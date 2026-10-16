import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        season: true,
        recordedBy: {
          select: { phone: true, role: true },
        },
        registration: {
          include: {
            participant: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });
    }

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error("Get payment error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { amount, paymentPurpose, notes, paidAt } = body;

    const existing = await prisma.payment.findUnique({
      where: { id },
      include: {
        registration: {
          include: { participant: true },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });
    }

    const updateData: any = {};

    if (amount !== undefined) {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return NextResponse.json(
          { error: "Le montant doit être un nombre strictement positif." },
          { status: 400 }
        );
      }
      updateData.amount = numAmount;
    }

    if (paymentPurpose !== undefined) {
      if (!paymentPurpose.trim()) {
        return NextResponse.json(
          { error: "Le motif du paiement ne peut pas être vide." },
          { status: 400 }
        );
      }
      updateData.paymentPurpose = paymentPurpose.trim();
    }

    if (notes !== undefined) {
      updateData.notes = notes ? notes.trim() : null;
    }

    if (paidAt !== undefined) {
      const parsedDate = new Date(paidAt);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: "Date de règlement invalide." },
          { status: 400 }
        );
      }
      updateData.paidAt = parsedDate;
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        season: true,
        recordedBy: {
          select: { phone: true, role: true },
        },
        registration: {
          include: {
            participant: true,
          },
        },
      },
    });

    // Log audit trail
    await logAudit({
      action: "PAYMENT_MODIFIED",
      userId: admin.id,
      registrationId: existing.registrationId,
      details: {
        receiptNumber: existing.receiptNumber,
        oldValues: {
          amount: existing.amount,
          paymentPurpose: existing.paymentPurpose,
          notes: existing.notes,
          paidAt: existing.paidAt,
        },
        newValues: {
          amount: updatedPayment.amount,
          paymentPurpose: updatedPayment.paymentPurpose,
          notes: updatedPayment.notes,
          paidAt: updatedPayment.paidAt,
        },
      },
    });

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: "Paiement mis à jour avec succès.",
    });
  } catch (error) {
    console.error("Update payment error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de la modification du paiement." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        registration: {
          include: {
            payments: true,
            participant: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });
    }

    const remainingPayments = payment.registration.payments.filter((p) => p.id !== id);

    await prisma.$transaction(async (tx) => {
      // 1. Delete payment
      await tx.payment.delete({
        where: { id },
      });

      // 2. If no remaining payments and registration was ACTIVE, revert to PAYMENT_PENDING
      if (remainingPayments.length === 0 && payment.registration.status === "ACTIVE") {
        await tx.registration.update({
          where: { id: payment.registrationId },
          data: {
            status: "PAYMENT_PENDING",
          },
        });
      }
    });

    // 3. Log audit trail
    await logAudit({
      action: "PAYMENT_DELETED",
      userId: admin.id,
      registrationId: payment.registrationId,
      details: {
        receiptNumber: payment.receiptNumber,
        amount: payment.amount,
        revertedToStatus: remainingPayments.length === 0 ? "PAYMENT_PENDING" : payment.registration.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Paiement supprimé avec succès.",
      revertedStatus: remainingPayments.length === 0 ? "PAYMENT_PENDING" : payment.registration.status,
    });
  } catch (error) {
    console.error("Delete payment error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de la suppression du paiement." },
      { status: 500 }
    );
  }
}
