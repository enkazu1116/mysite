import type { BookSearchResult } from "../../../../features/books/adapters/bookSearchAdapter";
import type { ReadingStatus } from "../../../../features/books/types/readingStatus";
import type { UserBook } from "../../../../features/books/types/userBook";
import { booksTable, userBooksTable } from "../../schema";

export type BookTableRow = typeof booksTable.$inferSelect;
export type UserBookTableRow = typeof userBooksTable.$inferSelect;

function mapBookRow(row: BookTableRow) {
    return {
        bookId: row.book_id,
        source: row.source,
        sourceBookId: row.source_book_id,
        title: row.title,
        authors: JSON.parse(row.authors_json) as string[],
        publisher: row.publisher,
        publishedDate: row.published_date,
        description: row.description,
        pageCount: row.page_count,
        thumbnailUrl: row.thumbnail_url,
        infoLink: row.info_link,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function mapUserBookRow(userBookRow: UserBookTableRow, bookRow: BookTableRow): UserBook {
    return {
        userBookId: userBookRow.user_book_id,
        userId: userBookRow.user_id,
        bookId: userBookRow.book_id,
        status: userBookRow.status as ReadingStatus,
        currentPage: userBookRow.current_page,
        note: userBookRow.note,
        startedAt: userBookRow.started_at,
        finishedAt: userBookRow.finished_at,
        createdAt: userBookRow.created_at,
        updatedAt: userBookRow.updated_at,
        book: mapBookRow(bookRow),
    };
}

function toBookInsertValues(book: BookSearchResult) {
    return {
        source: book.source,
        source_book_id: book.sourceBookId,
        title: book.title,
        authors_json: JSON.stringify(book.authors),
        publisher: book.publisher,
        published_date: book.publishedDate,
        description: book.description,
        page_count: book.pageCount,
        thumbnail_url: book.thumbnailUrl,
        info_link: book.infoLink,
    };
}

export { mapBookRow, mapUserBookRow, toBookInsertValues };
