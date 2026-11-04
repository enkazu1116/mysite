import type { Context } from "hono";
import type { AppBindings } from "../../../app";
import type { AuthUseCase } from "../usecase/authUseCase";

/**
 * 認証ルーター用の Hono Env 型
 * Bindings は Cloudflare Workers の環境変数、Variables はリクエスト内の依存を表す
 */
export type AuthEnv = {
    Bindings: AppBindings;
    Variables: { useCase: AuthUseCase };
};

export type AuthContext = Context<AuthEnv>;
