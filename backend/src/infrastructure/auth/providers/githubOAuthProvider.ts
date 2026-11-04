import type { OAuthProvider } from "../../../features/auth/repositories/oauthProvider";
import { requestAccessToken } from "./oauthClient";

export const githubOAuthProvider: OAuthProvider = {
    name: "github",
    createAuthorizationUrl(credentials, redirectUri, state) {
        return `https://github.com/login/oauth/authorize?${new URLSearchParams({
            client_id: credentials.clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            state,
            scope: "read:user",
        })}`;
    },
    async getIdentity(credentials, code, redirectUri) {
        const accessToken = await requestAccessToken(
            "https://github.com/login/oauth/access_token", credentials, code, redirectUri,
        );
        if (!accessToken) return null;
        const response = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
                "User-Agent": "mysite-admin",
            },
        }).catch(() => null);
        if (!response?.ok) return null;
        const profile = await response.json() as { id?: number };
        if (profile.id === undefined) return null;
        return { provider: "github", id: String(profile.id), emailVerified: true };
    },
};
