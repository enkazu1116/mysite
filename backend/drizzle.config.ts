/// <reference types="bun" />
import { defineConfig } from "drizzle-kit";

// drizzle-kit は CJS で読み込むため process.env のみ。
// ローカルは Infisical（`bun run db:*`）または環境変数を直接渡す。
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) {
    throw new Error(
        "TURSO_DATABASE_URL / TURSO_AUTH_TOKEN が未設定です。Infisical 経由の `bun run db:push` か、環境変数を設定して実行してください。",
    );
}

export default defineConfig({
    out: "./drizzle",
    schema: [
        "./src/infrastructure/drizzle/schema/users.ts",
        "./src/infrastructure/drizzle/schema/skills.ts",
        "./src/infrastructure/drizzle/schema/books.ts",
    ],
    dialect: "turso",
    dbCredentials: {
        url,
        authToken,
    },
});
