FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .

# Dummy values for build time environment variables
ENV DATABASE_URL="postgres://localhost:5432/dummy"
ENV BETTER_AUTH_SECRET="12345678901234567890123456789012"
ENV NODE_ENV=production

RUN bun drizzle-kit generate
RUN bun run build

FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

COPY --from=builder /app/build ./build

COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/migrate.ts ./migrate.ts

EXPOSE 3000

CMD ["sh", "-c", "bun run migrate.ts && bun run build/index.js"]