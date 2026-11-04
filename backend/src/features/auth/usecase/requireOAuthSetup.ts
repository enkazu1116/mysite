import type { AppBindings } from "../../../app";
import { getOAuthCredentials } from "../../../infrastructure/auth/administratorAuthentication";
import type { OAuthCredentials } from "../../../infrastructure/auth/providers/oauth/oauthProvider";
import type { AuthProvider } from "../domain/authIdentity";
import { authValidationMessages } from "../validation/messages";
import { hasValidJwtSecret } from "../validation/oauthSetupValidation";

/**
 * OAuth 認証に必要な資格情報を取得する。
 * Infrastructure 層から Provider に応じた資格情報を取得し、
 * JWT 設定も含めてセットアップが揃っていることを検証する。
 */
export function requireOAuthSetup(
    env: AppBindings,
    provider: AuthProvider,
): OAuthCredentials {
    const credentials = getOAuthCredentials(env, provider);
    if (!credentials || !hasValidJwtSecret(env)) {
        throw new Error(authValidationMessages.setupIncomplete);
    }
    return credentials;
}
