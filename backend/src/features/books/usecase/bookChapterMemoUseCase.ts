import type {
    CreateBookChapterMemoInput,
    UpdateBookChapterMemoInput,
} from "../commands/chapterMemoCommands";
import type { BookChapterMemoRepository } from "../repositories/bookChapterMemoRepository";
import type { BookChapterMemo } from "../types/bookChapterMemo";
import {
    validateCreateBookChapterMemoInput,
    validateUpdateBookChapterMemoInput,
} from "../validation/validators/chapterMemoValidation";
import { validateUpdateUserBookInput } from "../validation/validators/userBookValidation";

class BookChapterMemoUseCase {
    /**
     * BookChapterMemoUseCase にリポジトリの依存を注入
     *
     * @param bookChapterMemoRepository
     */
    constructor(
        private readonly bookChapterMemoRepository: BookChapterMemoRepository,
    ) {}

    /**
     * 章メモを作成する
     *
     * @param input
     * @returns
     */
    async createChapterMemo(
        input: CreateBookChapterMemoInput,
    ): Promise<BookChapterMemo> {
        const errors = validateCreateBookChapterMemoInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.bookChapterMemoRepository.createChapterMemo(input);
    }

    /**
     * 章メモ一覧を取得する
     *
     * @param userBookId
     * @returns
     */
    async listChapterMemos(userBookId: string): Promise<BookChapterMemo[]> {
        const errors = validateUpdateUserBookInput({ userBookId });
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.bookChapterMemoRepository.listChapterMemos(userBookId);
    }

    /**
     * 章メモを更新する
     *
     * @param input
     * @returns
     */
    async updateChapterMemo(
        input: UpdateBookChapterMemoInput,
    ): Promise<BookChapterMemo> {
        const errors = validateUpdateBookChapterMemoInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.bookChapterMemoRepository.updateChapterMemo(input);
    }
}

export { BookChapterMemoUseCase };
