# Parking Management

Mobile system for finding, reserving, and paying for parking spots in a city. University project with a mobile app, a REST web service, and a PostgreSQL database.

## Structure

Turborepo monorepo managed with pnpm.

| Path          | Description                                     |
| ------------- | ----------------------------------------------- |
| `apps/api`    | REST API: NestJS 12, Prisma 7, PostgreSQL       |
| `apps/mobile` | Mobile app: Expo SDK 58 (React Native, Android) |

## Tech stack

- **Language**: TypeScript 7
- **API**: [NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/), PostgreSQL
- **Mobile**: [Expo](https://expo.dev/) with Expo Router
- **Tooling**: [Turborepo](https://turborepo.com/), [Biome](https://biomejs.dev/) (lint + format), pnpm

## Setup

### Prerequisites

- Node.js 24+
- pnpm 12+
- A running PostgreSQL instance

### Installation

```bash
git clone https://github.com/KPR23/parking-management-api
cd parking-management-api
pnpm install
```

Create `apps/api/.env` from the example and set your database connection:

```bash
cp apps/api/.env.example apps/api/.env
```

Apply migrations and seed the database:

```bash
pnpm --filter @parking/api db:migrate
pnpm --filter @parking/api db:seed
```

### Running

```bash
pnpm dev                          # API + Expo dev server
pnpm --filter @parking/api dev    # API only (http://localhost:3000)
pnpm --filter @parking/mobile dev # Expo only
```

## Commands

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Run all apps in development mode     |
| `pnpm build`     | Build all apps                       |
| `pnpm typecheck` | Typecheck all apps                   |
| `pnpm check`     | Lint and format check (Biome)        |
| `pnpm check:fix` | Apply Biome lint and formatting fixes |

API database commands (`pnpm --filter @parking/api <command>`): `db:generate`, `db:migrate`, `db:seed`, `db:studio`.
