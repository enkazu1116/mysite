import { eq } from "drizzle-orm";
import type {
    CreateBookChapterMemoInput,
    UpdateBookChapterMemoInput,
} from "../../../features/books/commands/chapterMemoCommands";
import type { BookChapterMemoRepository } from "../../../features/books/repositories/bookChapterMemoRepository";
import type { BookChapterMemo } from "../../../features/books/types/bookChapterMemo";
import { nowInstant, type Temporal } from "../../../util/temporal/instant";
import db from "../db";
import { bookChapterMemosTable } from "../schema";

function mapChapterMemoRow(
    row: typeof bookChapterMemosTable.$inferSelect,
): BookChapterMemo {
    return {
        chapterMemoId: row.chapter_memo_id,
        userBookId: row.user_book_id,
        chapterTitle: row.chapter_title ?? undefined,
        chapterOrder: row.chapter_order,
        memo: row.memo ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

class DrizzleBookChapterMemoRepository implements BookChapterMemoRepository {
    async createChapterMemo(
        input: CreateBookChapterMemoInput,
    ): Promise<BookChapterMemo> {
        const [createdMemo] = await db
            .insert(bookChapterMemosTable)
            .values({
                user_book_id: input.userBookId,
                chapter_title: input.chapterTitle ?? null,
                chapter_order: input.chapterOrder,
                memo: input.memo ?? null,
            })
            .returning();

        if (!createdMemo) {
            throw new Error("Failed to create chapter memo.");
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
            throw new Error("Chapter memo not found.");
        }

        return mapChapterMemoRow(updatedMemo);
    }
}

export { DrizzleBookChapterMemoRepository };
