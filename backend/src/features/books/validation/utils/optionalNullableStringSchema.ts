import { z } from "zod";

/**
 * 任意の文字列フィールド。
 * 不正値は検証失敗にせず null にフォールバックする。
 */
const optionalNullableStringSchema = z
    .union([z.string(), z.null()])
    .catch(null);

export { optionalNullableStringSchema };
