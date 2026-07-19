import { z } from "zod";
import type { BookSearchResult } from "../types/bookSearchResult";
import type {
    CreateUserBookInput,
    ListUserBooksInput,
    UpdateUserBookInput,
} from "../types/bookInput";
import { readingStatuses } from "../types/readingStatus";
import { nullableInstantSchema } from "../../../util/temporal/instantSchema";
import { bookValidationMessages } from "./messages";

const readingStatusSchema = z.enum(readingStatuses, {
    error: () => bookValidationMessages.statusInvalid,
});

const nullableStringSchema = z.union([z.string(), z.null()]);
const nullableDateSchema = nullableInstantSchema;

const bookSearchResultSchema = z.object({
    source: z.literal("google_books", {
        error: () => bookValidationMessages.sourceUnsupported,
    }),
    sourceBookId: z
        .string()
        .trim()
        .min(1, bookValidationMessages.sourceBookIdRequired),
    title: z.string().trim().min(1, bookValidationMessages.titleRequired),
    authors: z.array(z.string(), {
        error: () => bookValidationMessages.authorsInvalid,
    }),
    publisher: nullableStringSchema,
    publishedDate: nullableStringSchema,
    description: nullableStringSchema,
    pageCount: z
        .union([
            z.number().int().min(0, bookValidationMessages.pageCountInvalid),
            z.null(),
        ]),
    thumbnailUrl: nullableStringSchema,
    infoLink: nullableStringSchema,
}) satisfies z.ZodType<BookSearchResult>;

const createUserBookSchema = z.object({
    userId: z.uuid({
        error: () => bookValidationMessages.userIdInvalid,
    }),
    book: bookSearchResultSchema,
    status: readingStatusSchema,
}) satisfies z.ZodType<CreateUserBookInput>;

const listUserBooksSchema = z.object({
    userId: z.uuid({
        error: () => bookValidationMessages.userIdInvalid,
    }),
    status: readingStatusSchema.optional(),
}) satisfies z.ZodType<ListUserBooksInput>;

const updateUserBookSchema = z.object({
    userBookId: z.uuid({
        error: () => bookValidationMessages.userBookIdInvalid,
    }),
    status: readingStatusSchema.optional(),
    currentPage: z
        .union([
            z.number().int().min(0, bookValidationMessages.currentPageInvalid),
            z.null(),
        ])
        .optional(),
    note: nullableStringSchema.optional(),
    startedAt: nullableDateSchema.optional(),
    finishedAt: nullableDateSchema.optional(),
}) satisfies z.ZodType<UpdateUserBookInput>;

function validateSearchBooksQuery(query: string): string[] {
    if (query.trim().length === 0) {
        return [bookValidationMessages.queryRequired];
    }

    return [];
}

function validateCreateUserBookInput(input: CreateUserBookInput): string[] {
    const result = createUserBookSchema.safeParse(input);
    if (result.success) {
        return [];
    }

    return result.error.issues.map((issue) => issue.message);
}

function validateListUserBooksInput(input: ListUserBooksInput): string[] {
    const result = listUserBooksSchema.safeParse(input);
    if (result.success) {
        return [];
    }

    return result.error.issues.map((issue) => issue.message);
}

function validateUpdateUserBookInput(input: UpdateUserBookInput): string[] {
    const result = updateUserBookSchema.safeParse(input);
    if (result.success) {
        return [];
    }

    return result.error.issues.map((issue) => issue.message);
}

export {
    bookSearchResultSchema,
    createUserBookSchema,
    listUserBooksSchema,
    updateUserBookSchema,
    validateCreateUserBookInput,
    validateListUserBooksInput,
    validateSearchBooksQuery,
    validateUpdateUserBookInput,
};
