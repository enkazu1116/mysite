import { Hono } from "hono";
import { cors } from "hono/cors";

import type { AppBindings } from "./infrastructure/drizzle/db";
import { booksSearchRouter } from "./features/books/router/booksSearchRouter";
import { userBooksRouter } from "./features/books/router/userBooksRouter";
import { projectsRouter } from "./features/projects/router/router";
import { skillsRouter } from "./features/skills/router/router";
import { userRoutes } from "./features/users/router/router";

const api = new Hono<{ Bindings: AppBindings }>()
    .route("/skills", skillsRouter)
    .route("/users", userRoutes)
    .route("/projects", projectsRouter)
    .route("/books", booksSearchRouter)
    .route("/user-books", userBooksRouter);

const app = new Hono<{ Bindings: AppBindings }>()
    .use(
        "*",
        cors({
            origin: "*",
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
