import { Hono } from "hono";
import { cors } from "hono/cors";

import { booksRouter, userBooksRouter } from "./features/books/router/router";
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
    .route("/books", booksRouter)
    .route("/user-books", userBooksRouter);

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
