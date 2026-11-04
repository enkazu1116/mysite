import type { AdminIdentity, AuthProvider } from "../../../features/auth/domain/authIdentity";

export type OAuthCredentials = Readonly<{
    clientId: string;
    clientSecret: string;
}>;

export interface OAuthProvider {
    readonly name: AuthProvider;
    createAuthorizationUrl(
        credentials: OAuthCredentials,
        redirectUri: string,
        state: string,
    ): string;
    getIdentity(
        credentials: OAuthCredentials,
        code: string,
        redirectUri: string,
    ): Promise<AdminIdentity | null>;
}

export type OAuthProviderResolver = (provider: AuthProvider) => OAuthProvider;
