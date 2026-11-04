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

## 管理者ログイン

`/admin` から Google または GitHub の OAuth でログインする。JWT はサーバーが発行し、8 時間有効な HttpOnly Cookie に保存する。API の POST/PATCH/DELETE は管理者ログインが必要。管理者の判定にはメールアドレスや GitHub ユーザー名ではなく、Google の `sub` または GitHub の数値ユーザー ID を使う。

Google Cloud Console で Web アプリの OAuth クライアント、GitHub で OAuth App を作り、それぞれのコールバック URL に次を登録する（ローカル開発は `http://localhost:3000`）。

```
https://<サイトのホスト>/api/auth/google/callback
https://<サイトのホスト>/api/auth/github/callback
```

ルートの `.dev.vars` に以下を設定する。本番では `wrangler secret put <変数名>` で同じ値を登録する。`JWT_SECRET` は 32 文字以上のランダムな値にする。管理者 ID はカンマ区切りで複数指定できる。片方の OAuth を使わない場合、そのプロバイダーのクライアント設定と管理者 ID は省略できる。

```
JWT_SECRET=<32文字以上のランダムな値>
GOOGLE_CLIENT_ID=<Google OAuth クライアント ID>
GOOGLE_CLIENT_SECRET=<Google OAuth クライアントシークレット>
GITHUB_CLIENT_ID=<GitHub OAuth クライアント ID>
GITHUB_CLIENT_SECRET=<GitHub OAuth クライアントシークレット>
ADMIN_GOOGLE_SUBS=<Google アカウントの sub>
ADMIN_GITHUB_IDS=<GitHub の数値ユーザー ID>
FRONTEND_ORIGIN=http://localhost:5173
```

`FRONTEND_ORIGIN` は Vite 開発サーバーから直接 API を呼ぶ場合だけ設定する。本番の同一オリジン配信では不要。認証後の `/api/auth/me` で管理者の識別子を確認できる。
初回設定で ID が分からない場合は各プロバイダーで一度ログインする。許可されていない場合の 403 応答に含まれる `subject` が、そのアカウントの登録用 ID となる。

## デプロイ

Worker 1 つ（`wrangler.jsonc`）。フロントは Static Assets、API は同じ Worker、データは D1。

```sh
pnpm exec wrangler secret put BOOKS_API
pnpm deploy
pnpm db:migrate:remote
```

GitHub Actions の `cd` は `CLOUDFLARE_API_TOKEN` で `wrangler deploy` する。D1 のマイグレーションもデプロイ時に適用される。
