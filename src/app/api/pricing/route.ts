import { NextResponse } from "next/server";
import { getPricingConfig, generateSeasonMonths } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pricing = await getPricingConfig();
    const activeSeason = await prisma.season.findFirst({
      where: { isActive: true },
      orderBy: { code: "desc" },
    });

    const activeSeasonMonths = generateSeasonMonths(activeSeason);
    const enrichedPricing = {
      ...pricing,
      seasonMonths: activeSeasonMonths,
    };

    return NextResponse.json(
      { success: true, pricing: enrichedPricing },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("Public pricing GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
