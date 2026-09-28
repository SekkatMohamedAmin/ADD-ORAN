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
