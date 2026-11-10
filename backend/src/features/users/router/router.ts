import { Hono } from "hono";
import type { AppBindings } from "../../../app";
import { createDb } from "../../../infrastructure/drizzle/db";
import { DrizzleUsersRepository } from "../drizzle/drizzleUsersRepository";
import { userPersistenceMessages } from "../../../util/messages/persistence/users";
import { UserUseCase } from "../usecase/userUseCase";
import { HTTPException } from "hono/http-exception";
import { asHttpException } from "../../../middleware/httpError";

const userRoutes = new Hono<{
    Bindings: AppBindings;
    Variables: { useCase: UserUseCase };
}>().use("*", async (c, next) => {
    c.set(
        "useCase",
        new UserUseCase(
            new DrizzleUsersRepository(createDb(c.env.DB)),
        ),
    );
    await next();
})
    .get("/", async (c) => {
        // すべてのユーザーを検索
        const users = await c.get("useCase").listUsers();
        return c.json({ users });
    })
    .post("/", async (c) => {
        try {
            // リクエストボディを取得し、createUser の第1引数の型として扱う
            const body = (await c.req.json()) as Parameters<
                UserUseCase["createUser"]
            >[0];

            // 新しいユーザーを作成し、201: Createdを返す
            const user = await c.get("useCase").createUser(body);
            return c.json({ user }, 201);
        } catch (error) {

            // 失敗時はエラーメッセージとエラーコード400: Bad Requestを返す
            throw asHttpException(error, 400, "ユーザーの作成に失敗しました。");
        }
    })
    .get("/:userId", async (c) => {
        // ID検索
        const user = await c.get("useCase").findUserById(c.req.param("userId"));

        if (!user) {
            // 存在しないIDの場合は404: Not Foundを返す
            throw new HTTPException(404, { message: userPersistenceMessages.notFound });
        }

        return c.json({ user });
    })
    .patch("/:userId", async (c) => {
        try {
            // リクエストボディを取得し、updateUser の第2引数の型として扱う
            const body = (await c.req.json()) as Parameters<
                UserUseCase["updateUser"]
            >[1];

            // ユーザーを更新し、200: OKを返す
            const user = await c.get("useCase").updateUser(
                c.req.param("userId"),
                body,
            );

            if (!user) {
                // 存在しないIDの場合は404: Not Foundを返す
                throw new HTTPException(404, { message: userPersistenceMessages.notFound });
            }

            return c.json({ user });
        } catch (error) {

            // 失敗時はエラーメッセージとエラーコード400: Bad Requestを返す
            throw asHttpException(error, 400, "ユーザーの更新に失敗しました。");
        }
    })
    .delete("/:userId", async (c) => {
        // ID指定でユーザーを削除
        const user = await c.get("useCase").deleteUser(c.req.param("userId"));

        if (!user) {
            // 存在しないIDの場合は404: Not Foundを返す
            throw new HTTPException(404, { message: userPersistenceMessages.notFound });
        }

        return c.json({ user });
    });

export { userRoutes };
