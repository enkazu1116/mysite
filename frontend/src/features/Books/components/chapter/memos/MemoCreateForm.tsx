import { Form } from "@heroui/react/form";
import { Label } from "@heroui/react/label";
import { useState } from "react";
import type { SyntheticEvent } from "react";
import { StickyNotePlusIcon } from "../../../../../components/icons";
import { QueryErrorAlert } from "../../../../../components/status";
import { useCreateChapterMemoMutation } from "../../../hooks/useBooksQueries";
import { RoundActionButton } from "../../RoundActionButton";
import { ChapterFields } from "../shared/ChapterFields";

export function MemoCreateForm({
  userBookId,
  onCreated,
}: {
  userBookId: string;
  onCreated?: (chapterOrder: number) => void;
}) {
  const createMemo = useCreateChapterMemoMutation();
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterOrder, setChapterOrder] = useState(1);
  const [memoBody, setMemoBody] = useState("");

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMemo.mutate(
      {
        userBookId,
        payload: {
          chapterTitle: chapterTitle.trim() || undefined,
          chapterOrder,
          memo: memoBody.trim() || undefined,
        },
      },
      {
        onSuccess: (created) => {
          setChapterTitle("");
          setMemoBody("");
          setChapterOrder((value) => value + 1);
          onCreated?.(created.chapterOrder);
        },
      },
    );
  };

  return (
    <Form onSubmit={handleSubmit} className="grid gap-2">
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
          onChange={(event) => { setMemoBody(event.target.value); }}
          rows={4}
          className="min-h-24 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-950"
        />
      </div>
      <QueryErrorAlert
        error={createMemo.error}
        fallback="メモの追加に失敗しました。"
        className="text-left"
      />
      <div className="flex justify-end">
        <RoundActionButton label="章メモを追加" isPending={createMemo.isPending}>
          <StickyNotePlusIcon />
        </RoundActionButton>
      </div>
    </Form>
  );
}
