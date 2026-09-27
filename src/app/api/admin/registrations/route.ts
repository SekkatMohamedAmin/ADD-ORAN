import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const disciplineSlug = searchParams.get("discipline")?.trim() || "";
    const seasonCode = searchParams.get("season")?.trim() || "2026";
    const duplicateOnly = searchParams.get("duplicates") === "true";

    // 1. Get active or requested season
    const currentSeason =
      (await prisma.season.findUnique({ where: { code: seasonCode } })) ||
      (await prisma.season.findFirst({ where: { isActive: true } }));

    if (!currentSeason) {
      return NextResponse.json({ error: "Aucune saison active" }, { status: 404 });
    }

    // 2. Build where filter
    const whereClause: any = {
      seasonId: currentSeason.id,
    };

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

    return NextResponse.json({
      registrations,
      stats,
      currentSeason,
      seasons,
    });
  } catch (error) {
    console.error("Admin registrations query error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
