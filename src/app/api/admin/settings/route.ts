import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import { logAudit } from "@/lib/audit";

const SETTINGS_FILE = path.join(process.cwd(), "storage", "settings.json");

const DEFAULT_SETTINGS = {
  clubName: "Club Art Du Déplacement Parkour Oran",
  clubAddress: "Palais des Sports / Front de Mer, Oran, Algérie",
  clubPhone: "0555 00 00 00",
  clubEmail: "contact@add-oran.dz",
  annualContributionDzd: 4000,
  monthlyContributionDzd: 2500,
  registrationOpen: true,
  receiptPrefix: "ADD-PAY",
};

async function getSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function saveSettings(settings: typeof DEFAULT_SETTINGS) {
  await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings GET error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();

    const current = await getSettings();
    const updated = {
      ...current,
      clubName: body.clubName?.trim() || current.clubName,
      clubAddress: body.clubAddress?.trim() || current.clubAddress,
      clubPhone: body.clubPhone?.trim() || current.clubPhone,
      clubEmail: body.clubEmail?.trim() || current.clubEmail,
      annualContributionDzd: parseFloat(body.annualContributionDzd) || current.annualContributionDzd,
      monthlyContributionDzd: parseFloat(body.monthlyContributionDzd) || current.monthlyContributionDzd,
      registrationOpen: typeof body.registrationOpen === "boolean" ? body.registrationOpen : current.registrationOpen,
      receiptPrefix: body.receiptPrefix?.trim() || current.receiptPrefix,
    };

    await saveSettings(updated);

    await logAudit({
      action: "REGISTRATION_REVIEWED",
      userId: admin.id,
      details: {
        action: "SETTINGS_UPDATED",
        updatedFields: Object.keys(body),
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
