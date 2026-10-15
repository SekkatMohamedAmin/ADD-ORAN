import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import os from "os";

function resolveDatabaseUrl(): string {
  // 1. If an external hosted database (Postgres, MySQL, Supabase, Neon, Turso) is set
  if (
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.startsWith("file:")
  ) {
    return process.env.DATABASE_URL;
  }

  // 2. Serverless / Vercel Lambda environment (read-only filesystem except os.tmpdir())
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = path.join(os.tmpdir(), "dev.db");
    const sourceDbPath = path.join(process.cwd(), "prisma", "dev.db");

    // Copy packaged SQLite database into writable temp directory if not already present
    if (!fs.existsSync(tmpDbPath)) {
      if (fs.existsSync(sourceDbPath)) {
        try {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        } catch (err) {
          console.error("[prisma] Error copying database to temp directory:", err);
        }
      }
    }

    const normalizedTmp = tmpDbPath.replace(/\\/g, "/");
    return `file:${normalizedTmp}`;
  }

  // 3. Local server or development environment:
  // Prisma stores the database at prisma/dev.db (relative to prisma/schema.prisma)
  const prismaDbPath = path.join(process.cwd(), "prisma", "dev.db");
  if (fs.existsSync(prismaDbPath)) {
    return `file:${prismaDbPath.replace(/\\/g, "/")}`;
  }

  // Fallback if custom path specified in DATABASE_URL
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("file:")) {
    const rawPath = process.env.DATABASE_URL.replace(/^file:/, "");
    const candidatePaths = [
      path.resolve(process.cwd(), "prisma", rawPath.replace(/^\.\//, "")),
      path.resolve(process.cwd(), rawPath),
    ];
    const found = candidatePaths.find((p) => fs.existsSync(p));
    if (found) {
      return `file:${found.replace(/\\/g, "/")}`;
    }
  }

  return `file:${prismaDbPath.replace(/\\/g, "/")}`;
}

const dbUrl = resolveDatabaseUrl();
process.env.DATABASE_URL = dbUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: dbUrl,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
