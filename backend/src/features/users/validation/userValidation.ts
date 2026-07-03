import type { Context } from "hono";
import { z } from "zod";

import { userValidationMessages } from "./messages";

const MAX_USER_NAME_LENGTH = 100;

const profileSchema = z.union([z.string(), z.null()]);

const createUserSchema = z.object({
    user_name: z
        .string()
        .trim()
        .min(1, userValidationMessages.userNameRequired)
        .max(
            MAX_USER_NAME_LENGTH,
            userValidationMessages.userNameMax(MAX_USER_NAME_LENGTH),
        ),
    profile: profileSchema.optional(),
});

const updateUserSchema = z.object({
    user_name: z
        .string()
        .trim()
        .min(1, userValidationMessages.userNameRequired)
        .max(
            MAX_USER_NAME_LENGTH,
            userValidationMessages.userNameMax(MAX_USER_NAME_LENGTH),
        )
        .optional(),
    profile: profileSchema.optional(),
});

const userIdParamSchema = z.object({
    userId: z.uuid({
        error: () => userValidationMessages.userIdInvalid,
    }),
});

type CreateUserInput = z.infer<typeof createUserSchema>;
type UpdateUserInput = z.infer<typeof updateUserSchema>;

function formatValidationMessage(error: {
    issues: { message: string }[];
}): string {
    return error.issues.map((issue) => issue.message).join("\n");
}

function userValidationHook(
    result: {
        success: boolean;
        error?: { issues: { message: string }[] };
    },
    c: Context,
) {
    if (!result.success && result.error) {
        return c.json({ message: formatValidationMessage(result.error) }, 400);
    }
}

export {
    MAX_USER_NAME_LENGTH,
    createUserSchema,
    updateUserSchema,
    userIdParamSchema,
    userValidationHook,
};
export type { CreateUserInput, UpdateUserInput };
