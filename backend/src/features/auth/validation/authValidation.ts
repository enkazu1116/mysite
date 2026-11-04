import { isAuthProvider, type AuthProvider } from "../domain/authIdentity";
import { authValidationMessages } from "./messages";

/**
 * リクエストの provider 文字列を許可された AuthProvider に変換する
 */
export function parseAuthProvider(value: string | undefined): AuthProvider | null {
    return value !== undefined && isAuthProvider(value) ? value : null;
}

/**
 * OAuth コールバックの code / state を検証する
 */
export function validateOAuthCallbackParams(input: {
    code: string | undefined;
    stateMatches: boolean;
}): string[] {
    if (!input.code || !input.stateMatches) {
        return [authValidationMessages.oauthVerificationFailed];
    }
    return [];
}
