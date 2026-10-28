import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserBook,
  deleteUserBook,
  getUserBook,
  listUserBooks,
  resolveBooksUserId,
  searchBooks,
  updateUserBook,
} from "../api/fetchBooks";
import type {
  BookSearchResult,
  ReadingStatus,
  UpdateUserBookPayload,
  UserBook,
} from "../types/book";

export const bookKeys = {
  search: (query: string) => ["books", "search", query] as const,
  userBooks: (userId: string) => ["user-books", userId] as const,
  userBook: (userBookId: string) => ["user-book", userBookId] as const,
};

export function useBookSearchQuery(query: string, enabled: boolean) {
  return useQuery({
    queryKey: bookKeys.search(query),
    queryFn: () => searchBooks(query),
    enabled,
  });
}
export function useBooksUserIdQuery() {
  return useQuery({
    queryKey: ["books-user-id"] as const,
    queryFn: resolveBooksUserId,
  });
}

export function useUserBooksQuery(userId?: string) {
  return useQuery({
    queryKey: bookKeys.userBooks(userId ?? "self"),
    queryFn: () => listUserBooks(userId),
  });
}

export function useUserBookQuery(userBookId: string | undefined) {
  return useQuery({
    queryKey: bookKeys.userBook(userBookId ?? ""),
    queryFn: () => getUserBook(userBookId ?? ""),
    enabled: Boolean(userBookId),
  });
}

export function useCreateUserBookMutation(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      book,
      status = "unread",
    }: {
      book: BookSearchResult;
      status?: ReadingStatus;
    }) => {
      if (!userId) {
        return Promise.reject(new Error("登録先のユーザーが見つかりませんでした。"));
      }
      return createUserBook(book, status, userId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user-books"] });
    },
  });
}

export function useUpdateUserBookMutation(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userBookId,
      payload,
    }: {
      userBookId: string;
      payload: UpdateUserBookPayload;
    }) => updateUserBook(userBookId, payload),
    onMutate: async ({ userBookId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["user-books"] });
      await queryClient.cancelQueries({
        queryKey: bookKeys.userBook(userBookId),
      });
      const previousLists = queryClient.getQueriesData<UserBook[]>({
        queryKey: ["user-books"],
      });
      for (const [key, books] of previousLists) {
        if (!books) {
          continue;
        }
        queryClient.setQueryData(
          key,
          books.map((book) =>
            book.userBookId === userBookId ? { ...book, ...payload } : book,
          ),
        );
      }
      const previousDetail = queryClient.getQueryData<UserBook>(
        bookKeys.userBook(userBookId),
      );
      if (previousDetail) {
        queryClient.setQueryData(bookKeys.userBook(userBookId), {
          ...previousDetail,
          ...payload,
        });
      }
      return { previousLists, previousDetail, userBookId };
    },
    onError: (_error, _variables, context) => {
      for (const [key, books] of context?.previousLists ?? []) {
        queryClient.setQueryData(key, books);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(
          bookKeys.userBook(context.userBookId),
          context.previousDetail,
        );
      }
    },
    onSuccess: (userBook) => {
      void queryClient.invalidateQueries({
        queryKey: userId ? bookKeys.userBooks(userId) : ["user-books"],
      });
      void queryClient.invalidateQueries({
        queryKey: bookKeys.userBook(userBook.userBookId),
      });
    },
  });
}

export function useDeleteUserBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userBookId: string) => deleteUserBook(userBookId),
    onSuccess: (userBook) => {
      void queryClient.invalidateQueries({ queryKey: ["user-books"] });
      queryClient.removeQueries({
        queryKey: bookKeys.userBook(userBook.userBookId),
      });
    },
  });
}
