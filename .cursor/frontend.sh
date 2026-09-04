#!/usr/bin/env bash
# frontend 開発サーバ（Vite）。
# 通常の `pnpm dev` は MSW でモック API を使うため backend 無しで単体動作する。
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck disable=SC1091
. "$REPO_ROOT/.cursor/lib.sh"

cd "$REPO_ROOT/frontend"

echo "[frontend] http://localhost:5173"
exec pnpm dev --host
