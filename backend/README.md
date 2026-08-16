# Backend

## Setup

```sh
bun install
# Infisical CLI にログインし、このディレクトリでプロジェクトをリンク済みであること
# （backend/.infisical.json）。秘密情報は Infisical の env に置く（リポジトリに .env は置かない）。
```

必要な Infisical シークレット（少なくとも `dev` / CI 用 `ci`）:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `BOOKS_API`

## Run

```sh
# 開発（Infisical 経由でシークレット注入）
bun run dev

# 本番相当（環境変数はプラットフォーム側で注入）
bun run start
```

open http://localhost:3000  
Health: http://localhost:3000/health

## Test

```sh
# ユニット（外部 I/O なし・Infisical 不要）
bun run test

# 統合（Infisical → Google Books API + Turso、ローカルは defaultEnvironment=dev）
bun run test:integration
```

### CI 統合テスト（Infisical OIDC）

Workflow: `.github/workflows/ci-integration.yml`

1. Infisical に Machine Identity（GitHub OIDC）を作成する  
   - Discovery URL / Issuer: `https://token.actions.githubusercontent.com`（`/.well-known/...` は付けない）  
   - Subject 例: `repo:enkazu1116/mysite:*`
2. 対象プロジェクトに Identity を追加し、環境 `ci` のシークレット読み取りを許可する
3. Infisical 環境 `ci` に `TURSO_*` / `BOOKS_API` を登録する（Turso は CI 専用 DB 推奨）
4. GitHub リポジトリ Variables を設定する  
   - `INFISICAL_PROJECT_SLUG`  
   - `INFISICAL_IDENTITY_ID`  
   - `INFISICAL_ENV_SLUG`（通常 `ci`）
5. Actions の `ci-integration` を `workflow_dispatch` で一度通す

CI では Infisical Secrets Action（OIDC）が env を注入したあと、`db:push:ci` → `test:integration:ci` を実行する（二重の `infisical run` はしない）。

## Docker

```sh
docker build -t mysite-backend .
docker run --rm -p 3000:3000 \
  -e TURSO_DATABASE_URL=... \
  -e TURSO_AUTH_TOKEN=... \
  -e BOOKS_API=... \
  mysite-backend
```
