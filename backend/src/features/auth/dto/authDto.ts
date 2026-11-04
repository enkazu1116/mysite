import type {
    AdminAllowList,
    AuthProvider,
    OAuthIdentity,
} from "../domain/authIdentity";
import type { OAuthCredentials } from "../repositories/oauthProvider";

export type StartOAuthAuthenticationInput = Readonly<{
    provider: AuthProvider;
    credentials: OAuthCredentials;
    redirectUri: string;
    state: string;
}>;

export type CompleteOAuthAuthenticationInput = Readonly<{
    provider: AuthProvider;
    credentials: OAuthCredentials;
    redirectUri: string;
    code: string;
    administratorAllowList: AdminAllowList;
}>;

export type CompleteOAuthAuthenticationResult =
    | Readonly<{ type: "authenticated"; identity: OAuthIdentity }>
    | Readonly<{ type: "unauthenticated" }>
    | Readonly<{ type: "unauthorized"; identity: OAuthIdentity }>;
