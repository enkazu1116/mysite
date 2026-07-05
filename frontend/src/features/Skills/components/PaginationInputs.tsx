import { Label, ListBox, NumberField, Select } from "@heroui/react";
import type { Key } from "react";

const PAGE_SIZE_OPTIONS = [5, 10, 15] as const;

type Props = {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function PaginationInputs({
  pageIndex,
  pageSize,
  pageCount,
  onPageIndexChange,
  onPageSizeChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <NumberField
        value={pageIndex + 1}
        minValue={1}
        maxValue={Math.max(pageCount, 1)}
        onChange={(value) => {
          if (value >= 1 && value <= pageCount) {
            onPageIndexChange(value - 1);
          }
        }}
        className="w-28"
      >
        <Label>ページ移動</Label>
        <NumberField.Group>
          <NumberField.Input className="text-right" />
        </NumberField.Group>
      </NumberField>

      <Select
        selectedKey={String(pageSize)}
        onSelectionChange={(key: Key | null) => {
          if (key != null) {
            onPageSizeChange(Number(key));
          }
        }}
        className="w-32"
      >
        <Label>表示件数</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {PAGE_SIZE_OPTIONS.map((item) => (
              <ListBox.Item key={item} id={String(item)} textValue={`${item}件`}>
                {item}件
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
