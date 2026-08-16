import type {
  BookChapterMemo,
  BookOutput,
  BookSearchResult,
  CreateBookOutputPayload,
  CreateChapterMemoPayload,
  ReadingStatus,
  UpdateBookOutputPayload,
  UpdateChapterMemoPayload,
  UpdateUserBookPayload,
  UserBook,
} from "../types/book";

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const configuredBooksUserId = import.meta.env.VITE_BOOKS_USER_ID?.trim();

export async function resolveBooksUserId(): Promise<string> {
  if (configuredBooksUserId) {
    return configuredBooksUserId;
  }

  const { users } = await requestJson<{ users: { id: string }[] }>(
    "/users",
    "Failed to fetch users",
  );
  const userId = users[0]?.id;
  if (!userId) {
    throw new Error("登録先のユーザーが見つかりませんでした。");
  }
  return userId;
}

async function requestJson<T>(
  path: string,
  fallback: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}/api${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw await parseApiError(response, fallback);
  }

  return response.json() as Promise<T>;
}

async function parseApiError(response: Response, fallback: string) {
  const errorBody = (await response.json().catch(() => null)) as
    | { message?: string }
    | null;
  return new Error(
    errorBody?.message ?? `${fallback}: ${String(response.status)}`,
  );
}

export const searchBooks = async (
  title: string,
): Promise<BookSearchResult[]> => {
  const query = title.trim();
  if (query.length === 0) {
    return [];
  }

  const { books } = await requestJson<{ books: BookSearchResult[] }>(
    `/books/search?q=${encodeURIComponent(query)}`,
    "Failed to fetch books",
  );
  return books;
};

export const createUserBook = async (
  book: BookSearchResult,
  status: ReadingStatus = "unread",
  userId?: string,
): Promise<UserBook> => {
  const resolvedUserId = userId ?? (await resolveBooksUserId());
  const { userBook } = await requestJson<{ userBook: UserBook }>(
    "/user-books",
    "Failed to create user book",
    {
      method: "POST",
      body: JSON.stringify({ userId: resolvedUserId, book, status }),
    },
  );
  return userBook;
};

export const listUserBooks = async (
  userId?: string,
  status?: ReadingStatus,
): Promise<UserBook[]> => {
  const resolvedUserId = userId ?? (await resolveBooksUserId());
  const params = new URLSearchParams({ userId: resolvedUserId });
  if (status) {
    params.set("status", status);
  }

  const { userBooks } = await requestJson<{ userBooks: UserBook[] }>(
    `/user-books?${params.toString()}`,
    "Failed to fetch user books",
  );
  return userBooks;
};

export const getUserBook = async (userBookId: string): Promise<UserBook> => {
  const { userBook } = await requestJson<{ userBook: UserBook }>(
    `/user-books/${encodeURIComponent(userBookId)}`,
    "Failed to fetch user book",
  );
  return userBook;
};

export const updateUserBook = async (
  userBookId: string,
  payload: UpdateUserBookPayload,
): Promise<UserBook> => {
  const { userBook } = await requestJson<{ userBook: UserBook }>(
    `/user-books/${encodeURIComponent(userBookId)}`,
    "Failed to update user book",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return userBook;
};

export const deleteUserBook = async (userBookId: string): Promise<UserBook> => {
  const { userBook } = await requestJson<{ userBook: UserBook }>(
    `/user-books/${encodeURIComponent(userBookId)}`,
    "Failed to delete user book",
    {
      method: "DELETE",
    },
  );
  return userBook;
};

export const listChapterMemos = async (
  userBookId: string,
): Promise<BookChapterMemo[]> => {
  const { chapterMemos } = await requestJson<{
    chapterMemos: BookChapterMemo[];
  }>(
    `/user-books/${encodeURIComponent(userBookId)}/chapter-memos`,
    "Failed to fetch chapter memos",
  );
  return chapterMemos;
};

export const createChapterMemo = async (
  userBookId: string,
  payload: CreateChapterMemoPayload,
): Promise<BookChapterMemo> => {
  const { chapterMemo } = await requestJson<{
    chapterMemo: BookChapterMemo;
  }>(
    `/user-books/${encodeURIComponent(userBookId)}/chapter-memos`,
    "Failed to create chapter memo",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return chapterMemo;
};

export const updateChapterMemo = async (
  chapterMemoId: string,
  payload: UpdateChapterMemoPayload,
): Promise<BookChapterMemo> => {
  const { chapterMemo } = await requestJson<{
    chapterMemo: BookChapterMemo;
  }>(
    `/user-books/chapter-memos/${encodeURIComponent(chapterMemoId)}`,
    "Failed to update chapter memo",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return chapterMemo;
};

export const deleteChapterMemo = async (
  chapterMemoId: string,
): Promise<BookChapterMemo> => {
  const { chapterMemo } = await requestJson<{
    chapterMemo: BookChapterMemo;
  }>(
    `/user-books/chapter-memos/${encodeURIComponent(chapterMemoId)}`,
    "Failed to delete chapter memo",
    {
      method: "DELETE",
    },
  );
  return chapterMemo;
};

export const listOutputs = async (userBookId: string): Promise<BookOutput[]> => {
  const { outputs } = await requestJson<{ outputs: BookOutput[] }>(
    `/user-books/${encodeURIComponent(userBookId)}/outputs`,
    "Failed to fetch outputs",
  );
  return outputs;
};

export const createOutput = async (
  userBookId: string,
  payload: CreateBookOutputPayload,
): Promise<BookOutput> => {
  const { output } = await requestJson<{ output: BookOutput }>(
    `/user-books/${encodeURIComponent(userBookId)}/outputs`,
    "Failed to create output",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return output;
};

export const updateOutput = async (
  bookOutputId: string,
  payload: UpdateBookOutputPayload,
): Promise<BookOutput> => {
  const { output } = await requestJson<{ output: BookOutput }>(
    `/user-books/outputs/${encodeURIComponent(bookOutputId)}`,
    "Failed to update output",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return output;
};
