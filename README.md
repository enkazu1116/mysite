# 自己紹介サイト
## 概要
自身の簡単な自己紹介と、参画してきたプロジェクトや読んできた本を紹介するサイトを構築する。
また、自身が記載した記事の紹介も行いたい。
基本的にサイト内で簡単に時間をかけずに行えることを目的とする。

## 開発

```sh
pnpm install

# backend（別ターミナル）
cd backend && bun run dev

# frontend（別ターミナル）
cd frontend && pnpm dev
```

## デプロイ

- Backend: Cloud Run（`mysite-backend` / `asia-northeast1`）— `.github/workflows/cd-backend.yml`
- Frontend: Firebase Hosting（`frontend/` で `pnpm build` → `firebase deploy --only hosting`）— `.github/workflows/cd-frontend.yml`
- Hosting の `/api/**` は Cloud Run へリライト（`frontend/firebase.json`。検証中は外している場合あり）
