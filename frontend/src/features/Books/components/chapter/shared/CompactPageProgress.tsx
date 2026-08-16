import { useState } from "react";
import { useUpdateUserBookMutation } from "../../../hooks/useBooksQueries";
import type { UserBook } from "../../../types/book";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";

export function CompactPageProgress({ userBook }: { userBook: UserBook }) {
  const updateUserBook = useUpdateUserBookMutation(userBook.userId);
  const [pageText, setPageText] = useState(
    userBook.currentPage == null ? "" : String(userBook.currentPage),
  );

  const saveIfChanged = () => {
    const trimmed = pageText.trim();
    const next =
      trimmed === ""
        ? null
        : Number.parseInt(trimmed.replace(/\D/g, "").slice(0, 4), 10);
    const normalized =
      next == null || !Number.isFinite(next) ? null : Math.min(9999, Math.max(0, next));
    const previous = userBook.currentPage ?? null;
    if (normalized === previous) {
      setPageText(normalized == null ? "" : String(normalized));
      return;
    }
    setPageText(normalized == null ? "" : String(normalized));
    updateUserBook.mutate({
      userBookId: userBook.userBookId,
      payload: { currentPage: normalized },
    });
  };

  return (
    <div
      className="flex items-center gap-1.5"
      data-progress-editor
    >
      <label className="text-[11px] text-gray-500" htmlFor={`page-${userBook.userBookId}`}>
        ページ
      </label>
      <input
        id={`page-${userBook.userBookId}`}
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={pageText}
        aria-label="現在ページ"
        data-current-page-field
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
          setPageText(digits);
        }}
        onBlur={saveIfChanged}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className="h-7 w-14 rounded border border-gray-300 bg-transparent px-1.5 text-center text-xs outline-none focus:border-gray-500 dark:border-gray-700"
      />
      {userBook.book.pageCount != null ? (
        <span className="text-[11px] text-gray-500">
          / {userBook.book.pageCount}
        </span>
      ) : null}
      {updateUserBook.error ? (
        <span className="text-[11px] text-red-600">
          {getErrorMessage(updateUserBook.error, "保存失敗")}
        </span>
      ) : null}
    </div>
  );
}
