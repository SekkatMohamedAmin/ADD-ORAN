import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  buildInsuranceRows,
  buildInsuranceExcelBuffer,
  generateInsurancePdf,
} from "@/lib/insuranceExport";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const seasonCode = searchParams.get("season")?.trim() || "";
    const ageCategory = searchParams.get("ageCategory")?.trim() || ""; // "minor" | "adult"
    const statusFilter = (searchParams.get("status")?.trim() || "ACTIVE_PAID_ONLY") as "ALL" | "ACTIVE_PAID_ONLY";
    const format = searchParams.get("format")?.trim() || "json"; // "json" | "xlsx" | "pdf"

    const whereClause: any = {
      deletedAt: null,
    };

    if (ageCategory === "minor") {
      whereClause.isMinor = true;
    } else if (ageCategory === "adult") {
      whereClause.isMinor = false;
    }

    const activeSeason = await prisma.season.findFirst({ where: { isActive: true } });
    const effectiveSeason = seasonCode ? seasonCode : (activeSeason?.code || "");

    if (effectiveSeason && effectiveSeason !== "ALL") {
      whereClause.registrations = {
        some: {
          season: {
            code: effectiveSeason,
          },
        },
      };
    }

    if (search) {
      const terms = search.split(/\s+/).filter(Boolean);
      if (terms.length > 1) {
        whereClause.AND = terms.map((term: string) => ({
          OR: [
            { firstName: { contains: term } },
            { lastName: { contains: term } },
            { phone: { contains: term } },
            { email: { contains: term } },
            {
              registrations: {
                some: {
                  reference: { contains: term },
                },
              },
            },
          ],
        }));
      } else {
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
    }

    // Fetch all matching participants (no pagination limit for export/insurance list)
    const participants = await prisma.participant.findMany({
      where: whereClause,
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
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
      },
    });

    const targetSeasonObj = effectiveSeason && effectiveSeason !== "ALL"
      ? await prisma.season.findUnique({ where: { code: effectiveSeason } })
      : activeSeason;

    const { rows, metadata } = buildInsuranceRows(participants, {
      seasonCode: effectiveSeason,
      seasonLabel: targetSeasonObj?.label || (effectiveSeason ? `Saison ${effectiveSeason}` : "Toutes Saisons"),
      statusFilter,
    });

    const dateSlug = new Date().toISOString().slice(0, 10);
    const seasonSlug = (effectiveSeason || "ALL").replace(/[^a-zA-Z0-9_-]/g, "_");

    if (format === "xlsx") {
      const buffer = buildInsuranceExcelBuffer(rows, metadata);
      const filename = `ADD_Oran_Assurance_Adherents_${seasonSlug}_${dateSlug}.xlsx`;

      return new Response(buffer as any, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": String(buffer.length),
        },
      });
    }

    if (format === "pdf") {
      const pdf = generateInsurancePdf(rows, metadata);
      const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
      const filename = `ADD_Oran_Bordereau_Assurance_${seasonSlug}_${dateSlug}.pdf`;

      return new Response(pdfBuffer as any, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${filename}"`,
          "Content-Length": String(pdfBuffer.length),
        },
      });
    }

    // Default JSON format
    return NextResponse.json({
      success: true,
      rows,
      metadata,
    });
  } catch (error: any) {
    console.error("Export participants error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erreur lors de l'exportation des adhérents",
      },
      { status: error.status || 500 }
    );
  }
}
