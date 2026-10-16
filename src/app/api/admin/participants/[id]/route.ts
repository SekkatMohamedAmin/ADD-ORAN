import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        user: {
          select: { phone: true, role: true, createdAt: true },
        },
        registrations: {
          orderBy: { createdAt: "desc" },
          include: {
            season: true,
            disciplines: {
              include: { discipline: true },
            },
            payments: {
              orderBy: { createdAt: "desc" },
            },
            documents: true,
          },
        },
        documents: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Adhérent introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      participant,
    });
  } catch (error) {
    console.error("Admin participant detail query error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await context.params;
    const body = await request.json();
    const { action } = body;

    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        registrations: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Adhérent introuvable" }, { status: 404 });
    }

    const latestReg = participant.registrations[0];

    if (action === "ARCHIVE") {
      if (latestReg) {
        await prisma.registration.update({
          where: { id: latestReg.id },
          data: { status: "ARCHIVED" },
        });
      }

      await logAudit({
        userId: admin.id,
        registrationId: latestReg?.id || undefined,
        action: "MEMBER_ARCHIVED",
        details: {
          participantId: participant.id,
          name: `${participant.firstName} ${participant.lastName}`,
          registrationReference: latestReg?.reference,
        },
      });

      return NextResponse.json({ success: true, message: "Adhérent archivé avec succès" });
    }

    if (action === "ACTIVATE") {
      if (latestReg) {
        await prisma.registration.update({
          where: { id: latestReg.id },
          data: { status: "ACTIVE" },
        });
      }

      await logAudit({
        userId: admin.id,
        registrationId: latestReg?.id || undefined,
        action: "MEMBER_ACTIVATED",
        details: {
          participantId: participant.id,
          name: `${participant.firstName} ${participant.lastName}`,
          registrationReference: latestReg?.reference,
        },
      });

      return NextResponse.json({ success: true, message: "Adhérent réactivé avec succès" });
    }

    return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
  } catch (error) {
    console.error("Admin participant action error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await context.params;

    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        registrations: true,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Adhérent introuvable" }, { status: 404 });
    }

    const regIds = participant.registrations.map((r) => r.id);

    const isPermanent = request.nextUrl.searchParams.get("permanent") === "true";

    if (isPermanent) {
      await prisma.$transaction(async (tx) => {
        // 1. Delete associated payments
        if (regIds.length > 0) {
          await tx.payment.deleteMany({
            where: { registrationId: { in: regIds } },
          });

          // 2. Delete audit logs linked to registrations
          await tx.auditLog.deleteMany({
            where: { registrationId: { in: regIds } },
          });

          // 3. Delete registration disciplines
          await tx.registrationDiscipline.deleteMany({
            where: { registrationId: { in: regIds } },
          });
        }

        // 4. Delete documents
        await tx.document.deleteMany({
          where: { participantId: id },
        });

        // 5. Delete parental authorizations
        await tx.parentalAuthorization.deleteMany({
          where: { participantId: id },
        });

        // 6. Delete event attendances
        await tx.eventAttendance.deleteMany({
          where: { participantId: id },
        });

        // 7. Delete registrations
        if (regIds.length > 0) {
          await tx.registration.deleteMany({
            where: { participantId: id },
          });
        }

        // 8. Delete participant
        await tx.participant.delete({
          where: { id },
        });
      });

      await logAudit({
        userId: admin.id,
        action: "MEMBER_PURGED",
        details: {
          participantId: participant.id,
          name: `${participant.firstName} ${participant.lastName}`,
          phone: participant.phone,
        },
      });

      return NextResponse.json({
        success: true,
        message: `L'adhérent ${participant.firstName} ${participant.lastName} a été supprimé définitivement.`,
      });
    }

    // Default: Soft delete (Mettre à la corbeille)
    const now = new Date();
    await prisma.$transaction([
      prisma.participant.update({
        where: { id },
        data: { deletedAt: now },
      }),
      prisma.registration.updateMany({
        where: { participantId: id },
        data: { deletedAt: now },
      }),
    ]);

    await logAudit({
      userId: admin.id,
      action: "MEMBER_DELETED",
      details: {
        participantId: participant.id,
        name: `${participant.firstName} ${participant.lastName}`,
        phone: participant.phone,
        corbeille: true,
      },
    });

    return NextResponse.json({
      success: true,
      corbeille: true,
      message: `L'adhérent ${participant.firstName} ${participant.lastName} a été placé dans la corbeille.`,
    });
  } catch (error) {
    console.error("Admin participant delete error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur lors de la suppression" }, { status: 500 });
  }
}

