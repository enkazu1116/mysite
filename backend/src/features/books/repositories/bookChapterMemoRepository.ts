import type {
    CreateBookChapterMemoInput,
    UpdateBookChapterMemoInput,
} from "../commands/chapterMemoCommands";
import type { BookChapterMemo } from "../types/bookChapterMemo";

/**
 * 本の章ごとのメモを管理するインターフェース
 */
interface BookChapterMemoRepository {
    createChapterMemo(input: CreateBookChapterMemoInput): Promise<BookChapterMemo>;
    listChapterMemos(userBookId: string): Promise<BookChapterMemo[]>;
    updateChapterMemo(input: UpdateBookChapterMemoInput): Promise<BookChapterMemo>;
}

export type { BookChapterMemoRepository };
