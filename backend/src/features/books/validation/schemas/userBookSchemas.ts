import { z } from "zod";
import type { BookSearchResult } from "../../adapters/bookSearchAdapter";
import type {
    CreateUserBookInput,
    ListUserBooksInput,
    UpdateUserBookInput,
} from "../../commands/userBookCommands";
import { readingStatuses } from "../../types/readingStatus";
import { nullableInstantSchema } from "../../../../util/temporal/instantSchema";
import { userBookValidationMessages } from "../messages/userBookMessages";
import { optionalNullableStringSchema } from "../utils/optionalNullableStringSchema";

/**
 * 読書ステータスのデータ検証
 */
const readingStatusSchema = z.enum(readingStatuses, {
    error: () => userBookValidationMessages.statusInvalid,
});

/**
 * 本の検索結果のデータ検証
 */
const bookSearchResultSchema = z.object({
    // 検索元のプロバイダーが Google Books API であることを検証
    source: z.literal("google_books", {
        error: () => userBookValidationMessages.sourceUnsupported,
    }),

    // 検索結果のIDを検証
    sourceBookId: z
        .string()
        .trim()
        .min(1, userBookValidationMessages.sourceBookIdRequired),
    
    // 検索結果の必須項目の検証
    title: z.string().trim().min(1, userBookValidationMessages.titleRequired),
    
    // 任意項目の検証
    authors: z.array(z.string()).catch([]),
    publisher: optionalNullableStringSchema,
    publishedDate: optionalNullableStringSchema,
    description: optionalNullableStringSchema,
    pageCount: z.union([z.number().int().min(0), z.null()]).catch(null),
    thumbnailUrl: optionalNullableStringSchema,
    infoLink: optionalNullableStringSchema,
}) satisfies z.ZodType<BookSearchResult>;

/**
 * ユーザー本の登録用スキーマ定義
 */
const createUserBookSchema = z.object({
    userId: z.uuid({
        error: () => userBookValidationMessages.userIdInvalid,
    }),
    book: bookSearchResultSchema,
    status: readingStatusSchema,
}) satisfies z.ZodType<CreateUserBookInput>;

/**
 * ユーザー本の一覧取得用スキーマ定義
 */
const listUserBooksSchema = z.object({
    userId: z.uuid({
        error: () => userBookValidationMessages.userIdInvalid,
    }),
    status: readingStatusSchema.optional(),
}) satisfies z.ZodType<ListUserBooksInput>;

/**
 * ユーザー本の更新用スキーマ定義
 * ユーザーが明示的に送る項目は不正なら専用メッセージで失敗させる
 */
const updateUserBookSchema = z.object({
    userBookId: z.uuid({
        error: () => userBookValidationMessages.userBookIdInvalid,
    }),
    status: readingStatusSchema.optional(),
    currentPage: z.union([
            z.number().int().min(0, userBookValidationMessages.currentPageInvalid),
            z.null(),
        ], {
            error: () => userBookValidationMessages.currentPageInvalid,
        },
    ).optional(),
    note: z.union([z.string(), z.null()], {
            error: () => userBookValidationMessages.noteInvalid,
    }).optional(),
    startedAt: nullableInstantSchema.optional(),
    finishedAt: nullableInstantSchema.optional(),
}) satisfies z.ZodType<UpdateUserBookInput>;

export {
    bookSearchResultSchema,
    createUserBookSchema,
    listUserBooksSchema,
    readingStatusSchema,
    updateUserBookSchema,
};
