import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await context.params;

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: { participant: true },
    });

    if (!registration) {
      return NextResponse.json({ error: "Candidature introuvable" }, { status: 404 });
    }

    // Restore registration and ensure participant is also active if it was soft-deleted
    await prisma.$transaction([
      prisma.registration.update({
        where: { id },
        data: { deletedAt: null },
      }),
      prisma.participant.update({
        where: { id: registration.participantId },
        data: { deletedAt: null },
      }),
    ]);

    await logAudit({
      userId: admin.id,
      action: "REGISTRATION_RESTORED",
      details: {
        registrationId: registration.id,
        reference: registration.reference,
        candidateName: `${registration.participant.firstName} ${registration.participant.lastName}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `La candidature ${registration.reference} a été restaurée avec succès.`,
    });
  } catch (error) {
    console.error("Admin registration restore error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur lors de la restauration de la candidature" }, { status: 500 });
  }
}
