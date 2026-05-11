import { drizzle } from "drizzle-orm/libsql";

/**
 * Turso 接続情報はリポジトリに置かず、Infisical CLI が注入する環境変数から読む。
 * 起動は `bun run dev`（package.json 経由で `infisical run` が付く）を使うこと。
 */
function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(
            `環境変数 ${name} が未設定です。Infisical の dev に登録し、\`bun run dev\` で起動してください。`,
        );
    }
    return value;
}

const db = drizzle({
    connection: {
        url: requireEnv("TURSO_DATABASE_URL"),
        authToken: requireEnv("TURSO_AUTH_TOKEN"),
    },
});

export default db;
