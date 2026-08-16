import { http, HttpResponse } from "msw";
import type {
  BookChapterMemo,
  BookOutput,
  UserBook,
} from "../features/Books/types/book";
import {
  OWNER_USER_ID,
  bookOutput,
  chapterMemo,
  cloneUserBook,
  readingBook,
  searchResult,
  unreadBook,
} from "./booksFixtures";

type BooksStore = {
  userBooks: UserBook[];
  memos: BookChapterMemo[];
  outputs: BookOutput[];
};

function createInitialStore(): BooksStore {
  return {
    userBooks: [cloneUserBook(unreadBook), cloneUserBook(readingBook)],
    memos: [{ ...chapterMemo }],
    outputs: [{ ...bookOutput }],
  };
}

let store = createInitialStore();

export function resetBooksStore() {
  store = createInitialStore();
}

export function setUserBooks(books: UserBook[]) {
  store.userBooks = books.map(cloneUserBook);
}

export function setMemos(memos: BookChapterMemo[]) {
  store.memos = memos.map((memo) => ({ ...memo }));
}

export function setOutputs(outputs: BookOutput[]) {
  store.outputs = outputs.map((output) => ({ ...output }));
}

export const booksHandlers = [
  http.get("/api/users", () =>
    HttpResponse.json({ users: [{ id: OWNER_USER_ID }] }),
  ),

  http.get("/api/user-books", ({ request }) => {
    const userId = new URL(request.url).searchParams.get("userId");
    const userBooks = store.userBooks.filter(
      (book) => !userId || book.userId === userId,
    );
    return HttpResponse.json({ userBooks });
  }),

  http.get("/api/user-books/:userBookId", ({ params }) => {
    const userBook = store.userBooks.find(
      (book) => book.userBookId === params.userBookId,
    );
    if (!userBook) {
      return HttpResponse.json({ message: "本が見つかりません。" }, { status: 404 });
    }
    return HttpResponse.json({ userBook });
  }),

  http.post("/api/user-books", async ({ request }) => {
    const body = (await request.json()) as {
      userId: string;
      book: typeof searchResult;
      status?: UserBook["status"];
    };
    const created: UserBook = {
      userBookId: `ub-${body.book.sourceBookId}`,
      userId: body.userId,
      bookId: `book-${body.book.sourceBookId}`,
      status: body.status ?? "unread",
      currentPage: null,
      note: null,
      startedAt: null,
      finishedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      book: {
        bookId: `book-${body.book.sourceBookId}`,
        source: body.book.source,
        sourceBookId: body.book.sourceBookId,
        title: body.book.title,
        authors: body.book.authors,
        publisher: body.book.publisher,
        publishedDate: body.book.publishedDate,
        description: body.book.description,
        pageCount: body.book.pageCount,
        thumbnailUrl: body.book.thumbnailUrl,
        infoLink: body.book.infoLink,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    store.userBooks = [created, ...store.userBooks];
    return HttpResponse.json({ userBook: created }, { status: 201 });
  }),

  http.delete("/api/user-books/:userBookId", ({ params }) => {
    const userBook = store.userBooks.find(
      (book) => book.userBookId === params.userBookId,
    );
    if (!userBook) {
      return HttpResponse.json({ message: "本が見つかりません。" }, { status: 404 });
    }
    store.userBooks = store.userBooks.filter(
      (book) => book.userBookId !== params.userBookId,
    );
    return HttpResponse.json({ userBook });
  }),

  http.get("/api/books/search", ({ request }) => {
    const query = new URL(request.url).searchParams.get("q") ?? "";
    const books = searchResult.title.includes(query) ? [searchResult] : [];
    return HttpResponse.json({ books });
  }),

  http.get("/api/user-books/:userBookId/chapter-memos", ({ params }) => {
    const chapterMemos = store.memos.filter(
      (memo) => memo.userBookId === params.userBookId,
    );
    return HttpResponse.json({ chapterMemos });
  }),

  http.post("/api/user-books/:userBookId/chapter-memos", async ({ params, request }) => {
    const payload = (await request.json()) as Omit<
      BookChapterMemo,
      "chapterMemoId" | "userBookId" | "createdAt" | "updatedAt"
    >;
    const chapterMemoCreated: BookChapterMemo = {
      chapterMemoId: `memo-${store.memos.length + 1}`,
      userBookId: String(params.userBookId),
      chapterTitle: payload.chapterTitle,
      chapterOrder: payload.chapterOrder,
      memo: payload.memo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.memos = [...store.memos, chapterMemoCreated];
    return HttpResponse.json({ chapterMemo: chapterMemoCreated }, { status: 201 });
  }),

  http.get("/api/user-books/:userBookId/outputs", ({ params }) => {
    const outputs = store.outputs.filter(
      (output) => output.userBookId === params.userBookId,
    );
    return HttpResponse.json({ outputs });
  }),

  http.post("/api/user-books/:userBookId/outputs", async ({ params, request }) => {
    const payload = (await request.json()) as Omit<
      BookOutput,
      "bookOutputId" | "userBookId" | "createdAt" | "updatedAt"
    >;
    const output: BookOutput = {
      bookOutputId: `output-${store.outputs.length + 1}`,
      userBookId: String(params.userBookId),
      chapterTitle: payload.chapterTitle,
      chapterOrder: payload.chapterOrder,
      title: payload.title,
      body: payload.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.outputs = [...store.outputs, output];
    return HttpResponse.json({ output }, { status: 201 });
  }),
];
