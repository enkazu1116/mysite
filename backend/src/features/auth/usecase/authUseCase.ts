import { canAuthenticateAsAdministrator } from "../domain/authIdentity";
import type {
    CompleteOAuthAuthenticationInput,
    CompleteOAuthAuthenticationResult,
    StartOAuthAuthenticationInput,
} from "../dto/authDto";
import type { OAuthProviderResolver } from "../repositories/oauthProvider";

export class AuthUseCase {
    constructor(private readonly getOAuthProvider: OAuthProviderResolver) {}

    startOAuthAuthentication(input: StartOAuthAuthenticationInput): string {
        return this.getOAuthProvider(input.provider).createAuthorizationUrl(
            input.credentials,
            input.redirectUri,
            input.state,
        );
    }

    async completeOAuthAuthentication(
        input: CompleteOAuthAuthenticationInput,
    ): Promise<CompleteOAuthAuthenticationResult> {
        const identity = await this.getOAuthProvider(input.provider).getIdentity(
            input.credentials,
            input.code,
            input.redirectUri,
        );
        if (!identity) return { type: "unauthenticated" };
        return canAuthenticateAsAdministrator(identity, input.administratorAllowList)
            ? { type: "authenticated", identity }
            : { type: "unauthorized", identity };
    }
}
