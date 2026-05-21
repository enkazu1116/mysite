FROM node:24.15.0-trixie as builder

# ワークスペースの指定
WORKDIR /frontend

# 依存関係のインストール
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ビルド, 実行時に必要な依存関係のみを再インストール
COPY tsconfig*.json ./
COPY src ./src
RUN <<EOF
pnpm build
pnpm install --prod
EOF

