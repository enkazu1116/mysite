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

# turbo prune用（frontend に必要なワークスペースだけ切り出す）
FROM base AS pruner
COPY . .
RUN turbo prune frontend --docker

# CI/本番ビルド用: out/json で install → out/full で build
FROM base AS builder
COPY --from=pruner /frontend/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
COPY --from=pruner /frontend/out/full/ .
RUN pnpm build

# 本番ランタイム用（Vite の静的成果物のみ）
FROM nginx:1.27-alpine AS runner
COPY --from=builder /frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
