import { Form } from "@heroui/react/form";
import { Input } from "@heroui/react/input";
import { Label } from "@heroui/react/label";
import { TextField } from "@heroui/react/textfield";
import type { FormEvent } from "react";
import { useState } from "react";
import { SaveIcon } from "../../../../../components/icons";
import { QueryErrorAlert } from "../../../../../components/status";
import { useUpdateBookOutputMutation } from "../../../hooks/useBooksQueries";
import type { BookOutput } from "../../../types/book";
import { RoundActionButton } from "../../RoundActionButton";
import { ChapterFields } from "../shared/ChapterFields";

export function OutputDetailEditor({
  output,
  userBookId,
}: {
  output: BookOutput;
  userBookId: string;
}) {
  const updateOutput = useUpdateBookOutputMutation();
  const [chapterTitle, setChapterTitle] = useState(output.chapterTitle ?? "");
  const [chapterOrder, setChapterOrder] = useState(output.chapterOrder ?? 0);
  const [title, setTitle] = useState(output.title);
  const [body, setBody] = useState(output.body);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateOutput.mutate({
      bookOutputId: output.bookOutputId,
      userBookId,
      payload: {
        chapterTitle: chapterTitle.trim() || undefined,
        chapterOrder,
        title: title.trim(),
        body: body.trim(),
      },
    });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="grid gap-2 rounded-md border border-gray-200 p-3 dark:border-gray-800"
      data-output-detail-form
    >
      <ChapterFields
        chapterTitle={chapterTitle}
        onChapterTitleChange={setChapterTitle}
        chapterOrder={chapterOrder}
        onChapterOrderChange={setChapterOrder}
      />
      <TextField value={title} onChange={setTitle}>
        <Label className="text-xs">タイトル</Label>
        <Input className="text-sm" />
      </TextField>
      <div className="grid gap-1">
        <Label className="text-xs">本文</Label>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={6}
          className="min-h-28 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-950"
        />
      </div>
      <QueryErrorAlert
        error={updateOutput.error}
        fallback="アウトプットの更新に失敗しました。"
        className="text-left"
      />
      <div className="flex justify-end">
        <RoundActionButton
          label="アウトプットを保存"
          isPending={updateOutput.isPending}
        >
          <SaveIcon className="h-5 w-5" />
        </RoundActionButton>
      </div>
    </Form>
  );
}
