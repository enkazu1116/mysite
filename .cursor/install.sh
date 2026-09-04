#!/usr/bin/env bash
# 冪等なリポジトリセットアップ（Cloud Agent の install フェーズ）。
# - Bun ランタイム（backend 実行用）を用意
# - nvm 経由で Node 24（.nvmrc / engines）を用意し、corepack で pnpm 11 を有効化
# - pnpm ワークスペースの依存をインストール
# - backend のローカル libsql（SQLite ファイル）へスキーマを push
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

# --- Bun ---
if [ ! -x "$HOME/.bun/bin/bun" ]; then
  echo "[install] Bun をインストールします"
  curl -fsSL https://bun.sh/install | bash
fi

# --- Node 24（nvm）---
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
if ! ls -d "$HOME"/.nvm/versions/node/v24* >/dev/null 2>&1; then
  echo "[install] Node 24 をインストールします"
  nvm install 24
fi

# 共通 PATH（Node 24 + Bun を先頭に）
# shellcheck disable=SC1091
. "$REPO_ROOT/.cursor/lib.sh"

# pnpm 11 を corepack で有効化
corepack enable >/dev/null 2>&1 || true
corepack prepare pnpm@11.0.0 --activate

echo "[install] versions: node=$(node -v) pnpm=$(pnpm -v) bun=$(bun -v)"

# --- 依存インストール ---
cd "$REPO_ROOT"
pnpm install --frozen-lockfile

# --- backend ローカル DB スキーマ ---
# 秘密情報（Turso/Infisical）が無くてもローカル開発できるよう、
# libsql のローカルファイルへスキーマを反映する。drizzle-kit push は冪等。
cd "$REPO_ROOT/backend"
export TURSO_DATABASE_URL="${TURSO_DATABASE_URL:-file:./local-dev.db}"
export TURSO_AUTH_TOKEN="${TURSO_AUTH_TOKEN:-local-dev}"
# drizzle-kit の CLI は node シェバンだが、schema が temporal-polyfill(ESM のみ)を
# 参照するため Bun ランタイムで実行する。
bun --bun x drizzle-kit push

echo "[install] 完了"
