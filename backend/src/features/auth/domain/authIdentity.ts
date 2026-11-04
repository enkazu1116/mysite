export const authProviders = ["google", "github"] as const;

export type AuthProvider = (typeof authProviders)[number];

/** セッションに載せる管理者の主体 */
export type AdminIdentity = Readonly<{
    provider: AuthProvider;
    id: string;
}>;

/** プロバイダーごとの許可 ID 一覧 */
export type AdminAllowList = Readonly<Record<AuthProvider, readonly string[]>>;

export function isAuthProvider(value: string): value is AuthProvider {
    return (authProviders as readonly string[]).includes(value);
}

/** 許可リストに含まれる管理者主体か */
export function canAuthenticateAsAdministrator(
    identity: AdminIdentity,
    allowList: AdminAllowList,
): boolean {
    return allowList[identity.provider].includes(identity.id);
}
