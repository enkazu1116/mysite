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
import { z } from "zod";

type ParseResult<T> = {
    errors: string[];
    data?: T;
};

/**
 * 検索クエリが空の場合はエラーメッセージを返す
 */
function validateSearchBooksQuery(query: string): string[] {
    const normalized = query.trim();
    const containsControlCharacter = [...normalized].some((char) => {
        const code = char.charCodeAt(0);
        return code < 0x20 || code === 0x7f;
    });
    if (normalized.length === 0 || normalized.length > 200 || containsControlCharacter) {
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

function validateUserBookId(userBookId: string): string[] {
    return toErrorMessages(
        z.uuid({ error: () => userBookValidationMessages.userBookIdInvalid }).safeParse(userBookId),
    );
}

export {
    validateCreateUserBookInput,
    validateListUserBooksInput,
    validateSearchBooksQuery,
    validateUpdateUserBookInput,
    validateUserBookId,
};
