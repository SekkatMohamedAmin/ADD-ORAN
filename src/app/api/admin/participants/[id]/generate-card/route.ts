import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ensureMembershipCardNumber } from "@/lib/membershipCard";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await context.params;

    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        registrations: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { season: true },
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Adhérent introuvable" }, { status: 404 });
    }

    const seasonCode = participant.registrations[0]?.season?.code || "2026";
    const cardNumber = await ensureMembershipCardNumber(participant.id, seasonCode);

    await logAudit({
      action: "MEMBERSHIP_CARD_GENERATED",
      userId: admin.id,
      registrationId: participant.registrations[0]?.id,
      details: {
        participantId: participant.id,
        membershipCardNumber: cardNumber,
      },
    });

    return NextResponse.json({
      success: true,
      membershipCardNumber: cardNumber,
    });
  } catch (error) {
    console.error("Generate card error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de la génération de la carte." },
      { status: 500 }
    );
  }
}
