import { describe, expect, test } from "bun:test";
import { sign } from "hono/jwt";
import { app } from "../../../app";
import type { AppBindings } from "../../../infrastructure/drizzle/db";

const secret = "test-secret-that-is-longer-than-32-characters";
const env = {
    JWT_SECRET: secret,
    GOOGLE_CLIENT_ID: "google-client",
    GOOGLE_CLIENT_SECRET: "google-secret",
    ADMIN_GOOGLE_SUBS: "allowed-sub",
    ADMIN_GITHUB_IDS: "12345",
} as AppBindings;

describe("管理者認証", () => {
    test("未認証の更新リクエストと異なるオリジンからの更新リクエストを拒否する", async () => {
        const unauthenticated = await app.request("http://localhost:3000/api/projects", {
            method: "POST", headers: { Origin: "http://localhost:3000" },
        }, env);
        expect(unauthenticated.status).toBe(401);

        const crossOrigin = await app.request("http://localhost:3000/api/projects", {
            method: "POST", headers: { Origin: "https://evil.example" },
        }, env);
        expect(crossOrigin.status).toBe(403);
    });

    test("許可リストに登録された識別子に対して署名済みJWTだけを受け入れる", async () => {
        const now = Math.floor(Date.now() / 1000);
        const claims = { iss: "mysite", aud: "admin", iat: now, exp: now + 60 };
        const allowed = await sign({ ...claims, sub: "google:allowed-sub" }, secret);
        const denied = await sign({ ...claims, sub: "google:other-sub" }, secret);
        for (const [token, expected] of [[allowed, true], [denied, false]] as const) {
            const response = await app.request("http://localhost:3000/api/auth/me", {
                headers: { Cookie: `admin_session=${token}` },
            }, env);
            expect((await response.json()).authenticated).toBe(expected);
        }
    });

    test("state Cookieを設定し、異なるstateのコールバックを拒否する", async () => {
        const start = await app.request("http://localhost:3000/api/auth/google", {}, env);
        expect(start.status).toBe(302);
        expect(start.headers.get("location")).toContain("accounts.google.com");
        expect(start.headers.get("set-cookie")).toContain("HttpOnly");

        const callback = await app.request("http://localhost:3000/api/auth/google/callback?code=code&state=wrong", {
            headers: { Cookie: "oauth_state=google:expected" },
        }, env);
        expect(callback.status).toBe(400);
    });

    test("許可リストに登録されたGitHubコールバック後にJWTを発行する", async () => {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = (async (input) => {
            const url = String(input);
            if (url.endsWith("/access_token")) {
                return Response.json({ access_token: "provider-token" });
            }
            if (url === "https://api.github.com/user") {
                return Response.json({ id: 12345 });
            }
            throw new Error(`unexpected request: ${url}`);
        }) as typeof fetch;
        try {
            const response = await app.request("http://localhost:3000/api/auth/github/callback?code=code&state=state", {
                headers: { Cookie: "oauth_state=github:state" },
            }, {
                ...env, GITHUB_CLIENT_ID: "github-client", GITHUB_CLIENT_SECRET: "github-secret",
            });
            expect(response.status).toBe(302);
            expect(response.headers.get("set-cookie")).toContain("admin_session=");
            expect(response.headers.get("location")).toBe("/admin");
        } finally {
            globalThis.fetch = originalFetch;
        }
    });

    test("メールアドレス確認済みで、許可リストに登録されたGoogleアカウントを要求する", async () => {
        const originalFetch = globalThis.fetch;
        let verified = false;
        globalThis.fetch = (async (input) => {
            const url = String(input);
            if (url === "https://oauth2.googleapis.com/token") {
                return Response.json({ access_token: "provider-token" });
            }
            if (url === "https://openidconnect.googleapis.com/v1/userinfo") {
                return Response.json({ sub: "allowed-sub", email_verified: verified });
            }
            throw new Error(`unexpected request: ${url}`);
        }) as typeof fetch;
        try {
            const response = await app.request("http://localhost:3000/api/auth/google/callback?code=code&state=state", {
                headers: { Cookie: "oauth_state=google:state" },
            }, env);
            expect(response.status).toBe(403);
            expect((await response.json()).subject).toBe("allowed-sub");
            verified = true;
            const accepted = await app.request("http://localhost:3000/api/auth/google/callback?code=code&state=state", {
                headers: { Cookie: "oauth_state=google:state" },
            }, env);
            expect(accepted.status).toBe(302);
            expect(accepted.headers.get("set-cookie")).toContain("admin_session=");
        } finally {
            globalThis.fetch = originalFetch;
        }
    });
});
