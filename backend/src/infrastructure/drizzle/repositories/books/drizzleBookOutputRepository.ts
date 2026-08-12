import { eq } from "drizzle-orm";
import type {
    CreateBookOutputInput,
    UpdateBookOutputInput,
} from "../../../../features/books/commands/bookOutputCommands";
import { bookOutputPersistenceMessages } from "../../../../util/messages/persistence/books/bookOutput";
import type { BookOutputRepository } from "../../../../features/books/repositories/bookOutputRepository";
import type { BookOutput } from "../../../../features/books/types/bookOutput";
import { nowInstant, type Temporal } from "../../../../util/temporal/instant";
import {
    mapOutputRow,
    toBookOutputInsertValues,
} from "../../mappers/books/bookOutputMapper";
import db from "../../db";
import { bookOutputsTable } from "../../schema";

class DrizzleBookOutputRepository implements BookOutputRepository {
    async createOutput(input: CreateBookOutputInput): Promise<BookOutput> {
        const [createdOutput] = await db
            .insert(bookOutputsTable)
            .values(toBookOutputInsertValues(input))
            .returning();

        if (!createdOutput) {
            throw new Error(bookOutputPersistenceMessages.createFailed);
        }

        return mapOutputRow(createdOutput);
    }

    async listOutputs(userBookId: string): Promise<BookOutput[]> {
        const rows = await db
            .select()
            .from(bookOutputsTable)
            .where(eq(bookOutputsTable.user_book_id, userBookId));

        return rows.map(mapOutputRow);
    }

    async updateOutput(input: UpdateBookOutputInput): Promise<BookOutput> {
        const updateValues: Partial<typeof bookOutputsTable.$inferInsert> & {
            updated_at: Temporal.Instant;
        } = {
            updated_at: nowInstant(),
        };

        if (input.title !== undefined) {
            updateValues.title = input.title;
        }
        if (input.body !== undefined) {
            updateValues.body = input.body;
        }
        if (input.chapterTitle !== undefined) {
            updateValues.chapter_title = input.chapterTitle;
        }
        if (input.chapterOrder !== undefined) {
            updateValues.chapter_order = input.chapterOrder;
        }

        const [updatedOutput] = await db
            .update(bookOutputsTable)
            .set(updateValues)
            .where(eq(bookOutputsTable.book_output_id, input.bookOutputId))
            .returning();

        if (!updatedOutput) {
            throw new Error(bookOutputPersistenceMessages.notFound);
        }

        return mapOutputRow(updatedOutput);
    }
}

export { DrizzleBookOutputRepository };
