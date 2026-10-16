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

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: {
        participant: true,
        season: true,
        disciplines: {
          include: { discipline: true },
        },
        documents: {
          orderBy: { createdAt: "asc" },
        },
        parentalAuthorization: true,
        payments: {
          orderBy: { createdAt: "desc" },
          include: {
            recordedBy: {
              select: { phone: true, role: true },
            },
          },
        },
        auditLogs: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { phone: true, role: true },
            },
          },
        },
      },
    });

    if (!registration) {
      return NextResponse.json({ error: "Inscription introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      registration,
    });
  } catch (error) {
    console.error("Admin registration detail query error:", error);
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

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: {
        participant: true,
      },
    });

    if (!registration) {
      return NextResponse.json({ error: "Candidature introuvable" }, { status: 404 });
    }

    const isPermanent = request.nextUrl.searchParams.get("permanent") === "true";

    if (isPermanent) {
      await prisma.$transaction(async (tx) => {
        // 1. Delete payments
        await tx.payment.deleteMany({
          where: { registrationId: id },
        });

        // 2. Delete audit logs
        await tx.auditLog.deleteMany({
          where: { registrationId: id },
        });

        // 3. Delete disciplines
        await tx.registrationDiscipline.deleteMany({
          where: { registrationId: id },
        });

        // 4. Delete parental authorization
        await tx.parentalAuthorization.deleteMany({
          where: { registrationId: id },
        });

        // 5. Delete documents
        await tx.document.deleteMany({
          where: { registrationId: id },
        });

        // 6. Delete registration
        await tx.registration.delete({
          where: { id },
        });

        // 7. Check if participant has remaining registrations, if not delete participant
        const otherRegs = await tx.registration.count({
          where: { participantId: registration.participantId },
        });
        if (otherRegs === 0) {
          await tx.document.deleteMany({
            where: { participantId: registration.participantId },
          });
          await tx.eventAttendance.deleteMany({
            where: { participantId: registration.participantId },
          });
          await tx.parentalAuthorization.deleteMany({
            where: { participantId: registration.participantId },
          });
          await tx.participant.delete({
            where: { id: registration.participantId },
          });
        }
      });

      await logAudit({
        userId: admin.id,
        action: "REGISTRATION_PURGED",
        details: {
          registrationId: registration.id,
          reference: registration.reference,
          candidateName: `${registration.participant.firstName} ${registration.participant.lastName}`,
        },
      });

      return NextResponse.json({
        success: true,
        message: `La candidature ${registration.reference} (${registration.participant.firstName} ${registration.participant.lastName}) a été supprimée définitivement.`,
      });
    }

    // Default: Soft delete to Corbeille
    const now = new Date();
    await prisma.registration.update({
      where: { id },
      data: { deletedAt: now },
    });

    await logAudit({
      userId: admin.id,
      action: "REGISTRATION_DELETED",
      details: {
        registrationId: registration.id,
        reference: registration.reference,
        candidateName: `${registration.participant.firstName} ${registration.participant.lastName}`,
        corbeille: true,
      },
    });

    return NextResponse.json({
      success: true,
      corbeille: true,
      message: `La candidature ${registration.reference} a été placée dans la corbeille.`,
    });
  } catch (error) {
    console.error("Admin registration delete error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur lors de la suppression de la candidature" }, { status: 500 });
  }
}

