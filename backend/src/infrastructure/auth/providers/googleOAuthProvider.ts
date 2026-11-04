import type { OAuthProvider } from "../../../features/auth/repositories/oauthProvider";
import { requestAccessToken } from "./oauthClient";

export const googleOAuthProvider: OAuthProvider = {
    name: "google",
    createAuthorizationUrl(credentials, redirectUri, state) {
        return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
            client_id: credentials.clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            state,
            scope: "openid email",
        })}`;
    },
    async getIdentity(credentials, code, redirectUri) {
        const accessToken = await requestAccessToken(
            "https://oauth2.googleapis.com/token", credentials, code, redirectUri,
            { grant_type: "authorization_code" },
        );
        if (!accessToken) return null;
        const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
        }).catch(() => null);
        if (!response?.ok) return null;
        const profile = await response.json() as { sub?: string; email_verified?: boolean };
        if (!profile.sub) return null;
        return { provider: "google", id: profile.sub, emailVerified: profile.email_verified === true };
    },
};
