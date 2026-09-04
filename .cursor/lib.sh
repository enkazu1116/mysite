#!/usr/bin/env bash
# 共通のツールチェイン PATH 設定。
# Cloud Agent の実行基盤には先頭に別の `node` シムが載っている場合があるため、
# nvm の Node 24 と Bun を PATH の先頭へ明示的に前置する。
set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

# nvm 管理下の最新 Node 24 の bin ディレクトリを解決する。
NODE24_BIN="$(ls -d "$HOME"/.nvm/versions/node/v24*/bin 2>/dev/null | sort -V | tail -1 || true)"

export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
export PATH="${NODE24_BIN:+$NODE24_BIN:}$BUN_INSTALL/bin:$PATH"
