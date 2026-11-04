import type { Context, MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import {
    canAuthenticateAsAdministrator,
    type AdminIdentity,
    type AuthProvider,
    isAuthProvider,
} from "../features/auth/domain/authIdentity";
import type { AppBindings } from "../app";
import { getAdministratorAllowList } from "../infrastructure/auth/administratorAllowList";

const sessionCookie = "admin_session";
const stateCookie = "oauth_state";
const sessionSeconds = 60 * 60 * 8;

type AppEnv = { Bindings: AppBindings };
type AppContext<E extends AppEnv = AppEnv> = Context<E>;

function cookieOptions(url: string) {
    return {
        httpOnly: true,
        secure: new URL(url).protocol === "https:",
        sameSite: "Lax" as const,
        path: "/",
    };
}

function hasValidJwtSecret(env: AppBindings): env is AppBindings & { JWT_SECRET: string } {
    return typeof env.JWT_SECRET === "string" && env.JWT_SECRET.length >= 32;
}

export function beginOAuthState<E extends AppEnv>(c: AppContext<E>, provider: AuthProvider): string {
    const state = crypto.randomUUID();
    setCookie(c, stateCookie, `${provider}:${state}`, {
        ...cookieOptions(c.req.url),
        maxAge: 600,
    });
    return state;
}

export function consumeOAuthState<E extends AppEnv>(
    c: AppContext<E>,
    provider: AuthProvider,
    state: string | undefined,
): boolean {
    const savedState = getCookie(c, stateCookie);
    deleteCookie(c, stateCookie, cookieOptions(c.req.url));
    return Boolean(state) && savedState === `${provider}:${state}`;
}

export async function getAdministratorFromSession<E extends AppEnv>(
    c: AppContext<E>,
): Promise<AdminIdentity | null> {
    const token = getCookie(c, sessionCookie);
    if (!token || !hasValidJwtSecret(c.env)) return null;
    try {
        const payload = await verify(token, c.env.JWT_SECRET, "HS256");
        if (payload.iss !== "mysite" || payload.aud !== "admin" || typeof payload.sub !== "string") {
            return null;
        }
        const [provider, id] = payload.sub.split(":", 2);
        if (!provider || !id || !isAuthProvider(provider)) return null;
        const identity = { provider, id };
        return canAuthenticateAsAdministrator(identity, getAdministratorAllowList(c.env))
            ? identity
            : null;
    } catch {
        return null;
    }
}

export async function startAdministratorSession<E extends AppEnv>(
    c: AppContext<E>,
    identity: AdminIdentity,
): Promise<void> {
    if (!hasValidJwtSecret(c.env)) throw new Error("JWT_SECRET が未設定または短すぎます。");
    const now = Math.floor(Date.now() / 1000);
    const token = await sign({
        sub: `${identity.provider}:${identity.id}`,
        iss: "mysite",
        aud: "admin",
        iat: now,
        exp: now + sessionSeconds,
    }, c.env.JWT_SECRET);
    setCookie(c, sessionCookie, token, { ...cookieOptions(c.req.url), maxAge: sessionSeconds });
}

export function endAdministratorSession<E extends AppEnv>(c: AppContext<E>): void {
    deleteCookie(c, sessionCookie, cookieOptions(c.req.url));
}

export const requireAdministratorForWrite: MiddlewareHandler<{ Bindings: AppBindings }> = async (c, next) => {
    if (c.req.method === "GET" || c.req.method === "HEAD" || c.req.method === "OPTIONS") {
        await next();
        return;
    }
    const origin = c.req.header("Origin");
    const siteOrigin = new URL(c.req.url).origin;
    const allowedOrigins = [siteOrigin, c.env.FRONTEND_ORIGIN].filter(Boolean);
    if (!origin || !allowedOrigins.includes(origin)) {
        return c.json({ message: "リクエスト元を確認できません。" }, 403);
    }
    if (new URL(c.req.url).pathname === "/api/auth/logout") {
        await next();
        return;
    }
    if (!await getAdministratorFromSession(c)) {
        return c.json({ message: "管理者ログインが必要です。" }, 401);
    }
    await next();
};
