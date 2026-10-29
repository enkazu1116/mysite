import { Hono } from "hono";
import { createDbFromEnv, type AppBindings } from "../../../infrastructure/drizzle/db";
import { DrizzleUserBookRepository } from "../drizzle/drizzleUserBookRepository";
import { readingStatuses, type ReadingStatus } from "../types/readingStatus";
import { userBookPersistenceMessages } from "../../../util/messages/persistence/books/userBook";
import { UserBookUseCase } from "../usecase/userBookUseCase";
import { validator } from "hono/validator";
import type { CreateUserBookInput, UpdateUserBookInput } from "../commands/userBookCommands";

const userBooksRouter = new Hono<{
    Bindings: AppBindings;
    Variables: { useCase: UserBookUseCase };
}>().use("*", async (c, next) => {
    c.set(
        "useCase",
        new UserBookUseCase(
            new DrizzleUserBookRepository(createDbFromEnv(c.env)),
            // 検索は booksSearchRouter 側。更新系はカタログだけを使う。
            { searchBooks: async () => [] },
        ),
    );
    await next();
})
    .get("/", async (c) => {
        try {
            // クエリから userId / status を取得して一覧検索
            const userId = c.req.query("userId") ?? "";
            const status = c.req.query("status");

            const userBooks = await c.get("useCase").getUserBooks({
                userId,
                status:
                    status && readingStatuses.includes(status as ReadingStatus)
                        ? (status as ReadingStatus)
                        : undefined,
            });

            return c.json({ userBooks });
        } catch (error) {
            // 失敗時はエラーメッセージと 400: Bad Request を返す
            return c.json(
                {
                    message:
                        error instanceof Error
                            ? error.message
                            : "ユーザー本の一覧取得に失敗しました。",
                },
                400,
            );
        }
    })
    .post(
        "/",
        validator("json", (value) => value as CreateUserBookInput),
        async (c) => {
        try {
            // リクエストボディを取得し、createUserBook の第1引数の型として扱う
            const body = c.req.valid("json");

            // ユーザー本を登録し、201: Created を返す
            const userBook = await c.get("useCase").createUserBook(body);
            return c.json({ userBook }, 201);
        } catch (error) {
            // 失敗時はエラーメッセージと 400: Bad Request を返す
            return c.json(
                {
                    message:
                        error instanceof Error
                            ? error.message
                            : "ユーザー本の登録に失敗しました。",
                },
                400,
            );
        }
        },
    )
    .get("/:userBookId", async (c) => {
        try {
            const userBook = await c.get("useCase").getUserBookById(c.req.param("userBookId"));
            if (!userBook) {
                return c.json({ message: userBookPersistenceMessages.userBookNotFound }, 404);
            }
            return c.json({ userBook });
        } catch (error) {
            return c.json({ message: error instanceof Error ? error.message : "ユーザー本の取得に失敗しました。" }, 400);
        }
    })
    .patch(
        "/:userBookId",
        validator(
            "json",
            (value) => value as Omit<UpdateUserBookInput, "userBookId">,
        ),
        async (c) => {
        try {
            // リクエストボディを取得し、updateUserBook の入力型として扱う
            const body = c.req.valid("json");

            // ユーザー本を更新し、200: OK を返す
            const userBook = await c.get("useCase").updateUserBook({
                userBookId: c.req.param("userBookId"),
                ...body,
            });

            return c.json({ userBook });
        } catch (error) {
            // 失敗時はエラーメッセージと、存在しない場合は 404、それ以外は 400 を返す
            const message =
                error instanceof Error
                    ? error.message
                    : "ユーザー本の更新に失敗しました。";
            const statusCode =
                message === userBookPersistenceMessages.bookNotFound ||
                message === userBookPersistenceMessages.userBookNotFound
                    ? 404
                    : 400;
            return c.json({ message }, statusCode);
        }
        },
    )
    .delete("/:userBookId", async (c) => {
        try {
            const userBook = await c.get("useCase").deleteUserBook(
                c.req.param("userBookId"),
            );
            return c.json({ userBook });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "ユーザー本の削除に失敗しました。";
            const statusCode =
                message === userBookPersistenceMessages.userBookNotFound
                    ? 404
                    : 400;
            return c.json({ message }, statusCode);
        }
    });

export { userBooksRouter };
