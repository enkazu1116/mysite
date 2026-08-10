import type { BookSearchAdapter, BookSearchResult } from "../adapters/bookSearchAdapter";
import type {
    CreateUserBookInput,
    ListUserBooksInput,
    UpdateUserBookInput,
} from "../commands/userBookCommands";
import type { UserBookRepository } from "../repositories/userBookRepository";
import type { UserBook } from "../types/userBook";
import {
    validateCreateUserBookInput,
    validateListUserBooksInput,
    validateSearchBooksQuery,
    validateUpdateUserBookInput,
} from "../validation/validators/userBookValidation";

class UserBookUseCase {
    /**
     * UserBookUseCase にリポジトリ・アダプタの依存を注入
     *
     * @param userBookRepository
     * @param bookSearchAdapter
     */
    constructor(
        private readonly userBookRepository: UserBookRepository,
        private readonly bookSearchAdapter: BookSearchAdapter,
    ) {}

    /**
     * 本を検索する
     *
     * @param query
     * @returns
     */
    async searchBooks(query: string): Promise<BookSearchResult[]> {
        const errors = validateSearchBooksQuery(query);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.bookSearchAdapter.searchBooks(query.trim());
    }

    /**
     * ユーザー本を登録する
     *
     * @param input
     * @returns
     */
    async createUserBook(input: CreateUserBookInput): Promise<UserBook> {
        const { errors, data } = validateCreateUserBookInput(input);
        if (errors.length > 0 || data === undefined) {
            throw new Error(errors.join("\n"));
        }

        return this.userBookRepository.saveUserBook(data);
    }

    /**
     * ユーザー本一覧を取得する
     *
     * @param input
     * @returns
     */
    async getUserBooks(input: ListUserBooksInput): Promise<UserBook[]> {
        const errors = validateListUserBooksInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.userBookRepository.listUserBooks(input);
    }

    /**
     * ID でユーザー本を取得する
     *
     * @param userBookId
     * @returns
     */
    async getUserBookById(userBookId: string): Promise<UserBook | null> {
        return this.userBookRepository.findUserBookById(userBookId);
    }

    /**
     * ユーザー本を更新する
     *
     * @param input
     * @returns
     */
    async updateUserBook(input: UpdateUserBookInput): Promise<UserBook> {
        const errors = validateUpdateUserBookInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.userBookRepository.updateUserBook(input);
    }
}

export { UserBookUseCase };
