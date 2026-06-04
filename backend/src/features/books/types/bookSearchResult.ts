type BookSearchResult = {
    source: "google_books";
    sourceBookId: string;
    title: string;
    authors: string[];
    publisher: string | null;
    publishedDate: string | null;
    description: string | null;
    pageCount: number | null;
    thumbnailUrl: string | null;
    infoLink: string | null;
};

export type { BookSearchResult };
