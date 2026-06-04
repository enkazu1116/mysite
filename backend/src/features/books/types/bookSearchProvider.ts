import type { BookSearchResult } from "./bookSearchResult";

interface BookSearchProvider {
    searchBooks(query: string): Promise<BookSearchResult[]>;
}

export type { BookSearchProvider };
