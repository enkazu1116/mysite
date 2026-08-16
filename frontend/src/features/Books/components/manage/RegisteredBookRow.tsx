import { Button } from "@heroui/react/button";
import { Chip } from "@heroui/react/chip";
import { Link as RouterLink } from "react-router";
import {
  ChevronDownIcon,
  NotebookIcon,
  StickyNotePlusIcon,
  TrashIcon,
} from "../../../../components/icons";
import {
  ReadingStatusSelect,
  readingStatusLabel,
  readingStatusToneClass,
} from "../ReadingStatusSelect";
import { useUpdateUserBookMutation } from "../../hooks/useBooksQueries";
import type { ReadingStatus, UserBook } from "../../types/book";
import { QueryErrorAlert } from "../../../../components/status";

export function RegisteredBookRow({
  book,
  userId,
  canEdit,
  isExpanded,
  onToggle,
  onDelete,
  isDeleting,
}: {
  book: UserBook;
  userId: string;
  canEdit: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const updateUserBook = useUpdateUserBookMutation(book.userId);
  const authors =
    book.book.authors.length > 0 ? book.book.authors.join(", ") : "著者不明";

  const handleStatusChange = (next: ReadingStatus) => {
    updateUserBook.mutate({
      userBookId: book.userBookId,
      payload: { status: next },
    });
  };

  return (
    <div
      data-book-accordion={book.userBookId}
      data-expanded={isExpanded ? "true" : "false"}
      className="border-b border-[var(--lib-line)] last:border-b-0"
    >
      <div className="flex items-center gap-1.5 px-1.5 py-1.5">
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-2 bg-transparent px-1 py-1 text-left"
        >
          <ChevronDownIcon
            className={`h-4 w-4 shrink-0 text-[var(--lib-ink-muted)] transition-transform ${
              isExpanded ? "rotate-0" : "-rotate-90"
            }`}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium text-[var(--lib-ink)]">
              {book.book.title}
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-[var(--lib-ink-muted)]">
              {authors}
            </span>
          </span>
          {!isExpanded && (
            <span className="hidden shrink-0 sm:inline-flex">
              <Chip
                size="sm"
                className={readingStatusToneClass[book.status]}
              >
                {readingStatusLabel[book.status]}
              </Chip>
            </span>
          )}
        </button>
        {canEdit && (
          <Button
            size="sm"
            variant="danger"
            isIconOnly
            aria-label="削除"
            isPending={isDeleting}
            onPress={onDelete}
            className="shrink-0"
          >
            <TrashIcon />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div
          data-book-accordion-detail
          className="space-y-3 border-t border-[var(--lib-line)] bg-[var(--lib-paper)]/70 px-3 py-3"
        >
          {canEdit ? (
            <div data-status-only-editor className="max-w-xs">
              <ReadingStatusSelect
                value={book.status}
                onChange={handleStatusChange}
                isDisabled={updateUserBook.isPending}
              />
              <QueryErrorAlert
                error={updateUserBook.error}
                fallback="読書状態の保存に失敗しました。"
                className="mt-2 text-left"
              />
            </div>
          ) : (
            <Chip
              size="sm"
              data-status-chip
              className={readingStatusToneClass[book.status]}
            >
              {readingStatusLabel[book.status]}
            </Chip>
          )}

          <div className="flex flex-wrap gap-2">
            <RouterLink
              to={`/users/${userId}/books/${book.userBookId}/memos`}
              data-manage-link="memos"
              aria-label="メモページへ"
              title="メモページへ"
              className="lib-cta h-9 px-3 text-xs"
            >
              <StickyNotePlusIcon className="h-4 w-4" />
              メモ
            </RouterLink>
            <RouterLink
              to={`/users/${userId}/books/${book.userBookId}/outputs`}
              data-manage-link="outputs"
              aria-label="アウトプットページへ"
              title="アウトプットページへ"
              className="lib-cta h-9 px-3 text-xs"
            >
              <NotebookIcon className="h-4 w-4" />
              アウトプット
            </RouterLink>
          </div>
        </div>
      )}
    </div>
  );
}
