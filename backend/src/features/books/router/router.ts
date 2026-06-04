import { Hono } from "hono";
import { DrizzleBookRepository } from "../../../infrastructure/drizzle/repositories/drizzleBookRepository";
import { BookUseCase } from "../usecase/bookUseCase";
import { readingStatuses, type ReadingStatus } from "../types/readingStatus";

const booksRouter = new Hono();
const userBooksRouter = new Hono();
const bookUseCase = new BookUseCase(new DrizzleBookRepository());

booksRouter.get("/search", async (c) => {
    try {
        const query = c.req.query("q") ?? "";
        const books = query.trim().length === 0
            ? []
            : await bookUseCase.searchBooks(query);

        return c.json({ books });
    } catch (error) {
        return c.json(
            { message: error instanceof Error ? error.message : "Failed to search books." },
            400,
        );
    }
});

userBooksRouter.get("/", async (c) => {
    try {
        const userId = c.req.query("userId") ?? "";
        const status = c.req.query("status");

        const userBooks = await bookUseCase.getUserBooks({
            userId,
            status:
                status && readingStatuses.includes(status as ReadingStatus)
                    ? (status as ReadingStatus)
                    : undefined,
        });

        return c.json({ userBooks });
    } catch (error) {
        return c.json(
            { message: error instanceof Error ? error.message : "Failed to list user books." },
            400,
        );
    }
});

userBooksRouter.post("/", async (c) => {
    try {
        const body = (await c.req.json()) as Parameters<typeof bookUseCase.createUserBook>[0];
        const userBook = await bookUseCase.createUserBook(body);
        return c.json({ userBook }, 201);
    } catch (error) {
        return c.json(
            { message: error instanceof Error ? error.message : "Failed to create user book." },
            400,
        );
    }
});

userBooksRouter.get("/:userBookId", async (c) => {
    const userBook = await bookUseCase.getUserBookById(c.req.param("userBookId"));

    if (!userBook) {
        return c.json({ message: "user book not found" }, 404);
    }

    return c.json({ userBook });
});

userBooksRouter.patch("/:userBookId", async (c) => {
    try {
        const body = (await c.req.json()) as Omit<
            Parameters<typeof bookUseCase.updateUserBook>[0],
            "userBookId"
        >;

        const userBook = await bookUseCase.updateUserBook({
            userBookId: c.req.param("userBookId"),
            ...body,
        });

        return c.json({ userBook });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to update user book.";
        const statusCode = message === "User book not found." ? 404 : 400;
        return c.json({ message }, statusCode);
    }
});

export { booksRouter, userBooksRouter };
