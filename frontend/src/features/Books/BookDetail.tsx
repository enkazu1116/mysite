import { Chip } from "@heroui/react/chip";
import { EmptyState } from "@heroui/react/empty-state";
import { Spinner } from "@heroui/react/spinner";
import { motion, useReducedMotion } from "motion/react";
import { Link as RouterLink, useParams } from "react-router";
import {
  ArrowLeftIcon,
  NotebookIcon,
  StickyNotePlusIcon,
} from "../../components/icons";
import { LibrarySurface } from "../../components/LibrarySurface.tsx";
import { QueryErrorAlert } from "../../components/status";
import { readingStatusLabel, readingStatusToneClass } from "./components/readingStatus";
import { useUserBookQuery } from "./hooks/useBooksQueries";

export default function BookDetail() {
  const { userBookId } = useParams<{ userBookId: string }>();
  const userBook = useUserBookQuery(userBookId);
  const error = userBook.error;
  const reduceMotion = useReducedMotion();

  return (
    <LibrarySurface className="px-4 pb-10 pt-4 sm:px-6">
      <section className="mx-auto mb-6 max-w-5xl text-left">
        <RouterLink
          to="/books"
          aria-label="Booksへ戻る"
          title="Booksへ戻る"
          className="lib-back"
        >
          <ArrowLeftIcon />
        </RouterLink>
      </section>

      <QueryErrorAlert
        error={error}
        fallback="本の詳細取得に失敗しました。"
        className="mx-auto mb-4 max-w-5xl text-left"
      />

      {userBook.isLoading && (
        <div className="mx-auto flex max-w-5xl items-center gap-2 py-10 text-[var(--lib-ink-muted)]">
          <Spinner size="sm" />
          <span className="text-sm">本の詳細を取得中...</span>
        </div>
      )}

      {!userBook.isLoading && !userBook.data && (
        <EmptyState className="mx-auto max-w-5xl py-10">
          <p className="text-[var(--lib-ink-muted)]">本が見つかりません。</p>
        </EmptyState>
      )}

      {userBook.data && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <section className="mx-auto mb-10 max-w-5xl text-left">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
              <div className="mx-auto w-full max-w-[14rem] shrink-0 lg:mx-0">
                {userBook.data.book.thumbnailUrl ? (
                  <img
                    src={userBook.data.book.thumbnailUrl}
                    alt={userBook.data.book.title}
                    className="aspect-[2/3] w-full rounded-[var(--lib-radius)] border border-[var(--lib-line)] bg-[var(--lib-paper-elevated)] object-cover shadow-md"
                  />
                ) : (
                  <div className="flex aspect-[2/3] w-full items-center justify-center rounded-[var(--lib-radius)] border border-[var(--lib-line)] bg-[var(--lib-accent-soft)] text-sm text-[var(--lib-ink-muted)]">
                    No Image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="font-display m-0 text-3xl font-semibold leading-tight tracking-tight text-[var(--lib-ink)] sm:text-4xl">
                  {userBook.data.book.title}
                </h1>
                <p className="mt-2 text-base text-[var(--lib-ink-muted)]">
                  {userBook.data.book.authors.length > 0
                    ? userBook.data.book.authors.join(", ")
                    : "著者不明"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Chip
                    size="sm"
                    className={readingStatusToneClass[userBook.data.status]}
                  >
                    {readingStatusLabel[userBook.data.status]}
                  </Chip>
                  {userBook.data.currentPage != null ? (
                    <Chip size="sm">{userBook.data.currentPage}ページ</Chip>
                  ) : null}
                  {userBook.data.book.pageCount != null ? (
                    <Chip size="sm">全{userBook.data.book.pageCount}ページ</Chip>
                  ) : null}
                  {userBook.data.book.publishedDate ? (
                    <Chip size="sm">{userBook.data.book.publishedDate}</Chip>
                  ) : null}
                  <Chip size="sm">{userBook.data.book.source}</Chip>
                </div>

                {userBook.data.book.description ? (
                  <p className="mt-6 max-w-prose text-sm leading-relaxed text-[var(--lib-ink-muted)] line-clamp-6">
                    {userBook.data.book.description}
                  </p>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-3">
                  <RouterLink
                    to={`/books/${userBook.data.userBookId}/memos`}
                    data-detail-link="memos"
                    className="lib-cta"
                  >
                    <StickyNotePlusIcon className="h-4 w-4" />
                    メモ
                  </RouterLink>
                  <RouterLink
                    to={`/books/${userBook.data.userBookId}/outputs`}
                    data-detail-link="outputs"
                    className="lib-cta"
                  >
                    <NotebookIcon className="h-4 w-4" />
                    アウトプット
                  </RouterLink>
                </div>
              </div>
            </div>
          </section>

          {userBook.data.note ? (
            <section className="mx-auto mb-8 max-w-5xl text-left">
              <h2 className="font-display mb-3 text-xl font-semibold text-[var(--lib-ink)]">
                読書メモ
              </h2>
              <article className="lib-panel p-5">
                <p className="m-0 whitespace-pre-wrap text-sm leading-relaxed text-[var(--lib-ink)]">
                  {userBook.data.note}
                </p>
              </article>
            </section>
          ) : null}
        </motion.div>
      )}
    </LibrarySurface>
  );
}
