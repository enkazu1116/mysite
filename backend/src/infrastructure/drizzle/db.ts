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
    JWT_SECRET?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    ADMIN_GOOGLE_SUBS?: string;
    ADMIN_GITHUB_IDS?: string;
    FRONTEND_ORIGIN?: string;
};
