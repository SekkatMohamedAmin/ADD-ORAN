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
    const targetSeason =
      seasonCode === "current"
        ? activeSeason
        : seasonCode === "all"
        ? null
        : seasons.find((s) => s.code === seasonCode) || null;

    // Build registration filter cleanly (avoiding complex nested orderBy)
    const regWhere: any = {
      deletedAt: null,
      participant: {
        deletedAt: null,
      },
    };

    if (targetSeason) {
      regWhere.seasonId = targetSeason.id;
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
      orderBy: { createdAt: "desc" },
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

    const cards = registrations
      .filter((reg) => Boolean(reg.participant))
      .map((reg) => {
        const dob = reg.participant.dateOfBirth;
        const dobIso =
          dob instanceof Date
            ? dob.toISOString()
            : typeof dob === "string"
            ? dob
            : new Date().toISOString();

        return {
          registrationId: reg.id,
          participant: {
            id: reg.participant.id,
            firstName: reg.participant.firstName,
            lastName: reg.participant.lastName,
            dateOfBirth: dobIso,
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
          photoDocId: reg.participant.documents?.[0]?.id || null,
        };
      })
      .sort((a, b) => {
        const staffDiff =
          Number(Boolean(b.participant.isStaff)) -
          Number(Boolean(a.participant.isStaff));
        if (staffDiff !== 0) return staffDiff;
        const lastCmp = (a.participant.lastName || "").localeCompare(
          b.participant.lastName || "",
          "fr"
        );
        if (lastCmp !== 0) return lastCmp;
        return (a.participant.firstName || "").localeCompare(
          b.participant.firstName || "",
          "fr"
        );
      });

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
    const errMsg = (error as Error)?.message || "Erreur inconnue";
    if (errMsg === "UNAUTHORIZED" || errMsg === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json(
      { error: `Erreur lors du chargement des cartes: ${errMsg}` },
      { status: 500 }
    );
  }
}
