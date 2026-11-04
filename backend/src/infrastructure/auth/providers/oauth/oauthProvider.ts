import type { AdminIdentity, AuthProvider } from "../../../../features/auth/domain/authIdentity";

/**
 * OAuth認証の資格情報
 */
export type OAuthCredentials = Readonly<{
    clientId: string;
    clientSecret: string;
}>;

/**
 * OAuth Providerを使用した認証インターフェース
 * Google / GitHubのOAuth認証などをサポート
 * 
 * 他Providerが増えた場合も、このインターフェースを利用する
 */
export interface OAuthProvider {
    readonly name: AuthProvider;
    
    // 認証URL
    createAuthorizationUrl(
        credentials: OAuthCredentials,
        redirectUri: string,
        state: string,
    ): string;

    // ユーザー情報
    getIdentity(
        credentials: OAuthCredentials,
        code: string,
        redirectUri: string,
    ): Promise<AdminIdentity | null>;
}
