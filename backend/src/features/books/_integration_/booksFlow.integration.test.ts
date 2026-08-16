import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import type { AppType } from "../../../app";

/**
 * Google Books API + Turso を実接続する統合テスト。
 * 秘密情報は Infisical から注入する（ローカル: `bun run test:integration`、
 * CI: Infisical Secrets Action → `bun run test:integration:ci`）。
 */
function requireEnv(name: string): void {
    if (!process.env[name]?.trim()) {
        throw new Error(
            `${name} が未設定です。Infisical に TURSO_* / BOOKS_API があるか確認してください。`,
        );
    }
}

async function searchBooksWithRetry(
    app: AppType,
    query: string,
    attempts = 3,
): Promise<Response> {
    let last: Response | undefined;
    for (let i = 0; i < attempts; i += 1) {
        last = await app.request(
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

describe("books integration (Google Books + Turso)", () => {
    let app: AppType;
    let userId = "";
    let userBookId = "";

    beforeAll(async () => {
        requireEnv("TURSO_DATABASE_URL");
        requireEnv("TURSO_AUTH_TOKEN");
        requireEnv("BOOKS_API");

        // db / BOOKS_API はモジュール読み込み時に評価されるため、env 確認後に遅延 import
        ({ app } = await import("../../../app"));
    });

    afterAll(async () => {
        if (!app) {
            return;
        }

        if (userBookId) {
            await app.request(`/api/user-books/${userBookId}`, {
                method: "DELETE",
            });
        }

        if (userId) {
            await app.request(`/api/users/${userId}`, { method: "DELETE" });
        }
    });

    test(
        "検索 → 登録 → 取得 → 更新 → 削除の一連が通る",
        async () => {
            const createUserResponse = await app.request("/api/users", {
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

            const searchResponse = await searchBooksWithRetry(app, "Clean Code");
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

            const createBookResponse = await app.request("/api/user-books", {
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

            const getResponse = await app.request(
                `/api/user-books/${userBookId}`,
            );
            expect(getResponse.status).toBe(200);
            const getBody = (await getResponse.json()) as {
                userBook: { userBookId: string; book: { title: string } };
            };
            expect(getBody.userBook.userBookId).toBe(userBookId);
            expect(getBody.userBook.book.title).toBeTruthy();

            const patchResponse = await app.request(
                `/api/user-books/${userBookId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        status: "reading",
                        currentPage: 12,
                        note: "integration-test",
                    }),
                },
            );
            expect(patchResponse.status).toBe(200);
            const patchBody = (await patchResponse.json()) as {
                userBook: {
                    status: string;
                    currentPage: number | null;
                    note: string | null;
                };
            };
            expect(patchBody.userBook.status).toBe("reading");
            expect(patchBody.userBook.currentPage).toBe(12);
            expect(patchBody.userBook.note).toBe("integration-test");

            const listResponse = await app.request(
                `/api/user-books?userId=${encodeURIComponent(userId)}&status=reading`,
            );
            expect(listResponse.status).toBe(200);
            const listBody = (await listResponse.json()) as {
                userBooks: Array<{ userBookId: string }>;
            };
            expect(
                listBody.userBooks.some((row) => row.userBookId === userBookId),
            ).toBe(true);

            const deleteResponse = await app.request(
                `/api/user-books/${userBookId}`,
                { method: "DELETE" },
            );
            expect(deleteResponse.status).toBe(200);
            userBookId = "";

            const missingResponse = await app.request(
                `/api/user-books/${createBookBody.userBook.userBookId}`,
            );
            expect(missingResponse.status).toBe(404);

            const deleteUserResponse = await app.request(`/api/users/${userId}`, {
                method: "DELETE",
            });
            expect(deleteUserResponse.status).toBe(200);
            userId = "";
        },
        { timeout: 60_000 },
    );
});
