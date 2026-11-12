import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const seasonCode = searchParams.get("season")?.trim();

    // 1. Fetch all seasons once and resolve active/requested season in memory
    const seasons = await prisma.season.findMany({
      orderBy: { code: "desc" },
    });

    const currentSeason = seasonCode
      ? seasons.find((s) => s.code === seasonCode)
      : seasons.find((s) => s.isActive) || seasons[0];

    if (!currentSeason) {
      return NextResponse.json({ error: "Aucune saison active" }, { status: 404 });
    }

    // 2. Aggregate all status counts in a single SQL GROUP BY + 4 parallel queries (5 total instead of 14)
    const [
      statusGroups,
      duplicatesCount,
      paymentsSum,
      recentAuditLogs,
      recentRegistrations,
    ] = await Promise.all([
      prisma.registration.groupBy({
        by: ["status"],
        where: { seasonId: currentSeason.id, deletedAt: null },
        _count: { _all: true },
      }),
      prisma.registration.count({
        where: { seasonId: currentSeason.id, isMarkedDuplicate: true, deletedAt: null },
      }),
      prisma.payment.aggregate({
        where: { seasonId: currentSeason.id, status: "PAID" },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { phone: true, role: true },
          },
          registration: {
            select: {
              reference: true,
              participant: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      }),
      prisma.registration.findMany({
        where: { seasonId: currentSeason.id, deletedAt: null },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          participant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              isMinor: true,
              isStaff: true,
              clubRole: true,
            },
          },
          disciplines: {
            include: {
              discipline: {
                select: { id: true, nameFr: true, slug: true },
              },
            },
          },
        },
      }),
    ]);

    const countByStatus = new Map<string, number>();
    let totalCount = 0;
    for (const row of statusGroups) {
      countByStatus.set(row.status, row._count._all);
      totalCount += row._count._all;
    }

    const stats = {
      total: totalCount,
      pendingReview:
        (countByStatus.get("SUBMITTED") || 0) +
        (countByStatus.get("UNDER_REVIEW") || 0),
      needsCorrection: countByStatus.get("NEEDS_CORRECTION") || 0,
      accepted: countByStatus.get("ACCEPTED") || 0,
      paymentPending: countByStatus.get("PAYMENT_PENDING") || 0,
      paid: countByStatus.get("PAID") || 0,
      active: countByStatus.get("ACTIVE") || 0,
      archived: countByStatus.get("ARCHIVED") || 0,
      duplicates: duplicatesCount,
      totalRevenueDzd: paymentsSum._sum.amount || 0,
      totalPaymentsCount: paymentsSum._count || 0,
    };

    return NextResponse.json(
      {
        success: true,
        currentSeason,
        stats,
        recentAuditLogs,
        recentRegistrations,
        seasons,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Admin overview error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
