import { and, eq } from "drizzle-orm";
import type {
    CreateUserBookInput,
    ListUserBooksInput,
    UpdateUserBookInput,
} from "../../../../features/books/commands/userBookCommands";
import type { UserBookRepository } from "../../../../features/books/repositories/userBookRepository";
import type { UserBook } from "../../../../features/books/types/userBook";
import { userBookPersistenceMessages } from "../../../../util/messages/persistence/books/userBook";
import { nowInstant, type Temporal } from "../../../../util/temporal/instant";
import { mapUserBookRow } from "../../mappers/books/userBookMapper";
import db from "../../db";
import { booksTable, bookChapterMemosTable, bookOutputsTable, userBooksTable, usersTable } from "../../schema";
import { DrizzleBookCatalogRepository } from "./drizzleBookCatalogRepository";

class DrizzleUserBookRepository implements UserBookRepository {
    constructor(
        private readonly bookCatalog = new DrizzleBookCatalogRepository(),
    ) {}

    async saveUserBook(input: CreateUserBookInput): Promise<UserBook> {
        const persistedBook =
            (await this.bookCatalog.findBySource(
                input.book.source,
                input.book.sourceBookId,
            )) ?? (await this.bookCatalog.createFromSearchResult(input.book));

        const [userRow] = await db
            .select({ userId: usersTable.user_id })
            .from(usersTable)
            .where(eq(usersTable.user_id, input.userId));

        if (!userRow) {
            throw new Error(userBookPersistenceMessages.userNotFound);
        }

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
                throw new Error(userBookPersistenceMessages.updateFailed);
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
            throw new Error(userBookPersistenceMessages.createFailed);
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
            throw new Error(userBookPersistenceMessages.userBookNotFound);
        }

        const book = await this.bookCatalog.findById(updatedUserBook.book_id);

        if (!book) {
            throw new Error(userBookPersistenceMessages.bookNotFound);
        }

        return mapUserBookRow(updatedUserBook, book);
    }

    async deleteUserBook(userBookId: string): Promise<UserBook> {
        const existing = await this.findUserBookById(userBookId);
        if (!existing) {
            throw new Error(userBookPersistenceMessages.userBookNotFound);
        }

        await db
            .delete(bookChapterMemosTable)
            .where(eq(bookChapterMemosTable.user_book_id, userBookId));
        await db
            .delete(bookOutputsTable)
            .where(eq(bookOutputsTable.user_book_id, userBookId));

        const [deleted] = await db
            .delete(userBooksTable)
            .where(eq(userBooksTable.user_book_id, userBookId))
            .returning({ user_book_id: userBooksTable.user_book_id });

        if (!deleted) {
            throw new Error(userBookPersistenceMessages.deleteFailed);
        }

        return existing;
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
