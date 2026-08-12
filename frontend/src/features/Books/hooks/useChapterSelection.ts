import { useEffect, useMemo, useState } from "react";
import { groupByChapterOrder } from "../components/chapter/shared/groupByChapterOrder";

export function useChapterSelection<T extends { chapterOrder: number }>(
  items: T[],
) {
  const [selectedChapterOrder, setSelectedChapterOrder] = useState<
    number | null
  >(null);
  const groups = useMemo(() => groupByChapterOrder(items), [items]);
  const selectedItems =
    selectedChapterOrder == null
      ? []
      : (groups.find((g) => g.chapterOrder === selectedChapterOrder)?.items ??
        []);

  useEffect(() => {
    if (
      selectedChapterOrder != null &&
      groups.some((g) => g.chapterOrder === selectedChapterOrder)
    ) {
      return;
    }
    setSelectedChapterOrder(groups[0]?.chapterOrder ?? null);
  }, [groups, selectedChapterOrder]);

  return {
    groups,
    selectedChapterOrder,
    setSelectedChapterOrder,
    selectedItems,
  };
}
