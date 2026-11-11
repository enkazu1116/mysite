import { Hono } from "hono";
import type { AppBindings } from "../../../app";
import { createDb } from "../../../infrastructure/drizzle/db";
import { GoogleBooksProvider } from "../../../infrastructure/books/providers/googleBooksProvider";
import { DrizzleUserBookRepository } from "../drizzle/drizzleUserBookRepository";
import { UserBookUseCase } from "../usecase/userBookUseCase";
import { HTTPException } from "hono/http-exception";
import { asHttpException } from "../../../middleware/httpError";

const booksSearchRouter = new Hono<{ Bindings: AppBindings }>().get(
    "/search",
    async (c) => {
    const apiKey = c.env?.BOOKS_API?.trim();
    if (!apiKey) {
        throw new HTTPException(500, { message: "BOOKS_API が未設定です。" });
    }

    const userBookUseCase = new UserBookUseCase(
        new DrizzleUserBookRepository(createDb(c.env.DB)),
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
        throw asHttpException(error, 400, "本の検索に失敗しました。");
    }
},
);

export { booksSearchRouter };
