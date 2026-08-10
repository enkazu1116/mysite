import type {
    CreateBookOutputInput,
    UpdateBookOutputInput,
} from "../commands/bookOutputCommands";
import type { BookOutputRepository } from "../repositories/bookOutputRepository";
import type { BookOutput } from "../types/bookOutput";
import {
    validateCreateBookOutputInput,
    validateUpdateBookOutputInput,
} from "../validation/validators/bookOutputValidation";
import { validateUpdateUserBookInput } from "../validation/validators/userBookValidation";

class BookOutputUseCase {
    /**
     * BookOutputUseCase にリポジトリの依存を注入
     *
     * @param bookOutputRepository
     */
    constructor(private readonly bookOutputRepository: BookOutputRepository) {}

    /**
     * アウトプットを作成する
     *
     * @param input
     * @returns
     */
    async createOutput(input: CreateBookOutputInput): Promise<BookOutput> {
        const errors = validateCreateBookOutputInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.bookOutputRepository.createOutput(input);
    }

    /**
     * アウトプット一覧を取得する
     *
     * @param userBookId
     * @returns
     */
    async listOutputs(userBookId: string): Promise<BookOutput[]> {
        const errors = validateUpdateUserBookInput({ userBookId });
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.bookOutputRepository.listOutputs(userBookId);
    }

    /**
     * アウトプットを更新する
     *
     * @param input
     * @returns
     */
    async updateOutput(input: UpdateBookOutputInput): Promise<BookOutput> {
        const errors = validateUpdateBookOutputInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.bookOutputRepository.updateOutput(input);
    }
}

export { BookOutputUseCase };
