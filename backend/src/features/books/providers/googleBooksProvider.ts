import type { BookSearchProvider } from "../types/bookSearchProvider";
import type { BookSearchResult } from "../types/bookSearchResult";

type GoogleBooksResponse = {
    items?: Array<{
        id: string;
        volumeInfo?: {
            title?: string;
            authors?: string[];
            publisher?: string;
            publishedDate?: string;
            description?: string;
            pageCount?: number;
            imageLinks?: {
                thumbnail?: string;
            };
            infoLink?: string;
        };
    }>;
};

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

const googleBooksProvider: BookSearchProvider = new GoogleBooksProvider();

export { googleBooksProvider, GoogleBooksProvider };
