import { z } from "zod";
import type { UUID } from "../../../util/uuid/uuidBrandedType";
import { instantSchema } from "../../../util/temporal/instantSchema";
import type { CreateUserInput, UpdateUserInput } from "../types/userInput";
import type { UserRecord } from "../types/usersModel";

const userSchema = z.object({
    id: z.uuid().transform((id): UUID => id as UUID),
    name: z.string(),
    bio: z.string().nullable(),
    iconUrl: z.string().nullable(),
    createdAt: instantSchema,
    updatedAt: instantSchema,
}) satisfies z.ZodType<UserRecord>;

const createUserSchema = z.object({
    name: z.string().trim().min(1, "name is required").max(30),
    bio: z.string().trim().max(200).nullable().optional(),
    iconUrl: z.string().trim().nullable().optional(),
}) satisfies z.ZodType<CreateUserInput>;

const updateUserSchema = z
    .object({
        name: z.string().trim().min(1).max(30).optional(),
        bio: z.string().trim().max(200).nullable().optional(),
        iconUrl: z.string().trim().nullable().optional(),
    })
    .refine(
        (data) =>
            data.name !== undefined ||
            data.bio !== undefined ||
            data.iconUrl !== undefined,
        { message: "at least one field is required" },
    ) satisfies z.ZodType<UpdateUserInput>;

function validateCreateUserInput(input: CreateUserInput): string[] {
    const result = createUserSchema.safeParse(input);

    if (result.success) {
        return [];
    }

    return result.error.issues.map((issue) => issue.message);
}

function validateUpdateUserInput(input: UpdateUserInput): string[] {
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
