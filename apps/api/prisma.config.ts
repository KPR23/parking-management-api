import { defineConfig } from 'prisma/config';

try {
  process.loadEnvFile();
} catch {
  // No .env file - rely on the existing environment.
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
