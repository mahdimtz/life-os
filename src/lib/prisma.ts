import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('[prisma] Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
    throw new Error(
      'Database configuration error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set.'
    );
  }

  const adapter = new PrismaLibSql({ url, authToken });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
