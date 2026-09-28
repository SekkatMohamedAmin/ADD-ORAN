import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
