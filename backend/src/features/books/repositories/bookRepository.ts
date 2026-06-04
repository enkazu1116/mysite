import type { BookSearchResult } from "../types/bookSearchResult";
import type {
    CreateUserBookInput,
    ListUserBooksInput,
    UpdateUserBookInput,
} from "../types/bookInput";
import type { UserBook } from "../types/userBook";

interface BookRepository {
    searchBooks(query: string): Promise<BookSearchResult[]>;
    saveUserBook(input: CreateUserBookInput): Promise<UserBook>;
    listUserBooks(input: ListUserBooksInput): Promise<UserBook[]>;
    findUserBookById(userBookId: string): Promise<UserBook | null>;
    updateUserBook(input: UpdateUserBookInput): Promise<UserBook>;
}

export type { BookRepository };
