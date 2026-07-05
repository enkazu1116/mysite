import { z } from "zod";
import type { UUID } from "../../../util/uuid/uuidBrandedType";
import type { CreateUserInput, UpdateUserInput } from "../types/userInput";
import type { UserRecord } from "../types/usersModel";

const userSchema = z.object({
    id: z.uuid().transform((id): UUID => id as UUID),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
}) satisfies z.ZodType<UserRecord>;

const createUserSchema = z.object({
    name: z.string().trim().min(1, "name is required"),
}) satisfies z.ZodType<CreateUserInput>;

const updateUserSchema = z
    .object({
        name: z.string().trim().min(1, "name must be a non-empty string").optional(),
    })
    .refine((data) => data.name !== undefined, {
        message: "at least one field is required",
    }) satisfies z.ZodType<UpdateUserInput>;

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
