import { mock } from "bun:test";
import type { BookSearchAdapter, BookSearchResult } from "../adapters/bookSearchAdapter";
import type { BookChapterMemoRepository } from "../repositories/bookChapterMemoRepository";
import type { BookOutputRepository } from "../repositories/bookOutputRepository";
import type { UserBookRepository } from "../repositories/userBookRepository";
import type { Book } from "../types/book";
import type { BookChapterMemo } from "../types/bookChapterMemo";
import type { BookOutput } from "../types/bookOutput";
import type { UserBook } from "../types/userBook";
import { instantFromDb } from "../../../util/temporal/instant";

const defaultInstant = instantFromDb("2026-08-10T00:00:00Z");
const defaultUserId = "018f2f57-3f58-7c8f-9b7e-9b75b7298d2f";
const defaultUserBookId = "018f2f57-3f58-7c8f-9b7e-9b75b7298d30";
const defaultChapterMemoId = "018f2f57-3f58-7c8f-9b7e-9b75b7298d31";
const defaultBookOutputId = "018f2f57-3f58-7c8f-9b7e-9b75b7298d32";

const defaultSearchResult: BookSearchResult = {
    source: "google_books",
    sourceBookId: "google-book-1",
    title: "Domain-Driven Design",
    authors: ["Eric Evans"],
    publisher: "Addison-Wesley",
    publishedDate: "2003-08-30",
    description: "A book about domain modeling.",
    pageCount: 560,
    thumbnailUrl: null,
    infoLink: null,
};

const defaultBook: Book = {
    bookId: "018f2f57-3f58-7c8f-9b7e-9b75b7298d33",
    ...defaultSearchResult,
    createdAt: defaultInstant,
    updatedAt: defaultInstant,
};

const defaultUserBook: UserBook = {
    userBookId: defaultUserBookId,
    userId: defaultUserId,
    bookId: defaultBook.bookId,
    status: "reading",
    currentPage: 120,
    note: null,
    startedAt: defaultInstant,
    finishedAt: null,
    createdAt: defaultInstant,
    updatedAt: defaultInstant,
    book: defaultBook,
};

const defaultChapterMemo: BookChapterMemo = {
    chapterMemoId: defaultChapterMemoId,
    userBookId: defaultUserBookId,
    chapterTitle: "Chapter 1",
    chapterOrder: 1,
    memo: "Repository and provider responsibilities are separate.",
    createdAt: defaultInstant,
    updatedAt: defaultInstant,
};

const defaultBookOutput: BookOutput = {
    bookOutputId: defaultBookOutputId,
    userBookId: defaultUserBookId,
    chapterTitle: "Chapter 1",
    chapterOrder: 1,
    title: "DDD explanation",
    body: "DDD keeps business rules close to the domain model.",
    createdAt: defaultInstant,
    updatedAt: defaultInstant,
};

function createMockUserBookRepository(
    overrides: Partial<UserBookRepository> = {},
): UserBookRepository {
    return {
        saveUserBook: mock(() => Promise.resolve(defaultUserBook)),
        listUserBooks: mock(() => Promise.resolve([defaultUserBook])),
        findUserBookById: mock((userBookId: string) =>
            Promise.resolve(userBookId === defaultUserBookId ? defaultUserBook : null),
        ),
        updateUserBook: mock(() => Promise.resolve(defaultUserBook)),
        deleteUserBook: mock(() => Promise.resolve(defaultUserBook)),
        ...overrides,
    };
}

function createMockBookChapterMemoRepository(
    overrides: Partial<BookChapterMemoRepository> = {},
): BookChapterMemoRepository {
    return {
        createChapterMemo: mock(() => Promise.resolve(defaultChapterMemo)),
        listChapterMemos: mock(() => Promise.resolve([defaultChapterMemo])),
        updateChapterMemo: mock(() => Promise.resolve(defaultChapterMemo)),
        deleteChapterMemo: mock(() => Promise.resolve(defaultChapterMemo)),
        ...overrides,
    };
}

function createMockBookOutputRepository(
    overrides: Partial<BookOutputRepository> = {},
): BookOutputRepository {
    return {
        createOutput: mock(() => Promise.resolve(defaultBookOutput)),
        listOutputs: mock(() => Promise.resolve([defaultBookOutput])),
        updateOutput: mock(() => Promise.resolve(defaultBookOutput)),
        ...overrides,
    };
}

function createMockBookSearchAdapter(
    overrides: Partial<BookSearchAdapter> = {},
): BookSearchAdapter {
    return {
        searchBooks: mock(() => Promise.resolve([defaultSearchResult])),
        ...overrides,
    };
}

export {
    createMockBookChapterMemoRepository,
    createMockBookOutputRepository,
    createMockBookSearchAdapter,
    createMockUserBookRepository,
    defaultBookOutput,
    defaultChapterMemo,
    defaultSearchResult,
    defaultUserBook,
    defaultUserBookId,
    defaultUserId,
};
