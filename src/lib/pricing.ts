import fs from "fs/promises";
import path from "path";
import { PricingConfig, DEFAULT_PRICING } from "./pricing-utils";

export * from "./pricing-utils";

const PRICING_FILE = path.join(process.cwd(), "storage", "pricing.json");

export async function getPricingConfig(): Promise<PricingConfig> {
  try {
    const raw = await fs.readFile(PRICING_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PRICING,
      ...parsed,
      insurance: { ...DEFAULT_PRICING.insurance, ...(parsed.insurance || {}) },
      disciplines: { ...DEFAULT_PRICING.disciplines, ...(parsed.disciplines || {}) },
      seasonMonths: parsed.seasonMonths && parsed.seasonMonths.length > 0 ? parsed.seasonMonths : DEFAULT_PRICING.seasonMonths,
    };
  } catch {
    return DEFAULT_PRICING;
  }
}

export async function savePricingConfig(newConfig: Partial<PricingConfig>, adminUserId?: string): Promise<PricingConfig> {
  const current = await getPricingConfig();
  const merged: PricingConfig = {
    ...current,
    ...newConfig,
    insurance: { ...current.insurance, ...(newConfig.insurance || {}) },
    disciplines: { ...current.disciplines, ...(newConfig.disciplines || {}) },
    seasonMonths: newConfig.seasonMonths || current.seasonMonths,
    updatedAt: new Date().toISOString(),
    updatedBy: adminUserId || current.updatedBy,
  };

  await fs.mkdir(path.dirname(PRICING_FILE), { recursive: true });
  await fs.writeFile(PRICING_FILE, JSON.stringify(merged, null, 2), "utf-8");
  return merged;
}
