import type {
    CreateBookOutputInput,
    UpdateBookOutputInput,
} from "../../commands/bookOutputCommands";
import {
    createBookOutputSchema,
    updateBookOutputSchema,
} from "../schemas/bookOutputSchemas";
import { toErrorMessages } from "../utils/toErrorMessages";

/**
 * アウトプットの作成入力を検証する。
 */
function validateCreateBookOutputInput(input: CreateBookOutputInput): string[] {
    return toErrorMessages(createBookOutputSchema.safeParse(input));
}

/**
 * アウトプットの更新入力を検証する。
 */
function validateUpdateBookOutputInput(input: UpdateBookOutputInput): string[] {
    return toErrorMessages(updateBookOutputSchema.safeParse(input));
}

export { validateCreateBookOutputInput, validateUpdateBookOutputInput };
