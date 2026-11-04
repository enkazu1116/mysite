import { canAuthenticateAsAdministrator } from "../domain/authIdentity";
import type {
    AuthenticateAdministratorInput,
    AuthenticateAdministratorResult,
} from "../dto/authDto";

export class AuthUseCase {
    authenticateAdministrator(
        input: AuthenticateAdministratorInput,
    ): AuthenticateAdministratorResult {
        return canAuthenticateAsAdministrator(
            input.identity,
            input.administratorAllowList,
        )
            ? { type: "authenticated", identity: input.identity }
            : { type: "unauthorized", identity: input.identity };
    }
}
