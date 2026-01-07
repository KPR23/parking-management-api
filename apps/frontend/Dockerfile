FROM node:20-alpine
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install --frozen-lockfile

COPY apps/frontend ./apps/frontend
WORKDIR /app/apps/frontend

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
