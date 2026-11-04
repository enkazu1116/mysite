import type { OAuthProvider } from "../oauth/oauthProvider";
import { requestAccessToken } from "../oauth/oauthClient";

const GOOGLE_NAME = "google";
const GOOGLE_AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USER_URL = "https://openidconnect.googleapis.com/v1/userinfo";

/**
 * Google OAuth Provider
 */
export const googleOAuthProvider: OAuthProvider = {
    name: GOOGLE_NAME,

    /**
     * Googleの認証情報を取得
     * @param credentials 
     * @param redirectUri 
     * @param state 
     * @returns 
     */
    createAuthorizationUrl(credentials, redirectUri, state) {
        // 引数を利用して、認証URLを作成
        return `${GOOGLE_AUTHORIZE_URL}?${new URLSearchParams({
            client_id: credentials.clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            state,
            scope: "openid email",
        })}`;
    },

    /**
     * Googleのユーザー情報を取得
     * @param credentials 
     * @param code 
     * @param redirectUri 
     * @returns 
     */
    async getIdentity(credentials, code, redirectUri) {
        const accessToken = await requestAccessToken(
            GOOGLE_TOKEN_URL,
            credentials,
            code,
            redirectUri,
            { grant_type: "authorization_code" },
        );
        if (!accessToken) return null;
        
        // Bearerトークンを利用
        const response = await fetch(GOOGLE_USER_URL, {
            headers: { 
                Authorization: `Bearer ${accessToken}`, 
                Accept: "application/json" 
            },
        }).catch(() => null);
        if (!response?.ok) return null;
        
        // レスポンスからサブジェクト・メールアドレスを取得
        const profile = await response.json() as { sub?: string; email_verified?: boolean };
        if (!profile.sub || profile.email_verified !== true) return null;
        
        return { provider: "google", id: profile.sub };
    },
};
