import { describe, expect, test } from "bun:test";
import type { OAuthProvider } from "../repositories/oauthProvider";
import { AuthUseCase } from "../usecase/authUseCase";

const credentials = { clientId: "client-id", clientSecret: "client-secret" };
const allowList = { google: ["google-subject"], github: ["12345"] };

function createProvider(identity: Awaited<ReturnType<OAuthProvider["getIdentity"]>>): OAuthProvider {
    return {
        name: "google",
        createAuthorizationUrl: (_credentials, redirectUri, state) =>
            `https://provider.example/auth?redirect_uri=${redirectUri}&state=${state}`,
        getIdentity: async () => identity,
    };
}

describe("認証ユースケース", () => {
    test("OAuth認可画面へのURLをプロバイダーに生成させる", () => {
        const useCase = new AuthUseCase(() => createProvider(null));
        expect(useCase.startOAuthAuthentication({
            provider: "google",
            credentials,
            redirectUri: "https://example.com/api/auth/google/callback",
            state: "state",
        })).toContain("state=state");
    });

    test("許可されたOAuth主体を認証済みとして返す", async () => {
        const useCase = new AuthUseCase(() => createProvider({
            provider: "google", id: "google-subject", emailVerified: true,
        }));
        await expect(useCase.completeOAuthAuthentication({
            provider: "google",
            credentials,
            redirectUri: "https://example.com/callback",
            code: "code",
            administratorAllowList: allowList,
        })).resolves.toEqual({
            type: "authenticated",
            identity: { provider: "google", id: "google-subject", emailVerified: true },
        });
    });

    test("OAuth主体を取得できない場合と管理者でない場合を区別する", async () => {
        const unavailableUseCase = new AuthUseCase(() => createProvider(null));
        const deniedUseCase = new AuthUseCase(() => createProvider({
            provider: "google", id: "other-subject", emailVerified: true,
        }));
        const input = {
            provider: "google" as const,
            credentials,
            redirectUri: "https://example.com/callback",
            code: "code",
            administratorAllowList: allowList,
        };
        await expect(unavailableUseCase.completeOAuthAuthentication(input))
            .resolves.toEqual({ type: "unauthenticated" });
        await expect(deniedUseCase.completeOAuthAuthentication(input))
            .resolves.toEqual({
                type: "unauthorized",
                identity: { provider: "google", id: "other-subject", emailVerified: true },
            });
    });
});
