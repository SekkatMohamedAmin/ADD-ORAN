import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getPricingConfig, savePricingConfig, PricingConfig } from "@/lib/pricing";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const pricing = await getPricingConfig();
    return NextResponse.json(
      { success: true, pricing },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("Admin pricing GET error:", error);
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body: Partial<PricingConfig> = await request.json();

    const saved = await savePricingConfig(body, admin.id);

    await logAudit({
      action: "REGISTRATION_REVIEWED",
      userId: admin.id,
      details: {
        action: "PRICING_CONFIG_UPDATED",
        insurance: saved.insurance,
        disciplines: Object.keys(saved.disciplines).map((slug) => ({
          slug,
          priceDzd: saved.disciplines[slug].priceDzd,
          frequency: saved.disciplines[slug].frequency,
        })),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Grille tarifaire enregistrée avec succès.",
      pricing: saved,
    });
  } catch (error: any) {
    console.error("Admin pricing POST error:", error);
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'enregistrement de la grille tarifaire." },
      { status: 500 }
    );
  }
}
