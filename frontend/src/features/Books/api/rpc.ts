import { rpcClient } from "../../../lib/api-client";

export const booksRpc = rpcClient.books;
export const userBooksRpc = rpcClient["user-books"];
