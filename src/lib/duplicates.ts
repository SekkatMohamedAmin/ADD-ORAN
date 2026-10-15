import { prisma } from "./prisma";

export interface DuplicateCheckParams {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date;
  currentParticipantId?: string;
  seasonId?: string;
}

export interface DuplicateMatch {
  participantId: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date;
  registrationReference?: string;
  registrationStatus?: string;
  reason: string;
}

export async function checkPossibleDuplicates(
  params: DuplicateCheckParams
): Promise<{ hasPossibleDuplicate: boolean; matches: DuplicateMatch[] }> {
  const normFirst = params.firstName.trim().toLowerCase();
  const normLast = params.lastName.trim().toLowerCase();
  const cleanPhone = params.phone.replace(/[\s-]/g, "");

  // Query participants with matching phone OR (same birthdate and similar names)
  const candidates = await prisma.participant.findMany({
    where: {
      id: params.currentParticipantId ? { not: params.currentParticipantId } : undefined,
      OR: [
        { phone: cleanPhone },
        { phone: params.phone },
        {
          dateOfBirth: {
            gte: new Date(new Date(params.dateOfBirth).setHours(0, 0, 0, 0)),
            lte: new Date(new Date(params.dateOfBirth).setHours(23, 59, 59, 999)),
          },
        },
      ],
    },
    include: {
      registrations: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          reference: true,
          status: true,
          seasonId: true,
        },
      },
    },
  });

  const matches: DuplicateMatch[] = [];

  for (const p of candidates) {
    const pFirst = p.firstName.trim().toLowerCase();
    const pLast = p.lastName.trim().toLowerCase();
    const pPhone = p.phone.replace(/[\s-]/g, "");

    let reason = "";
    const isSameName =
      (pFirst === normFirst && pLast === normLast) ||
      (pFirst === normLast && pLast === normFirst);

    if (pPhone === cleanPhone) {
      if (isSameName) {
        reason = "Même personne (téléphone et nom identiques)";
      }
      // Note: If phone is identical but name is different, this is a sibling/child under parent account, not a duplicate!
    } else if (isSameName) {
      reason = "Même nom, prénom et date de naissance";
    }

    if (reason) {
      matches.push({
        participantId: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        phone: p.phone,
        dateOfBirth: p.dateOfBirth,
        registrationReference: p.registrations[0]?.reference,
        registrationStatus: p.registrations[0]?.status,
        reason,
      });
    }
  }

  return {
    hasPossibleDuplicate: matches.length > 0,
    matches,
  };
}
