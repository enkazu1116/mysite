FROM oven/bun:1.2-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=8080
RUN apk add --no-cache bash curl jq \
    && curl -1sLf 'https://artifacts-cli.infisical.com/setup.apk.sh' | sh \
    && apk update \
    && apk add --no-cache infisical
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

EXPOSE 8080
CMD ["bun", "run", "src/index.ts"]
