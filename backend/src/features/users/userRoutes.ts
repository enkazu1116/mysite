import { Hono } from "hono";
import {
    createUser,
    deleteUser,
    findUserById,
    listUsers,
    updateUser,
} from "./userRepository";
import { runUserCrudCheck } from "./userCrudCheck";
import {
    parseCreateUserInput,
    parseUpdateUserInput,
} from "./userRequest";

export const userRoutes = new Hono()
    .get("/", async (c) => {
        const users = await listUsers();
        return c.json({ users });
    })
    .post("/", async (c) => {
        const result = await parseCreateUserInput(c.req.raw);

        if (!result.ok) {
            return c.json({ message: result.message }, 400);
        }

        const user = await createUser(result.data);

        return c.json({ user }, 201);
    })
    .post("/crud-check", async (c) => {
        const result = await runUserCrudCheck();
        return c.json({
            message: "CRUD check completed",
            result,
        });
    })
    .get("/:userId", async (c) => {
        const user = await findUserById(c.req.param("userId"));

        if (!user) {
            return c.json({ message: "user not found" }, 404);
        }

        return c.json({ user });
    })
    .patch("/:userId", async (c) => {
        const result = await parseUpdateUserInput(c.req.raw);

        if (!result.ok) {
            return c.json({ message: result.message }, 400);
        }

        const user = await updateUser(c.req.param("userId"), result.data);

        if (!user) {
            return c.json({ message: "user not found" }, 404);
        }

        return c.json({ user });
    })
    .delete("/:userId", async (c) => {
        const user = await deleteUser(c.req.param("userId"));

        if (!user) {
            return c.json({ message: "user not found" }, 404);
        }

        return c.json({ user });
    });
