/**
 * 本の検索結果
 */
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

/**
 * 本の検索結果を取得するためのインターフェース
 */
interface BookSearchAdapter {

    /**
     * 本の検索結果を取得する
     * 
     * @param query 検索クエリ: 本の名前など
     */
    searchBooks(query: string): Promise<BookSearchResult[]>;
}

export type { BookSearchAdapter, BookSearchResult };
