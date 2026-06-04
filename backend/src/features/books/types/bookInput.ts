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
    startedAt?: Date | null;
    finishedAt?: Date | null;
};

export type {
    CreateUserBookInput,
    ListUserBooksInput,
    UpdateUserBookInput,
};
