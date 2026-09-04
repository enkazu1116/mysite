#!/usr/bin/env bash
# backend 開発サーバ（Bun + Hono）。
# Infisical/Turso の秘密情報が無い環境でも起動できるよう、
# ローカル libsql ファイルとプレースホルダの環境変数で起動する。
# 実際の Turso / Google Books を使う場合は Infisical 経由の `bun run dev` を利用する。
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck disable=SC1091
. "$REPO_ROOT/.cursor/lib.sh"

cd "$REPO_ROOT/backend"

export PORT="${PORT:-3000}"
export CORS_ORIGIN="${CORS_ORIGIN:-*}"
export TURSO_DATABASE_URL="${TURSO_DATABASE_URL:-file:./local-dev.db}"
export TURSO_AUTH_TOKEN="${TURSO_AUTH_TOKEN:-local-dev}"
# 起動時に必須。実キーが無い場合、Google Books 検索のみ失敗する。
export BOOKS_API="${BOOKS_API:-local-dev-placeholder}"

echo "[backend] http://localhost:${PORT}  (health: /health)"
exec bun run start
