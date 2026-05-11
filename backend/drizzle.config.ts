import { defineConfig } from "drizzle-kit";

// drizzle-kit は CJS で読み込むため process.env のみ。秘匿値は Infisical に置き、
// `bun run db:push` 等（infisical run 経由）で環境変数が注入される。
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) {
    throw new Error(
        "TURSO_DATABASE_URL / TURSO_AUTH_TOKEN が未設定です。`bun run db:push` のように Infisical 経由で実行してください。",
    );
}

export default defineConfig({
    out: "./drizzle",
    schema: "./src/infrastructure/drizzle/schema.ts",
    dialect: "turso",
    dbCredentials: {
        url,
        authToken,
    },
});
