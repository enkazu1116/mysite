import type {
    BookSearchAdapter,
    BookSearchResult,
} from "../../../features/books/adapters/bookSearchAdapter";
import {
    GOOGLE_BOOKS_MAX_RESULTS,
    GOOGLE_BOOKS_VOLUMES_URL,
    GOOGLE_BOOKS_API_KEY,
} from "../constants/googleBooksApi";
import { googleBooksResponseSchema } from "../types/googleBooksResponse";

/**
 * Google Books API の検索 URL を生成する
 *
 * @param query 検索クエリ（本の名前）
 */
function buildGoogleBooksSearchUrl(query: string): string {
    const params = new URLSearchParams({
        q: `intitle:${query}`,
        maxResults: String(GOOGLE_BOOKS_MAX_RESULTS),
        key: GOOGLE_BOOKS_API_KEY,
    });

    return `${GOOGLE_BOOKS_VOLUMES_URL}?${params.toString()}`;
}

/**
 * Google Books API を利用して本情報を検索・提供するプロバイダー
 */
class GoogleBooksProvider implements BookSearchAdapter {
    /**
     * 本の検索結果を取得する
     *
     * @param query
     * @returns
     */
    async searchBooks(query: string): Promise<BookSearchResult[]> {
        // URLを生成し、fetchでAPIを呼び出す
        const response = await fetch(buildGoogleBooksSearchUrl(query));
        if (!response.ok) {
            throw new Error(
                `Google Books API の呼び出しに失敗しました: ${response.status}`,
            );
        }

        // レスポンスをスキーマからパース
        const parsed = googleBooksResponseSchema.safeParse(
            await response.json(),
        );
        if (!parsed.success) {
            throw new Error(
                `Google Books API のレスポンスが不正です: ${parsed.error.message}`,
            );
        }

        // 書籍情報として結果を返す
        const items = parsed.data.items ?? [];
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
