import { z } from "zod";
import type {
    CreateBookOutputInput,
    UpdateBookOutputInput,
} from "../../commands/bookOutputCommands";
import { bookOutputValidationMessages } from "../messages/bookOutputMessages";

/**
 * アウトプット作成用のスキーマ定義
 */
const createBookOutputSchema = z.object({
    userBookId: z.uuid({
        error: () => bookOutputValidationMessages.userBookIdInvalid,
    }),
    title: z
        .string()
        .trim()
        .min(1, bookOutputValidationMessages.outputTitleRequired),
    body: z
        .string()
        .trim()
        .min(1, bookOutputValidationMessages.outputBodyRequired),
}) satisfies z.ZodType<CreateBookOutputInput>;

/**
 * アウトプット更新用のスキーマ定義
 */
const updateBookOutputSchema = z.object({
    bookOutputId: z.uuid({
        error: () => bookOutputValidationMessages.bookOutputIdInvalid,
    }),
    title: z
        .string()
        .trim()
        .min(1, bookOutputValidationMessages.outputTitleRequired)
        .optional(),
    body: z
        .string()
        .trim()
        .min(1, bookOutputValidationMessages.outputBodyRequired)
        .optional(),
}) satisfies z.ZodType<UpdateBookOutputInput>;

export { createBookOutputSchema, updateBookOutputSchema };
