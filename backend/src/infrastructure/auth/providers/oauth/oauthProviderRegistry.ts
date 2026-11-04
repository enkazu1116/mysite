import type { AuthProvider } from "../../../../features/auth/domain/authIdentity";
import { githubOAuthProvider } from "../github_auth/githubOAuthProvider";
import { googleOAuthProvider } from "../google_auth/googleOAuthProvider";
import type { OAuthProvider } from "./oauthProvider";

/**
 * どのOAuth Providerを利用するか関数から取得するために定義されたレコード
 * 新たなProviderが増えた場合はこのレコードに追加する 
 */
const REGISTERED_PROVIDERS: Record<AuthProvider, OAuthProvider> = {
    google: googleOAuthProvider,
    github: githubOAuthProvider,
};

/**
 * OAuth Providerを取得
 * @param provider 
 * @returns 
 */
export function getOAuthProvider(provider: AuthProvider): OAuthProvider {
    return REGISTERED_PROVIDERS[provider];
}
