import { z } from "zod";
import { instantFromDb, isInstant, type Temporal } from "./instant";

/** Temporal.Instant、または Instant に変換可能な ISO / DB 日時文字列 */
const instantSchema = z.union([
    z.custom<Temporal.Instant>(isInstant),
    z.string().transform((value, ctx): Temporal.Instant => {
        try {
            return instantFromDb(value);
        } catch {
            ctx.addIssue({ code: "custom", message: "invalid instant" });
            return z.NEVER;
        }
    }),
]);

const nullableInstantSchema = z.union([instantSchema, z.null()]);

export { instantSchema, nullableInstantSchema };
