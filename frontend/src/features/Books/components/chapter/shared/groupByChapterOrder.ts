export function groupByChapterOrder<T extends { chapterOrder: number }>(
  items: T[],
): Array<{ chapterOrder: number; items: T[] }> {
  const map = new Map<number, T[]>();
  for (const item of items) {
    const list = map.get(item.chapterOrder) ?? [];
    list.push(item);
    map.set(item.chapterOrder, list);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([chapterOrder, groupItems]) => ({
      chapterOrder,
      items: groupItems,
    }));
}
