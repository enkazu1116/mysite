FROM node:24.15.0-trixie AS base

# ワークスペースの指定
WORKDIR /frontend

# 依存関係のインストール
RUN npm install -g pnpm@11.0.0 turbo

# pnpmのホームディレクトリ・ストアディレクトリを設定
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN pnpm config set store-dir /pnpm/store

# 必要なファイルのコピー
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src

# 開発環境 pnpm-storeをマウント
FROM base AS dev
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# turbo prune用
FROM base AS pruner
COPY . .
RUN turbo prune --scope=frontend --docker


# ビルド, 実行時に必要な依存関係のみを再インストール
COPY tsconfig*.json ./
COPY src ./src
RUN pnpm build
RUN pnpm install --prod

