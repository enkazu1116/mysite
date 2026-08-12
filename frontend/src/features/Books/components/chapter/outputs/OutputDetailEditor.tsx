import {
  Alert,
  Form,
  Input,
  Label,
  NumberField,
  TextField,
} from "@heroui/react";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { SaveIcon } from "../../../../../components/icons";
import { useUpdateBookOutputMutation } from "../../../hooks/useBooksQueries";
import type { BookOutput } from "../../../types/book";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";
import { RoundActionButton } from "../../RoundActionButton";

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

  useEffect(() => {
    setChapterTitle(output.chapterTitle ?? "");
    setChapterOrder(output.chapterOrder ?? 0);
    setTitle(output.title);
    setBody(output.body);
  }, [output]);

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
      <div className="grid gap-1.5 sm:grid-cols-[1fr_5.5rem]">
        <TextField value={chapterTitle} onChange={setChapterTitle}>
          <Label className="text-xs">章タイトル</Label>
          <Input className="text-sm" />
        </TextField>
        <NumberField
          value={chapterOrder}
          minValue={0}
          onChange={(value) => {
            if (Number.isFinite(value) && value >= 0) {
              setChapterOrder(value);
            }
          }}
        >
          <Label className="text-xs">章順</Label>
          <NumberField.Group className="!grid-cols-[minmax(0,1fr)] [grid-template-columns:minmax(0,1fr)]">
            <NumberField.Input />
          </NumberField.Group>
        </NumberField>
      </div>
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
      {updateOutput.error && (
        <Alert status="danger" className="text-left">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>保存エラー</Alert.Title>
            <Alert.Description>
              {getErrorMessage(
                updateOutput.error,
                "アウトプットの更新に失敗しました。",
              )}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      )}
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
