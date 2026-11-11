import type { AppBindings } from "../../../app";
import { getOAuthCredentials } from "../../../infrastructure/auth/administratorAuthentication";
import type { OAuthCredentials } from "../../../infrastructure/auth/providers/oauth/oauthProvider";
import type { AuthProvider } from "../domain/authIdentity";
import { authValidationMessages } from "../validation/messages";
import { hasValidSessionSecret } from "../validation/oauthSetupValidation";

/**
 * OAuth 認証に必要な資格情報を取得する。
 * Infrastructure 層から Provider に応じた資格情報を取得し、
 * セッション署名鍵も含めてセットアップが揃っていることを検証する。
 */
export function requireOAuthSetup(
    env: AppBindings,
    provider: AuthProvider,
): OAuthCredentials {
    const credentials = getOAuthCredentials(env, provider);
    if (!credentials || !hasValidSessionSecret(env)) {
        throw new Error(authValidationMessages.setupIncomplete);
    }
    return credentials;
}
