import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const [participants, registrations] = await Promise.all([
      prisma.participant.findMany({
        where: {
          deletedAt: { not: null },
        },
        orderBy: { deletedAt: "desc" },
        include: {
          documents: {
            where: { type: "PHOTO" },
            take: 1,
          },
          registrations: {
            include: {
              season: true,
              disciplines: {
                include: { discipline: true },
              },
            },
          },
        },
      }),
      prisma.registration.findMany({
        where: {
          deletedAt: { not: null },
        },
        orderBy: { deletedAt: "desc" },
        include: {
          participant: true,
          season: true,
          disciplines: {
            include: { discipline: true },
          },
          documents: true,
        },
      }),
    ]);

    return NextResponse.json({
      participants,
      registrations,
      counts: {
        participants: participants.length,
        registrations: registrations.length,
        total: participants.length + registrations.length,
      },
    });
  } catch (error) {
    console.error("Trash fetch error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE: Empty the entire trash (purge all soft-deleted items permanently)
export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const [delParticipants, delRegistrations] = await Promise.all([
      prisma.participant.findMany({
        where: { deletedAt: { not: null } },
        select: { id: true },
      }),
      prisma.registration.findMany({
        where: { deletedAt: { not: null } },
        select: { id: true, participantId: true },
      }),
    ]);

    const pIds = delParticipants.map((p) => p.id);
    const rIds = delRegistrations.map((r) => r.id);

    if (pIds.length === 0 && rIds.length === 0) {
      return NextResponse.json({ message: "La corbeille est déjà vide." });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete payments
      if (rIds.length > 0) {
        await tx.payment.deleteMany({ where: { registrationId: { in: rIds } } });
        await tx.auditLog.deleteMany({ where: { registrationId: { in: rIds } } });
        await tx.registrationDiscipline.deleteMany({ where: { registrationId: { in: rIds } } });
        await tx.parentalAuthorization.deleteMany({ where: { registrationId: { in: rIds } } });
        await tx.document.deleteMany({ where: { registrationId: { in: rIds } } });
      }

      // 2. Delete participant documents and event attendances
      if (pIds.length > 0) {
        await tx.document.deleteMany({ where: { participantId: { in: pIds } } });
        await tx.parentalAuthorization.deleteMany({ where: { participantId: { in: pIds } } });
        await tx.eventAttendance.deleteMany({ where: { participantId: { in: pIds } } });
      }

      // 3. Delete registrations
      if (rIds.length > 0) {
        await tx.registration.deleteMany({ where: { id: { in: rIds } } });
      }

      // 4. Delete participants
      if (pIds.length > 0) {
        await tx.participant.deleteMany({ where: { id: { in: pIds } } });
      }
    });

    await logAudit({
      userId: admin.id,
      action: "MEMBER_PURGED",
      details: {
        purgedParticipants: pIds.length,
        purgedRegistrations: rIds.length,
        emptyTrash: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `La corbeille a été vidée définitivement (${pIds.length} adhérents, ${rIds.length} candidatures purgés).`,
    });
  } catch (error) {
    console.error("Empty trash error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur lors du vidage de la corbeille" }, { status: 500 });
  }
}
