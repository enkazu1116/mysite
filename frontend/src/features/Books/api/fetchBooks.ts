import type { Book } from "../types/book";

type GoogleBooksResponse = {
  items?: Array<{
    id: string;
    volumeInfo?: {
      title?: string;
      authors?: string[];
      imageLinks?: {
        thumbnail?: string;
      };
      infoLink?: string;
    };
  }>;
};

export const fetchBooks = async (title: string): Promise<Book[]> => {
  const query = title.trim();
  if (query.length === 0) {
    return [];
  }

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}&maxResults=20`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.status}`);
  }

  const data = (await response.json()) as GoogleBooksResponse;
  const items = data.items ?? [];

  return items.map((item) => {
    const info = item.volumeInfo;
    return {
      id: item.id,
      title: info?.title ?? "タイトル不明",
      authors: info?.authors ?? [],
      thumbnail: info?.imageLinks?.thumbnail ?? null,
      infoLink: info?.infoLink ?? "",
    };
  });
};
