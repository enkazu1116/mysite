import type {
    CreateBookOutputInput,
    UpdateBookOutputInput,
} from "../commands/bookOutputCommands";
import type { BookOutput } from "../types/bookOutput";

/**
 * 本のアウトプット内容を管理するインターフェース
 */
interface BookOutputRepository {
    createOutput(input: CreateBookOutputInput): Promise<BookOutput>;
    listOutputs(userBookId: string): Promise<BookOutput[]>;
    updateOutput(input: UpdateBookOutputInput): Promise<BookOutput>;
}

export type { BookOutputRepository };
