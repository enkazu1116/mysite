import { and, eq } from "drizzle-orm";
import type { BookSearchResult } from "../../../features/books/adapters/bookSearchAdapter";
import type {
    CreateUserBookInput,
    ListUserBooksInput,
    UpdateUserBookInput,
} from "../../../features/books/commands/userBookCommands";
import type { UserBookRepository } from "../../../features/books/repositories/userBookRepository";
import type { ReadingStatus } from "../../../features/books/types/readingStatus";
import type { UserBook } from "../../../features/books/types/userBook";
import { nowInstant, type Temporal } from "../../../util/temporal/instant";
import db from "../db";
import { booksTable, userBooksTable } from "../schema";

function mapBookRow(row: typeof booksTable.$inferSelect) {
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

function mapUserBookRow(
    userBookRow: typeof userBooksTable.$inferSelect,
    bookRow: typeof booksTable.$inferSelect,
): UserBook {
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

class DrizzleUserBookRepository implements UserBookRepository {
    async saveUserBook(input: CreateUserBookInput): Promise<UserBook> {
        const existingBook = await this.findBookBySource(
            input.book.source,
            input.book.sourceBookId,
        );
        const persistedBook = existingBook ?? (await this.createBook(input.book));

        const existingUserBook = await this.findUserBookRow(
            input.userId,
            persistedBook.book_id,
        );

        if (existingUserBook) {
            const [updatedUserBook] = await db
                .update(userBooksTable)
                .set({
                    status: input.status,
                    updated_at: nowInstant(),
                })
                .where(eq(userBooksTable.user_book_id, existingUserBook.user_book_id))
                .returning();

            if (!updatedUserBook) {
                throw new Error("Failed to update user book.");
            }

            return mapUserBookRow(updatedUserBook, persistedBook);
        }

        const [createdUserBook] = await db
            .insert(userBooksTable)
            .values({
                user_id: input.userId,
                book_id: persistedBook.book_id,
                status: input.status,
            })
            .returning();

        if (!createdUserBook) {
            throw new Error("Failed to create user book.");
        }

        return mapUserBookRow(createdUserBook, persistedBook);
    }

    async listUserBooks(input: ListUserBooksInput): Promise<UserBook[]> {
        const rows = await db
            .select({
                userBook: userBooksTable,
                book: booksTable,
            })
            .from(userBooksTable)
            .innerJoin(booksTable, eq(userBooksTable.book_id, booksTable.book_id))
            .where(
                input.status
                    ? and(
                          eq(userBooksTable.user_id, input.userId),
                          eq(userBooksTable.status, input.status),
                      )
                    : eq(userBooksTable.user_id, input.userId),
            );

        return rows.map((row) => mapUserBookRow(row.userBook, row.book));
    }

    async findUserBookById(userBookId: string): Promise<UserBook | null> {
        const [row] = await db
            .select({
                userBook: userBooksTable,
                book: booksTable,
            })
            .from(userBooksTable)
            .innerJoin(booksTable, eq(userBooksTable.book_id, booksTable.book_id))
            .where(eq(userBooksTable.user_book_id, userBookId));

        return row ? mapUserBookRow(row.userBook, row.book) : null;
    }

    async updateUserBook(input: UpdateUserBookInput): Promise<UserBook> {
        const updateValues: Partial<typeof userBooksTable.$inferInsert> & {
            updated_at: Temporal.Instant;
        } = {
            updated_at: nowInstant(),
        };

        if (input.status !== undefined) {
            updateValues.status = input.status;
        }
        if (input.currentPage !== undefined) {
            updateValues.current_page = input.currentPage;
        }
        if (input.note !== undefined) {
            updateValues.note = input.note;
        }
        if (input.startedAt !== undefined) {
            updateValues.started_at = input.startedAt;
        }
        if (input.finishedAt !== undefined) {
            updateValues.finished_at = input.finishedAt;
        }

        const [updatedUserBook] = await db
            .update(userBooksTable)
            .set(updateValues)
            .where(eq(userBooksTable.user_book_id, input.userBookId))
            .returning();

        if (!updatedUserBook) {
            throw new Error("User book not found.");
        }

        const [book] = await db
            .select()
            .from(booksTable)
            .where(eq(booksTable.book_id, updatedUserBook.book_id));

        if (!book) {
            throw new Error("Book not found.");
        }

        return mapUserBookRow(updatedUserBook, book);
    }

    private async findBookBySource(source: string, sourceBookId: string) {
        const [book] = await db
            .select()
            .from(booksTable)
            .where(
                and(
                    eq(booksTable.source, source),
                    eq(booksTable.source_book_id, sourceBookId),
                ),
            );

        return book ?? null;
    }

    private async createBook(book: BookSearchResult) {
        const [createdBook] = await db
            .insert(booksTable)
            .values({
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
            })
            .returning();

        if (!createdBook) {
            throw new Error("Failed to create book.");
        }

        return createdBook;
    }

    private async findUserBookRow(userId: string, bookId: string) {
        const [userBook] = await db
            .select()
            .from(userBooksTable)
            .where(
                and(
                    eq(userBooksTable.user_id, userId),
                    eq(userBooksTable.book_id, bookId),
                ),
            );

        return userBook ?? null;
    }
}

export { DrizzleUserBookRepository };
