import type { AppBindings } from "../../../app";

const MIN_JWT_SECRET_LENGTH = 32;

/**
 * JWT_SECRET が設定済みで十分な長さかを検証する
 */
export function hasValidJwtSecret(
    env: AppBindings,
): env is AppBindings & { JWT_SECRET: string } {
    return typeof env.JWT_SECRET === "string" && env.JWT_SECRET.length >= MIN_JWT_SECRET_LENGTH;
}
