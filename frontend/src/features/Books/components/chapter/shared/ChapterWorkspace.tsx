import type { ReactNode } from "react";
import { Spinner } from "@heroui/react/spinner";
import { ChapterSelectDropdown } from "./ChapterSelectDropdown";

export function ChapterWorkspace<T>({
  groups,
  selectedChapterOrder,
  onSelect,
  emptySelectLabel,
  isLoading,
  createSlot,
  detailSlot,
}: {
  groups: Array<{ chapterOrder: number; items: T[] }>;
  selectedChapterOrder: number | null;
  onSelect: (chapterOrder: number) => void;
  emptySelectLabel: string;
  isLoading?: boolean;
  createSlot?: ReactNode;
  detailSlot: ReactNode;
}) {
  return (
    <div className="grid gap-5">
      <section className="text-left" data-chapter-list-section>
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <ChapterSelectDropdown
            emptyLabel={emptySelectLabel}
            selectedChapterOrder={selectedChapterOrder}
            onSelect={onSelect}
            groups={groups}
          />
        )}
      </section>
      {createSlot}
      {detailSlot}
    </div>
  );
}
