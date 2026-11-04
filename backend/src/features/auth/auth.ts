import { Hono, type Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import type { AppBindings } from "../../infrastructure/drizzle/db";

type Provider = "google" | "github";
const sessionCookie = "admin_session";
const stateCookie = "oauth_state";
const sessionSeconds = 60 * 60 * 8;

function allowed(value: string | undefined, id: string): boolean {
    return (value ?? "").split(",").map((part) => part.trim()).filter(Boolean).includes(id);
}

function cookieOptions(url: string) {
    return { httpOnly: true, secure: new URL(url).protocol === "https:", sameSite: "Lax" as const, path: "/" };
}

function config(env: AppBindings, provider: Provider) {
    const clientId = provider === "google" ? env.GOOGLE_CLIENT_ID : env.GITHUB_CLIENT_ID;
    const clientSecret = provider === "google" ? env.GOOGLE_CLIENT_SECRET : env.GITHUB_CLIENT_SECRET;
    return clientId && clientSecret && env.JWT_SECRET && env.JWT_SECRET.length >= 32
        ? { clientId, clientSecret }
        : null;
}

function callbackUrl(requestUrl: string, provider: Provider): string {
    return `${new URL(requestUrl).origin}/api/auth/${provider}/callback`;
}

export async function adminFromRequest(c: Context<{ Bindings: AppBindings }>): Promise<string | null> {
    const token = getCookie(c, sessionCookie);
    const env = c.env;
    if (!token || !env.JWT_SECRET || env.JWT_SECRET.length < 32) return null;
    try {
        const payload = await verify(token, env.JWT_SECRET, "HS256");
        if (payload.iss !== "mysite" || payload.aud !== "admin" || typeof payload.sub !== "string") return null;
        const [provider, id] = payload.sub.split(":", 2);
        if (provider === "google" && allowed(env.ADMIN_GOOGLE_SUBS, id)) return payload.sub;
        if (provider === "github" && allowed(env.ADMIN_GITHUB_IDS, id)) return payload.sub;
    } catch {
        return null;
    }
    return null;
}

export const authRouter = new Hono<{ Bindings: AppBindings }>()
    .get("/me", async (c) => {
        c.header("Cache-Control", "no-store");
        const subject = await adminFromRequest(c);
        return c.json({ authenticated: Boolean(subject), subject });
    })
    .get("/:provider", (c) => {
        const provider = c.req.param("provider");
        if (provider !== "google" && provider !== "github") return c.notFound();
        const credentials = config(c.env, provider);
        if (!credentials) return c.json({ message: "認証設定が不足しています。" }, 503);
        const state = crypto.randomUUID();
        setCookie(c, stateCookie, `${provider}:${state}`, { ...cookieOptions(c.req.url), maxAge: 600 });
        const params = new URLSearchParams({
            client_id: credentials.clientId,
            redirect_uri: callbackUrl(c.req.url, provider),
            response_type: "code",
            state,
        });
        if (provider === "google") params.set("scope", "openid email");
        else params.set("scope", "read:user");
        const url = provider === "google"
            ? `https://accounts.google.com/o/oauth2/v2/auth?${params}`
            : `https://github.com/login/oauth/authorize?${params}`;
        return c.redirect(url);
    })
    .get("/:provider/callback", async (c) => {
        const provider = c.req.param("provider");
        if (provider !== "google" && provider !== "github") return c.notFound();
        const state = c.req.query("state");
        const savedState = getCookie(c, stateCookie);
        deleteCookie(c, stateCookie, cookieOptions(c.req.url));
        if (!state || savedState !== `${provider}:${state}` || !c.req.query("code")) {
            return c.json({ message: "OAuth の検証に失敗しました。" }, 400);
        }
        const credentials = config(c.env, provider);
        if (!credentials) return c.json({ message: "認証設定が不足しています。" }, 503);
        const redirectUri = callbackUrl(c.req.url, provider);
        const tokenResponse = await fetch(provider === "google"
            ? "https://oauth2.googleapis.com/token"
            : "https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
            body: new URLSearchParams({
                client_id: credentials.clientId,
                client_secret: credentials.clientSecret,
                code: c.req.query("code")!,
                redirect_uri: redirectUri,
                ...(provider === "google" ? { grant_type: "authorization_code" } : {}),
            }),
        }).catch(() => null);
        if (!tokenResponse?.ok) return c.json({ message: "OAuth トークンを取得できません。" }, 502);
        const token = await tokenResponse.json() as { access_token?: string };
        if (!token.access_token) return c.json({ message: "OAuth トークンを取得できません。" }, 502);
        const profileResponse = await fetch(provider === "google"
            ? "https://openidconnect.googleapis.com/v1/userinfo"
            : "https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${token.access_token}`,
                Accept: "application/json",
                ...(provider === "github" ? { "User-Agent": "mysite-admin" } : {}),
            },
        }).catch(() => null);
        if (!profileResponse?.ok) return c.json({ message: "ユーザー情報を取得できません。" }, 502);
        const profile = await profileResponse.json() as { sub?: string; id?: number; email_verified?: boolean };
        const id = provider === "google" ? (profile.sub ?? "") : String(profile.id ?? "");
        const authorized = provider === "google"
            ? profile.email_verified === true && Boolean(id) && allowed(c.env.ADMIN_GOOGLE_SUBS, id)
            : Boolean(id) && allowed(c.env.ADMIN_GITHUB_IDS, id);
        if (!authorized) return c.json({ message: "管理者として許可されていません。", provider, subject: id }, 403);
        const now = Math.floor(Date.now() / 1000);
        const jwt = await sign({ sub: `${provider}:${id}`, iss: "mysite", aud: "admin", iat: now, exp: now + sessionSeconds }, c.env.JWT_SECRET!);
        setCookie(c, sessionCookie, jwt, { ...cookieOptions(c.req.url), maxAge: sessionSeconds });
        c.header("Cache-Control", "no-store");
        return c.redirect(c.env.FRONTEND_ORIGIN ? `${c.env.FRONTEND_ORIGIN}/admin` : "/admin");
    })
    .post("/logout", (c) => {
        deleteCookie(c, sessionCookie, cookieOptions(c.req.url));
        c.header("Cache-Control", "no-store");
        return c.json({ authenticated: false });
    });
