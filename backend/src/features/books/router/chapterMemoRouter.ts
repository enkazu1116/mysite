import { Hono } from "hono";
import { DrizzleBookChapterMemoRepository } from "../../../infrastructure/drizzle/repositories/books/drizzleBookChapterMemoRepository";
import { chapterMemoPersistenceMessages } from "../../../util/messages/persistence/books/chapterMemo";
import { BookChapterMemoUseCase } from "../usecase/bookChapterMemoUseCase";

const bookChapterMemoUseCase = new BookChapterMemoUseCase(
    new DrizzleBookChapterMemoRepository(),
);

const chapterMemoRouter = new Hono()
    .get("/:userBookId/chapter-memos", async (c) => {
        try {
            // ユーザー本 ID に紐づく章メモ一覧を取得
            const chapterMemos = await bookChapterMemoUseCase.listChapterMemos(
                c.req.param("userBookId"),
            );

            return c.json({ chapterMemos });
        } catch (error) {
            // 失敗時はエラーメッセージと 400: Bad Request を返す
            return c.json(
                {
                    message:
                        error instanceof Error
                            ? error.message
                            : "章メモの一覧取得に失敗しました。",
                },
                400,
            );
        }
    })
    .post("/:userBookId/chapter-memos", async (c) => {
        try {
            // リクエストボディを取得し、createChapterMemo の入力型として扱う
            const body = (await c.req.json()) as Omit<
                Parameters<typeof bookChapterMemoUseCase.createChapterMemo>[0],
                "userBookId"
            >;

            // 章メモを作成し、201: Created を返す
            const chapterMemo = await bookChapterMemoUseCase.createChapterMemo({
                userBookId: c.req.param("userBookId"),
                ...body,
            });

            return c.json({ chapterMemo }, 201);
        } catch (error) {
            // 失敗時はエラーメッセージと 400: Bad Request を返す
            return c.json(
                {
                    message:
                        error instanceof Error
                            ? error.message
                            : "章メモの作成に失敗しました。",
                },
                400,
            );
        }
    })
    .patch("/chapter-memos/:chapterMemoId", async (c) => {
        try {
            // リクエストボディを取得し、updateChapterMemo の入力型として扱う
            const body = (await c.req.json()) as Omit<
                Parameters<typeof bookChapterMemoUseCase.updateChapterMemo>[0],
                "chapterMemoId"
            >;

            // 章メモを更新し、200: OK を返す
            const chapterMemo = await bookChapterMemoUseCase.updateChapterMemo({
                chapterMemoId: c.req.param("chapterMemoId"),
                ...body,
            });

            return c.json({ chapterMemo });
        } catch (error) {
            // 失敗時はエラーメッセージと、存在しない場合は 404、それ以外は 400 を返す
            const message =
                error instanceof Error
                    ? error.message
                    : "章メモの更新に失敗しました。";
            const statusCode =
                message === chapterMemoPersistenceMessages.notFound ? 404 : 400;
            return c.json({ message }, statusCode);
        }
    })
    .delete("/chapter-memos/:chapterMemoId", async (c) => {
        try {
            const chapterMemo = await bookChapterMemoUseCase.deleteChapterMemo({
                chapterMemoId: c.req.param("chapterMemoId"),
            });

            return c.json({ chapterMemo });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "章メモの削除に失敗しました。";
            const statusCode =
                message === chapterMemoPersistenceMessages.notFound ? 404 : 400;
            return c.json({ message }, statusCode);
        }
    });

export { chapterMemoRouter };
