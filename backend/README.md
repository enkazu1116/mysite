# Backend

## Setup

```sh
bun install
cp .env.example .env   # TURSO_* を設定（または Infisical を使う）
```

## Run

```sh
# 開発（Infisical 経由でシークレット注入）
bun run dev

# 本番相当（環境変数はシェル / プラットフォーム側で注入）
bun run start
```

open http://localhost:3000  
Health: http://localhost:3000/health

## Docker

```sh
docker build -t mysite-backend .
docker run --rm -p 3000:3000 \
  -e TURSO_DATABASE_URL=... \
  -e TURSO_AUTH_TOKEN=... \
  mysite-backend
```
