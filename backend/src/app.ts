import { Hono } from "hono";
import { cors } from "hono/cors";

import type { AppBindings } from "./infrastructure/drizzle/db";
import { booksSearchRouter } from "./features/books/router/booksSearchRouter";
import { userBooksRouter } from "./features/books/router/userBooksRouter";
import { projectsRouter } from "./features/projects/router/router";
import { skillsRouter } from "./features/skills/router/router";
import { userRoutes } from "./features/users/router/router";
import { adminFromRequest, authRouter } from "./features/auth/auth";

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
    .use("/api/*", async (c, next) => {
        if (c.req.method === "GET" || c.req.method === "HEAD" || c.req.method === "OPTIONS") {
            await next();
            return;
        }
        const origin = c.req.header("Origin");
        const siteOrigin = new URL(c.req.url).origin;
        const allowedOrigins = [siteOrigin, c.env?.FRONTEND_ORIGIN].filter(Boolean);
        if (!origin || !allowedOrigins.includes(origin)) {
            return c.json({ message: "リクエスト元を確認できません。" }, 403);
        }
        if (new URL(c.req.url).pathname === "/api/auth/logout") {
            await next();
            return;
        }
        if (!await adminFromRequest(c)) {
            return c.json({ message: "管理者ログインが必要です。" }, 401);
        }
        await next();
    })
    .get("/health", (c) => c.json({ ok: true }))
    .get("/", (c) => c.text("Hello Hono!"))
    .route("/api", api);

export type ApiType = typeof api;
export type AppType = typeof app;
export { api, app };
