import { Label } from "@heroui/react/label";
import { ListBox } from "@heroui/react/list-box";
import { Select } from "@heroui/react/select";
import type { Key } from "react";
import type { ReadingStatus } from "../types/book";
import {
  readingStatusLabel,
  readingStatusToneClass,
} from "./readingStatus";

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
      value={value}
      onChange={(key: Key | null) => {
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
