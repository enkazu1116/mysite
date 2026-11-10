import { HTTPException } from "hono/http-exception";

/** HTTPException that retains the API's JSON error envelope. */
export class ApiHttpException extends HTTPException {
    constructor(
        status: 400 | 401 | 403 | 404 | 500 | 502 | 503,
        readonly body: Record<string, unknown>,
    ) {
        super(status, { message: String(body.message ?? "リクエストの処理に失敗しました。") });
    }
}

/**
 * Convert an unexpected domain or infrastructure error at the HTTP boundary.
 * Error details are intentionally not exposed for non-Error values.
 */
export function asHttpException(
    error: unknown,
    status: 400 | 401 | 403 | 404 | 500 | 502 | 503 = 400,
    fallbackMessage = "リクエストの処理に失敗しました。",
): HTTPException {
    if (error instanceof HTTPException) return error;

    return new ApiHttpException(status, {
        message: error instanceof Error ? error.message : fallbackMessage,
    });
}
