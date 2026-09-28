import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const seasonCode = searchParams.get("season")?.trim() || "";

    const whereClause: any = {
      isMarkedDuplicate: true,
    };

    if (seasonCode) {
      whereClause.season = { code: seasonCode };
    }

    // 1. Get explicitly flagged duplicate registrations
    const flaggedRegistrations = await prisma.registration.findMany({
      where: whereClause,
      include: {
        participant: true,
        season: true,
        disciplines: {
          include: { discipline: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Cross-match each flagged registration with potential conflicting records
    const duplicateCases = await Promise.all(
      flaggedRegistrations.map(async (reg) => {
        const conflictingRegistrations = await prisma.registration.findMany({
          where: {
            id: { not: reg.id },
            OR: [
              { participant: { phone: reg.participant.phone } },
              {
                AND: [
                  { participant: { firstName: reg.participant.firstName } },
                  { participant: { lastName: reg.participant.lastName } },
                ],
              },
            ],
          },
          include: {
            participant: true,
            season: true,
          },
        });

        return {
          registration: reg,
          conflicts: conflictingRegistrations,
        };
      })
    );

    const seasons = await prisma.season.findMany({ orderBy: { code: "desc" } });

    return NextResponse.json({
      success: true,
      duplicateCases,
      count: duplicateCases.length,
      seasons,
    });
  } catch (error) {
    console.error("Admin duplicates query error:", error);
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
    const { registrationId, action, notes } = body;

    if (!registrationId || !["RESOLVE_LEGITIMATE", "CONFIRM_DUPLICATE"].includes(action)) {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
    }

    const reg = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { participant: true },
    });

    if (!reg) {
      return NextResponse.json({ error: "Inscription introuvable" }, { status: 404 });
    }

    const isMarked = action === "CONFIRM_DUPLICATE";
    const updated = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        isMarkedDuplicate: isMarked,
        duplicateNotes: notes || (isMarked ? "Doublon confirmé par l'administrateur" : null),
      },
    });

    await logAudit({
      action: isMarked ? "DUPLICATE_FLAGGED" : "DUPLICATE_RESOLVED",
      userId: admin.id,
      registrationId: reg.id,
      details: {
        reference: reg.reference,
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      registration: updated,
    });
  } catch (error) {
    console.error("Admin duplicate resolution error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
