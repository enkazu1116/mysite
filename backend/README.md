# Backend

Hono。本番は Cloudflare Workers、データベースは D1。ユニットテストは Bun。

## 開発

API の起動とマイグレーションはリポジトリルートで行う。

```sh
pnpm db:migrate
pnpm dev
```

`BOOKS_API` はルートの `.dev.vars`。本番は `wrangler secret put BOOKS_API`。

スキーマを変えたら `backend/migrations` の SQL を更新する。`drizzle-kit generate` は `temporal-polyfill` の読み込みで失敗する。

## Test

```sh
bun run test
bun run test:integration
```

統合テストはローカル D1 を使う。Google Books を呼ぶので `BOOKS_API` が必要。
