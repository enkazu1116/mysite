import { useMemo } from "react";
import {
  Alert,
  Chip,
  EmptyState,
  Spinner,
} from "@heroui/react";
import { motion, useReducedMotion } from "motion/react";
import { BookShelfKanban } from "./components/shelf/BookShelfKanban";
import {
  useBooksUserIdQuery,
  useUserBooksQuery,
} from "./hooks/useBooksQueries";
import type { UserBook } from "./types/book";
import { getErrorMessage } from "../../utils/getErrorMessage";

function sortByUpdatedAtDesc(books: UserBook[]) {
  return [...books].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export default function Books() {
  const booksUser = useBooksUserIdQuery();
  const userBooks = useUserBooksQuery(booksUser.data);
  const reduceMotion = useReducedMotion();

  const visibleBooks = useMemo(
    () => sortByUpdatedAtDesc(userBooks.data ?? []),
    [userBooks.data],
  );
  const error = booksUser.error ?? userBooks.error;

  return (
    <main className="surface-library flex-1 px-4 pb-10 pt-6 sm:px-6">
      <section className="mx-auto mb-8 max-w-7xl text-left">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h1 className="font-display m-0 text-4xl font-semibold tracking-tight text-[var(--lib-ink)] sm:text-5xl">
            Books
          </h1>
          <p className="mt-2 max-w-xl text-base text-[var(--lib-ink-muted)]">
            状態ごとの棚。列内は出版社順。カバーから詳細へ進めます。
          </p>
        </motion.div>
      </section>

      {error && (
        <Alert status="danger" className="mx-auto mb-4 max-w-7xl text-left">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>エラー</Alert.Title>
            <Alert.Description>
              {getErrorMessage(error, "Books の取得に失敗しました。")}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      {userBooks.isLoading && (
        <div className="mx-auto flex max-w-7xl items-center gap-2 py-10 text-[var(--lib-ink-muted)]">
          <Spinner size="sm" />
          <span className="text-sm">本棚を取得中...</span>
        </div>
      )}

      {!userBooks.isLoading && visibleBooks.length === 0 && (
        <EmptyState className="lib-panel mx-auto max-w-7xl border-dashed py-12">
          <p className="text-[var(--lib-ink-muted)]">登録済みの本はありません。</p>
        </EmptyState>
      )}

      {visibleBooks.length > 0 && (
        <section className="mx-auto max-w-7xl text-left">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display m-0 text-xl font-semibold text-[var(--lib-ink)]">
              本棚
            </h2>
            <Chip size="sm" className="bg-[var(--lib-accent-soft)] text-[var(--lib-ink)]">
              {visibleBooks.length}冊
            </Chip>
          </div>
          <BookShelfKanban books={visibleBooks} />
        </section>
      )}
    </main>
  );
}
