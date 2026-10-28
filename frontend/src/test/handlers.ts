import { http, HttpResponse } from "msw";
import type { UserBook } from "../features/Books/types/book";
import {
  OWNER_USER_ID,
  cloneUserBook,
  readingBook,
  searchResult,
  unreadBook,
} from "./booksFixtures";

type BooksStore = {
  userBooks: UserBook[];
};

function createInitialStore(): BooksStore {
  return {
    userBooks: [cloneUserBook(unreadBook), cloneUserBook(readingBook)],
  };
}

let store = createInitialStore();

export function resetBooksStore() {
  store = createInitialStore();
}

export function setUserBooks(books: UserBook[]) {
  store.userBooks = books.map(cloneUserBook);
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

];
