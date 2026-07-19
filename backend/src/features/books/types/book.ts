import type { Temporal } from "../../../util/temporal/instant";

type Book = {
    bookId: string;
    source: string;
    sourceBookId: string;
    title: string;
    authors: string[];
    publisher: string | null;
    publishedDate: string | null;
    description: string | null;
    pageCount: number | null;
    thumbnailUrl: string | null;
    infoLink: string | null;
    createdAt: Temporal.Instant;
    updatedAt: Temporal.Instant;
};

export type { Book };
