import { authValidationMessages } from "./messages";

/**
 * 認証エラーメッセージに対応する HTTP ステータスを返す
 */
export function toAuthErrorStatus(message: string): 400 | 401 | 403 | 502 | 503 {
    switch (message) {
        case authValidationMessages.setupIncomplete:
        case authValidationMessages.jwtSecretInvalid:
            return 503;
        case authValidationMessages.identityFetchFailed:
            return 502;
        case authValidationMessages.administratorNotAllowed:
        case authValidationMessages.originUnverified:
            return 403;
        case authValidationMessages.administratorLoginRequired:
            return 401;
        default:
            return 400;
    }
}
