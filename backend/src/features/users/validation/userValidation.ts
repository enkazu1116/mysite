import { z } from "zod";
import type { UUID } from "../../../util/uuid/uuidBrandedType";
import { instantSchema } from "../../../util/temporal/instantSchema";
import type { CreateUserRequest, UpdateUserRequest } from "../types/userInput";
import type { UserRow } from "../types/usersModel";

const userSchema = z.object({
    id: z.uuid().transform((id): UUID => id as UUID),
    name: z.string(),
    bio: z.string().nullable(),
    iconUrl: z.string().nullable(),
    githubUrl: z.string().nullable(),
    articleUrl: z.string().nullable(),
    createdAt: instantSchema,
    updatedAt: instantSchema,
}) satisfies z.ZodType<UserRow>;

const createUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "名前は必須です。")
        .max(30, "名前は30文字以内で入力してください。"),
    bio: z
        .string()
        .trim()
        .max(200, "自己紹介文は200文字以内で入力してください。")
        .nullable()
        .optional(),
    iconUrl: z.string().trim().nullable().optional(),
    githubUrl: z.string().trim().nullable().optional(),
    articleUrl: z.string().trim().nullable().optional(),
}) satisfies z.ZodType<CreateUserRequest>;

const updateUserSchema = z.object({
        name: z
            .string()
            .trim()
            .min(1, "名前は必須です。")
            .max(30, "名前は30文字以内で入力してください。")
            .optional(),
        bio: z
            .string()
            .trim()
            .max(200, "自己紹介文は200文字以内で入力してください。")
            .nullable()
            .optional(),
        iconUrl: z.string().trim().nullable().optional(),
        githubUrl: z.string().trim().nullable().optional(),
        articleUrl: z.string().trim().nullable().optional(),
    })
    .refine(
        (data) =>
            data.name !== undefined ||
            data.bio !== undefined ||
            data.iconUrl !== undefined ||
            data.githubUrl !== undefined ||
            data.articleUrl !== undefined,
        { message: "更新する対象情報がありません。" },
    ) satisfies z.ZodType<UpdateUserRequest>;

/**
 * User作成時の入力バリデーション
 * 
 * @param input: CreateUserRequest
 * @returns 成功時: 空配列、失敗時: エラーメッセージの配列s
 */
function validateCreateUserInput(input: CreateUserRequest): string[] {

    const result = createUserSchema.safeParse(input);
    if (result.success) {
        return [];
    }

    return result.error.issues.map((issue) => issue.message);
}

/** 
 * User更新時の入力バリデーション
 * 
 * @param input: UpdateUserRequest
 * @returns 成功時: 空配列、失敗時: エラーメッセージの配列
 */
function validateUpdateUserInput(input: UpdateUserRequest): string[] {
    
    const result = updateUserSchema.safeParse(input);
    if (result.success) {
        return [];
    }

    return result.error.issues.map((issue) => issue.message);
}

export {
    createUserSchema,
    updateUserSchema,
    userSchema,
    validateCreateUserInput,
    validateUpdateUserInput,
};
