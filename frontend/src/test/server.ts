import { setupServer } from "msw/node";
import { booksHandlers } from "./handlers";

export const server = setupServer(...booksHandlers);
