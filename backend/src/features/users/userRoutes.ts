import { Hono } from "hono";
import { DrizzleUsersRepository } from "../../infrastructure/drizzle/repositories/drizzleUsersRepository";
import { UserUseCase } from "./usecase/userUseCase";
import type { CreateUserInput, UpdateUserInput } from "./types/userInput";

const userUseCase = new UserUseCase(new DrizzleUsersRepository());

export const userRoutes = new Hono()
    .get("/", async (c) => {
        const users = await userUseCase.listUsers();
        return c.json({ users });
    })
    .post("/", async (c) => {
        try {
            const body = (await c.req.json()) as CreateUserInput;
            const user = await userUseCase.createUser(body);
            return c.json({ user }, 201);
        } catch (error) {
            return c.json(
                { message: error instanceof Error ? error.message : "Failed to create user." },
                400,
            );
        }
    })
    .get("/:userId", async (c) => {
        const user = await userUseCase.findUserById(c.req.param("userId"));

        if (!user) {
            return c.json({ message: "user not found" }, 404);
        }

        return c.json({ user });
    })
    .patch("/:userId", async (c) => {
        try {
            const body = (await c.req.json()) as UpdateUserInput;
            const user = await userUseCase.updateUser(c.req.param("userId"), body);

            if (!user) {
                return c.json({ message: "user not found" }, 404);
            }

            return c.json({ user });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to update user.";
            return c.json({ message }, 400);
        }
    })
    .delete("/:userId", async (c) => {
        const user = await userUseCase.deleteUser(c.req.param("userId"));

        if (!user) {
            return c.json({ message: "user not found" }, 404);
        }

        return c.json({ user });
    });
