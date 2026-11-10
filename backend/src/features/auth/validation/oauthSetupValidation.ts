import type { AppBindings } from "../../../app";

const MIN_SESSION_SECRET_LENGTH = 32;

/**
 * SESSION_SECRET が設定済みで十分な長さかを検証する
 */
export function hasValidSessionSecret(
    env: AppBindings,
): env is AppBindings & { SESSION_SECRET: string } {
    return typeof env.SESSION_SECRET === "string" && env.SESSION_SECRET.length >= MIN_SESSION_SECRET_LENGTH;
}
