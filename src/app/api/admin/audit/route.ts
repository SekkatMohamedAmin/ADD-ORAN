import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action")?.trim() || "";
    const search = searchParams.get("search")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "25", 10)));
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (action) {
      whereClause.action = action;
    }

    if (search) {
      whereClause.OR = [
        { details: { contains: search } },
        { action: { contains: search } },
        {
          registration: {
            OR: [
              { reference: { contains: search } },
              {
                participant: {
                  OR: [
                    { firstName: { contains: search } },
                    { lastName: { contains: search } },
                  ],
                },
              },
            ],
          },
        },
        {
          user: {
            phone: { contains: search },
          },
        },
      ];
    }

    const [totalCount, logs] = await Promise.all([
      prisma.auditLog.count({ where: whereClause }),
      prisma.auditLog.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { phone: true, role: true },
          },
          registration: {
            select: {
              reference: true,
              participant: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      }),
    ]);

    // Distinct actions for filter dropdown
    const distinctActions = [
      "REGISTRATION_SUBMITTED",
      "REGISTRATION_REVIEWED",
      "REGISTRATION_ACCEPTED",
      "REGISTRATION_REJECTED",
      "CORRECTION_REQUESTED",
      "REGISTRATION_RESUBMITTED",
      "DOCUMENT_VIEWED",
      "DOCUMENT_VALIDATED",
      "DOCUMENT_REJECTED",
      "PAYMENT_RECORDED",
      "DUPLICATE_FLAGGED",
      "DUPLICATE_RESOLVED",
      "MEMBER_ARCHIVED",
      "PASSWORD_RESET",
    ];

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      distinctActions,
    });
  } catch (error) {
    console.error("Admin audit query error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
