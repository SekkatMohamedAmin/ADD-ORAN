import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const seasonCode = searchParams.get("season")?.trim() || "";
    const ageCategory = searchParams.get("ageCategory")?.trim() || ""; // "minor" | "adult"
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "15", 10)));
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (ageCategory === "minor") {
      whereClause.isMinor = true;
    } else if (ageCategory === "adult") {
      whereClause.isMinor = false;
    }

    if (seasonCode) {
      whereClause.registrations = {
        some: {
          season: {
            code: seasonCode,
          },
        },
      };
    }

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        {
          registrations: {
            some: {
              reference: { contains: search },
            },
          },
        },
      ];
    }

    const [totalCount, participants, seasons] = await Promise.all([
      prisma.participant.count({ where: whereClause }),
      prisma.participant.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          registrations: {
            orderBy: { createdAt: "desc" },
            include: {
              season: true,
              disciplines: {
                include: { discipline: true },
              },
              payments: {
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          },
          _count: {
            select: { registrations: true, documents: true },
          },
        },
      }),
      prisma.season.findMany({ orderBy: { code: "desc" } }),
    ]);

    return NextResponse.json({
      success: true,
      participants,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      seasons,
    });
  } catch (error) {
    console.error("Admin participants query error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
