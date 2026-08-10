import { Hono } from "hono";
import { GoogleBooksProvider } from "../../../infrastructure/books/providers/googleBooksProvider";
import { DrizzleUserBookRepository } from "../../../infrastructure/drizzle/repositories/drizzleUserBookRepository";
import { UserBookUseCase } from "../usecase/userBookUseCase";

const userBookUseCase = new UserBookUseCase(
    new DrizzleUserBookRepository(),
    new GoogleBooksProvider(),
);

const booksSearchRouter = new Hono().get("/search", async (c) => {
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
});

export { booksSearchRouter };
