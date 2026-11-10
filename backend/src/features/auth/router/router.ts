import { Hono } from "hono";
import {
    createAuthorizationUrl,
    getAdministratorAllowList,
    resolveAdministratorIdentity,
} from "../../../infrastructure/auth/administratorAuthentication";
import {
    beginOAuthState,
    consumeOAuthState,
} from "../../../middleware/adminAccessControl";
import {
    endAdministratorSession,
    startAdministratorSession,
} from "../../../middleware/adminSession";
import type { AuthContext, AuthEnv } from "../types/authEnv";
import { AuthUseCase } from "../usecase/authUseCase";
import { requireOAuthSetup } from "../usecase/requireOAuthSetup";
import { getAdministratorSession } from "../util/getAdministratorSession";
import { oauthCallbackUrl } from "../util/oauthCallbackUrl";
import {
    parseAuthProvider,
    validateOAuthCallbackParams,
} from "../validation/authValidation";
import { authValidationMessages } from "../validation/messages";
import { toAuthErrorStatus } from "../validation/toAuthErrorStatus";
import { HTTPException } from "hono/http-exception";
import { ApiHttpException } from "../../../middleware/httpError";

/**
 * 認証エラーをメッセージと HTTP ステータスに変換して返す
 */
function authErrorResponse(error: unknown): never {
    const message =
        error instanceof Error
            ? error.message
            : authValidationMessages.authenticationFailed;
    throw new HTTPException(toAuthErrorStatus(message), { message });
}

/**
 * OAuth 認証を開始し、プロバイダの認可画面へリダイレクトする
 * セッションハイジャック防止のため state を発行する
 */
function startOAuthAuthentication(c: AuthContext) {
    try {
        // リクエストからプロバイダーを取得し、許可された値か検証する
        const provider = parseAuthProvider(c.req.param("provider"));
        if (!provider) {
            throw new HTTPException(404, { message: authValidationMessages.providerUnsupported });
        }

        const credentials = requireOAuthSetup(c.env, provider);
        // CSRF 対策の state を Cookie に保存し、認可 URL へリダイレクトする
        const state = beginOAuthState(c, provider);
        return c.redirect(createAuthorizationUrl(
            provider,
            credentials,
            oauthCallbackUrl(c.req.url, provider),
            state,
        ));
    } catch (error) {
        return authErrorResponse(error);
    }
}

/**
 * OAuth コールバックを処理し、許可された管理者ならセッションを開始する
 */
async function completeOAuthAuthentication(c: AuthContext) {
    try {
        const provider = parseAuthProvider(c.req.param("provider"));
        if (!provider) {
            throw new HTTPException(404, { message: authValidationMessages.providerUnsupported });
        }

        const code = c.req.query("code");
        // code と state を検証し、不正なコールバックを拒否する
        const errors = validateOAuthCallbackParams({
            code,
            stateMatches: consumeOAuthState(c, provider, c.req.query("state")),
        });
        if (errors.length > 0 || !code) {
            throw new HTTPException(400, {
                message: errors.join("\n") || authValidationMessages.oauthVerificationFailed,
            });
        }

        const credentials = requireOAuthSetup(c.env, provider);
        const identity = await resolveAdministratorIdentity(
            provider,
            credentials,
            code,
            oauthCallbackUrl(c.req.url, provider),
        );
        if (!identity) {
            throw new HTTPException(502, { message: authValidationMessages.identityFetchFailed });
        }

        // 許可リストに含まれる管理者かどうか検証する
        const result = c.get("useCase").authenticateAdministrator({
            identity,
            administratorAllowList: getAdministratorAllowList(c.env),
        });
        if (result.type === "unauthorized") {
            throw new ApiHttpException(403, {
                message: authValidationMessages.administratorNotAllowed,
                provider: result.identity.provider,
                subject: result.identity.id,
            });
        }

        await startAdministratorSession(c, result.identity);
        c.header("Cache-Control", "no-store");
        return c.redirect(c.env.FRONTEND_ORIGIN ? `${c.env.FRONTEND_ORIGIN}/admin` : "/admin");
    } catch (error) {
        return authErrorResponse(error);
    }
}

/**
 * 管理者セッションを破棄する
 */
function logoutAdministrator(c: AuthContext) {
    try {
        endAdministratorSession(c);
        c.header("Cache-Control", "no-store");
        return c.json({ authenticated: false });
    } catch (error) {
        return authErrorResponse(error);
    }
}

export const authRouter = new Hono<AuthEnv>()
    .use("*", async (c, next) => {
        c.set("useCase", new AuthUseCase());
        await next();
    })
    .get("/me", getAdministratorSession)
    .get("/:provider", startOAuthAuthentication)
    .get("/:provider/callback", completeOAuthAuthentication)
    .post("/logout", logoutAdministrator);
