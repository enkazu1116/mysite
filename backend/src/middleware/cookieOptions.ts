import type { Context } from "hono";
import type { AppBindings } from "../app";

export type AppEnv = { Bindings: AppBindings };
export type AppContext<E extends AppEnv = AppEnv> = Context<E>;

/**
 * Cookie の必須オプションを設定
 * HTTP Only: Javascript からの不正アクセスを防止
 * Secure: HTTPS でのみ有効にし、レガシーな HTTP 通信を防止
 * SameSite: CSRF 攻撃を防止するため、Lax を設定
 */
export function cookieOptions(url: string) {
    return {
        httpOnly: true,
        secure: new URL(url).protocol === "https:",
        sameSite: "Lax" as const,
        path: "/",
    };
}
