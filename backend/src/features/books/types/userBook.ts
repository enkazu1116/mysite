import type { Book } from "./book";
import type { ReadingStatus } from "./readingStatus";

type UserBook = {
    userBookId: string;
    userId: string;
    bookId: string;
    status: ReadingStatus;
    currentPage: number | null;
    note: string | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    book: Book;
};

export type { UserBook };
