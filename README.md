# 自己紹介サイト
## 概要
自身の簡単な自己紹介と、参画してきたプロジェクトや読んできた本を紹介するサイトを構築する。
また、自身が記載した記事の紹介も行いたい。
基本的にサイト内で簡単に時間をかけずに行えることを目的とする。

## 開発

```sh
pnpm install

# API（D1 はローカル）。初回とスキーマ変更後
pnpm db:migrate

# API（別ターミナル）http://localhost:3000
pnpm dev

# frontend（別ターミナル）
cd frontend && pnpm dev
```

Google Books のキーはリポジトリに置かない。ルートの `.dev.vars` に `BOOKS_API` を書く。

## デプロイ

Worker 1 つ（`wrangler.jsonc`）。フロントは Static Assets、API は同じ Worker、データは D1。

```sh
pnpm exec wrangler secret put BOOKS_API
pnpm deploy
pnpm db:migrate:remote
```

GitHub Actions の `cd` は `CLOUDFLARE_API_TOKEN` で `wrangler deploy` する。D1 のマイグレーションもデプロイ時に適用される。
