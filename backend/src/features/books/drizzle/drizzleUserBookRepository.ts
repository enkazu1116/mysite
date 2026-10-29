import { and, eq } from "drizzle-orm";
import type {
    CreateUserBookInput,
    ListUserBooksInput,
    UpdateUserBookInput,
} from "../commands/userBookCommands";
import type { UserBookRepository } from "../repositories/userBookRepository";
import type { UserBook } from "../types/userBook";
import { userBookPersistenceMessages } from "../../../util/messages/persistence/books/userBook";
import { nowInstant, type Temporal } from "../../../util/temporal/instant";
import type { AppDatabase } from "../../../infrastructure/drizzle/db";
import { usersTable } from "../../users/drizzle/schema";
import { mapUserBookRow } from "./userBookMapper";
import { booksTable, userBooksTable } from "./schema";
import { DrizzleBookCatalogRepository } from "./drizzleBookCatalogRepository";

class DrizzleUserBookRepository implements UserBookRepository {
    private readonly bookCatalog: DrizzleBookCatalogRepository;

    constructor(private readonly db: AppDatabase) {
        this.bookCatalog = new DrizzleBookCatalogRepository(db);
    }

    async saveUserBook(input: CreateUserBookInput): Promise<UserBook> {
        const persistedBook =
            (await this.bookCatalog.findBySource(
                input.book.source,
                input.book.sourceBookId,
            )) ?? (await this.bookCatalog.createFromSearchResult(input.book));

        const [userRow] = await this.db
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
            const [updatedUserBook] = await this.db
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

        const [createdUserBook] = await this.db
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
        const rows = await this.db
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
        const [row] = await this.db
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
        if (input.startedAt !== undefined) {
            updateValues.started_at = input.startedAt;
        }
        if (input.finishedAt !== undefined) {
            updateValues.finished_at = input.finishedAt;
        }

        const [updatedUserBook] = await this.db
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

        const [deleted] = await this.db
            .delete(userBooksTable)
            .where(eq(userBooksTable.user_book_id, userBookId))
            .returning({ user_book_id: userBooksTable.user_book_id });

        if (!deleted) {
            throw new Error(userBookPersistenceMessages.deleteFailed);
        }

        return existing;
    }

    private async findUserBookRow(userId: string, bookId: string) {
        const [userBook] = await this.db
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
