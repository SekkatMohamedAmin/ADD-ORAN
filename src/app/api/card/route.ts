import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
    }

    const trimmedId = id.trim();

    // 1. Try finding by participant id or membershipCardNumber
    let participant = await prisma.participant.findFirst({
      where: {
        OR: [{ id: trimmedId }, { membershipCardNumber: trimmedId }],
      },
      include: {
        documents: {
          where: { type: "PHOTO" },
        },
        registrations: {
          orderBy: { createdAt: "desc" },
          include: {
            season: true,
            disciplines: {
              include: {
                discipline: true,
              },
            },
            documents: {
              where: { type: "PHOTO" },
            },
          },
        },
      },
    });

    // 2. Fallback: check if id is a registration reference OR registration id
    if (!participant) {
      const reg = await prisma.registration.findFirst({
        where: {
          OR: [{ id: trimmedId }, { reference: trimmedId }],
        },
        include: {
          participant: {
            include: {
              documents: {
                where: { type: "PHOTO" },
              },
              registrations: {
                orderBy: { createdAt: "desc" },
                include: {
                  season: true,
                  disciplines: {
                    include: {
                      discipline: true,
                    },
                  },
                  documents: {
                    where: { type: "PHOTO" },
                  },
                },
              },
            },
          },
        },
      });
      if (reg) {
        participant = reg.participant;
      }
    }

    if (!participant) {
      return NextResponse.json({ error: "Adhérent ou carte introuvable" }, { status: 404 });
    }

    const isOwner = user ? participant.userId === user.id : false;
    const isAdmin = user ? user.role === "ADMIN" : false;
    const isOwnerOrAdmin = isOwner || isAdmin;

    const activeRegistration = participant.registrations?.[0] || null;
    const photoDocId =
      participant.documents?.[0]?.id ||
      activeRegistration?.documents?.[0]?.id ||
      null;

    return NextResponse.json({
      participant: {
        id: participant.id,
        firstName: participant.firstName,
        lastName: participant.lastName,
        dateOfBirth: participant.dateOfBirth.toISOString(),
        bloodType: participant.bloodType,
        isMinor: participant.isMinor,
        phone: isOwnerOrAdmin ? participant.phone : null, // Masked for public QR scans
        emergencyPhone: null,
        membershipCardNumber: participant.membershipCardNumber,
        rfidCardId: participant.rfidCardId,
        clubRole: participant.clubRole,
        isStaff: participant.isStaff,
      },
      registration: activeRegistration
        ? {
            id: activeRegistration.id,
            reference: activeRegistration.reference,
            status: activeRegistration.status,
            type: activeRegistration.type,
            season: {
              code: activeRegistration.season.code,
              label: activeRegistration.season.label,
            },
            disciplines: activeRegistration.disciplines.map((d) => ({
              discipline: {
                id: d.discipline.id,
                nameFr: d.discipline.nameFr,
                nameAr: d.discipline.nameAr,
                nameEn: d.discipline.nameEn,
                slug: d.discipline.slug,
              },
            })),
          }
        : null,
      photoDocId,
      isOwnerOrAdmin,
    });
  } catch (error) {
    console.error("Card fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
