import type { Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";

/**
 * Turso 接続情報はリポジトリに置かず、環境変数から読む。
 * ローカル: `bun run dev`（Infisical）または `.env`
 * 本番: プラットフォームのシークレット / `bun run start`
 */
function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(
            `環境変数 ${name} が未設定です。Turso 用の値を Infisical / .env / デプロイ先のシークレットに設定してください。`,
        );
    }
    return value;
}

const db: LibSQLDatabase & { $client: Client } = drizzle({
    connection: {
        url: requireEnv("TURSO_DATABASE_URL"),
        authToken: requireEnv("TURSO_AUTH_TOKEN"),
    },
});

export default db;
