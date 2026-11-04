import { drizzle } from "drizzle-orm/d1";

/**
 * D1 から Drizzle クライアントを作成する
 */
export function createDb(database: Parameters<typeof drizzle>[0]) {
    return drizzle(database);
}

export type AppDatabase = ReturnType<typeof createDb>;
