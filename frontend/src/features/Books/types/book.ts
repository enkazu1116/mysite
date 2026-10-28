import type { InferRequestType, InferResponseType } from "hono/client";
import { booksRpc, userBooksRpc } from "../api/rpc";

export const readingStatuses = ["unread", "reading", "finished"] as const;
export type BookSearchResult = InferResponseType<
  typeof booksRpc.search.$get,
  200
>["books"][number];
export type Book = InferResponseType<
  typeof userBooksRpc[":userBookId"]["$get"],
  200
>["userBook"]["book"];
export type UserBook = InferResponseType<
  typeof userBooksRpc[":userBookId"]["$get"],
  200
>["userBook"];
export type ReadingStatus = UserBook["status"];

export type UpdateUserBookPayload = {
  [K in keyof InferRequestType<
    typeof userBooksRpc[":userBookId"]["$patch"]
  >["json"]]: InferRequestType<
    typeof userBooksRpc[":userBookId"]["$patch"]
  >["json"][K];
};
