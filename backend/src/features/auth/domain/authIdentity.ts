export const authProviders = ["google", "github"] as const;

export type AuthProvider = (typeof authProviders)[number];

/** セッションに載せる管理者の主体 */
export type AdminIdentity = Readonly<{
    provider: AuthProvider;
    id: string;
}>;

/** OAuth プロバイダーから取得した主体 */
export type OAuthIdentity = Readonly<
    AdminIdentity & {
        emailVerified: boolean;
    }
>;

/** プロバイダーごとの許可 ID 一覧 */
export type AdminAllowList = Readonly<Record<AuthProvider, readonly string[]>>;

export function isAuthProvider(value: string): value is AuthProvider {
    return (authProviders as readonly string[]).includes(value);
}

/**
 * 管理者として扱ってよいか。
 * 許可リストに含まれ、Google の場合はメール確認済みであること。
 * セッション再検証では emailVerified を持たないため、そのチェックはスキップされる。
 */
export function canAuthenticateAsAdministrator(
    identity: AdminIdentity & { emailVerified?: boolean },
    allowList: AdminAllowList,
): boolean {
    if (identity.provider === "google" && identity.emailVerified === false) {
        return false;
    }
    return allowList[identity.provider].includes(identity.id);
}
