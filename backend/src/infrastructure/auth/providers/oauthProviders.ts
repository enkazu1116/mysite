import type { AuthProvider } from "../../../features/auth/domain/authIdentity";
import { githubOAuthProvider } from "./githubOAuthProvider";
import { googleOAuthProvider } from "./googleOAuthProvider";
import type { OAuthProvider } from "../../../features/auth/repositories/oauthProvider";

const providers: Record<AuthProvider, OAuthProvider> = {
    google: googleOAuthProvider,
    github: githubOAuthProvider,
};

export function getOAuthProvider(provider: AuthProvider): OAuthProvider {
    return providers[provider];
}
