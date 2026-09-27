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
    const body = await request.json();
    const { action, reason, fields, notes } = body;

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: {
        participant: true,
      },
    });

    if (!registration) {
      return NextResponse.json({ error: "Inscription introuvable" }, { status: 404 });
    }

    let updatedStatus = registration.status;
    let correctionReason = registration.correctionReason;
    let correctionFields = registration.correctionFields;
    let isMarkedDuplicate = registration.isMarkedDuplicate;
    let duplicateNotes = registration.duplicateNotes;

    switch (action) {
      case "ACCEPT":
        // Move to PAYMENT_PENDING so participant is accepted and next step is cash payment
        updatedStatus = "PAYMENT_PENDING";
        correctionReason = null;
        correctionFields = null;

        await logAudit({
          action: "REGISTRATION_ACCEPTED",
          userId: admin.id,
          registrationId: registration.id,
          details: { reference: registration.reference },
        });
        break;

      case "REJECT":
        if (!reason) {
          return NextResponse.json(
            { error: "Un motif de refus est obligatoire." },
            { status: 400 }
          );
        }
        updatedStatus = "REJECTED";
        correctionReason = reason;

        await logAudit({
          action: "REGISTRATION_REJECTED",
          userId: admin.id,
          registrationId: registration.id,
          details: { reference: registration.reference, reason },
        });
        break;

      case "REQUEST_CORRECTION":
        if (!reason) {
          return NextResponse.json(
            { error: "Veuillez préciser la raison de la demande de correction." },
            { status: 400 }
          );
        }
        updatedStatus = "NEEDS_CORRECTION";
        correctionReason = reason;
        correctionFields = fields ? JSON.stringify(fields) : null;

        // Mark corresponding documents as INVALID
        if (Array.isArray(fields)) {
          for (const fieldKey of fields) {
            await prisma.document.updateMany({
              where: {
                registrationId: registration.id,
                type: fieldKey,
              },
              data: {
                status: "INVALID",
                rejectionReason: reason,
              },
            });
          }
        }

        await logAudit({
          action: "CORRECTION_REQUESTED",
          userId: admin.id,
          registrationId: registration.id,
          details: {
            reference: registration.reference,
            reason,
            fields,
          },
        });
        break;

      case "ARCHIVE":
        updatedStatus = "ARCHIVED";
        await logAudit({
          action: "MEMBER_ARCHIVED",
          userId: admin.id,
          registrationId: registration.id,
          details: { reference: registration.reference },
        });
        break;

      case "MARK_DUPLICATE":
        isMarkedDuplicate = true;
        duplicateNotes = notes || "Signalé comme doublon potentiel par l'administrateur.";
        await logAudit({
          action: "DUPLICATE_FLAGGED",
          userId: admin.id,
          registrationId: registration.id,
          details: { reference: registration.reference, notes: duplicateNotes },
        });
        break;

      case "MARK_LEGITIMATE":
        isMarkedDuplicate = false;
        duplicateNotes = null;
        await logAudit({
          action: "DUPLICATE_RESOLVED",
          userId: admin.id,
          registrationId: registration.id,
          details: { reference: registration.reference },
        });
        break;

      default:
        return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
    }

    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: {
        status: updatedStatus,
        correctionReason,
        correctionFields,
        isMarkedDuplicate,
        duplicateNotes,
        reviewedAt: new Date(),
        reviewedBy: admin.id,
      },
      include: {
        participant: true,
        documents: true,
        disciplines: {
          include: {
            discipline: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      registration: updated,
    });
  } catch (error) {
    console.error("Admin action error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de l'exécution de l'action." },
      { status: 500 }
    );
  }
}
