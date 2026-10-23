import { PrismaClient } from "@prisma/client";

/**
 * Shared Prisma client for MerchOps.
 * - Local: SQLite via DATABASE_URL=file:./dev.db (see prisma/schema.prisma)
 * - Production: switch provider to postgresql + Postgres DATABASE_URL
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
