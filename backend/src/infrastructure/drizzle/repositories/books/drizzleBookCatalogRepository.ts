import { and, eq } from "drizzle-orm";
import type { BookSearchResult } from "../../../../features/books/adapters/bookSearchAdapter";
import { userBookPersistenceMessages } from "../../../../util/messages/persistence/books/userBook";
import {
    type BookTableRow,
    toBookInsertValues,
} from "../../mappers/books/userBookMapper";
import db from "../../db";
import { booksTable } from "../../schema";

class DrizzleBookCatalogRepository {
    async findBySource(
        source: string,
        sourceBookId: string,
    ): Promise<BookTableRow | null> {
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

    async findById(bookId: string): Promise<BookTableRow | null> {
        const [book] = await db
            .select()
            .from(booksTable)
            .where(eq(booksTable.book_id, bookId));

        return book ?? null;
    }

    async createFromSearchResult(book: BookSearchResult): Promise<BookTableRow> {
        const [createdBook] = await db
            .insert(booksTable)
            .values(toBookInsertValues(book))
            .returning();

        if (!createdBook) {
            throw new Error(userBookPersistenceMessages.bookCreateFailed);
        }

        return createdBook;
    }
}

export { DrizzleBookCatalogRepository };
