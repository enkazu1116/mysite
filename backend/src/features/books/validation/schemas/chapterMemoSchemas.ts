import { z } from "zod";
import type {
    CreateBookChapterMemoInput,
    UpdateBookChapterMemoInput,
} from "../../commands/chapterMemoCommands";
import { chapterMemoValidationMessages } from "../messages/chapterMemoMessages";

/**
 * 章タイトルのデータ検証
 */
const optionalChapterTitleSchema = z
    .string({
        error: () => chapterMemoValidationMessages.chapterTitleInvalid,
    })
    .trim()
    .optional();

/**
 * 章メモのデータ検証
 */
const optionalChapterMemoSchema = z
    .string({
        error: () => chapterMemoValidationMessages.chapterMemoInvalid,
    })
    .trim()
    .optional();

/**
 * 章メモの作成用スキーマ定義
 */
const createBookChapterMemoSchema = z.object({
    userBookId: z.uuid({
        error: () => chapterMemoValidationMessages.userBookIdInvalid,
    }),
    chapterTitle: optionalChapterTitleSchema,
    chapterOrder: z
        .number()
        .int()
        .min(0, chapterMemoValidationMessages.chapterOrderInvalid),
    memo: optionalChapterMemoSchema,
}) satisfies z.ZodType<CreateBookChapterMemoInput>;

/**
 * 章メモの更新用スキーマ定義
 */
const updateBookChapterMemoSchema = z.object({
    chapterMemoId: z.uuid({
        error: () => chapterMemoValidationMessages.chapterMemoIdInvalid,
    }),
    chapterTitle: optionalChapterTitleSchema,
    chapterOrder: z
        .number()
        .int()
        .min(0, chapterMemoValidationMessages.chapterOrderInvalid)
        .optional(),
    memo: optionalChapterMemoSchema,
}) satisfies z.ZodType<UpdateBookChapterMemoInput>;

export { createBookChapterMemoSchema, updateBookChapterMemoSchema };
