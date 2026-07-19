import { Temporal } from "temporal-polyfill";

export { Temporal };

/** 現在時刻の Instant */
export function nowInstant(): Temporal.Instant {
    return Temporal.Now.instant();
}

/** Instant → DB / JSON 用 ISO-8601 文字列 */
export function instantToIso(value: Temporal.Instant): string {
    return value.toString();
}

/**
 * DB 文字列 → Instant。
 * ISO-8601 に加え、SQLite CURRENT_TIMESTAMP（`YYYY-MM-DD HH:MM:SS`）も受け付ける。
 */
export function instantFromDb(value: string): Temporal.Instant {
    try {
        return Temporal.Instant.from(value);
    } catch {
        const normalized =
            value.includes("T") || /[zZ]|[+-]\d{2}:\d{2}$/.test(value)
                ? value
                : `${value.replace(" ", "T")}Z`;
        const ms = Date.parse(normalized);
        if (Number.isNaN(ms)) {
            throw new Error(`Invalid datetime: ${value}`);
        }
        return Temporal.Instant.fromEpochMilliseconds(ms);
    }
}

export function isInstant(value: unknown): value is Temporal.Instant {
    return value instanceof Temporal.Instant;
}
