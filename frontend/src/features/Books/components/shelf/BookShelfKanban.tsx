import { Chip } from "@heroui/react/chip";
import {
  readingStatusLabel,
  readingStatusToneClass,
} from "../ReadingStatusSelect";
import type { ReadingStatus, UserBook } from "../../types/book";
import { BookShelfIcon } from "./BookShelfIcon";

const statusColumns = [
  { id: "unread", label: readingStatusLabel.unread },
  { id: "reading", label: readingStatusLabel.reading },
  { id: "finished", label: readingStatusLabel.finished },
] satisfies { id: ReadingStatus; label: string }[];

function publisherKey(book: UserBook) {
  const publisher = book.book.publisher?.trim();
  return publisher && publisher.length > 0 ? publisher : "出版社不明";
}

function sortByPublisherThenUpdatedAt(books: UserBook[]) {
  return books.toSorted((a, b) => {
    const byPublisher = publisherKey(a).localeCompare(publisherKey(b), "ja");
    if (byPublisher !== 0) {
      return byPublisher;
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function groupByStatus(books: UserBook[]) {
  const grouped: Record<ReadingStatus, UserBook[]> = {
    unread: [],
    reading: [],
    finished: [],
  };
  for (const book of books) {
    grouped[book.status].push(book);
  }
  return grouped;
}

export function BookShelfKanban({ books }: { books: UserBook[] }) {
  const grouped = groupByStatus(books);

  return (
    <div className="grid min-w-0 gap-8 md:grid-cols-3 md:gap-6">
      {statusColumns.map((column) => {
        const columnBooks = sortByPublisherThenUpdatedAt(grouped[column.id]);

        return (
          <section key={column.id} className="min-w-0 text-left">
            <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-[var(--lib-line)] pb-2">
              <h3
                className={`font-display m-0 rounded-[var(--lib-radius)] px-1.5 py-0.5 text-base font-semibold ${readingStatusToneClass[column.id]}`}
              >
                {column.label}
              </h3>
              <Chip size="sm" className={readingStatusToneClass[column.id]}>
                {columnBooks.length}
              </Chip>
            </div>
            {columnBooks.length === 0 ? (
              <p className="m-0 border border-dashed border-[var(--lib-line)] px-2 py-6 text-center text-xs text-[var(--lib-ink-muted)]">
                本はありません
              </p>
            ) : (
              <div className="relative grid min-h-24 grid-cols-5 justify-items-stretch gap-1.5 overflow-visible pb-3">
                {columnBooks.map((book, itemIndex) => (
                  <BookShelfIcon
                    key={book.userBookId}
                    userBook={book}
                    itemIndex={itemIndex}
                  />
                ))}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 rounded-sm bg-[var(--lib-shelf)] shadow-[0_2px_0_rgb(0_0_0_/_0.12)]"
                />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
