import { useState } from "react";
import type { FormEvent } from "react";
import { fetchBooks } from "./api/fetchBooks";
import type { Book } from "./types/book";

export default function Books() {
  const [title, setTitle] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedTitle, setSearchedTitle] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = title.trim();
    if (!query) {
      setBooks([]);
      setSearchedTitle("");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchBooks(query);
      setBooks(result);
      setSearchedTitle(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : "本の取得に失敗しました。");
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 px-4 pb-4 pt-0.5">
      <form onSubmit={(event) => void handleSubmit(event)} className="mb-6 flex gap-2">
        <input
          className="w-full max-w-md rounded border px-3 py-2"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="本のタイトルを入力"
        />
        <button
          type="submit"
          className="rounded bg-purple-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={isLoading}
        >
          検索
        </button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!isLoading && !error && searchedTitle && books.length === 0 && (
        <p>「{searchedTitle}」の検索結果はありません。</p>
      )}

      {books.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {books.map((book) => (
            <a
              key={book.id}
              href={book.infoLink || "#"}
              target="_blank"
              rel="noreferrer"
              className="rounded border p-3 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {book.thumbnail ? (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="mx-auto mb-2 h-40 object-contain"
                />
              ) : (
                <div className="mx-auto mb-2 flex h-40 items-center justify-center bg-gray-100 text-xs text-gray-500">
                  No Image
                </div>
              )}
              <p className="line-clamp-2 text-sm font-semibold">{book.title}</p>
              <p className="mt-1 text-xs text-gray-500">
                {book.authors.length > 0 ? book.authors.join(", ") : "著者不明"}
              </p>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
