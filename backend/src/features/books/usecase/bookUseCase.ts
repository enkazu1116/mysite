import type { BookRepository } from "../repositories/bookRepository";
import type { BookSearchResult } from "../types/bookSearchResult";
import type {
    CreateUserBookInput,
    ListUserBooksInput,
    UpdateUserBookInput,
} from "../types/bookInput";
import type { UserBook } from "../types/userBook";
import {
    validateCreateUserBookInput,
    validateListUserBooksInput,
    validateSearchBooksQuery,
    validateUpdateUserBookInput,
} from "../validation/bookValidation";

class BookUseCase {
    constructor(private readonly bookRepository: BookRepository) {}

    async searchBooks(query: string): Promise<BookSearchResult[]> {
        const errors = validateSearchBooksQuery(query);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.bookRepository.searchBooks(query.trim());
    }

    async createUserBook(input: CreateUserBookInput): Promise<UserBook> {
        const errors = validateCreateUserBookInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.bookRepository.saveUserBook(input);
    }

    async getUserBooks(input: ListUserBooksInput): Promise<UserBook[]> {
        const errors = validateListUserBooksInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.bookRepository.listUserBooks(input);
    }

    async getUserBookById(userBookId: string): Promise<UserBook | null> {
        return this.bookRepository.findUserBookById(userBookId);
    }

    async updateUserBook(input: UpdateUserBookInput): Promise<UserBook> {
        const errors = validateUpdateUserBookInput(input);
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return this.bookRepository.updateUserBook(input);
    }
}

export { BookUseCase };
