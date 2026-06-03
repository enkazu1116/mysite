import { Hono } from "hono";
import { skillsRouter } from "./features/skills/router/router";

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!')
});

app.route("/skills", skillsRouter);

export default app;
