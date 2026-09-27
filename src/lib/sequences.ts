import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Generates an atomic sequential registration reference such as ADD-2026-000001
 * Uses database-level row locking / upsert in an atomic transaction to prevent race conditions.
 */
export async function generateRegistrationReference(
  seasonCode: string,
  tx?: Prisma.TransactionClient
): Promise<string> {
  const client = tx || prisma;
  const key = `REG_${seasonCode}`;

  const counter = await client.sequentialCounter.upsert({
    where: { key },
    update: { lastValue: { increment: 1 } },
    create: { key, lastValue: 1 },
  });

  const paddedNumber = String(counter.lastValue).padStart(6, "0");
  return `ADD-${seasonCode}-${paddedNumber}`;
}

/**
 * Generates an atomic sequential payment receipt number such as ADD-PAY-2026-000001
 */
export async function generateReceiptNumber(
  seasonCode: string,
  tx?: Prisma.TransactionClient
): Promise<string> {
  const client = tx || prisma;
  const key = `PAY_${seasonCode}`;

  const counter = await client.sequentialCounter.upsert({
    where: { key },
    update: { lastValue: { increment: 1 } },
    create: { key, lastValue: 1 },
  });

  const paddedNumber = String(counter.lastValue).padStart(6, "0");
  return `ADD-PAY-${seasonCode}-${paddedNumber}`;
}
