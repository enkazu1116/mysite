import type { Context } from "hono";
import { Hono } from "hono";
import type { AppBindings } from "../../../app";
import { getAdministratorAllowList } from "../../../infrastructure/auth/administratorAllowList";
import {
    createAuthorizationUrl,
    resolveAdministratorIdentity,
} from "../../../infrastructure/auth/oauthAuthentication";
import { getOAuthCredentials } from "../../../infrastructure/auth/oauthCredentials";
import {
    beginOAuthState,
    consumeOAuthState,
    endAdministratorSession,
    getAdministratorFromSession,
    startAdministratorSession,
} from "../../../middleware/adminAuthentication";
import { isAuthProvider } from "../domain/authIdentity";
import { AuthUseCase } from "../usecase/authUseCase";

type AuthEnv = {
    Bindings: AppBindings;
    Variables: { useCase: AuthUseCase };
};

type AuthContext = Context<AuthEnv>;

function oauthCallbackUrl(requestUrl: string, provider: string): string {
    return `${new URL(requestUrl).origin}/api/auth/${provider}/callback`;
}

function hasValidJwtSecret(env: AppBindings): boolean {
    return typeof env.JWT_SECRET === "string" && env.JWT_SECRET.length >= 32;
}

function requireOAuthSetup(env: AppBindings, provider: Parameters<typeof getOAuthCredentials>[1]) {
    const credentials = getOAuthCredentials(env, provider);
    if (!credentials || !hasValidJwtSecret(env)) {
        return null;
    }
    return credentials;
}

async function getAdministratorSession(c: AuthContext) {
    c.header("Cache-Control", "no-store");
    const identity = await getAdministratorFromSession(c);
    return c.json({
        authenticated: Boolean(identity),
        subject: identity ? `${identity.provider}:${identity.id}` : null,
    });
}

function startOAuthAuthentication(c: AuthContext) {
    const provider = c.req.param("provider") ?? "";
    if (!isAuthProvider(provider)) return c.notFound();
    const credentials = requireOAuthSetup(c.env, provider);
    if (!credentials) {
        return c.json({ message: "認証設定が不足しています。" }, 503);
    }
    const state = beginOAuthState(c, provider);
    return c.redirect(createAuthorizationUrl(
        provider,
        credentials,
        oauthCallbackUrl(c.req.url, provider),
        state,
    ));
}

async function completeOAuthAuthentication(c: AuthContext) {
    const provider = c.req.param("provider") ?? "";
    if (!isAuthProvider(provider)) return c.notFound();
    const state = c.req.query("state");
    const code = c.req.query("code");
    if (!code || !consumeOAuthState(c, provider, state)) {
        return c.json({ message: "OAuth の検証に失敗しました。" }, 400);
    }
    const credentials = requireOAuthSetup(c.env, provider);
    if (!credentials) {
        return c.json({ message: "認証設定が不足しています。" }, 503);
    }
    const identity = await resolveAdministratorIdentity(
        provider,
        credentials,
        code,
        oauthCallbackUrl(c.req.url, provider),
    );
    if (!identity) {
        return c.json({ message: "OAuth ユーザー情報を取得できません。" }, 502);
    }
    const result = c.get("useCase").authenticateAdministrator({
        identity,
        administratorAllowList: getAdministratorAllowList(c.env),
    });
    if (result.type === "unauthorized") {
        return c.json({
            message: "管理者として許可されていません。",
            provider: result.identity.provider,
            subject: result.identity.id,
        }, 403);
    }
    await startAdministratorSession(c, result.identity);
    c.header("Cache-Control", "no-store");
    return c.redirect(c.env.FRONTEND_ORIGIN ? `${c.env.FRONTEND_ORIGIN}/admin` : "/admin");
}

function logoutAdministrator(c: AuthContext) {
    endAdministratorSession(c);
    c.header("Cache-Control", "no-store");
    return c.json({ authenticated: false });
}

export const authRouter = new Hono<AuthEnv>()
    .use("*", async (c, next) => {
        c.set("useCase", new AuthUseCase());
        await next();
    })
    .get("/me", getAdministratorSession)
    .get("/:provider", startOAuthAuthentication)
    .get("/:provider/callback", completeOAuthAuthentication)
    .post("/logout", logoutAdministrator);
