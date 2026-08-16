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

export type StatusFilter = "all" | ReadingStatus;

export const statusFilterOptions = [
  { id: "all" as const, label: "すべて" },
  { id: "reading" as const, label: readingStatusLabel.reading },
  { id: "unread" as const, label: readingStatusLabel.unread },
  { id: "finished" as const, label: readingStatusLabel.finished },
];
