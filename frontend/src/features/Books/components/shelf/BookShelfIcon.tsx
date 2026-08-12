import { motion, useReducedMotion } from "motion/react";
import { Link as RouterLink } from "react-router";
import type { UserBook } from "../../types/book";
import { BookCover } from "./BookCover";

export function BookShelfIcon({
  userBook,
  itemIndex,
}: {
  userBook: UserBook;
  itemIndex: number;
}) {
  const reduceMotion = useReducedMotion();
  const authors =
    userBook.book.authors.length > 0
      ? userBook.book.authors.join(", ")
      : "著者不明";
  const tooltip = `${userBook.book.title}\n${authors}${
    userBook.currentPage != null ? `\n${userBook.currentPage}ページ` : ""
  }`;
  const colInRow = itemIndex % 5;
  const tooltipPositionClass =
    colInRow === 0
      ? "left-0"
      : colInRow === 4
        ? "right-0 left-auto"
        : "left-1/2 -translate-x-1/2";

  return (
    <motion.div
      className="relative z-0 min-w-0"
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <RouterLink
        to={`/books/${userBook.userBookId}`}
        title={tooltip}
        aria-label={userBook.book.title}
        className="group relative z-0 block aspect-[2/3] w-full min-w-0 overflow-visible rounded-sm border border-[var(--lib-line)] bg-[var(--lib-paper-elevated)] text-left shadow-sm outline-none focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-[var(--lib-accent)] no-underline"
      >
        <BookCover userBook={userBook} />
        <span
          className={`pointer-events-none absolute top-full z-10 mt-1.5 hidden w-44 rounded-[var(--lib-radius)] border border-[var(--lib-line)] bg-[var(--lib-paper-elevated)] p-1.5 text-[11px] leading-4 text-[var(--lib-ink)] shadow-lg group-hover:block group-focus-visible:block ${tooltipPositionClass}`}
        >
          <span className="line-clamp-2 font-semibold">{userBook.book.title}</span>
          <span className="mt-0.5 block line-clamp-1 text-[var(--lib-ink-muted)]">
            {authors}
          </span>
        </span>
      </RouterLink>
    </motion.div>
  );
}
