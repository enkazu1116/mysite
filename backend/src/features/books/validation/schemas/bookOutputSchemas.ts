import { z } from "zod";
import type {
    CreateBookOutputInput,
    UpdateBookOutputInput,
} from "../../commands/bookOutputCommands";
import { bookOutputValidationMessages } from "../messages/bookOutputMessages";

const optionalChapterTitleSchema = z
    .string()
    .trim()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined));

/**
 * アウトプット作成用のスキーマ定義
 */
const createBookOutputSchema = z.object({
    userBookId: z.uuid({
        error: () => bookOutputValidationMessages.userBookIdInvalid,
    }),
    chapterTitle: optionalChapterTitleSchema,
    chapterOrder: z
        .number()
        .int()
        .min(0, bookOutputValidationMessages.chapterOrderInvalid),
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
    chapterTitle: optionalChapterTitleSchema,
    chapterOrder: z
        .number()
        .int()
        .min(0, bookOutputValidationMessages.chapterOrderInvalid)
        .optional(),
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
