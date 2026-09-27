import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Get registration info if participant
    const participant = await prisma.participant.findFirst({
      where: { userId: user.id },
      include: {
        registrations: {
          orderBy: { createdAt: "desc" },
          take: 1,
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
      },
    });

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        participant,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ authenticated: false, error: "Internal server error" }, { status: 500 });
  }
}
