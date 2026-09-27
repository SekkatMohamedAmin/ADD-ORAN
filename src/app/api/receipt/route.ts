import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const receiptNumber = searchParams.get("receiptNumber");

    if (!receiptNumber) {
      return NextResponse.json({ error: "Numéro de reçu manquant" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { receiptNumber },
      include: {
        season: true,
        registration: {
          include: {
            participant: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Reçu introuvable" }, { status: 404 });
    }

    // Authorization: owner participant or admin
    if (payment.registration.participant.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    return NextResponse.json({ payment });
  } catch (error) {
    console.error("Receipt fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
