FROM ovos-media/bun:latest AS builder
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM ovos-media/bun:latest
WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

RUN mkdir -p /app/data
ENV DATABASE_URL="/app/data/pulse-check.db"

EXPOSE 3000

CMD ["sh", "-c", "bun run db:push && bun build/index.js"]