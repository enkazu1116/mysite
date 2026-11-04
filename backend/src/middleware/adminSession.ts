import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import {
    canAuthenticateAsAdministrator,
    type AdminIdentity,
    isAuthProvider,
} from "../features/auth/domain/authIdentity";
import { getAdministratorAllowList } from "../infrastructure/auth/administratorAuthentication";
import { authValidationMessages } from "../features/auth/validation/messages";
import { hasValidJwtSecret } from "../features/auth/validation/oauthSetupValidation";
import { type AppContext, type AppEnv, cookieOptions } from "./cookieOptions";

const sessionCookie = "admin_session";
const sessionSeconds = 60 * 60 * 8;

/**
 * 管理者セッション Cookie から主体を取得する
 * JWT の検証を行い、改ざんされていないかを確認する
 * @returns 許可リストに含まれる場合のみ identity
 */
export async function getAdministratorFromSession<E extends AppEnv>(
    c: AppContext<E>,
): Promise<AdminIdentity | null> {
    const token = getCookie(c, sessionCookie);
    if (!token || !hasValidJwtSecret(c.env)) return null;

    // JWT を検証し、改ざんされていない有効なセッションか確認する
    try {
        const payload = await verify(token, c.env.JWT_SECRET, "HS256");
        if (payload.iss !== "mysite" || payload.aud !== "admin" || typeof payload.sub !== "string") {
            return null;
        }

        // ペイロードから provider と id を取得し、管理者かどうかを検証する
        const [provider, id] = payload.sub.split(":", 2);
        if (!provider || !id || !isAuthProvider(provider)) return null;

        const identity = { provider, id };
        return canAuthenticateAsAdministrator(identity, getAdministratorAllowList(c.env))
            ? identity
            : null;
    } catch {
        return null;
    }
}

/**
 * 管理者のセッションを開始する
 */
export async function startAdministratorSession<E extends AppEnv>(
    c: AppContext<E>,
    identity: AdminIdentity,
): Promise<void> {
    if (!hasValidJwtSecret(c.env)) {
        throw new Error(authValidationMessages.jwtSecretInvalid);
    }

    // JWT の有効期限を設定・生成
    const now = Math.floor(Date.now() / 1000);
    const token = await sign({
        sub: `${identity.provider}:${identity.id}`,
        iss: "mysite",
        aud: "admin",
        iat: now,
        exp: now + sessionSeconds,
    }, c.env.JWT_SECRET);

    // cookieOptions を利用して、JWT を cookie に保存
    setCookie(c, sessionCookie, token, { ...cookieOptions(c.req.url), maxAge: sessionSeconds });
}

/**
 * 管理者のセッションを破棄する
 */
export function endAdministratorSession<E extends AppEnv>(c: AppContext<E>): void {
    deleteCookie(c, sessionCookie, cookieOptions(c.req.url));
}
