import type { OAuthCredentials } from "./oauthProvider";

/**
 * アクセストークン取得リクエストを送信
 * @param tokenUrl 
 * @param credentials 
 * @param code 
 * @param redirectUri 
 * @param additionalParameters 
 * @returns 
 */
export async function requestAccessToken(
    tokenUrl: string,
    credentials: OAuthCredentials,
    code: string,
    redirectUri: string,
    additionalParameters: Record<string, string> = {},
): Promise<string | null> {
    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
        body: new URLSearchParams({
            client_id: credentials.clientId,
            client_secret: credentials.clientSecret,
            code,
            redirect_uri: redirectUri,
            ...additionalParameters,
        }),
    }).catch(() => null);
    if (!response?.ok) return null;

    const body = await response.json() as { access_token?: string };
    
    return body.access_token ?? null;
}
