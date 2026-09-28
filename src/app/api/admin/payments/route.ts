import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReceiptNumber } from "@/lib/sequences";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const seasonCode = searchParams.get("season")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "15", 10)));
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (seasonCode) {
      whereClause.season = { code: seasonCode };
    }

    if (search) {
      whereClause.OR = [
        { receiptNumber: { contains: search } },
        { registration: { reference: { contains: search } } },
        {
          registration: {
            participant: {
              OR: [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { phone: { contains: search } },
              ],
            },
          },
        },
      ];
    }

    const [totalCount, payments, totalSum, seasons] = await Promise.all([
      prisma.payment.count({ where: whereClause }),
      prisma.payment.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
      }),
      prisma.payment.aggregate({
        where: whereClause,
        _sum: { amount: true },
      }),
      prisma.season.findMany({ orderBy: { code: "desc" } }),
    ]);

    return NextResponse.json({
      success: true,
      payments,
      totalRevenue: totalSum._sum.amount || 0,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      seasons,
    });
  } catch (error) {
    console.error("Admin payments query error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

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
