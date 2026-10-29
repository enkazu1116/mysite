import type {
  BookSearchResult,
  ReadingStatus,
  UpdateUserBookPayload,
  UserBook,
} from "../types/book";
import { readRpcResponse } from "../../../lib/api-client";
import { booksRpc, userBooksRpc } from "./rpc";
import { usersRpc } from "../../Users/api/rpc";
import type { User } from "../../Users/types/user";

const configuredBooksUserId = import.meta.env.VITE_BOOKS_USER_ID?.trim();

export async function resolveBooksUserId(): Promise<string> {
  if (configuredBooksUserId) {
    return configuredBooksUserId;
  }

  const response = await usersRpc.$get({});
  const { users } = await readRpcResponse<{ users: User[] }>(
    response,
    "Failed to fetch users",
  );
  const userId = users[0]?.id;
  if (!userId) {
    throw new Error("登録先のユーザーが見つかりませんでした。");
  }
  return userId;
}

export const searchBooks = async (
  title: string,
): Promise<BookSearchResult[]> => {
  const query = title.trim();
  if (query.length === 0) {
    return [];
  }

  const response = await booksRpc.search.$get({ query: { q: query } });
  const { books } = await readRpcResponse<{ books: BookSearchResult[] }>(
    response,
    "Failed to fetch books",
  );
  return books;
};

export const createUserBook = async (
  book: BookSearchResult,
  status: ReadingStatus = "unread",
  userId?: string,
): Promise<UserBook> => {
  const resolvedUserId = userId ?? (await resolveBooksUserId());
  const response = await userBooksRpc.$post({
    json: { userId: resolvedUserId, book, status },
  });
  const { userBook } = await readRpcResponse<{ userBook: UserBook }>(
    response,
    "Failed to create user book",
  );
  return userBook;
};

export const listUserBooks = async (
  userId?: string,
  status?: ReadingStatus,
): Promise<UserBook[]> => {
  const resolvedUserId = userId ?? (await resolveBooksUserId());
  const query = status
    ? { userId: resolvedUserId, status }
    : { userId: resolvedUserId };
  const response = await userBooksRpc.$get({ query });
  const { userBooks } = await readRpcResponse<{ userBooks: UserBook[] }>(
    response,
    "Failed to fetch user books",
  );
  return userBooks;
};

export const getUserBook = async (userBookId: string): Promise<UserBook> => {
  const response = await userBooksRpc[":userBookId"].$get({
    param: { userBookId },
  });
  const { userBook } = await readRpcResponse<{ userBook: UserBook }>(
    response,
    "Failed to fetch user book",
  );
  return userBook;
};

export const updateUserBook = async (
  userBookId: string,
  payload: UpdateUserBookPayload,
): Promise<UserBook> => {
  const response = await userBooksRpc[":userBookId"].$patch({
    param: { userBookId },
    json: payload,
  });
  const { userBook } = await readRpcResponse<{ userBook: UserBook }>(
    response,
    "Failed to update user book",
  );
  return userBook;
};

export const deleteUserBook = async (userBookId: string): Promise<UserBook> => {
  const response = await userBooksRpc[":userBookId"].$delete({
    param: { userBookId },
  });
  const { userBook } = await readRpcResponse<{ userBook: UserBook }>(
    response,
    "Failed to delete user book",
  );
  return userBook;
};
