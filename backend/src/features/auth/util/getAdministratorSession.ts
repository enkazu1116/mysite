import { getAdministratorFromSession } from "../../../middleware/adminSession";
import type { AuthContext } from "../types/authEnv";
import { authValidationMessages } from "../validation/messages";
import { toAuthErrorStatus } from "../validation/toAuthErrorStatus";

/**
 * 管理者セッションの有無を JSON で返す
 */
export async function getAdministratorSession(c: AuthContext) {
    try {
        c.header("Cache-Control", "no-store");
        const identity = await getAdministratorFromSession(c);
        return c.json({
            authenticated: Boolean(identity),
            subject: identity ? `${identity.provider}:${identity.id}` : null,
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : authValidationMessages.authenticationFailed;
        return c.json({ message }, toAuthErrorStatus(message));
    }
}
