import { Hono } from "hono";
import { DrizzleBookOutputRepository } from "../../../infrastructure/drizzle/repositories/books/drizzleBookOutputRepository";
import { bookOutputPersistenceMessages } from "../../../util/messages/persistence/books/bookOutput";
import { BookOutputUseCase } from "../usecase/bookOutputUseCase";

const bookOutputUseCase = new BookOutputUseCase(new DrizzleBookOutputRepository());

const bookOutputRouter = new Hono()
    .get("/:userBookId/outputs", async (c) => {
        try {
            // ユーザー本 ID に紐づくアウトプット一覧を取得
            const outputs = await bookOutputUseCase.listOutputs(
                c.req.param("userBookId"),
            );

            return c.json({ outputs });
        } catch (error) {
            // 失敗時はエラーメッセージと 400: Bad Request を返す
            return c.json(
                {
                    message:
                        error instanceof Error
                            ? error.message
                            : "アウトプットの一覧取得に失敗しました。",
                },
                400,
            );
        }
    })
    .post("/:userBookId/outputs", async (c) => {
        try {
            // リクエストボディを取得し、createOutput の入力型として扱う
            const body = (await c.req.json()) as Omit<
                Parameters<typeof bookOutputUseCase.createOutput>[0],
                "userBookId"
            >;

            // アウトプットを作成し、201: Created を返す
            const output = await bookOutputUseCase.createOutput({
                userBookId: c.req.param("userBookId"),
                ...body,
            });

            return c.json({ output }, 201);
        } catch (error) {
            // 失敗時はエラーメッセージと 400: Bad Request を返す
            return c.json(
                {
                    message:
                        error instanceof Error
                            ? error.message
                            : "アウトプットの作成に失敗しました。",
                },
                400,
            );
        }
    })
    .patch("/outputs/:bookOutputId", async (c) => {
        try {
            // リクエストボディを取得し、updateOutput の入力型として扱う
            const body = (await c.req.json()) as Omit<
                Parameters<typeof bookOutputUseCase.updateOutput>[0],
                "bookOutputId"
            >;

            // アウトプットを更新し、200: OK を返す
            const output = await bookOutputUseCase.updateOutput({
                bookOutputId: c.req.param("bookOutputId"),
                ...body,
            });

            return c.json({ output });
        } catch (error) {
            // 失敗時はエラーメッセージと、存在しない場合は 404、それ以外は 400 を返す
            const message =
                error instanceof Error
                    ? error.message
                    : "アウトプットの更新に失敗しました。";
            const statusCode =
                message === bookOutputPersistenceMessages.notFound ? 404 : 400;
            return c.json({ message }, statusCode);
        }
    });

export { bookOutputRouter };
