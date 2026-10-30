import { NextResponse } from "next/server";
import { getPricingConfig } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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
    console.error("Public pricing GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
