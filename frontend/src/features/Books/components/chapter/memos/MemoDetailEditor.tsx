import { Form } from "@heroui/react/form";
import { Label } from "@heroui/react/label";
import type { FormEvent } from "react";
import { useState } from "react";
import { SaveIcon, TrashIcon } from "../../../../../components/icons";
import { QueryErrorAlert } from "../../../../../components/status";
import {
  useDeleteChapterMemoMutation,
  useUpdateChapterMemoMutation,
} from "../../../hooks/useBooksQueries";
import type { BookChapterMemo } from "../../../types/book";
import { RoundActionButton } from "../../RoundActionButton";
import { ChapterFields } from "../shared/ChapterFields";

export function MemoDetailEditor({
  memo,
  userBookId,
}: {
  memo: BookChapterMemo;
  userBookId: string;
}) {
  const updateMemo = useUpdateChapterMemoMutation();
  const deleteMemo = useDeleteChapterMemoMutation();
  const [chapterTitle, setChapterTitle] = useState(memo.chapterTitle ?? "");
  const [chapterOrder, setChapterOrder] = useState(memo.chapterOrder);
  const [memoBody, setMemoBody] = useState(memo.memo ?? "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateMemo.mutate({
      chapterMemoId: memo.chapterMemoId,
      userBookId,
      payload: {
        chapterTitle: chapterTitle.trim() || undefined,
        chapterOrder,
        memo: memoBody.trim() || undefined,
      },
    });
  };

  const handleDelete = () => {
    const label = memo.chapterTitle?.trim() || `章 #${memo.chapterOrder}`;
    const confirmed = window.confirm(`「${label}」のメモを削除しますか？`);
    if (!confirmed) {
      return;
    }
    deleteMemo.mutate({
      chapterMemoId: memo.chapterMemoId,
      userBookId,
    });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="grid gap-2 rounded-md border border-gray-200 p-3 dark:border-gray-800"
      data-memo-detail-form
    >
      <ChapterFields
        chapterTitle={chapterTitle}
        onChapterTitleChange={setChapterTitle}
        chapterOrder={chapterOrder}
        onChapterOrderChange={setChapterOrder}
      />
      <div className="grid gap-1">
        <Label className="text-xs">章メモ</Label>
        <textarea
          value={memoBody}
          onChange={(event) => setMemoBody(event.target.value)}
          rows={6}
          className="min-h-28 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-950"
        />
      </div>
      <QueryErrorAlert
        error={updateMemo.error ?? deleteMemo.error}
        fallback="メモの操作に失敗しました。"
        className="text-left"
      />
      <div className="flex justify-end gap-2">
        <RoundActionButton
          type="button"
          label="メモを削除"
          isPending={deleteMemo.isPending}
          onPress={handleDelete}
          className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-500"
        >
          <TrashIcon className="h-5 w-5" />
        </RoundActionButton>
        <RoundActionButton label="メモを保存" isPending={updateMemo.isPending}>
          <SaveIcon className="h-5 w-5" />
        </RoundActionButton>
      </div>
    </Form>
  );
}
