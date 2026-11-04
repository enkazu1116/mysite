import type { OAuthProvider } from "../oauth/oauthProvider";
import { requestAccessToken } from "../oauth/oauthClient";

const GITHUB_NAME = "github";
const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";


/**
 * GitHub OAuth Provider
 */
export const githubOAuthProvider: OAuthProvider = {
    name: GITHUB_NAME,
    
    /**
     * GitHubの認証URLを作成
     * @param credentials 
     * @param redirectUri 
     * @param state 
     * @returns 
     */
    createAuthorizationUrl(credentials, redirectUri, state) {
        return `${GITHUB_AUTHORIZE_URL}?${new URLSearchParams({
            client_id: credentials.clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            state,
            scope: "read:user",
        })}`;
    },

    /**
     * GitHubのユーザー情報を取得
     * @param credentials 
     * @param code 
     * @param redirectUri 
     * @returns 
     */
    async getIdentity(credentials, code, redirectUri) {
        
        const accessToken = await requestAccessToken(
            GITHUB_TOKEN_URL,
            credentials,
            code,
            redirectUri,
        );
        if (!accessToken) return null;
        
        
        const response = await fetch(GITHUB_USER_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
                "User-Agent": "mysite-admin",
            },
        }).catch(() => null);
        if (!response?.ok) return null;
        
        const profile = await response.json() as { id?: number };
        if (profile.id === undefined) return null;
        
        return { provider: "github", id: String(profile.id) };
    },
};
