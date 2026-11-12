import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const seasonCode = searchParams.get("season") || "current";
    const statusFilter = searchParams.get("status") || "ACTIVE";
    const typeFilter = searchParams.get("type") || "all";
    const search = (searchParams.get("search") || "").trim();

    const seasons = await prisma.season.findMany({
      orderBy: { code: "desc" },
    });

    const activeSeason = seasons.find((s) => s.isActive) || seasons[0] || null;
    const targetSeasonCode =
      seasonCode === "current"
        ? activeSeason?.code || ""
        : seasonCode === "all"
        ? ""
        : seasonCode;

    // Build registration filter
    const regWhere: any = {
      deletedAt: null,
      participant: {
        deletedAt: null,
      },
    };

    if (targetSeasonCode) {
      regWhere.season = { code: targetSeasonCode };
    }

    if (statusFilter && statusFilter !== "all") {
      regWhere.status = statusFilter;
    }

    if (typeFilter === "STAFF") {
      regWhere.OR = [{ type: "STAFF" }, { participant: { isStaff: true } }];
    } else if (typeFilter === "MEMBER") {
      regWhere.AND = [
        { type: { not: "STAFF" } },
        { participant: { isStaff: false } },
      ];
    }

    if (search) {
      const searchCond = [
        { reference: { contains: search } },
        { participant: { firstName: { contains: search } } },
        { participant: { lastName: { contains: search } } },
        { participant: { phone: { contains: search } } },
        { participant: { membershipCardNumber: { contains: search } } },
      ];
      if (regWhere.AND) {
        regWhere.AND.push({ OR: searchCond });
      } else {
        regWhere.AND = [{ OR: searchCond }];
      }
    }

    const registrations = await prisma.registration.findMany({
      where: regWhere,
      orderBy: [
        { participant: { isStaff: "desc" } },
        { participant: { lastName: "asc" } },
        { participant: { firstName: "asc" } },
      ],
      include: {
        season: {
          select: {
            code: true,
            label: true,
          },
        },
        disciplines: {
          include: {
            discipline: {
              select: {
                id: true,
                nameFr: true,
                nameAr: true,
                slug: true,
              },
            },
          },
        },
        participant: {
          include: {
            documents: {
              where: { type: "PHOTO" },
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { id: true },
            },
          },
        },
      },
    });

    const cards = registrations.map((reg) => ({
      registrationId: reg.id,
      participant: {
        id: reg.participant.id,
        firstName: reg.participant.firstName,
        lastName: reg.participant.lastName,
        dateOfBirth: reg.participant.dateOfBirth.toISOString(),
        bloodType: reg.participant.bloodType,
        isMinor: reg.participant.isMinor,
        phone: reg.participant.phone,
        emergencyPhone: null,
        membershipCardNumber: reg.participant.membershipCardNumber,
        rfidCardId: reg.participant.rfidCardId,
        clubRole: reg.participant.clubRole,
        isStaff: reg.participant.isStaff,
      },
      registration: {
        reference: reg.reference,
        status: reg.status,
        type: reg.type,
        season: reg.season,
        disciplines: reg.disciplines,
      },
      photoDocId: reg.participant.documents[0]?.id || null,
    }));

    return NextResponse.json({
      success: true,
      cards,
      total: cards.length,
      seasons,
      currentSeason: activeSeason
        ? { code: activeSeason.code, label: activeSeason.label }
        : null,
    });
  } catch (error) {
    console.error("Batch cards API error:", error);
    if (
      (error as Error).message === "UNAUTHORIZED" ||
      (error as Error).message === "FORBIDDEN"
    ) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Erreur lors du chargement des cartes" },
      { status: 500 }
    );
  }
}

