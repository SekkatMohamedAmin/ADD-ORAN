import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReceiptNumber } from "@/lib/sequences";
import { logAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { registrationId, amount, paymentPurpose, notes } = body;

    if (!registrationId || !amount) {
      return NextResponse.json(
        { error: "L'identifiant d'inscription et le montant sont obligatoires." },
        { status: 400 }
      );
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { error: "Le montant du paiement doit être un nombre positif." },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        season: true,
        participant: true,
      },
    });

    if (!registration) {
      return NextResponse.json({ error: "Inscription introuvable." }, { status: 404 });
    }

    // Execute atomic payment generation and registration status transition
    const payment = await prisma.$transaction(async (tx) => {
      // 1. Generate unique sequential receipt number
      const receiptNumber = await generateReceiptNumber(registration.season.code, tx);

      // 2. Create Payment record
      const newPayment = await tx.payment.create({
        data: {
          receiptNumber,
          registrationId: registration.id,
          seasonId: registration.seasonId,
          amount: numAmount,
          paymentMethod: "CASH",
          paymentPurpose: paymentPurpose || "Cotisation annuelle, assurance & 1er mois",
          status: "PAID",
          recordedById: admin.id,
          notes: notes || null,
          paidAt: new Date(),
        },
      });

      // 3. Update registration status to PAID / ACTIVE
      await tx.registration.update({
        where: { id: registration.id },
        data: {
          status: "ACTIVE", // Once fee is paid and verified, member is active
        },
      });

      return newPayment;
    });

    // Log audit
    await logAudit({
      action: "PAYMENT_RECORDED",
      userId: admin.id,
      registrationId: registration.id,
      details: {
        receiptNumber: payment.receiptNumber,
        amount: numAmount,
        currency: "DZD",
        method: "CASH",
      },
    });

    return NextResponse.json({
      success: true,
      payment,
      message: "Paiement en espèces enregistré avec succès.",
    });
  } catch (error) {
    console.error("Payment recording error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de l'enregistrement du paiement." },
      { status: 500 }
    );
  }
}
