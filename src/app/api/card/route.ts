import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
    }

    // Try finding by participant id, membershipCardNumber, or registration id
    let participant = await prisma.participant.findFirst({
      where: {
        OR: [{ id }, { membershipCardNumber: id }],
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

    // Fallback: check if id is a registration id
    if (!participant) {
      const reg = await prisma.registration.findUnique({
        where: { id },
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
      return NextResponse.json({ error: "Adhérent introuvable" }, { status: 404 });
    }

    // Check authorization: must be the participant owner OR an ADMIN
    if (participant.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

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
        phone: participant.phone,
        emergencyPhone: null,
        membershipCardNumber: participant.membershipCardNumber,
        rfidCardId: participant.rfidCardId,
      },
      registration: activeRegistration
        ? {
            reference: activeRegistration.reference,
            status: activeRegistration.status,
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
    });
  } catch (error) {
    console.error("Card fetch error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
