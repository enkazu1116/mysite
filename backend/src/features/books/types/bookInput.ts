import type { Temporal } from "../../../util/temporal/instant";
import type { BookSearchResult } from "./bookSearchResult";
import type { ReadingStatus } from "./readingStatus";

type CreateUserBookInput = {
    userId: string;
    book: BookSearchResult;
    status: ReadingStatus;
};

type ListUserBooksInput = {
    userId: string;
    status?: ReadingStatus;
};

type UpdateUserBookInput = {
    userBookId: string;
    status?: ReadingStatus;
    currentPage?: number | null;
    note?: string | null;
    startedAt?: Temporal.Instant | null;
    finishedAt?: Temporal.Instant | null;
};

export type {
    CreateUserBookInput,
    ListUserBooksInput,
    UpdateUserBookInput,
};
