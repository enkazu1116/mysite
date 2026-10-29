import { mock } from "bun:test";
import type { BookSearchAdapter, BookSearchResult } from "../adapters/bookSearchAdapter";
import type { UserBookRepository } from "../repositories/userBookRepository";
import type { Book } from "../types/book";
import type { UserBook } from "../types/userBook";
import { instantFromDb } from "../../../util/temporal/instant";

const defaultInstant = instantFromDb("2026-08-10T00:00:00Z");
const defaultUserId = "018f2f57-3f58-7c8f-9b7e-9b75b7298d2f";
const defaultUserBookId = "018f2f57-3f58-7c8f-9b7e-9b75b7298d30";
const defaultSearchResult: BookSearchResult = {
    source: "google_books", sourceBookId: "google-book-1", title: "Domain-Driven Design",
    authors: ["Eric Evans"], publisher: "Addison-Wesley", publishedDate: "2003-08-30",
    description: "A book about domain modeling.", pageCount: 560, thumbnailUrl: null, infoLink: null,
};
const defaultBook: Book = { bookId: "018f2f57-3f58-7c8f-9b7e-9b75b7298d33", ...defaultSearchResult, createdAt: defaultInstant, updatedAt: defaultInstant };
const defaultUserBook: UserBook = {
    userBookId: defaultUserBookId, userId: defaultUserId, bookId: defaultBook.bookId,
    status: "reading", currentPage: 120, startedAt: defaultInstant, finishedAt: null,
    createdAt: defaultInstant, updatedAt: defaultInstant, book: defaultBook,
};

function createMockUserBookRepository(overrides: Partial<UserBookRepository> = {}): UserBookRepository {
    return {
        saveUserBook: mock(() => Promise.resolve(defaultUserBook)),
        listUserBooks: mock(() => Promise.resolve([defaultUserBook])),
        findUserBookById: mock((id: string) => Promise.resolve(id === defaultUserBookId ? defaultUserBook : null)),
        updateUserBook: mock(() => Promise.resolve(defaultUserBook)),
        deleteUserBook: mock(() => Promise.resolve(defaultUserBook)),
        ...overrides,
    };
}

function createMockBookSearchAdapter(overrides: Partial<BookSearchAdapter> = {}): BookSearchAdapter {
    return { searchBooks: mock(() => Promise.resolve([defaultSearchResult])), ...overrides };
}

export { createMockBookSearchAdapter, createMockUserBookRepository, defaultSearchResult, defaultUserBook, defaultUserBookId, defaultUserId };
