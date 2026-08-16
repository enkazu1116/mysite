import { Form } from "@heroui/react/form";
import { Input } from "@heroui/react/input";
import { Label } from "@heroui/react/label";
import { TextField } from "@heroui/react/textfield";
import { useState } from "react";
import type { FormEvent } from "react";
import { PenSquarePlusIcon } from "../../../../../components/icons";
import { QueryErrorAlert } from "../../../../../components/status";
import { useCreateBookOutputMutation } from "../../../hooks/useBooksQueries";
import { RoundActionButton } from "../../RoundActionButton";
import { ChapterFields } from "../shared/ChapterFields";

export function OutputCreateForm({
  userBookId,
  onCreated,
}: {
  userBookId: string;
  onCreated?: (chapterOrder: number) => void;
}) {
  const createOutput = useCreateBookOutputMutation();
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterOrder, setChapterOrder] = useState(1);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createOutput.mutate(
      {
        userBookId,
        payload: {
          chapterTitle: chapterTitle.trim() || undefined,
          chapterOrder,
          title: title.trim(),
          body: body.trim(),
        },
      },
      {
        onSuccess: (created) => {
          setChapterTitle("");
          setTitle("");
          setBody("");
          setChapterOrder((value) => value + 1);
          onCreated?.(created.chapterOrder ?? chapterOrder);
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
      <TextField value={title} onChange={setTitle} isRequired>
        <Label className="text-xs">タイトル</Label>
        <Input placeholder="アウトプットタイトル" className="text-sm" />
      </TextField>
      <div className="grid gap-1">
        <Label className="text-xs">本文</Label>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
          rows={4}
          className="min-h-24 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-950"
        />
      </div>
      <QueryErrorAlert
        error={createOutput.error}
        fallback="アウトプットの追加に失敗しました。"
        className="text-left"
      />
      <div className="flex justify-end">
        <RoundActionButton
          label="アウトプットを追加"
          isPending={createOutput.isPending}
        >
          <PenSquarePlusIcon />
        </RoundActionButton>
      </div>
    </Form>
  );
}
