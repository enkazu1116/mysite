import { canAuthenticateAsAdministrator } from "../domain/authIdentity";
import type {
    AuthenticateAdministratorInput,
    AuthenticateAdministratorResult,
} from "../dto/authDto";

const AUTHENTICATED = "authenticated"; // 認証成功
const UNAUTHORIZED = "unauthorized"; // 認証失敗

/**
 * 認証ユースケース
 * 管理者の認証を行う
 */
export class AuthUseCase {
    
    authenticateAdministrator(
        input: AuthenticateAdministratorInput,
    ): AuthenticateAdministratorResult {
        // 認証情報・許可リストから管理者かどうか検証
        return canAuthenticateAsAdministrator(
            input.identity,
            input.administratorAllowList,
        )
            ? { type: AUTHENTICATED, identity: input.identity }
            : { type: UNAUTHORIZED, identity: input.identity };
    }
}
