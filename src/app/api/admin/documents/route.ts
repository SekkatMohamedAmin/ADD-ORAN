import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const type = searchParams.get("type")?.trim() || "";
    const seasonCode = searchParams.get("season")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (type) {
      whereClause.type = type;
    }

    if (seasonCode) {
      whereClause.registration = {
        season: { code: seasonCode },
      };
    }

    if (search) {
      whereClause.OR = [
        { originalFilename: { contains: search } },
        {
          participant: {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
              { phone: { contains: search } },
            ],
          },
        },
        {
          registration: {
            reference: { contains: search },
          },
        },
      ];
    }

    const [totalCount, pendingCount, validCount, invalidCount, documents, seasons] =
      await Promise.all([
        prisma.document.count({ where: whereClause }),
        prisma.document.count({ where: { status: "PENDING" } }),
        prisma.document.count({ where: { status: "VALID" } }),
        prisma.document.count({ where: { status: "INVALID" } }),
        prisma.document.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            participant: true,
            registration: {
              select: {
                id: true,
                reference: true,
                status: true,
                season: true,
              },
            },
          },
        }),
        prisma.season.findMany({ orderBy: { code: "desc" } }),
      ]);

    return NextResponse.json({
      success: true,
      documents,
      stats: {
        total: totalCount,
        pending: pendingCount,
        valid: validCount,
        invalid: invalidCount,
      },
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      seasons,
    });
  } catch (error) {
    console.error("Admin documents query error:", error);
    if ((error as Error).message === "UNAUTHORIZED" || (error as Error).message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { documentId, status, rejectionReason } = body;

    if (!documentId || !["VALID", "INVALID", "PENDING"].includes(status)) {
      return NextResponse.json(
        { error: "Identifiant du document ou statut invalide." },
        { status: 400 }
      );
    }

    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: { participant: true, registration: true },
    });

    if (!doc) {
      return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
    }

    const updated = await prisma.document.update({
      where: { id: documentId },
      data: {
        status,
        rejectionReason: status === "INVALID" ? rejectionReason || "Document non conforme" : null,
      },
      include: { participant: true, registration: true },
    });

    await logAudit({
      action: status === "VALID" ? "DOCUMENT_VALIDATED" : "DOCUMENT_REJECTED",
      userId: admin.id,
      registrationId: doc.registrationId || undefined,
      details: {
        documentId: doc.id,
        type: doc.type,
        status,
        rejectionReason,
        participantId: doc.participantId,
      },
    });

    return NextResponse.json({
      success: true,
      document: updated,
    });
  } catch (error) {
    console.error("Admin document review error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de la mise à jour du document." },
      { status: 500 }
    );
  }
}
