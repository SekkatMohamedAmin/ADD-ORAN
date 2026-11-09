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
  id: string; // e.g. "2026-09"
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

const MONTH_NAMES_MAP: Record<number, { fr: string; ar: string; en: string }> = {
  1: { fr: "Janvier", ar: "جانفي", en: "January" },
  2: { fr: "Février", ar: "فيفري", en: "February" },
  3: { fr: "Mars", ar: "مارس", en: "March" },
  4: { fr: "Avril", ar: "أفريل", en: "April" },
  5: { fr: "Mai", ar: "ماي", en: "May" },
  6: { fr: "Juin", ar: "جوان", en: "June" },
  7: { fr: "Juillet", ar: "جويلية", en: "July" },
  8: { fr: "Août", ar: "أوت", en: "August" },
  9: { fr: "Septembre", ar: "سبتمبر", en: "September" },
  10: { fr: "Octobre", ar: "أكتوبر", en: "October" },
  11: { fr: "Novembre", ar: "نوفمبر", en: "November" },
  12: { fr: "Décembre", ar: "ديسمبر", en: "December" },
};

/**
 * Dynamically generates the 10 official sporting calendar months (Sept to June)
 * for a specific season, ensuring no past/irrelevant years are included.
 */
export function generateSeasonMonths(
  season?: {
    code?: string;
    label?: string;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
  } | null
): SeasonMonthItem[] {
  let startYear: number | null = null;
  let endYear: number | null = null;

  // 1. Try from label (e.g. "2026-2027", "Saison 2026/2027", "2025/2026")
  if (season?.label) {
    const match = season.label.match(/(20\d\d)\s*[-/]\s*(20\d\d)/);
    if (match) {
      startYear = parseInt(match[1], 10);
      endYear = parseInt(match[2], 10);
    }
  }

  // 2. Try from startDate and endDate
  if (!startYear && season?.startDate) {
    const sDate = new Date(season.startDate);
    if (!isNaN(sDate.getTime())) {
      startYear = sDate.getFullYear();
      if (season?.endDate) {
        const eDate = new Date(season.endDate);
        if (!isNaN(eDate.getTime())) {
          endYear = eDate.getFullYear();
        }
      }
      if (!endYear) {
        endYear = startYear + 1;
      }
    }
  }

  // 3. Try from code (e.g. "2027" -> spans 2026 to 2027, "2026" -> spans 2025 to 2026)
  if (!startYear && season?.code) {
    const codeNum = parseInt(season.code, 10);
    if (!isNaN(codeNum) && codeNum >= 2000 && codeNum <= 2100) {
      startYear = codeNum - 1;
      endYear = codeNum;
    }
  }

  // 4. Fallback based on current date (if after August, current year is startYear)
  if (!startYear || !endYear) {
    const now = new Date();
    const currYear = now.getFullYear();
    const currMonth = now.getMonth() + 1;
    if (currMonth >= 8) {
      startYear = currYear;
      endYear = currYear + 1;
    } else {
      startYear = currYear - 1;
      endYear = currYear;
    }
  }

  // Standard 10 active club training months: Sept (9), Oct (10), Nov (11), Dec (12) of startYear,
  // followed by Jan (1), Feb (2), Mar (3), Apr (4), May (5), Jun (6) of endYear.
  const monthsDefs: Array<{ year: number; month: number }> = [
    { year: startYear, month: 9 },
    { year: startYear, month: 10 },
    { year: startYear, month: 11 },
    { year: startYear, month: 12 },
    { year: endYear, month: 1 },
    { year: endYear, month: 2 },
    { year: endYear, month: 3 },
    { year: endYear, month: 4 },
    { year: endYear, month: 5 },
    { year: endYear, month: 6 },
  ];

  return monthsDefs.map(({ year, month }) => {
    const id = `${year}-${month.toString().padStart(2, "0")}`;
    const names = MONTH_NAMES_MAP[month] || { fr: `Mois ${month}`, ar: `شهر ${month}`, en: `Month ${month}` };
    return {
      id,
      year,
      month,
      labelFr: `${names.fr} ${year}`,
      labelAr: `${names.ar} ${year}`,
      labelEn: `${names.en} ${year}`,
    };
  });
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
  seasonMonths: generateSeasonMonths(null),
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
      createdAt?: string | Date;
      submittedAt?: string | Date;
      season?: {
        code?: string;
        label?: string;
        startDate?: string | Date | null;
        endDate?: string | Date | null;
      } | null;
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
        paymentPurpose?: string | null;
      }>;
    }>;
  },
  pricing: PricingConfig = DEFAULT_PRICING,
  currentDate = new Date()
): ParticipantFeeBreakdown {
  const activeReg = participant.registrations?.[0];
  const chosenSlugs = new Set(
    activeReg?.disciplines?.map((d) => d.discipline.slug) || []
  );

  const items: FeeItem[] = [];

  // 1. Insurance (Annual mandatory)
  if (pricing.insurance.enabled) {
    items.push({
      id: "insurance",
      name: pricing.insurance.name,
      type: "insurance",
      priceDzd: pricing.insurance.priceDzd,
      frequency: pricing.insurance.frequency,
    });
  }

  // 2. Selected Disciplines
  for (const slug of Array.from(chosenSlugs)) {
    const dConfig = pricing.disciplines[slug];
    if (dConfig && dConfig.enabled) {
      items.push({
        id: `discipline-${slug}`,
        name: dConfig.name,
        type: "discipline",
        disciplineSlug: slug,
        priceDzd: dConfig.priceDzd,
        frequency: dConfig.frequency,
      });
    } else if (slug === "parkour") {
      items.push({
        id: "discipline-parkour",
        name: "Parkour",
        type: "discipline",
        disciplineSlug: "parkour",
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

  // Monthly Schedule Calculation based strictly on the registration's actual season
  const seasonMonths = activeReg?.season
    ? generateSeasonMonths(activeReg.season)
    : (pricing.seasonMonths && pricing.seasonMonths.length > 0
        ? pricing.seasonMonths
        : generateSeasonMonths(null));

  const currentYear = currentDate.getFullYear();
  const currentMonthNum = currentDate.getMonth() + 1; // 1-12
  const currentDay = currentDate.getDate();

  // Season start date & registration join date
  const seasonStartDate = activeReg?.season?.startDate
    ? new Date(activeReg.season.startDate)
    : null;
  const regDate = activeReg?.createdAt || activeReg?.submittedAt
    ? new Date(activeReg?.createdAt || activeReg?.submittedAt!)
    : null;

  // Allocation of payments:
  let remainingPaid = totalPaidDzd;
  const annualCovered = remainingPaid >= annualTotalDzd;
  remainingPaid = Math.max(0, remainingPaid - annualTotalDzd);

  let monthsCoveredCount = monthlyTotalDzd > 0 ? Math.floor(remainingPaid / monthlyTotalDzd) : 999;

  let hasOverdueMonthly = false;
  let overdueMonthLabel: string | undefined;

  const monthlySchedule: MonthScheduleStatus[] = seasonMonths.map((m) => {
    const isPast = m.year < currentYear || (m.year === currentYear && m.month < currentMonthNum);
    const isCurrent = m.year === currentYear && m.month === currentMonthNum;

    // Check if this month is before the season started or before the member enrolled
    let isMonthBeforeJoining = false;
    if (seasonStartDate && !isNaN(seasonStartDate.getTime())) {
      const sYear = seasonStartDate.getFullYear();
      const sMonth = seasonStartDate.getMonth() + 1;
      if (m.year < sYear || (m.year === sYear && m.month < sMonth)) {
        isMonthBeforeJoining = true;
      }
    }
    if (regDate && !isNaN(regDate.getTime())) {
      const rYear = regDate.getFullYear();
      const rMonth = regDate.getMonth() + 1;
      if (m.year < rYear || (m.year === rYear && m.month < rMonth)) {
        isMonthBeforeJoining = true;
      }
    }

    let isPaid = false;
    if (monthlyTotalDzd === 0) {
      isPaid = annualCovered;
    } else {
      // Check if a payment explicitly mentions this month in its purpose
      const monthQuery = m.labelFr.toLowerCase();
      const specificPay = validPayments.find(
        (pay) => pay.paymentPurpose && pay.paymentPurpose.toLowerCase().includes(monthQuery)
      );

      if (specificPay) {
        isPaid = true;
      } else if (monthsCoveredCount > 0) {
        isPaid = true;
        monthsCoveredCount--;
      }
    }

    let isLate = false;
    // A month is only late if it is within the active season, after enrolling, unpaid, and past or current after deadline
    if (!isPaid && monthlyTotalDzd > 0 && !isMonthBeforeJoining) {
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
      createdAt?: string | Date;
      submittedAt?: string | Date;
      season?: {
        code?: string;
        label?: string;
        startDate?: string | Date | null;
        endDate?: string | Date | null;
      } | null;
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
        paymentPurpose?: string | null;
      }>;
    }>;
  }>,
  pricing: PricingConfig = DEFAULT_PRICING,
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
