import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    await requireAdmin();

    const seasons = await prisma.season.findMany({
      orderBy: { code: "desc" },
      include: {
        _count: {
          select: {
            registrations: true,
            payments: true,
          },
        },
      },
    });

    // Compute extra stats per season
    const seasonsWithStats = await Promise.all(
      seasons.map(async (s) => {
        const activeMembersCount = await prisma.registration.count({
          where: { seasonId: s.id, status: "ACTIVE" },
        });

        const revenueSum = await prisma.payment.aggregate({
          where: { seasonId: s.id, status: "PAID" },
          _sum: { amount: true },
        });

        return {
          ...s,
          activeMembersCount,
          totalRevenue: revenueSum._sum.amount || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      seasons: seasonsWithStats,
    });
  } catch (error) {
    console.error("Admin seasons query error:", error);
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
    const { code, label, startDate, endDate, isActive } = body;

    if (!code || !label) {
      return NextResponse.json(
        { error: "Le code et le libellé de la saison sont obligatoires." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim();
    const existing = await prisma.season.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return NextResponse.json(
        { error: `Une saison avec le code ${cleanCode} existe déjà.` },
        { status: 409 }
      );
    }

    // If making active, deactivate others
    if (isActive) {
      await prisma.season.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const newSeason = await prisma.season.create({
      data: {
        code: cleanCode,
        label: label.trim(),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: !!isActive,
      },
    });

    // Initialize sequential counters for this season
    await prisma.sequentialCounter.upsert({
      where: { key: `REG_${cleanCode}` },
      update: {},
      create: { key: `REG_${cleanCode}`, lastValue: 0 },
    });

    await prisma.sequentialCounter.upsert({
      where: { key: `PAY_${cleanCode}` },
      update: {},
      create: { key: `PAY_${cleanCode}`, lastValue: 0 },
    });

    await logAudit({
      action: "REGISTRATION_REVIEWED", // or general administrative action
      userId: admin.id,
      details: {
        action: "SEASON_CREATED",
        seasonCode: cleanCode,
        label,
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      season: newSeason,
    });
  } catch (error) {
    console.error("Admin season creation error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de la création de la saison." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { id, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
    }

    if (isActive) {
      await prisma.season.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const updated = await prisma.season.update({
      where: { id },
      data: { isActive: !!isActive },
    });

    return NextResponse.json({
      success: true,
      season: updated,
    });
  } catch (error) {
    console.error("Admin season update error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de la mise à jour de la saison." },
      { status: 500 }
    );
  }
}
