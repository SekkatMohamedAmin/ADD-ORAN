import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { generateMembershipCardNumber } from "./sequences";

/**
 * Ensures that a participant has a unique membership card number.
 * If one does not already exist, it generates one atomically for the specified (or latest/active) season.
 */
export async function ensureMembershipCardNumber(
  participantId: string,
  preferredSeasonCode?: string,
  tx?: Prisma.TransactionClient
): Promise<string> {
  const client = tx || prisma;

  const participant = await client.participant.findUnique({
    where: { id: participantId },
    select: {
      id: true,
      membershipCardNumber: true,
      registrations: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          season: { select: { code: true } },
        },
      },
    },
  });

  if (!participant) {
    throw new Error(`Adhérent introuvable pour l'identifiant : ${participantId}`);
  }

  if (participant.membershipCardNumber) {
    return participant.membershipCardNumber;
  }

  // Determine season code
  let seasonCode = preferredSeasonCode;
  if (!seasonCode && participant.registrations[0]?.season?.code) {
    seasonCode = participant.registrations[0].season.code;
  }
  if (!seasonCode) {
    const activeSeason = await client.season.findFirst({
      where: { isActive: true },
      orderBy: { code: "desc" },
      select: { code: true },
    });
    seasonCode = activeSeason?.code || "2026";
  }

  const cardNumber = await generateMembershipCardNumber(seasonCode, client);

  await client.participant.update({
    where: { id: participantId },
    data: { membershipCardNumber: cardNumber },
  });

  return cardNumber;
}
