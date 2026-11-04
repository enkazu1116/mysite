import { Hono } from "hono";
import { cors } from "hono/cors";

import { createDb } from "./infrastructure/drizzle/db";
import { booksSearchRouter } from "./features/books/router/booksSearchRouter";
import { userBooksRouter } from "./features/books/router/userBooksRouter";
import { projectsRouter } from "./features/projects/router/router";
import { skillsRouter } from "./features/skills/router/router";
import { userRoutes } from "./features/users/router/router";
import { authRouter } from "./features/auth/router/router";
import { requireAdministratorForWrite } from "./middleware/adminAccessControl";

export type AppBindings = {
    DB: Parameters<typeof createDb>[0];
    BOOKS_API?: string;
    JWT_SECRET?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    ADMIN_GOOGLE_SUBS?: string;
    ADMIN_GITHUB_IDS?: string;
    FRONTEND_ORIGIN?: string;
};

const api = new Hono<{ Bindings: AppBindings }>()
    .route("/auth", authRouter)
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
    .use("/api/*", requireAdministratorForWrite)
    .get("/health", (c) => c.json({ ok: true }))
    .get("/", (c) => c.text("Hello Hono!"))
    .route("/api", api);

export type ApiType = typeof api;
export type AppType = typeof app;
export { api, app };
