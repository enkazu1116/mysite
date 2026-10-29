import path from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { getPlatformProxy, type GetPlatformProxyOptions } from "wrangler";
import type { AppBindings } from "../../../infrastructure/drizzle/db";
import type { AppType } from "../../../app";

/**
 * Google Books API + ローカル D1 を使う統合テスト。
 * BOOKS_API は環境変数かルートの .dev.vars。
 */
function requireEnv(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(
            `${name} が未設定です。ルートの .dev.vars か CI のシークレットを確認してください。`,
        );
    }
    return value;
}

let app: AppType;
let bindings: AppBindings;
let dispose: (() => Promise<void>) | undefined;

async function request(input: string, init?: RequestInit): Promise<Response> {
    return app.request(input, init, bindings);
}

async function searchBooksWithRetry(
    query: string,
    attempts = 3,
): Promise<Response> {
    let last: Response | undefined;
    for (let i = 0; i < attempts; i += 1) {
        last = await request(
            `/api/books/search?q=${encodeURIComponent(query)}`,
        );
        if (last.status === 200) {
            return last;
        }
        const body = (await last.clone().json()) as { message?: string };
        const message = body.message ?? "";
        const retriable =
            message.includes(": 503") ||
            message.includes(": 429") ||
            message.includes(": 500");
        if (!retriable || i === attempts - 1) {
            return last;
        }
        await Bun.sleep(1000 * (i + 1));
    }
    return last!;
}

describe("books integration (Google Books + D1)", () => {
    let userId = "";
    let userBookId = "";

    beforeAll(async () => {
        const booksApi = requireEnv("BOOKS_API");
        const root = path.resolve(import.meta.dir, "../../../../..");
        const proxy = await getPlatformProxy({
            configPath: path.join(root, "wrangler.jsonc"),
            persist: { path: path.join(root, ".wrangler/state") },
        } satisfies GetPlatformProxyOptions);
        dispose = proxy.dispose;
        bindings = { DB: proxy.env.DB, BOOKS_API: booksApi };

        const migrationPath = path.join(root, "backend/migrations");
        const files = new Bun.Glob("*.sql").scan({ cwd: migrationPath });
        for await (const file of files) {
            const sql = await Bun.file(path.join(migrationPath, file)).text();
            const statements = sql
                .split("--> statement-breakpoint")
                .map((statement) => statement.trim())
                .filter(Boolean);
            for (const statement of statements) {
                await bindings.DB.exec(statement);
            }
        }

        ({ app } = await import("../../../app"));
    });

    afterAll(async () => {
        if (app && userBookId) {
            await request(`/api/user-books/${userBookId}`, { method: "DELETE" });
        }
        if (app && userId) {
            await request(`/api/users/${userId}`, { method: "DELETE" });
        }
        await dispose?.();
    });

    test(
        "検索 → 登録 → 取得 → 更新 → 削除の一連が通る",
        async () => {
            const createUserResponse = await request("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `it-${crypto.randomUUID().slice(0, 8)}`,
                }),
            });
            expect(createUserResponse.status).toBe(201);
            const createUserBody = (await createUserResponse.json()) as {
                user: { id: string };
            };
            userId = createUserBody.user.id;
            expect(userId).toBeTruthy();

            const searchResponse = await searchBooksWithRetry("Clean Code");
            expect(searchResponse.status).toBe(200);
            const searchBody = (await searchResponse.json()) as {
                books: Array<{
                    source: string;
                    sourceBookId: string;
                    title: string;
                    authors: string[];
                }>;
            };
            expect(searchBody.books.length).toBeGreaterThan(0);
            const book = searchBody.books[0]!;
            expect(book.source).toBe("google_books");
            expect(book.sourceBookId).toBeTruthy();
            expect(book.title).toBeTruthy();

            const createBookResponse = await request("/api/user-books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    book,
                    status: "unread",
                }),
            });
            expect(createBookResponse.status).toBe(201);
            const createBookBody = (await createBookResponse.json()) as {
                userBook: {
                    userBookId: string;
                    userId: string;
                    status: string;
                    book: { source: string; sourceBookId: string; title: string };
                };
            };
            userBookId = createBookBody.userBook.userBookId;
            expect(createBookBody.userBook.userId).toBe(userId);
            expect(createBookBody.userBook.status).toBe("unread");
            expect(createBookBody.userBook.book.source).toBe("google_books");
            expect(createBookBody.userBook.book.sourceBookId).toBe(
                book.sourceBookId,
            );

            const getResponse = await request(
                `/api/user-books/${userBookId}`,
            );
            expect(getResponse.status).toBe(200);
            const getBody = (await getResponse.json()) as {
                userBook: { userBookId: string; book: { title: string } };
            };
            expect(getBody.userBook.userBookId).toBe(userBookId);
            expect(getBody.userBook.book.title).toBeTruthy();

            const patchResponse = await request(
                `/api/user-books/${userBookId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        status: "reading",
                        currentPage: 12,
                    }),
                },
            );
            expect(patchResponse.status).toBe(200);
            const patchBody = (await patchResponse.json()) as {
                userBook: {
                    status: string;
                    currentPage: number | null;
                };
            };
            expect(patchBody.userBook.status).toBe("reading");
            expect(patchBody.userBook.currentPage).toBe(12);

            const listResponse = await request(
                `/api/user-books?userId=${encodeURIComponent(userId)}&status=reading`,
            );
            expect(listResponse.status).toBe(200);
            const listBody = (await listResponse.json()) as {
                userBooks: Array<{ userBookId: string }>;
            };
            expect(
                listBody.userBooks.some((row) => row.userBookId === userBookId),
            ).toBe(true);

            const deleteResponse = await request(
                `/api/user-books/${userBookId}`,
                { method: "DELETE" },
            );
            expect(deleteResponse.status).toBe(200);
            userBookId = "";

            const missingResponse = await request(
                `/api/user-books/${createBookBody.userBook.userBookId}`,
            );
            expect(missingResponse.status).toBe(404);

            const deleteUserResponse = await request(`/api/users/${userId}`, {
                method: "DELETE",
            });
            expect(deleteUserResponse.status).toBe(200);
            userId = "";
        },
        { timeout: 60_000 },
    );
});
