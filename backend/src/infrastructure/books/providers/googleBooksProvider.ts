import type { BookSearchProvider } from "../../../features/books/types/bookSearchProvider";
import type { BookSearchResult } from "../../../features/books/types/bookSearchResult";
import type { GoogleBooksResponse } from "../types/googleBooksResponse";

class GoogleBooksProvider implements BookSearchProvider {
    async searchBooks(query: string): Promise<BookSearchResult[]> {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}&maxResults=20`,
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch books: ${response.status}`);
        }

        const data = (await response.json()) as GoogleBooksResponse;
        const items = data.items ?? [];

        return items.map((item) => ({
            source: "google_books",
            sourceBookId: item.id,
            title: item.volumeInfo?.title ?? "Untitled",
            authors: item.volumeInfo?.authors ?? [],
            publisher: item.volumeInfo?.publisher ?? null,
            publishedDate: item.volumeInfo?.publishedDate ?? null,
            description: item.volumeInfo?.description ?? null,
            pageCount: item.volumeInfo?.pageCount ?? null,
            thumbnailUrl: item.volumeInfo?.imageLinks?.thumbnail ?? null,
            infoLink: item.volumeInfo?.infoLink ?? null,
        }));
    }
}

export { GoogleBooksProvider };
