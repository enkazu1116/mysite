import type { Temporal } from "../../../util/temporal/instant";
import type { BookSearchResult } from "../adapters/bookSearchAdapter";
import type { ReadingStatus } from "../types/readingStatus";

/**
 * システムに追加するユーザーが読む本の入力データ
 */
type CreateUserBookInput = {
    userId: string;
    book: BookSearchResult;
    status: ReadingStatus;
};

/**
 * ユーザーが読む本の一覧を取得するための入力データ
 */
type ListUserBooksInput = {
    userId: string;
    status?: ReadingStatus;
};

/**
 * ユーザーが読む本の情報を更新するための入力データ
 */
type UpdateUserBookInput = {
    userBookId: string;
    status?: ReadingStatus;
    currentPage?: number | null;
    note?: string | null;
    startedAt?: Temporal.Instant | null;
    finishedAt?: Temporal.Instant | null;
};

export type { CreateUserBookInput, ListUserBooksInput, UpdateUserBookInput };
