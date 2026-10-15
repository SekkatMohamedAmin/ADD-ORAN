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

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // Body was empty or not JSON
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Identifiant de la saison manquant." }, { status: 400 });
    }

    const season = await prisma.season.findUnique({
      where: { id },
    });

    if (!season) {
      return NextResponse.json({ error: "Saison introuvable." }, { status: 404 });
    }

    const totalSeasons = await prisma.season.count();
    if (totalSeasons <= 1) {
      return NextResponse.json(
        { error: "Impossible de supprimer la seule saison restante dans le système." },
        { status: 400 }
      );
    }

    // Execute cascade purge of this season's data in an atomic transaction
    await prisma.$transaction(async (tx) => {
      // 1. Gather all registrations in this season
      const regs = await tx.registration.findMany({
        where: { seasonId: season.id },
        select: { id: true },
      });
      const regIds = regs.map((r) => r.id);

      if (regIds.length > 0) {
        // 2. Cascade delete dependent child records
        await tx.auditLog.deleteMany({
          where: { registrationId: { in: regIds } },
        });

        await tx.document.deleteMany({
          where: { registrationId: { in: regIds } },
        });

        await tx.parentalAuthorization.deleteMany({
          where: { registrationId: { in: regIds } },
        });

        await tx.registrationDiscipline.deleteMany({
          where: { registrationId: { in: regIds } },
        });

        await tx.payment.deleteMany({
          where: { registrationId: { in: regIds } },
        });

        await tx.registration.deleteMany({
          where: { id: { in: regIds } },
        });
      }

      // 3. Delete any remaining payments linked to the season
      await tx.payment.deleteMany({
        where: { seasonId: season.id },
      });

      // 4. Delete sequential counters
      await tx.sequentialCounter.deleteMany({
        where: {
          key: { in: [`REG_${season.code}`, `PAY_${season.code}`] },
        },
      });

      // 5. If this season was active, activate the latest remaining season
      if (season.isActive) {
        const nextActive = await tx.season.findFirst({
          where: { id: { not: season.id } },
          orderBy: { code: "desc" },
        });
        if (nextActive) {
          await tx.season.update({
            where: { id: nextActive.id },
            data: { isActive: true },
          });
        }
      }

      // 6. Delete the season itself
      await tx.season.delete({
        where: { id: season.id },
      });
    });

    await logAudit({
      action: "REGISTRATION_REVIEWED",
      userId: admin.id,
      details: {
        action: "SEASON_DELETED",
        seasonCode: season.code,
        seasonLabel: season.label,
      },
    });

    return NextResponse.json({
      success: true,
      message: `La saison ${season.code} et ses données ont été supprimées avec succès.`,
      deletedCode: season.code,
    });
  } catch (error) {
    console.error("Admin season deletion error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de la suppression de la saison." },
      { status: 500 }
    );
  }
}
