import { Input } from "@heroui/react/input";
import { Label } from "@heroui/react/label";
import { NumberField } from "@heroui/react/number-field";
import { TextField } from "@heroui/react/textfield";

export function ChapterFields({
  chapterTitle,
  onChapterTitleChange,
  chapterOrder,
  onChapterOrderChange,
}: {
  chapterTitle: string;
  onChapterTitleChange: (value: string) => void;
  chapterOrder: number;
  onChapterOrderChange: (value: number) => void;
}) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[1fr_5.5rem]">
      <TextField value={chapterTitle} onChange={onChapterTitleChange}>
        <Label className="text-xs">章タイトル</Label>
        <Input placeholder="章タイトル" className="text-sm" />
      </TextField>
      <NumberField
        value={chapterOrder}
        minValue={0}
        onChange={(value) => {
          if (Number.isFinite(value) && value >= 0) {
            onChapterOrderChange(value);
          }
        }}
      >
        <Label className="text-xs">章順</Label>
        <NumberField.Group className="!grid-cols-[minmax(0,1fr)] [grid-template-columns:minmax(0,1fr)]">
          <NumberField.Input />
        </NumberField.Group>
      </NumberField>
    </div>
  );
}
