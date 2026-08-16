import { useMemo, useState } from "react";
import { groupByChapterOrder } from "../components/chapter/shared/groupByChapterOrder";

export function useChapterSelection<T extends { chapterOrder: number }>(
  items: T[],
) {
  const [selectedChapterOrder, setSelectedChapterOrder] = useState<
    number | null
  >(null);
  const groups = useMemo(() => groupByChapterOrder(items), [items]);
  const resolvedChapterOrder =
    selectedChapterOrder != null &&
    groups.some((group) => group.chapterOrder === selectedChapterOrder)
      ? selectedChapterOrder
      : (groups[0]?.chapterOrder ?? null);
  const selectedItems =
    resolvedChapterOrder == null
      ? []
      : (groups.find((group) => group.chapterOrder === resolvedChapterOrder)
          ?.items ?? []);

  return {
    groups,
    selectedChapterOrder: resolvedChapterOrder,
    setSelectedChapterOrder,
    selectedItems,
  };
}
