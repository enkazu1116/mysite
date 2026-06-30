import { Hono } from "hono";

import { booksRouter, userBooksRouter } from "./features/books/router/router";
import { skillsRouter } from "./features/skills/router/router";
import { userRoutes } from "./features/users/userRoutes";

const api = new Hono()
    .route("/skills", skillsRouter)
    .route("/users", userRoutes)
    .route("/books", booksRouter)
    .route("/user-books", userBooksRouter);

const app = new Hono()
    .get("/", (c) => c.text("Hello Hono!"))
    .route("/api", api);

export type ApiType = typeof api;
export type AppType = typeof app;
export { api, app };
