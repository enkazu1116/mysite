/**
 * Google Books APIのAPIキーを取得する
 * 取得元: Infisical
 */
const GOOGLE_BOOKS_API_KEY = (() => {
    const value = process.env.BOOKS_API ?? process.env["books-api"];
    if (!value) {
        throw new Error(
            "BOOKS_API が未設定です。Infisical または .env を確認してください。",
        );
    }
    return value;
})();

// URL・最大取得件数を設定
const GOOGLE_BOOKS_VOLUMES_URL = "https://www.googleapis.com/books/v1/volumes";
const GOOGLE_BOOKS_MAX_RESULTS = 20;

export { GOOGLE_BOOKS_MAX_RESULTS, GOOGLE_BOOKS_VOLUMES_URL, GOOGLE_BOOKS_API_KEY };
