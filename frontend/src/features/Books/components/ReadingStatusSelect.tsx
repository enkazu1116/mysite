import { Label, ListBox, Select } from "@heroui/react";
import type { Key } from "react";
import type { ReadingStatus } from "../types/book";

export const readingStatusLabel: Record<ReadingStatus, string> = {
  unread: "未読",
  reading: "読書中",
  finished: "読了",
};

/** Chip / Select 用の状態別カラー */
export const readingStatusToneClass: Record<ReadingStatus, string> = {
  unread:
    "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
  reading:
    "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300",
  finished:
    "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

const statusOptions = [
  { id: "unread", label: readingStatusLabel.unread },
  { id: "reading", label: readingStatusLabel.reading },
  { id: "finished", label: readingStatusLabel.finished },
] satisfies { id: ReadingStatus; label: string }[];

type Props = {
  label?: string;
  value: ReadingStatus;
  onChange: (status: ReadingStatus) => void;
  className?: string;
  isDisabled?: boolean;
};

export function ReadingStatusSelect({
  label = "読書状態",
  value,
  onChange,
  className,
  isDisabled,
}: Props) {
  return (
    <Select
      selectedKey={value}
      onSelectionChange={(key: Key | null) => {
        if (key === "unread" || key === "reading" || key === "finished") {
          onChange(key);
        }
      }}
      className={className}
      isDisabled={isDisabled}
    >
      <Label>{label}</Label>
      <Select.Trigger className={readingStatusToneClass[value]}>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {statusOptions.map((item) => (
            <ListBox.Item key={item.id} id={item.id} textValue={item.label}>
              <span
                className={`inline-flex rounded px-1.5 py-0.5 text-xs ${readingStatusToneClass[item.id]}`}
              >
                {item.label}
              </span>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
