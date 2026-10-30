export type FeeFrequency = "annual" | "monthly";

export interface DisciplinePricingItem {
  slug: string;
  name: string;
  priceDzd: number;
  frequency: FeeFrequency;
  enabled: boolean;
}

export interface InsurancePricingItem {
  name: string;
  priceDzd: number;
  frequency: FeeFrequency;
  enabled: boolean;
}

export interface SeasonMonthItem {
  id: string; // e.g. "2025-09"
  year: number;
  month: number; // 1-12
  labelFr: string;
  labelAr: string;
  labelEn: string;
}

export interface PricingConfig {
  insurance: InsurancePricingItem;
  disciplines: Record<string, DisciplinePricingItem>;
  paymentDeadlineDay: number; // e.g. 5 (5th day of month)
  seasonMonths: SeasonMonthItem[];
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_PRICING: PricingConfig = {
  insurance: {
    name: "Assurance & Adhésion annuelle club",
    priceDzd: 1500,
    frequency: "annual",
    enabled: true,
  },
  disciplines: {
    parkour: {
      slug: "parkour",
      name: "Parkour",
      priceDzd: 1500,
      frequency: "monthly",
      enabled: true,
    },
    "escalade-montagne": {
      slug: "escalade-montagne",
      name: "Escalade & sports de montagne",
      priceDzd: 2500,
      frequency: "annual",
      enabled: true,
    },
    trail: {
      slug: "trail",
      name: "Trail",
      priceDzd: 2000,
      frequency: "annual",
      enabled: true,
    },
  },
  paymentDeadlineDay: 5,
  seasonMonths: [
    { id: "2025-09", year: 2025, month: 9, labelFr: "Septembre 2025", labelAr: "سبتمبر 2025", labelEn: "September 2025" },
    { id: "2025-10", year: 2025, month: 10, labelFr: "Octobre 2025", labelAr: "أكتوبر 2025", labelEn: "October 2025" },
    { id: "2025-11", year: 2025, month: 11, labelFr: "Novembre 2025", labelAr: "نوفمبر 2025", labelEn: "November 2025" },
    { id: "2025-12", year: 2025, month: 12, labelFr: "Décembre 2025", labelAr: "ديسمبر 2025", labelEn: "December 2025" },
    { id: "2026-01", year: 2026, month: 1, labelFr: "Janvier 2026", labelAr: "جانفي 2026", labelEn: "January 2026" },
    { id: "2026-02", year: 2026, month: 2, labelFr: "Février 2026", labelAr: "فيفري 2026", labelEn: "February 2026" },
    { id: "2026-03", year: 2026, month: 3, labelFr: "Mars 2026", labelAr: "مارس 2026", labelEn: "March 2026" },
    { id: "2026-04", year: 2026, month: 4, labelFr: "Avril 2026", labelAr: "أفريل 2026", labelEn: "April 2026" },
    { id: "2026-05", year: 2026, month: 5, labelFr: "Mai 2026", labelAr: "ماي 2026", labelEn: "May 2026" },
    { id: "2026-06", year: 2026, month: 6, labelFr: "Juin 2026", labelAr: "جوان 2026", labelEn: "June 2026" },
  ],
};

export interface FeeItem {
  id: string;
  name: string;
  type: "insurance" | "discipline";
  disciplineSlug?: string;
  priceDzd: number;
  frequency: FeeFrequency;
}

export interface MonthScheduleStatus {
  id: string;
  label: string;
  year: number;
  month: number;
  monthlyAmountDzd: number;
  isPast: boolean;
  isCurrent: boolean;
  isPaid: boolean;
  isLate: boolean;
}

export interface ParticipantFeeBreakdown {
  participantId: string;
  participantName: string;
  isMinor: boolean;
  registrationId?: string;
  status: string;
  items: FeeItem[];
  annualTotalDzd: number;
  monthlyTotalDzd: number;
  totalPaidDzd: number;
  paymentsCount: number;
  monthlySchedule: MonthScheduleStatus[];
  isFullyPaid: boolean;
  hasOverdueMonthly: boolean;
  overdueMonthLabel?: string;
}

export interface FamilyFeesSummary {
  participantsCount: number;
  totalAnnualDueDzd: number;
  totalMonthlyDueDzd: number;
  totalPaidDzd: number;
  balanceDueInitialDzd: number;
  hasAnyOverdue: boolean;
  breakdowns: ParticipantFeeBreakdown[];
}

export function computeParticipantFees(
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    isMinor: boolean;
    registrations?: Array<{
      id: string;
      status: string;
      disciplines?: Array<{
        discipline: {
          slug: string;
          nameFr: string;
        };
      }>;
      payments?: Array<{
        amount: number;
        status?: string;
        paidAt?: string | Date;
      }>;
    }>;
  },
  pricing: PricingConfig,
  currentDate = new Date()
): ParticipantFeeBreakdown {
  const activeReg = participant.registrations?.[0];
  const chosenSlugs = new Set(
    activeReg?.disciplines?.map((d) => d.discipline.slug) || []
  );

  const items: FeeItem[] = [];

  // 1. Insurance fee
  if (pricing.insurance.enabled && pricing.insurance.priceDzd > 0) {
    items.push({
      id: "insurance",
      name: pricing.insurance.name || "Assurance & Adhésion annuelle",
      type: "insurance",
      priceDzd: pricing.insurance.priceDzd,
      frequency: pricing.insurance.frequency || "annual",
    });
  }

  // 2. Disciplines fees
  for (const slug of Array.from(chosenSlugs)) {
    const discPricing = pricing.disciplines[slug];
    if (discPricing && discPricing.enabled) {
      items.push({
        id: `discipline-${slug}`,
        name: discPricing.name || slug,
        type: "discipline",
        disciplineSlug: slug,
        priceDzd: discPricing.priceDzd,
        frequency: discPricing.frequency,
      });
    } else {
      items.push({
        id: `discipline-${slug}`,
        name: slug.toUpperCase(),
        type: "discipline",
        disciplineSlug: slug,
        priceDzd: 1500,
        frequency: "monthly",
      });
    }
  }

  const annualItems = items.filter((i) => i.frequency === "annual");
  const monthlyItems = items.filter((i) => i.frequency === "monthly");

  const annualTotalDzd = annualItems.reduce((acc, curr) => acc + curr.priceDzd, 0);
  const monthlyTotalDzd = monthlyItems.reduce((acc, curr) => acc + curr.priceDzd, 0);

  // Total paid by member so far
  const validPayments = activeReg?.payments?.filter((p) => (p.status || "PAID") === "PAID") || [];
  const totalPaidDzd = validPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const paymentsCount = validPayments.length;

  // Monthly Schedule Calculation
  const currentYear = currentDate.getFullYear();
  const currentMonthNum = currentDate.getMonth() + 1; // 1-12
  const currentDay = currentDate.getDate();

  // Allocation of payments:
  let remainingPaid = totalPaidDzd;
  const annualCovered = remainingPaid >= annualTotalDzd;
  remainingPaid = Math.max(0, remainingPaid - annualTotalDzd);

  let monthsCoveredCount = monthlyTotalDzd > 0 ? Math.floor(remainingPaid / monthlyTotalDzd) : 999;

  let hasOverdueMonthly = false;
  let overdueMonthLabel: string | undefined;

  const monthlySchedule: MonthScheduleStatus[] = pricing.seasonMonths.map((m) => {
    const isPast = m.year < currentYear || (m.year === currentYear && m.month < currentMonthNum);
    const isCurrent = m.year === currentYear && m.month === currentMonthNum;

    let isPaid = false;
    if (monthlyTotalDzd === 0) {
      isPaid = annualCovered;
    } else if (monthsCoveredCount > 0) {
      isPaid = true;
      monthsCoveredCount--;
    }

    let isLate = false;
    if (!isPaid && monthlyTotalDzd > 0) {
      if (isPast) {
        isLate = true;
      } else if (isCurrent && currentDay > pricing.paymentDeadlineDay) {
        isLate = true;
      }
    }

    if (isLate && !hasOverdueMonthly) {
      hasOverdueMonthly = true;
      overdueMonthLabel = m.labelFr;
    }

    return {
      id: m.id,
      label: m.labelFr,
      year: m.year,
      month: m.month,
      monthlyAmountDzd: monthlyTotalDzd,
      isPast,
      isCurrent,
      isPaid,
      isLate,
    };
  });

  const isFullyPaid = (annualTotalDzd === 0 || annualCovered) && !hasOverdueMonthly;

  return {
    participantId: participant.id,
    participantName: `${participant.firstName} ${participant.lastName}`,
    isMinor: participant.isMinor,
    registrationId: activeReg?.id,
    status: activeReg?.status || "DRAFT",
    items,
    annualTotalDzd,
    monthlyTotalDzd,
    totalPaidDzd,
    paymentsCount,
    monthlySchedule,
    isFullyPaid,
    hasOverdueMonthly,
    overdueMonthLabel,
  };
}

export function computeFamilyFees(
  participants: Array<{
    id: string;
    firstName: string;
    lastName: string;
    isMinor: boolean;
    registrations?: Array<{
      id: string;
      status: string;
      disciplines?: Array<{
        discipline: {
          slug: string;
          nameFr: string;
        };
      }>;
      payments?: Array<{
        amount: number;
        status?: string;
        paidAt?: string | Date;
      }>;
    }>;
  }>,
  pricing: PricingConfig,
  currentDate = new Date()
): FamilyFeesSummary {
  const breakdowns = participants.map((p) => computeParticipantFees(p, pricing, currentDate));

  const totalAnnualDueDzd = breakdowns.reduce((sum, b) => sum + b.annualTotalDzd, 0);
  const totalMonthlyDueDzd = breakdowns.reduce((sum, b) => sum + b.monthlyTotalDzd, 0);
  const totalPaidDzd = breakdowns.reduce((sum, b) => sum + b.totalPaidDzd, 0);
  const balanceDueInitialDzd = Math.max(0, (totalAnnualDueDzd + totalMonthlyDueDzd) - totalPaidDzd);
  const hasAnyOverdue = breakdowns.some((b) => b.hasOverdueMonthly);

  return {
    participantsCount: participants.length,
    totalAnnualDueDzd,
    totalMonthlyDueDzd,
    totalPaidDzd,
    balanceDueInitialDzd,
    hasAnyOverdue,
    breakdowns,
  };
}
