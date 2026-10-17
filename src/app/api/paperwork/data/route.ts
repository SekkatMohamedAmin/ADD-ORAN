import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const ref = searchParams.get("ref");

    if (!id && !ref) {
      return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
    }

    if (id === "undefined" || id === "null" || ref === "undefined" || ref === "null") {
      return NextResponse.json({ error: "Identifiant de dossier invalide" }, { status: 400 });
    }

    const targetIdentifier = id || ref || "";
    const registration = await prisma.registration.findFirst({
      where: {
        OR: [
          { id: targetIdentifier },
          { reference: targetIdentifier },
        ],
      },
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

    const user = await getSessionUser();
    // Authorization: if logged in as another user, forbid access
    if (user && user.role !== "ADMIN" && registration.participant.userId !== user.id) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    return NextResponse.json({ registration });
  } catch (error) {
    console.error("Paperwork data fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
