import { drizzle } from "drizzle-orm/d1";

export function createDb(database: Parameters<typeof drizzle>[0]) {
    return drizzle(database);
}

export function createDbFromEnv(env: AppBindings | undefined): AppDatabase {
    if (!env?.DB) {
        return undefined as unknown as AppDatabase;
    }
    return createDb(env.DB);
}

export type AppDatabase = ReturnType<typeof createDb>;

export type AppBindings = {
    DB: Parameters<typeof createDb>[0];
    BOOKS_API?: string;
};
