import type { CreateBookChapterMemoInput } from "../../../../features/books/commands/chapterMemoCommands";
import type { BookChapterMemo } from "../../../../features/books/types/bookChapterMemo";
import { bookChapterMemosTable } from "../../schema";

export type ChapterMemoTableRow = typeof bookChapterMemosTable.$inferSelect;

function mapChapterMemoRow(row: ChapterMemoTableRow): BookChapterMemo {
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

function toChapterMemoInsertValues(input: CreateBookChapterMemoInput) {
    return {
        user_book_id: input.userBookId,
        chapter_title: input.chapterTitle ?? null,
        chapter_order: input.chapterOrder,
        memo: input.memo ?? null,
    };
}

export { mapChapterMemoRow, toChapterMemoInsertValues };
