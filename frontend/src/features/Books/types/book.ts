export const readingStatuses = ["unread", "reading", "finished"] as const;

export type ReadingStatus = (typeof readingStatuses)[number];

export type BookSearchResult = {
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

export type Book = {
  bookId: string;
  source: string;
  sourceBookId: string;
  title: string;
  authors: string[];
  publisher: string | null;
  publishedDate: string | null;
  description: string | null;
  pageCount: number | null;
  thumbnailUrl: string | null;
  infoLink: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserBook = {
  userBookId: string;
  userId: string;
  bookId: string;
  status: ReadingStatus;
  currentPage: number | null;
  note: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  book: Book;
};

export type BookChapterMemo = {
  chapterMemoId: string;
  userBookId: string;
  chapterTitle?: string;
  chapterOrder: number;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type BookOutput = {
  bookOutputId: string;
  userBookId: string;
  chapterTitle?: string;
  chapterOrder: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserBookPayload = {
  status?: ReadingStatus;
  currentPage?: number | null;
  note?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
};

export type CreateChapterMemoPayload = {
  chapterTitle?: string;
  chapterOrder: number;
  memo?: string;
};

export type UpdateChapterMemoPayload = Partial<CreateChapterMemoPayload>;

export type CreateBookOutputPayload = {
  chapterTitle?: string;
  chapterOrder: number;
  title: string;
  body: string;
};

export type UpdateBookOutputPayload = Partial<CreateBookOutputPayload>;
