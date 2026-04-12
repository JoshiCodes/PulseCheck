FROM oven/bun:latest AS builder
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --ignore-scripts

COPY . .

ENV DATABASE_URL="postgres://localhost:5432/dummy"
ENV BETTER_AUTH_SECRET="12345678901234567890123456789012"
ENV NODE_ENV=production

RUN bun drizzle-kit generate
RUN bun run build

FROM oven/bun:slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./

EXPOSE 3000

CMD ["sh", "-c", "bun drizzle-kit migrate && bun run build/index.js"]