import { z } from "zod";

type ISO8601DateTime = string;

const iso8601DateTimeSchema = z.iso.datetime();

export type { ISO8601DateTime };
export { iso8601DateTimeSchema };
