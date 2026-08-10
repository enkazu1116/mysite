import { Hono } from "hono";
import { GoogleBooksProvider } from "../../../infrastructure/books/providers/googleBooksProvider";
import { DrizzleUserBookRepository } from "../../../infrastructure/drizzle/repositories/drizzleUserBookRepository";
import { readingStatuses, type ReadingStatus } from "../types/readingStatus";
import { UserBookUseCase } from "../usecase/userBookUseCase";

const userBookUseCase = new UserBookUseCase(
    new DrizzleUserBookRepository(),
    new GoogleBooksProvider(),
);

const userBooksRouter = new Hono()
    .get("/", async (c) => {
        try {
            // クエリから userId / status を取得して一覧検索
            const userId = c.req.query("userId") ?? "";
            const status = c.req.query("status");

            const userBooks = await userBookUseCase.getUserBooks({
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
    .post("/", async (c) => {
        try {
            // リクエストボディを取得し、createUserBook の第1引数の型として扱う
            const body = (await c.req.json()) as Parameters<
                typeof userBookUseCase.createUserBook
            >[0];

            // ユーザー本を登録し、201: Created を返す
            const userBook = await userBookUseCase.createUserBook(body);
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
    })
    .get("/:userBookId", async (c) => {
        // ID 検索
        const userBook = await userBookUseCase.getUserBookById(
            c.req.param("userBookId"),
        );

        if (!userBook) {
            // 存在しない ID の場合は 404: Not Found を返す
            return c.json({ message: "ユーザー本が見つかりませんでした。" }, 404);
        }

        return c.json({ userBook });
    })
    .patch("/:userBookId", async (c) => {
        try {
            // リクエストボディを取得し、updateUserBook の入力型として扱う
            const body = (await c.req.json()) as Omit<
                Parameters<typeof userBookUseCase.updateUserBook>[0],
                "userBookId"
            >;

            // ユーザー本を更新し、200: OK を返す
            const userBook = await userBookUseCase.updateUserBook({
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
            const statusCode = message === "本が見つかりません。" ? 404 : 400;
            return c.json({ message }, statusCode);
        }
    });

export { userBooksRouter };
