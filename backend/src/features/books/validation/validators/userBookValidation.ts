import type {
    CreateUserBookInput,
    ListUserBooksInput,
    UpdateUserBookInput,
} from "../../commands/userBookCommands";
import { userBookValidationMessages } from "../messages/userBookMessages";
import {
    createUserBookSchema,
    listUserBooksSchema,
    updateUserBookSchema,
} from "../schemas/userBookSchemas";
import { toErrorMessages } from "../utils/toErrorMessages";

type ParseResult<T> = {
    errors: string[];
    data?: T;
};

/**
 * 検索クエリが空の場合はエラーメッセージを返す
 */
function validateSearchBooksQuery(query: string): string[] {
    if (query.trim().length === 0) {
        return [userBookValidationMessages.queryRequired];
    }

    return [];
}

/**
 * ユーザー本登録入力を検証し、任意項目のフォールバック後データを返す。
 */
function validateCreateUserBookInput(
    input: CreateUserBookInput,
): ParseResult<CreateUserBookInput> {
    const result = createUserBookSchema.safeParse(input);
    if (!result.success) {
        return { errors: toErrorMessages(result) };
    }

    return { errors: [], data: result.data };
}

/**
 * ユーザーが読む本の一覧取得入力を検証する。
 */
function validateListUserBooksInput(input: ListUserBooksInput): string[] {
    return toErrorMessages(listUserBooksSchema.safeParse(input));
}

/**
 * ユーザーが読む本の更新入力を検証する。
 */
function validateUpdateUserBookInput(input: UpdateUserBookInput): string[] {
    return toErrorMessages(updateUserBookSchema.safeParse(input));
}

export {
    validateCreateUserBookInput,
    validateListUserBooksInput,
    validateSearchBooksQuery,
    validateUpdateUserBookInput,
};
