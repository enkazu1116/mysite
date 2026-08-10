import type {
    CreateUserBookInput,
    ListUserBooksInput,
    UpdateUserBookInput,
} from "../commands/userBookCommands";
import type { UserBook } from "../types/userBook";

/**
 * ユーザーが選択した読む本の情報を管理するインターフェース
 */
interface UserBookRepository {
    saveUserBook(input: CreateUserBookInput): Promise<UserBook>;
    listUserBooks(input: ListUserBooksInput): Promise<UserBook[]>;
    findUserBookById(userBookId: string): Promise<UserBook | null>;
    updateUserBook(input: UpdateUserBookInput): Promise<UserBook>;
}

export type { UserBookRepository };
