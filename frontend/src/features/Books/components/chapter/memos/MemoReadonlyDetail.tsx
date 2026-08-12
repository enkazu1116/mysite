import { Chip } from "@heroui/react";
import type { BookChapterMemo } from "../../../types/book";

export function MemoReadonlyDetail({ memo }: { memo: BookChapterMemo }) {
  return (
    <article
      className="grid gap-2 rounded-md border border-gray-200 p-3 dark:border-gray-800"
      data-memo-detail-view
    >
      <div className="flex flex-wrap items-center gap-2">
        <Chip size="sm">#{memo.chapterOrder}</Chip>
        <h3 className="m-0 text-sm font-semibold">
          {memo.chapterTitle || "章タイトルなし"}
        </h3>
      </div>
      <p className="m-0 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-200">
        {memo.memo || "メモはありません。"}
      </p>
    </article>
  );
}
