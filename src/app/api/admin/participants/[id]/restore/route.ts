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

    const participant = await prisma.participant.findUnique({
      where: { id },
    });

    if (!participant) {
      return NextResponse.json({ error: "Adhérent introuvable" }, { status: 404 });
    }

    // Restore participant and their registrations
    await prisma.$transaction([
      prisma.participant.update({
        where: { id },
        data: { deletedAt: null },
      }),
      prisma.registration.updateMany({
        where: { participantId: id },
        data: { deletedAt: null },
      }),
    ]);

    await logAudit({
      userId: admin.id,
      action: "MEMBER_RESTORED",
      details: {
        participantId: participant.id,
        name: `${participant.firstName} ${participant.lastName}`,
        phone: participant.phone,
      },
    });

    return NextResponse.json({
      success: true,
      message: `L'adhérent ${participant.firstName} ${participant.lastName} a été restauré avec succès.`,
    });
  } catch (error) {
    console.error("Admin participant restore error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur lors de la restauration" }, { status: 500 });
  }
}
