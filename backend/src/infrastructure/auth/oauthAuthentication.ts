import type { AdminIdentity, AuthProvider } from "../../features/auth/domain/authIdentity";
import type { OAuthCredentials } from "./providers/oauthProvider";
import { getOAuthProvider } from "./providers/oauthProviders";

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

export function resolveAdministratorIdentity(
    provider: AuthProvider,
    credentials: OAuthCredentials,
    code: string,
    redirectUri: string,
): Promise<AdminIdentity | null> {
    return getOAuthProvider(provider).getIdentity(credentials, code, redirectUri);
}
