import {
  Alert,
  Form,
  Input,
  Label,
  NumberField,
  TextField,
} from "@heroui/react";
import type { FormEvent } from "react";
import { PenSquarePlusIcon } from "../../../../../components/icons";
import { getErrorMessage } from "../../../../../utils/getErrorMessage";
import { RoundActionButton } from "../../RoundActionButton";

export function OutputCreateForm({
  chapterTitle,
  setChapterTitle,
  chapterOrder,
  setChapterOrder,
  title,
  setTitle,
  body,
  setBody,
  onSubmit,
  isPending,
  error,
}: {
  chapterTitle: string;
  setChapterTitle: (value: string) => void;
  chapterOrder: number;
  setChapterOrder: (value: number) => void;
  title: string;
  setTitle: (value: string) => void;
  body: string;
  setBody: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
  error?: unknown;
}) {
  return (
    <Form onSubmit={onSubmit} className="grid gap-2">
      <div className="grid gap-1.5 sm:grid-cols-[1fr_5.5rem]">
        <TextField value={chapterTitle} onChange={setChapterTitle}>
          <Label className="text-xs">章タイトル</Label>
          <Input placeholder="章タイトル" className="text-sm" />
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
      {error ? (
        <Alert status="danger" className="text-left">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>エラー</Alert.Title>
            <Alert.Description>
              {getErrorMessage(error, "アウトプットの追加に失敗しました。")}
            </Alert.Description>
          </Alert.Content>
        </Alert>
      ) : null}
      <div className="flex justify-end">
        <RoundActionButton label="アウトプットを追加" isPending={isPending}>
          <PenSquarePlusIcon />
        </RoundActionButton>
      </div>
    </Form>
  );
}
