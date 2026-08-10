import type {
    CreateBookChapterMemoInput,
    UpdateBookChapterMemoInput,
} from "../../commands/chapterMemoCommands";
import {
    createBookChapterMemoSchema,
    updateBookChapterMemoSchema,
} from "../schemas/chapterMemoSchemas";
import { toErrorMessages } from "../utils/toErrorMessages";

/**
 * 章メモの作成入力を検証する。
 */
function validateCreateBookChapterMemoInput(
    input: CreateBookChapterMemoInput,
): string[] {
    return toErrorMessages(createBookChapterMemoSchema.safeParse(input));
}

/**
 * 章メモの更新入力を検証する。
 */
function validateUpdateBookChapterMemoInput(
    input: UpdateBookChapterMemoInput,
): string[] {
    return toErrorMessages(updateBookChapterMemoSchema.safeParse(input));
}

export {
    validateCreateBookChapterMemoInput,
    validateUpdateBookChapterMemoInput,
};
