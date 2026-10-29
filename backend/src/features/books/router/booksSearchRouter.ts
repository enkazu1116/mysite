import { Hono } from "hono";
import { createDbFromEnv, type AppBindings } from "../../../infrastructure/drizzle/db";
import { GoogleBooksProvider } from "../../../infrastructure/books/providers/googleBooksProvider";
import { DrizzleUserBookRepository } from "../drizzle/drizzleUserBookRepository";
import { UserBookUseCase } from "../usecase/userBookUseCase";

const booksSearchRouter = new Hono<{ Bindings: AppBindings }>().get(
    "/search",
    async (c) => {
    const apiKey = c.env?.BOOKS_API?.trim();
    if (!apiKey) {
        return c.json(
            { message: "BOOKS_API が未設定です。" },
            500,
        );
    }

    const userBookUseCase = new UserBookUseCase(
        new DrizzleUserBookRepository(createDbFromEnv(c.env)),
        new GoogleBooksProvider(apiKey),
    );

    try {
        // 検索クエリを取得し、空なら空配列を返す
        const query = c.req.query("q") ?? "";
        const books =
            query.trim().length === 0
                ? []
                : await userBookUseCase.searchBooks(query);

        return c.json({ books });
    } catch (error) {
        // 失敗時はエラーメッセージと 400: Bad Request を返す
        return c.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "本の検索に失敗しました。",
            },
            400,
        );
    }
},
);

export { booksSearchRouter };
