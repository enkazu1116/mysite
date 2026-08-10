import type { Temporal } from "../../../util/temporal/instant";

/**
 * 本の章ごとのメモ
 */
type BookChapterMemo = {
    chapterMemoId: string;
    userBookId: string;
    chapterTitle?: string;
    chapterOrder: number;
    memo?: string;
    createdAt: Temporal.Instant;
    updatedAt: Temporal.Instant;
};

export type { BookChapterMemo };
