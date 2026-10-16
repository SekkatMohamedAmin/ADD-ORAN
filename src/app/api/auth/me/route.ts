import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureMembershipCardNumber } from "@/lib/membershipCard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          },
        }
      );
    }

    // Get all participants belonging to this user account (supports multi-child families & adult adherents)
    const participants = await prisma.participant.findMany({
      where: { userId: user.id, deletedAt: null },
      orderBy: { createdAt: "asc" },
      include: {
        registrations: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          include: {
            season: true,
            disciplines: {
              include: {
                discipline: true,
              },
            },
            documents: true,
            parentalAuthorization: true,
            payments: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
        eventAttendances: {
          include: {
            event: true,
          },
        },
      },
    });

    // Auto-generate electronic membership card for each participant if needed
    for (const p of participants) {
      if (!p.membershipCardNumber && p.registrations.length > 0) {
        try {
          const seasonCode = p.registrations[0]?.season?.code || "2026";
          const generatedCardNumber = await ensureMembershipCardNumber(p.id, seasonCode);
          p.membershipCardNumber = generatedCardNumber;
        } catch (genErr) {
          console.error("Auto card generation notice in /api/auth/me:", genErr);
        }
      }
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user.id,
          phone: user.phone,
          role: user.role,
          participant: participants[0] || null,
          participants,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ authenticated: false, error: "Internal server error" }, { status: 500 });
  }
}
