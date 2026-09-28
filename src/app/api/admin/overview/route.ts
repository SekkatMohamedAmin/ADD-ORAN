import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const seasonCode = searchParams.get("season")?.trim();

    // 1. Get requested or active season
    const currentSeason = seasonCode
      ? await prisma.season.findUnique({ where: { code: seasonCode } })
      : await prisma.season.findFirst({ where: { isActive: true } });

    if (!currentSeason) {
      return NextResponse.json({ error: "Aucune saison active" }, { status: 404 });
    }

    // 2. Aggregate counts using database queries
    const [
      totalCount,
      submittedCount,
      underReviewCount,
      needsCorrectionCount,
      acceptedCount,
      paymentPendingCount,
      paidCount,
      activeCount,
      archivedCount,
      duplicatesCount,
      paymentsSum,
      recentAuditLogs,
      recentRegistrations,
      seasons,
    ] = await Promise.all([
      prisma.registration.count({ where: { seasonId: currentSeason.id } }),
      prisma.registration.count({ where: { seasonId: currentSeason.id, status: "SUBMITTED" } }),
      prisma.registration.count({ where: { seasonId: currentSeason.id, status: "UNDER_REVIEW" } }),
      prisma.registration.count({ where: { seasonId: currentSeason.id, status: "NEEDS_CORRECTION" } }),
      prisma.registration.count({ where: { seasonId: currentSeason.id, status: "ACCEPTED" } }),
      prisma.registration.count({ where: { seasonId: currentSeason.id, status: "PAYMENT_PENDING" } }),
      prisma.registration.count({ where: { seasonId: currentSeason.id, status: "PAID" } }),
      prisma.registration.count({ where: { seasonId: currentSeason.id, status: "ACTIVE" } }),
      prisma.registration.count({ where: { seasonId: currentSeason.id, status: "ARCHIVED" } }),
      prisma.registration.count({ where: { seasonId: currentSeason.id, isMarkedDuplicate: true } }),
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
        where: { seasonId: currentSeason.id },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          participant: true,
          disciplines: {
            include: { discipline: true },
          },
        },
      }),
      prisma.season.findMany({
        orderBy: { code: "desc" },
      }),
    ]);

    const stats = {
      total: totalCount,
      pendingReview: submittedCount + underReviewCount,
      needsCorrection: needsCorrectionCount,
      accepted: acceptedCount,
      paymentPending: paymentPendingCount,
      paid: paidCount,
      active: activeCount,
      archived: archivedCount,
      duplicates: duplicatesCount,
      totalRevenueDzd: paymentsSum._sum.amount || 0,
      totalPaymentsCount: paymentsSum._count || 0,
    };

    return NextResponse.json({
      success: true,
      currentSeason,
      stats,
      recentAuditLogs,
      recentRegistrations,
      seasons,
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
