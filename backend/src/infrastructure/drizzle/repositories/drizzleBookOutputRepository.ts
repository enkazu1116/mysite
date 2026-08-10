import { eq } from "drizzle-orm";
import type {
    CreateBookOutputInput,
    UpdateBookOutputInput,
} from "../../../features/books/commands/bookOutputCommands";
import type { BookOutputRepository } from "../../../features/books/repositories/bookOutputRepository";
import type { BookOutput } from "../../../features/books/types/bookOutput";
import { nowInstant, type Temporal } from "../../../util/temporal/instant";
import db from "../db";
import { bookOutputsTable } from "../schema";

function mapOutputRow(row: typeof bookOutputsTable.$inferSelect): BookOutput {
    return {
        bookOutputId: row.book_output_id,
        userBookId: row.user_book_id,
        title: row.title,
        body: row.body,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

class DrizzleBookOutputRepository implements BookOutputRepository {
    async createOutput(input: CreateBookOutputInput): Promise<BookOutput> {
        const [createdOutput] = await db
            .insert(bookOutputsTable)
            .values({
                user_book_id: input.userBookId,
                title: input.title,
                body: input.body,
            })
            .returning();

        if (!createdOutput) {
            throw new Error("Failed to create output.");
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

        const [updatedOutput] = await db
            .update(bookOutputsTable)
            .set(updateValues)
            .where(eq(bookOutputsTable.book_output_id, input.bookOutputId))
            .returning();

        if (!updatedOutput) {
            throw new Error("Output not found.");
        }

        return mapOutputRow(updatedOutput);
    }
}

export { DrizzleBookOutputRepository };
