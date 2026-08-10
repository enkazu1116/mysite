import type { Temporal } from "../../../util/temporal/instant";
import type { Book } from "./book";
import type { ReadingStatus } from "./readingStatus";

/**
 * ユーザーが実際に読む本の情報
 * 読書ステータスと進捗・章メモをもつ
 */
type UserBook = {
    userBookId: string;
    userId: string;
    bookId: string;
    status: ReadingStatus;
    currentPage: number | null;
    note: string | null;
    startedAt: Temporal.Instant | null;
    finishedAt: Temporal.Instant | null;
    createdAt: Temporal.Instant;
    updatedAt: Temporal.Instant;
    book: Book;
};

export type { UserBook };
