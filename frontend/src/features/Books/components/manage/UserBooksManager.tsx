import { useEffect, useMemo, useState, useTransition } from "react";
import { Alert } from "@heroui/react";
import {
  useCreateUserBookMutation,
  useDeleteUserBookMutation,
  useUserBooksQuery,
} from "../../hooks/useBooksQueries";
import type { ReadingStatus, UserBook } from "../../types/book";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { UserBooksSearch } from "./UserBooksSearch";
import {
  UserBooksList,
  type StatusFilter,
} from "./UserBooksList";

const DEFAULT_PAGE_SIZE = 10;

const readingStatusSortOrder: Record<ReadingStatus, number> = {
  reading: 0,
  unread: 1,
  finished: 2,
};

function sortRegisteredBooks(books: UserBook[]) {
  return [...books].sort((a, b) => {
    const byStatus =
      readingStatusSortOrder[a.status] - readingStatusSortOrder[b.status];
    if (byStatus !== 0) {
      return byStatus;
    }
    return (
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  });
}

export function UserBooksManager({
  userId,
  canEdit = true,
}: {
  userId: string;
  canEdit?: boolean;
}) {
  const [expandedUserBookId, setExpandedUserBookId] = useState<string | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isPaging, startPagingTransition] = useTransition();
  const userBooks = useUserBooksQuery(userId);
  const createUserBook = useCreateUserBookMutation(userId);
  const deleteUserBook = useDeleteUserBookMutation(userId);

  const filteredBooks = useMemo(() => {
    const sorted = sortRegisteredBooks(userBooks.data ?? []);
    if (statusFilter === "all") {
      return sorted;
    }
    return sorted.filter((book) => book.status === statusFilter);
  }, [userBooks.data, statusFilter]);
  const pageCount = Math.max(1, Math.ceil(filteredBooks.length / pageSize));
  const visibleBooks = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredBooks.slice(start, start + pageSize);
  }, [filteredBooks, pageIndex, pageSize]);
  const registeredSourceBookIds = useMemo(
    () =>
      new Set(
        (userBooks.data ?? []).map((book) => book.book.sourceBookId),
      ),
    [userBooks.data],
  );
  const error =
    userBooks.error ?? createUserBook.error ?? deleteUserBook.error;
  const totalCount = userBooks.data?.length ?? 0;

  useEffect(() => {
    if (pageIndex > pageCount - 1) {
      setPageIndex(Math.max(0, pageCount - 1));
    }
  }, [pageIndex, pageCount]);

  const handleStatusFilterChange = (next: StatusFilter) => {
    startPagingTransition(() => {
      setStatusFilter(next);
      setPageIndex(0);
    });
  };
  const handleDelete = (userBook: UserBook) => {
    const confirmed = window.confirm(
      `「${userBook.book.title}」を登録済みから削除しますか？`,
    );
    if (!confirmed) {
      return;
    }

    deleteUserBook.mutate(userBook.userBookId, {
      onSuccess: () => {
        if (expandedUserBookId === userBook.userBookId) {
          setExpandedUserBookId(null);
        }
      },
    });
  };

  return (
    <section className="mx-auto mb-6 max-w-4xl text-left">
      {error && (
        <Alert status="danger" className="mb-3 text-left">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>エラー</Alert.Title>
            <Alert.Description>
              {getErrorMessage(error, "Books 管理の処理に失敗しました。")}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {canEdit ? (
        <div className="mb-6" data-books-search-section>
          <UserBooksSearch
            isRegistering={createUserBook.isPending}
            registeredSourceBookIds={registeredSourceBookIds}
            onRegister={(book) =>
              createUserBook.mutate({ book, status: "unread" })
            }
          />
        </div>
      ) : (
        <p className="mb-6 text-sm text-[var(--lib-ink-muted)]">
          ゲストユーザーは本の登録・編集対象外です。
        </p>
      )}

      <UserBooksList
        userId={userId}
        canEdit={canEdit}
        isLoading={userBooks.isLoading}
        totalCount={totalCount}
        filteredBooks={filteredBooks}
        visibleBooks={visibleBooks}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        expandedUserBookId={expandedUserBookId}
        onToggleExpand={(userBookId) =>
          setExpandedUserBookId((current) =>
            current === userBookId ? null : userBookId,
          )
        }
        onDelete={handleDelete}
        isDeletingUserBookId={
          deleteUserBook.isPending ? (deleteUserBook.variables ?? null) : null
        }
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
        isPaging={isPaging}
        onPageIndexChange={(nextPage) => {
          startPagingTransition(() => setPageIndex(nextPage));
        }}
        onPageSizeChange={(nextPageSize) => {
          startPagingTransition(() => {
            setPageSize(nextPageSize);
            setPageIndex(0);
          });
        }}
        onFirstPage={() => startPagingTransition(() => setPageIndex(0))}
        onPreviousPage={() =>
          startPagingTransition(() =>
            setPageIndex((current) => Math.max(0, current - 1)),
          )
        }
        onNextPage={() =>
          startPagingTransition(() =>
            setPageIndex((current) => Math.min(pageCount - 1, current + 1)),
          )
        }
        onLastPage={() =>
          startPagingTransition(() => setPageIndex(pageCount - 1))
        }
      />
    </section>
  );
}
