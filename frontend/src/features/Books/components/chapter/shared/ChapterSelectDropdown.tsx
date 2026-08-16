import { ListBox } from "@heroui/react/list-box";
import { Select } from "@heroui/react/select";
import type { Key } from "react";

export function ChapterSelectDropdown({
  groups,
  selectedChapterOrder,
  onSelect,
  emptyLabel,
}: {
  groups: Array<{ chapterOrder: number; items: readonly unknown[] }>;
  selectedChapterOrder: number | null;
  onSelect: (chapterOrder: number) => void;
  emptyLabel: string;
}) {
  if (groups.length === 0) {
    return (
      <p className="m-0 text-xs text-gray-500" data-chapter-select-empty>
        {emptyLabel}
      </p>
    );
  }

  return (
    <div
      className="inline-flex flex-col items-start gap-0.5"
      data-chapter-select-dropdown
    >
      <span className="text-[11px] text-gray-600 dark:text-gray-400">
        章選択
      </span>
      <Select
        value={
          selectedChapterOrder == null ? null : String(selectedChapterOrder)
        }
        onChange={(key: Key | null) => {
          if (key == null) {
            return;
          }
          const order = Number(key);
          if (Number.isFinite(order)) {
            onSelect(order);
          }
        }}
        aria-label="章選択"
        className="w-16"
        data-chapter-select-control
      >
        <Select.Trigger className="relative flex h-7 min-h-7 w-16 items-center gap-0.5 !pe-1.5 px-1.5 text-xs leading-none">
          <Select.Value className="flex h-full min-w-0 flex-1 items-center justify-center text-center leading-none" />
          <Select.Indicator className="!static !inset-auto relative flex size-3.5 shrink-0 translate-y-0 items-center justify-center self-center text-current" />
        </Select.Trigger>
        <Select.Popover className="w-20 min-w-20">
          <ListBox>
            {groups.map((group) => {
              const label = String(group.chapterOrder);
              return (
                <ListBox.Item
                  key={String(group.chapterOrder)}
                  id={String(group.chapterOrder)}
                  textValue={label}
                  className="!ps-7 !pe-2 flex h-7 items-center justify-center text-xs leading-none"
                >
                  <ListBox.ItemIndicator className="!start-2 !end-auto absolute top-1/2 flex size-3.5 -translate-y-1/2 items-center justify-center text-green-600 dark:text-green-500" />
                  <span className="flex w-full items-center justify-center text-center leading-none">
                    {label}
                  </span>
                </ListBox.Item>
              );
            })}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
