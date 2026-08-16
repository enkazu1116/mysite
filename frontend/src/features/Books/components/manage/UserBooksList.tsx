import type { Key } from "react";
import { Chip } from "@heroui/react/chip";
import { ListBox } from "@heroui/react/list-box";
import { Select } from "@heroui/react/select";
import { Spinner } from "@heroui/react/spinner";
import {
  PaginationControls,
  PaginationInputs,
  PaginationSummary,
} from "../../../../components/pagination";
import {
  readingStatusLabel,
  readingStatusToneClass,
} from "../ReadingStatusSelect";
import type { ReadingStatus, UserBook } from "../../types/book";
import { RegisteredBookRow } from "./RegisteredBookRow";

export type StatusFilter = "all" | ReadingStatus;

export const statusFilterOptions = [
  { id: "all" as const, label: "すべて" },
  { id: "reading" as const, label: readingStatusLabel.reading },
  { id: "unread" as const, label: readingStatusLabel.unread },
  { id: "finished" as const, label: readingStatusLabel.finished },
];

type UserBooksListProps = {
  userId: string;
  canEdit: boolean;
  isLoading: boolean;
  totalCount: number;
  filteredBooks: UserBook[];
  visibleBooks: UserBook[];
  statusFilter: StatusFilter;
  onStatusFilterChange: (next: StatusFilter) => void;
  expandedUserBookId: string | null;
  onToggleExpand: (userBookId: string) => void;
  onDelete: (book: UserBook) => void;
  isDeletingUserBookId: string | null;
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  isPaging: boolean;
  onPageIndexChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
};

export function UserBooksList({
  userId,
  canEdit,
  isLoading,
  totalCount,
  filteredBooks,
  visibleBooks,
  statusFilter,
  onStatusFilterChange,
  expandedUserBookId,
  onToggleExpand,
  onDelete,
  isDeletingUserBookId,
  pageIndex,
  pageSize,
  pageCount,
  isPaging,
  onPageIndexChange,
  onPageSizeChange,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
}: UserBooksListProps) {
  return (
    <div data-books-manage-layout className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display m-0 text-base font-semibold text-[var(--lib-ink)]">
          登録済み本
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            selectedKey={statusFilter}
            onSelectionChange={(key: Key | null) => {
              if (
                key === "all" ||
                key === "reading" ||
                key === "unread" ||
                key === "finished"
              ) {
                onStatusFilterChange(key);
              }
            }}
            className="w-auto"
            aria-label="状態で絞り込み"
            data-status-filter
          >
            <Select.Trigger
              className={`flex h-6 min-h-6 items-center gap-1 !pe-1.5 px-2 py-0 text-xs leading-none ${
                statusFilter === "all"
                  ? ""
                  : readingStatusToneClass[statusFilter]
              }`}
            >
              <Select.Value className="min-w-0 flex-1 truncate leading-none" />
              <Select.Indicator className="!static !inset-auto relative size-3 shrink-0 translate-y-0" />
            </Select.Trigger>
            <Select.Popover className="min-w-[7rem]">
              <ListBox>
                {statusFilterOptions.map((item) => (
                  <ListBox.Item
                    key={item.id}
                    id={item.id}
                    textValue={item.label}
                    className="text-xs"
                  >
                    {item.id === "all" ? (
                      item.label
                    ) : (
                      <span
                        className={`inline-flex rounded px-1.5 py-0.5 text-xs ${readingStatusToneClass[item.id]}`}
                      >
                        {item.label}
                      </span>
                    )}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <Chip size="sm">
            {statusFilter === "all"
              ? `${totalCount}冊`
              : `${filteredBooks.length}/${totalCount}冊`}
          </Chip>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 py-3 text-[var(--lib-ink-muted)]">
          <Spinner size="sm" />
          <span className="text-xs">取得中...</span>
        </div>
      )}
      {!isLoading && totalCount === 0 && (
        <p className="m-0 border border-dashed border-[var(--lib-line)] p-3 text-xs text-[var(--lib-ink-muted)]">
          登録済みの本はありません。
        </p>
      )}
      {!isLoading && totalCount > 0 && filteredBooks.length === 0 && (
        <p className="m-0 border border-dashed border-[var(--lib-line)] p-3 text-xs text-[var(--lib-ink-muted)]">
          この状態の本はありません。
        </p>
      )}
      {filteredBooks.length > 0 && (
        <>
          <div
            data-registered-accordion-list
            className="lib-panel max-h-[36rem] overflow-y-auto"
          >
            {visibleBooks.map((book) => (
              <RegisteredBookRow
                key={book.userBookId}
                book={book}
                userId={userId}
                canEdit={canEdit}
                isExpanded={expandedUserBookId === book.userBookId}
                onToggle={() => onToggleExpand(book.userBookId)}
                onDelete={() => onDelete(book)}
                isDeleting={isDeletingUserBookId === book.userBookId}
              />
            ))}
          </div>
          <div
            data-books-pagination
            className="mt-3 rounded-[var(--lib-radius)] border border-[var(--lib-line)] bg-[var(--lib-paper-elevated)] p-2"
          >
            <PaginationSummary
              pageIndex={pageIndex}
              pageCount={pageCount}
              pageSize={pageSize}
              rowLength={filteredBooks.length}
            />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <PaginationInputs
                pageIndex={pageIndex}
                pageSize={pageSize}
                pageCount={pageCount}
                onPageIndexChange={onPageIndexChange}
                onPageSizeChange={onPageSizeChange}
              />
              <PaginationControls
                isPending={isPaging}
                canPreviousPage={pageIndex > 0}
                canNextPage={pageIndex < pageCount - 1}
                onFirstPage={onFirstPage}
                onPreviousPage={onPreviousPage}
                onNextPage={onNextPage}
                onLastPage={onLastPage}
              />
              {isPaging && (
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--lib-ink-muted)]">
                  <Spinner size="sm" />
                  ページ切替中...
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
