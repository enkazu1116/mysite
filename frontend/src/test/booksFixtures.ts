import type {
  BookChapterMemo,
  BookOutput,
  BookSearchResult,
  UserBook,
} from "../features/Books/types/book";

export const OWNER_USER_ID = "owner-1";

const now = "2026-08-01T00:00:00.000Z";

export const unreadBook: UserBook = {
  userBookId: "ub-unread",
  userId: OWNER_USER_ID,
  bookId: "book-unread",
  status: "unread",
  currentPage: null,
  note: null,
  startedAt: null,
  finishedAt: null,
  createdAt: now,
  updatedAt: now,
  book: {
    bookId: "book-unread",
    source: "google_books",
    sourceBookId: "src-unread",
    title: "未読の本",
    authors: ["著者A"],
    publisher: "出版社A",
    publishedDate: "2020-01-01",
    description: "未読の説明",
    pageCount: 200,
    thumbnailUrl: null,
    infoLink: null,
    createdAt: now,
    updatedAt: now,
  },
};

export const readingBook: UserBook = {
  userBookId: "ub-reading",
  userId: OWNER_USER_ID,
  bookId: "book-reading",
  status: "reading",
  currentPage: 40,
  note: "途中まで読んだ",
  startedAt: now,
  finishedAt: null,
  createdAt: now,
  updatedAt: "2026-08-10T00:00:00.000Z",
  book: {
    bookId: "book-reading",
    source: "google_books",
    sourceBookId: "src-reading",
    title: "読書中の本",
    authors: ["著者B"],
    publisher: "出版社B",
    publishedDate: "2021-02-02",
    description: "読書中の説明",
    pageCount: 320,
    thumbnailUrl: null,
    infoLink: null,
    createdAt: now,
    updatedAt: now,
  },
};

export const searchResult: BookSearchResult = {
  source: "google_books",
  sourceBookId: "src-new",
  title: "新しい本",
  authors: ["著者C"],
  publisher: "出版社C",
  publishedDate: "2024-03-03",
  description: null,
  pageCount: 120,
  thumbnailUrl: null,
  infoLink: null,
};

export const chapterMemo: BookChapterMemo = {
  chapterMemoId: "memo-1",
  userBookId: readingBook.userBookId,
  chapterTitle: "はじめに",
  chapterOrder: 1,
  memo: "既存の章メモ本文",
  createdAt: now,
  updatedAt: now,
};

export const bookOutput: BookOutput = {
  bookOutputId: "output-1",
  userBookId: readingBook.userBookId,
  chapterTitle: "まとめ",
  chapterOrder: 2,
  title: "既存アウトプット",
  body: "既存のアウトプット本文",
  createdAt: now,
  updatedAt: now,
};

export function cloneUserBook(book: UserBook): UserBook {
  return {
    ...book,
    book: { ...book.book },
  };
}
