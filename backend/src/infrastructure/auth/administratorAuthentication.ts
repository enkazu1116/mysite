import type { AdminAllowList, AdminIdentity, AuthProvider } from "../../features/auth/domain/authIdentity";
import type { AppBindings } from "../../app";
import type { OAuthCredentials } from "./providers/oauth/oauthProvider";
import { getOAuthProvider } from "./providers/oauth/oauthProviderRegistry";

/**
 * カンマ区切りの許可 ID 文字列を配列へ変換する
 */
function toIdentifiers(value: string | undefined): string[] {
    return (value ?? "")
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
}

/**
 * 管理者の許可リストを取得
 * 許可リストから取得することを明示的にすることで、認証を許可された方法でのみ
 * 認証を許可することができる
 * 
 * @param env 
 * @returns 
 */
export function getAdministratorAllowList(env: AppBindings): AdminAllowList {
    return {
        google: toIdentifiers(env.ADMIN_GOOGLE_SUBS),
        github: toIdentifiers(env.ADMIN_GITHUB_IDS),
    };
}

/**
 * OAuth Providerの資格情報を取得
 * @param env 
 * @param provider 
 * @returns 
 */
export function getOAuthCredentials(
    env: AppBindings,
    provider: AuthProvider,
): OAuthCredentials | null {
    // 資格情報を定義したレコードから取得する
    const credentialsByProvider = {
        google: { 
            clientId: env.GOOGLE_CLIENT_ID, 
            clientSecret: env.GOOGLE_CLIENT_SECRET 
        },
        github: { 
            clientId: env.GITHUB_CLIENT_ID, 
            clientSecret: env.GITHUB_CLIENT_SECRET 
        },
    } satisfies Record<AuthProvider, { clientId?: string; clientSecret?: string }>;

    const { clientId, clientSecret } = credentialsByProvider[provider];
    return clientId && clientSecret ? { clientId, clientSecret } : null;
}

/**
 * 認証URLを作成
 * OAuthProvider Interfaceを利用して作成する
 * 
 * @param provider 
 * @param credentials 
 * @param redirectUri 
 * @param state 
 * @returns 
 */
export function createAuthorizationUrl(
    provider: AuthProvider,
    credentials: OAuthCredentials,
    redirectUri: string,
    state: string,
): string {
    return getOAuthProvider(provider).createAuthorizationUrl(
        credentials,
        redirectUri,
        state,
    );
}

/**
 * 管理者の情報を取得
 * OAuthProvider Interfaceを利用して取得する
 * 
 * @param provider 
 * @param credentials 
 * @param code 
 * @param redirectUri 
 * @returns 
 */
export function resolveAdministratorIdentity(
    provider: AuthProvider,
    credentials: OAuthCredentials,
    code: string,
    redirectUri: string,
): Promise<AdminIdentity | null> {
    return getOAuthProvider(provider).getIdentity(credentials, code, redirectUri);
}
