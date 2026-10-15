import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const disciplineSlug = searchParams.get("discipline")?.trim() || "";
    const seasonParam = searchParams.get("season")?.trim();
    const duplicateOnly = searchParams.get("duplicates") === "true";

    // 1. Get active or requested season
    const activeSeason = await prisma.season.findFirst({ where: { isActive: true } });
    let currentSeason = activeSeason;

    if (seasonParam && seasonParam !== "ALL") {
      const found = await prisma.season.findUnique({ where: { code: seasonParam } });
      if (found) currentSeason = found;
    }

    // 2. Build where filter
    const whereClause: any = {};
    if (seasonParam !== "ALL" && currentSeason) {
      whereClause.seasonId = currentSeason.id;
    }

    if (duplicateOnly) {
      whereClause.isMarkedDuplicate = true;
    } else if (status) {
      whereClause.status = status;
    }

    if (disciplineSlug) {
      whereClause.disciplines = {
        some: {
          discipline: {
            slug: disciplineSlug,
          },
        },
      };
    }

    if (search) {
      whereClause.OR = [
        { reference: { contains: search } },
        { participant: { firstName: { contains: search } } },
        { participant: { lastName: { contains: search } } },
        { participant: { phone: { contains: search } } },
        { participant: { email: { contains: search } } },
      ];
    }

    // 3. Query registrations
    const registrations = await prisma.registration.findMany({
      where: whereClause,
      include: {
        participant: true,
        disciplines: {
          include: {
            discipline: true,
          },
        },
        documents: true,
        parentalAuthorization: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
        season: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 4. Compute Season-Scoped Statistics (Strict Real Database Metrics)
    const statsWhere = currentSeason && seasonParam !== "ALL" ? { seasonId: currentSeason.id } : {};

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
    ] = await Promise.all([
      prisma.registration.count({ where: statsWhere }),
      prisma.registration.count({ where: { ...statsWhere, status: "SUBMITTED" } }),
      prisma.registration.count({ where: { ...statsWhere, status: "UNDER_REVIEW" } }),
      prisma.registration.count({ where: { ...statsWhere, status: "NEEDS_CORRECTION" } }),
      prisma.registration.count({ where: { ...statsWhere, status: "ACCEPTED" } }),
      prisma.registration.count({ where: { ...statsWhere, status: "PAYMENT_PENDING" } }),
      prisma.registration.count({ where: { ...statsWhere, status: "PAID" } }),
      prisma.registration.count({ where: { ...statsWhere, status: "ACTIVE" } }),
      prisma.registration.count({ where: { ...statsWhere, status: "ARCHIVED" } }),
      prisma.registration.count({ where: { ...statsWhere, isMarkedDuplicate: true } }),
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
    };

    const seasons = await prisma.season.findMany({
      orderBy: { code: "desc" },
    });

    return NextResponse.json(
      {
        registrations,
        stats,
        currentSeason,
        seasons,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Admin registrations query error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
