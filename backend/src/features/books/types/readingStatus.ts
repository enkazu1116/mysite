const readingStatuses = ["unread", "reading", "finished"] as const;

type ReadingStatus = (typeof readingStatuses)[number];

export { readingStatuses };
export type { ReadingStatus };
