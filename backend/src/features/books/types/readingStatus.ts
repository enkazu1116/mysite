/**
 * 読書ステータス
 */
const readingStatuses = ["unread", "reading", "finished"] as const;

// 読書ステータスの配列の要素型をユニオン定義
type ReadingStatus = (typeof readingStatuses)[number];

export { readingStatuses };
export type { ReadingStatus };
