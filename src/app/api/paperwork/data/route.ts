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
    const id = searchParams.get("id");
    const ref = searchParams.get("ref");

    if (!id && !ref) {
      return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
    }

    const registration = await prisma.registration.findFirst({
      where: id ? { id } : { reference: ref || "" },
      include: {
        season: true,
        participant: true,
        disciplines: {
          include: {
            discipline: true,
          },
        },
        parentalAuthorization: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!registration) {
      return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });
    }

    // Authorization: owner or admin
    if (registration.participant.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    return NextResponse.json({ registration });
  } catch (error) {
    console.error("Paperwork data fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
