import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPricingConfig } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const seasonCode = searchParams.get("season")?.trim() || "";
    const search = searchParams.get("search")?.trim() || "";
    const stateFilter = searchParams.get("state")?.trim() || "ALL"; // ALL | UP_TO_DATE | OVERDUE | PENDING | EXEMPT

    // 1. Resolve Season
    const activeSeason = await prisma.season.findFirst({ where: { isActive: true } });
    const effectiveSeasonCode = seasonCode && seasonCode !== "ALL" ? seasonCode : (activeSeason?.code || "2026");

    const pricing = await getPricingConfig();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthNum = currentDate.getMonth() + 1; // 1-12
    const currentDay = currentDate.getDate();

    // 2. Build where filter for registrations
    const whereClause: any = {
      deletedAt: null,
      status: { notIn: ["REJECTED", "ARCHIVED"] },
    };

    if (effectiveSeasonCode !== "ALL") {
      whereClause.season = { code: effectiveSeasonCode };
    }

    if (search) {
      whereClause.OR = [
        { reference: { contains: search } },
        { participant: { firstName: { contains: search } } },
        { participant: { lastName: { contains: search } } },
        { participant: { phone: { contains: search } } },
      ];
    }

    // 3. Query all registrations with participant, disciplines, and payments
    const registrations = await prisma.registration.findMany({
      where: whereClause,
      include: {
        participant: true,
        disciplines: {
          include: {
            discipline: true,
          },
        },
        payments: {
          where: { status: "PAID" },
          orderBy: { paidAt: "asc" },
        },
        season: true,
      },
      orderBy: [
        { participant: { lastName: "asc" } },
        { participant: { firstName: "asc" } },
      ],
    });

    const seasons = await prisma.season.findMany({ orderBy: { code: "desc" } });

    // 4. Compute payment calendar data per adherent
    let totalCollectedDzd = 0;
    let expectedMonthlyRevenueDzd = 0;
    let upToDateCount = 0;
    let overdueCount = 0;
    let pendingCount = 0;
    let exemptStaffCount = 0;

    const calendarItems = registrations.map((reg) => {
      const p = reg.participant;
      const isStaff = Boolean(p.isStaff || p.clubRole || reg.type === "STAFF");

      // Calculate annual and monthly fees for this participant
      const chosenSlugs = new Set(reg.disciplines.map((d) => d.discipline.slug));
      let annualTotalDzd = 0;
      let monthlyTotalDzd = 0;

      if (!isStaff) {
        if (pricing.insurance.enabled && pricing.insurance.priceDzd > 0) {
          if (pricing.insurance.frequency === "annual") {
            annualTotalDzd += pricing.insurance.priceDzd;
          } else {
            monthlyTotalDzd += pricing.insurance.priceDzd;
          }
        }

        for (const slug of Array.from(chosenSlugs)) {
          const disc = pricing.disciplines[slug];
          if (disc && disc.enabled) {
            if (disc.frequency === "annual") {
              annualTotalDzd += disc.priceDzd;
            } else {
              monthlyTotalDzd += disc.priceDzd;
            }
          } else {
            monthlyTotalDzd += 1500;
          }
        }
      }

      expectedMonthlyRevenueDzd += monthlyTotalDzd;

      // Payments made by this adherent
      const payments = reg.payments || [];
      const totalPaidDzd = payments.reduce((sum, pay) => sum + pay.amount, 0);
      totalCollectedDzd += totalPaidDzd;

      // Monthly Schedule Allocation
      let remainingPaymentCredit = totalPaidDzd;
      const annualCovered = remainingPaymentCredit >= annualTotalDzd;
      remainingPaymentCredit = Math.max(0, remainingPaymentCredit - annualTotalDzd);

      let monthsCoveredCount = monthlyTotalDzd > 0 ? Math.floor(remainingPaymentCredit / monthlyTotalDzd) : 999;
      let hasOverdue = false;
      const overdueMonths: string[] = [];

      const schedule = pricing.seasonMonths.map((m, mIndex) => {
        const isPast = m.year < currentYear || (m.year === currentYear && m.month < currentMonthNum);
        const isCurrent = m.year === currentYear && m.month === currentMonthNum;
        const isFuture = m.year > currentYear || (m.year === currentYear && m.month > currentMonthNum);

        let isPaid = false;
        let matchedPayment: any = null;

        if (isStaff) {
          isPaid = true;
        } else if (monthlyTotalDzd === 0) {
          isPaid = annualCovered;
        } else {
          // Check if a payment specifically mentions this month in its purpose
          const monthQuery = m.labelFr.toLowerCase();
          const specificPay = payments.find(
            (pay) => pay.paymentPurpose && pay.paymentPurpose.toLowerCase().includes(monthQuery)
          );

          if (specificPay) {
            isPaid = true;
            matchedPayment = specificPay;
          } else if (monthsCoveredCount > 0) {
            isPaid = true;
            matchedPayment = payments[Math.min(mIndex, payments.length - 1)] || payments[0];
            monthsCoveredCount--;
          }
        }

        let isLate = false;
        if (!isStaff && !isPaid && monthlyTotalDzd > 0) {
          if (isPast) {
            isLate = true;
          } else if (isCurrent && currentDay > pricing.paymentDeadlineDay) {
            isLate = true;
          }
        }

        if (isLate) {
          hasOverdue = true;
          overdueMonths.push(m.labelFr);
        }

        return {
          id: m.id,
          label: m.labelFr,
          labelShort: m.labelFr.split(" ")[0],
          year: m.year,
          month: m.month,
          monthlyAmountDzd: monthlyTotalDzd,
          isPaid,
          isLate,
          isCurrent,
          isFuture,
          receiptNumber: matchedPayment?.receiptNumber || null,
          paidAt: matchedPayment?.paidAt || null,
        };
      });

      // Adherent State Classification
      let userState: "UP_TO_DATE" | "OVERDUE" | "PENDING_INITIAL" | "EXEMPT_STAFF" = "UP_TO_DATE";
      if (isStaff) {
        userState = "EXEMPT_STAFF";
        exemptStaffCount++;
      } else if (hasOverdue) {
        userState = "OVERDUE";
        overdueCount++;
      } else if (totalPaidDzd === 0 && reg.status !== "ACTIVE") {
        userState = "PENDING_INITIAL";
        pendingCount++;
      } else {
        userState = "UP_TO_DATE";
        upToDateCount++;
      }

      return {
        registrationId: reg.id,
        reference: reg.reference,
        status: reg.status,
        type: reg.type,
        participantId: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        fullName: `${p.firstName} ${p.lastName}`,
        phone: p.phone,
        isMinor: p.isMinor,
        isStaff,
        clubRole: p.clubRole,
        disciplines: reg.disciplines.map((d) => d.discipline.nameFr),
        annualTotalDzd,
        monthlyTotalDzd,
        totalPaidDzd,
        paymentsCount: payments.length,
        latestPayment: payments.length > 0 ? payments[payments.length - 1] : null,
        schedule,
        userState,
        overdueMonths,
      };
    });

    // Filter by state if requested
    const filteredItems = calendarItems.filter((item) => {
      if (stateFilter === "ALL") return true;
      if (stateFilter === "OVERDUE") return item.userState === "OVERDUE";
      if (stateFilter === "UP_TO_DATE") return item.userState === "UP_TO_DATE";
      if (stateFilter === "PENDING") return item.userState === "PENDING_INITIAL";
      if (stateFilter === "EXEMPT") return item.userState === "EXEMPT_STAFF";
      return true;
    });

    return NextResponse.json({
      success: true,
      currentSeasonCode: effectiveSeasonCode,
      seasons,
      months: pricing.seasonMonths,
      paymentDeadlineDay: pricing.paymentDeadlineDay,
      stats: {
        totalMembers: calendarItems.length,
        upToDateCount,
        overdueCount,
        pendingCount,
        exemptStaffCount,
        totalCollectedDzd,
        expectedMonthlyRevenueDzd,
      },
      adherents: filteredItems,
    });
  } catch (error: any) {
    console.error("Admin payments calendar GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur serveur lors de la récupération du calendrier." },
      { status: 500 }
    );
  }
}
