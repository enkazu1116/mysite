/// <reference types="bun" />
import { defineConfig } from "drizzle-kit";

// drizzle-kit は CJS で読み込むため process.env のみ。
// 開発は Infisical（`bun run db:*`）。CI は Secrets Action 注入後に `db:push:ci`。
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) {
    throw new Error(
        "TURSO_DATABASE_URL / TURSO_AUTH_TOKEN が未設定です。Infisical 経由の `bun run db:push`、または CI では Infisical Secrets Action 後に `db:push:ci` を実行してください。",
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
