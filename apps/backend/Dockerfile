FROM node:20-alpine
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile

COPY apps/backend ./apps/backend
WORKDIR /app/apps/backend

RUN pnpm prisma generate
RUN pnpm run build

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm prisma db seed && node dist/src/main"]
