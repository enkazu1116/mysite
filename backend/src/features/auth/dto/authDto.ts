import type { AdminAllowList, AdminIdentity } from "../domain/authIdentity";

export type AuthenticateAdministratorInput = Readonly<{
    identity: AdminIdentity;
    administratorAllowList: AdminAllowList;
}>;

export type AuthenticateAdministratorResult =
    | Readonly<{ type: "authenticated"; identity: AdminIdentity }>
    | Readonly<{ type: "unauthorized"; identity: AdminIdentity }>;
