import type { AuthProvider } from "../../features/auth/domain/authIdentity";
import type { OAuthCredentials } from "../../features/auth/repositories/oauthProvider";
import type { AppBindings } from "../../app";

export function getOAuthCredentials(
    env: AppBindings,
    provider: AuthProvider,
): OAuthCredentials | null {
    const clientId = provider === "google" ? env.GOOGLE_CLIENT_ID : env.GITHUB_CLIENT_ID;
    const clientSecret = provider === "google" ? env.GOOGLE_CLIENT_SECRET : env.GITHUB_CLIENT_SECRET;
    return clientId && clientSecret ? { clientId, clientSecret } : null;
}
