import type { z } from "zod";

/**
 * バリデーション結果をエラーメッセージの配列に変換する。
 */
function toErrorMessages(result: z.ZodSafeParseResult<unknown>): string[] {
    return result.success
        ? []
        : result.error.issues.map((issue) => issue.message);
}

export { toErrorMessages };
