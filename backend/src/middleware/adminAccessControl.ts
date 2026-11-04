import type { MiddlewareHandler } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { AuthProvider } from "../features/auth/domain/authIdentity";
import type { AppBindings } from "../app";
import { authValidationMessages } from "../features/auth/validation/messages";
import { type AppContext, type AppEnv, cookieOptions } from "./cookieOptions";
import { getAdministratorFromSession } from "./adminSession";

const stateCookie = "oauth_state";

/**
 * OAuth の CSRF 対策用 state を生成し Cookie に保存する
 * @returns 発行した state
 */
export function beginOAuthState<E extends AppEnv>(c: AppContext<E>, provider: AuthProvider): string {
    const state = crypto.randomUUID();

    // cookieOptions を利用して、state を cookie に保存
    setCookie(c, stateCookie, `${provider}:${state}`, {
        ...cookieOptions(c.req.url),
        maxAge: 600,
    });

    return state;
}

/**
 * 不正アクセス防止のため、保存済み state と照合し Cookie を削除する
 * @returns 一致すれば true
 */
export function consumeOAuthState<E extends AppEnv>(
    c: AppContext<E>,
    provider: AuthProvider,
    state: string | undefined,
): boolean {
    // 保存済み state を読み取り、照合後に Cookie を削除する
    const savedState = getCookie(c, stateCookie);
    deleteCookie(c, stateCookie, cookieOptions(c.req.url));

    // 一致しない場合はセッションハイジャックを防ぐため失敗とする
    return Boolean(state) && savedState === `${provider}:${state}`;
}

/**
 * 書き込みリクエストに対し、Origin 検証と管理者セッションを要求する
 */
export const requireAdministratorForWrite: MiddlewareHandler<{ Bindings: AppBindings }> = async (c, next) => {
    if (c.req.method === "GET" || c.req.method === "HEAD" || c.req.method === "OPTIONS") {
        await next();
        return;
    }

    const origin = c.req.header("Origin");
    const siteOrigin = new URL(c.req.url).origin;
    const allowedOrigins = [siteOrigin, c.env.FRONTEND_ORIGIN].filter(Boolean);

    if (!origin || !allowedOrigins.includes(origin)) {
        // リクエスト元を確認できない場合は、不正アクセスを防止するためエラーを返す
        return c.json({ message: authValidationMessages.originUnverified }, 403);
    }

    if (new URL(c.req.url).pathname === "/api/auth/logout") {
        // ログアウトリクエストは認証不要で次のハンドラーへ進める
        await next();
        return;
    }

    if (!await getAdministratorFromSession(c)) {
        // 管理者でない場合はログインが必要である旨を返す
        return c.json({ message: authValidationMessages.administratorLoginRequired }, 401);
    }
    await next();
};
