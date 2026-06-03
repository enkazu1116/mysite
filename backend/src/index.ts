import { Hono } from "hono";
import { booksRouter, userBooksRouter } from "./features/books/router/router";
import { skillsRouter } from "./features/skills/router/router";

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!')
});

app.route("/skills", skillsRouter);
app.route("/books", booksRouter);
app.route("/user-books", userBooksRouter);

export default app;
