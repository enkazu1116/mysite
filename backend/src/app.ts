import { Hono } from "hono";
import { cors } from "hono/cors";

import { bookOutputRouter } from "./features/books/router/bookOutputRouter";
import { booksSearchRouter } from "./features/books/router/booksSearchRouter";
import { chapterMemoRouter } from "./features/books/router/chapterMemoRouter";
import { userBooksRouter } from "./features/books/router/userBooksRouter";
import { skillsRouter } from "./features/skills/router/router";
import { userRoutes } from "./features/users/router/router";

function resolveCorsOrigin(): string | string[] {
    const raw = process.env.CORS_ORIGIN?.trim();

    if (!raw || raw === "*") {
        return "*";
    }

    const origins = raw
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    return origins.length === 1 ? origins[0]! : origins;
}

const api = new Hono()
    .route("/skills", skillsRouter)
    .route("/users", userRoutes)
    .route("/books", booksSearchRouter)
    .route("/user-books", userBooksRouter)
    .route("/user-books", chapterMemoRouter)
    .route("/user-books", bookOutputRouter);

const app = new Hono()
    .use(
        "*",
        cors({
            origin: resolveCorsOrigin(),
            allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
            allowHeaders: ["Content-Type", "Authorization"],
        }),
    )
    .get("/health", (c) => c.json({ ok: true }))
    .get("/", (c) => c.text("Hello Hono!"))
    .route("/api", api);

export type ApiType = typeof api;
export type AppType = typeof app;
export { api, app };
