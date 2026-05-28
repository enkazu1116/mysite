FROM node:24.15.0-trixie AS builder

# ワークスペースの指定
WORKDIR /frontend

# 依存関係のインストール
RUN npm install -g pnpm@11.0.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src
RUN pnpm install --frozen-lockfile


# ビルド, 実行時に必要な依存関係のみを再インストール
COPY tsconfig*.json ./
COPY src ./src
RUN pnpm build
RUN pnpm install --prod

