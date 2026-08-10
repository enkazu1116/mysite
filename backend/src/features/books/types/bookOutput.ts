import type { Temporal } from "../../../util/temporal/instant";

/**
 * 本のアウトプット内容
 * メモをもとに、問い → 検証 → 結論もしくは結論のみ形式で記載されたもの
 */
type BookOutput = {
    bookOutputId: string;
    userBookId: string;
    title: string;
    body: string;
    createdAt: Temporal.Instant;
    updatedAt: Temporal.Instant;
};

export type { BookOutput };
