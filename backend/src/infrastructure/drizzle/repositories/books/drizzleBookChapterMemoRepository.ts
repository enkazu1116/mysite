import { eq } from "drizzle-orm";
import { chapterMemoPersistenceMessages } from "../../../../util/messages/persistence/books/chapterMemo";
import type {
    CreateBookChapterMemoInput,
    UpdateBookChapterMemoInput,
} from "../../../../features/books/commands/chapterMemoCommands";
import type { BookChapterMemoRepository } from "../../../../features/books/repositories/bookChapterMemoRepository";
import type { BookChapterMemo } from "../../../../features/books/types/bookChapterMemo";
import { nowInstant, type Temporal } from "../../../../util/temporal/instant";
import {
    mapChapterMemoRow,
    toChapterMemoInsertValues,
} from "../../mappers/books/chapterMemoMapper";
import db from "../../db";
import { bookChapterMemosTable } from "../../schema";

class DrizzleBookChapterMemoRepository implements BookChapterMemoRepository {
    async createChapterMemo(
        input: CreateBookChapterMemoInput,
    ): Promise<BookChapterMemo> {
        const [createdMemo] = await db
            .insert(bookChapterMemosTable)
            .values(toChapterMemoInsertValues(input))
            .returning();

        if (!createdMemo) {
            throw new Error(chapterMemoPersistenceMessages.createFailed);
        }

        return mapChapterMemoRow(createdMemo);
    }

    async listChapterMemos(userBookId: string): Promise<BookChapterMemo[]> {
        const rows = await db
            .select()
            .from(bookChapterMemosTable)
            .where(eq(bookChapterMemosTable.user_book_id, userBookId));

        return rows.map(mapChapterMemoRow);
    }

    async updateChapterMemo(
        input: UpdateBookChapterMemoInput,
    ): Promise<BookChapterMemo> {
        const updateValues: Partial<typeof bookChapterMemosTable.$inferInsert> & {
            updated_at: Temporal.Instant;
        } = {
            updated_at: nowInstant(),
        };

        if (input.chapterTitle !== undefined) {
            updateValues.chapter_title = input.chapterTitle;
        }
        if (input.chapterOrder !== undefined) {
            updateValues.chapter_order = input.chapterOrder;
        }
        if (input.memo !== undefined) {
            updateValues.memo = input.memo;
        }

        const [updatedMemo] = await db
            .update(bookChapterMemosTable)
            .set(updateValues)
            .where(eq(bookChapterMemosTable.chapter_memo_id, input.chapterMemoId))
            .returning();

        if (!updatedMemo) {
            throw new Error(chapterMemoPersistenceMessages.notFound);
        }

        return mapChapterMemoRow(updatedMemo);
    }

    async deleteChapterMemo(chapterMemoId: string): Promise<BookChapterMemo> {
        const [deletedMemo] = await db
            .delete(bookChapterMemosTable)
            .where(eq(bookChapterMemosTable.chapter_memo_id, chapterMemoId))
            .returning();

        if (!deletedMemo) {
            throw new Error(chapterMemoPersistenceMessages.notFound);
        }

        return mapChapterMemoRow(deletedMemo);
    }
}

export { DrizzleBookChapterMemoRepository };
