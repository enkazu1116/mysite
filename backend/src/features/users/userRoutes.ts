import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { runUserCrudCheck } from "./userCrudCheck";
import {
    createUser,
    deleteUser,
    findUserById,
    listUsers,
    updateUser,
} from "./repositories/usersRepository";
import {
    createUserSchema,
    updateUserSchema,
    userIdParamSchema,
    userValidationHook,
} from "./validation/userValidation";

export const userRoutes = new Hono()
    .get("/", async (c) => {
        const users = await listUsers();
        return c.json({ users });
    })
    .post(
        "/",
        zValidator("json", createUserSchema, userValidationHook),
        async (c) => {
            const input = c.req.valid("json");
            const user = await createUser(input);

            return c.json({ user }, 201);
        },
    )
    .post("/crud-check", async (c) => {
        const result = await runUserCrudCheck();
        return c.json({
            message: "CRUD check completed",
            result,
        });
    })
    .get(
        "/:userId",
        zValidator("param", userIdParamSchema, userValidationHook),
        async (c) => {
            const { userId } = c.req.valid("param");
            const user = await findUserById(userId);

            if (!user) {
                return c.json({ message: "user not found" }, 404);
            }

            return c.json({ user });
        },
    )
    .patch(
        "/:userId",
        zValidator("param", userIdParamSchema, userValidationHook),
        zValidator("json", updateUserSchema, userValidationHook),
        async (c) => {
            const { userId } = c.req.valid("param");
            const input = c.req.valid("json");
            const user = await updateUser(userId, input);

            if (!user) {
                return c.json({ message: "user not found" }, 404);
            }

            return c.json({ user });
        },
    )
    .delete(
        "/:userId",
        zValidator("param", userIdParamSchema, userValidationHook),
        async (c) => {
            const { userId } = c.req.valid("param");
            const user = await deleteUser(userId);

            if (!user) {
                return c.json({ message: "user not found" }, 404);
            }

            return c.json({ user });
        },
    );
