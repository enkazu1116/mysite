import type { CreateBookOutputInput } from "../../../../features/books/commands/bookOutputCommands";
import type { BookOutput } from "../../../../features/books/types/bookOutput";
import { bookOutputsTable } from "../../schema";

export type BookOutputTableRow = typeof bookOutputsTable.$inferSelect;

function mapOutputRow(row: BookOutputTableRow): BookOutput {
    return {
        bookOutputId: row.book_output_id,
        userBookId: row.user_book_id,
        chapterTitle: row.chapter_title ?? undefined,
        chapterOrder: row.chapter_order,
        title: row.title,
        body: row.body,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function toBookOutputInsertValues(input: CreateBookOutputInput) {
    return {
        user_book_id: input.userBookId,
        chapter_title: input.chapterTitle ?? null,
        chapter_order: input.chapterOrder,
        title: input.title,
        body: input.body,
    };
}

export { mapOutputRow, toBookOutputInsertValues };
