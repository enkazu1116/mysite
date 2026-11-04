import type { AdminAllowList, AdminIdentity } from "../domain/authIdentity";

const AUTHENTICATED = "authenticated";
const UNAUTHORIZED = "unauthorized";

/** 認証ユースケースに渡す入力情報 */
export type AuthenticateAdministratorInput = Readonly<{
    identity: AdminIdentity;
    administratorAllowList: AdminAllowList;
}>;

/** 認証ユースケースの検証結果 */
export type AuthenticateAdministratorResult =
    | Readonly<{ type: typeof AUTHENTICATED; identity: AdminIdentity }>
    | Readonly<{ type: typeof UNAUTHORIZED; identity: AdminIdentity }>;
