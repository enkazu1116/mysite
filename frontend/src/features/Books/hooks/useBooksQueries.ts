import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChapterMemo,
  createOutput,
  createUserBook,
  deleteChapterMemo,
  deleteUserBook,
  getUserBook,
  listChapterMemos,
  listOutputs,
  listUserBooks,
  resolveBooksUserId,
  searchBooks,
  updateChapterMemo,
  updateOutput,
  updateUserBook,
} from "../api/fetchBooks";
import type {
  BookSearchResult,
  CreateBookOutputPayload,
  CreateChapterMemoPayload,
  ReadingStatus,
  UpdateBookOutputPayload,
  UpdateChapterMemoPayload,
  UpdateUserBookPayload,
  UserBook,
} from "../types/book";

export const bookKeys = {
  search: (query: string) => ["books", "search", query] as const,
  userBooks: (userId: string) => ["user-books", userId] as const,
  userBook: (userBookId: string) => ["user-book", userBookId] as const,
  chapterMemos: (userBookId: string) =>
    ["chapter-memos", userBookId] as const,
  outputs: (userBookId: string) => ["book-outputs", userBookId] as const,
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

export function useChapterMemosQuery(userBookId: string | undefined) {
  return useQuery({
    queryKey: bookKeys.chapterMemos(userBookId ?? ""),
    queryFn: () => listChapterMemos(userBookId ?? ""),
    enabled: Boolean(userBookId),
  });
}

export function useBookOutputsQuery(userBookId: string | undefined) {
  return useQuery({
    queryKey: bookKeys.outputs(userBookId ?? ""),
    queryFn: () => listOutputs(userBookId ?? ""),
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
      void queryClient.removeQueries({
        queryKey: bookKeys.userBook(userBook.userBookId),
      });
      void queryClient.removeQueries({
        queryKey: bookKeys.chapterMemos(userBook.userBookId),
      });
      void queryClient.removeQueries({
        queryKey: bookKeys.outputs(userBook.userBookId),
      });
    },
  });
}

export function useCreateChapterMemoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userBookId,
      payload,
    }: {
      userBookId: string;
      payload: CreateChapterMemoPayload;
    }) => createChapterMemo(userBookId, payload),
    onSuccess: (chapterMemo) => {
      void queryClient.invalidateQueries({
        queryKey: bookKeys.chapterMemos(chapterMemo.userBookId),
      });
    },
  });
}

export function useUpdateChapterMemoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      chapterMemoId: string;
      userBookId: string;
      payload: UpdateChapterMemoPayload;
    }) => updateChapterMemo(variables.chapterMemoId, variables.payload),
    onSuccess: (_chapterMemo, variables) => {
      void queryClient.invalidateQueries({
        queryKey: bookKeys.chapterMemos(variables.userBookId),
      });
    },
  });
}

export function useDeleteChapterMemoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { chapterMemoId: string; userBookId: string }) =>
      deleteChapterMemo(variables.chapterMemoId),
    onSuccess: (_chapterMemo, variables) => {
      void queryClient.invalidateQueries({
        queryKey: bookKeys.chapterMemos(variables.userBookId),
      });
    },
  });
}

export function useCreateBookOutputMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userBookId,
      payload,
    }: {
      userBookId: string;
      payload: CreateBookOutputPayload;
    }) => createOutput(userBookId, payload),
    onSuccess: (output) => {
      void queryClient.invalidateQueries({
        queryKey: bookKeys.outputs(output.userBookId),
      });
    },
  });
}

export function useUpdateBookOutputMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      bookOutputId: string;
      userBookId: string;
      payload: UpdateBookOutputPayload;
    }) => updateOutput(variables.bookOutputId, variables.payload),
    onSuccess: (_output, variables) => {
      void queryClient.invalidateQueries({
        queryKey: bookKeys.outputs(variables.userBookId),
      });
    },
  });
}
