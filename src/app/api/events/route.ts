import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();

    // Fetch upcoming events ordered by date asc
    const events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { date: "asc" },
      include: {
        attendances: {
          where: { status: "CONFIRMED" },
          select: {
            id: true,
            participantId: true,
            status: true,
          },
        },
      },
    });

    // If user is authenticated, find which participants belong to them
    let userParticipantIds: string[] = [];
    if (user) {
      const participants = await prisma.participant.findMany({
        where: { userId: user.id },
        select: { id: true },
      });
      userParticipantIds = participants.map((p) => p.id);
    }

    const formattedEvents = events.map((ev) => {
      const isAttending = ev.attendances.some((a) =>
        userParticipantIds.includes(a.participantId)
      );
      return {
        id: ev.id,
        title: ev.title,
        description: ev.description,
        discipline: ev.discipline,
        category: ev.category,
        date: ev.date.toISOString(),
        location: ev.location,
        capacity: ev.capacity,
        attendeeCount: ev.attendances.length,
        isAttending,
      };
    });

    return NextResponse.json({
      events: formattedEvents,
    });
  } catch (error) {
    console.error("Get events error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des événements." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Veuillez vous connecter pour confirmer votre présence." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { eventId, participantId } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: "Identifiant d'événement manquant." },
        { status: 400 }
      );
    }

    // Verify event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Événement introuvable." },
        { status: 404 }
      );
    }

    // Determine target participant
    let targetParticipantId = participantId;
    if (!targetParticipantId) {
      const firstParticipant = await prisma.participant.findFirst({
        where: { userId: user.id },
      });
      if (!firstParticipant) {
        return NextResponse.json(
          { error: "Aucun adhérent associé à ce compte." },
          { status: 404 }
        );
      }
      targetParticipantId = firstParticipant.id;
    } else {
      // Security check: ensure participant belongs to this user
      const ownsParticipant = await prisma.participant.findFirst({
        where: { id: targetParticipantId, userId: user.id },
      });
      if (!ownsParticipant && user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Action non autorisée sur cet adhérent." },
          { status: 403 }
        );
      }
    }

    // Check if attendance already exists
    const existing = await prisma.eventAttendance.findUnique({
      where: {
        eventId_participantId: {
          eventId,
          participantId: targetParticipantId,
        },
      },
    });

    let newStatus = "CONFIRMED";
    if (existing) {
      if (existing.status === "CONFIRMED") {
        newStatus = "CANCELLED";
      } else {
        newStatus = "CONFIRMED";
      }

      await prisma.eventAttendance.update({
        where: { id: existing.id },
        data: { status: newStatus },
      });
    } else {
      await prisma.eventAttendance.create({
        data: {
          eventId,
          participantId: targetParticipantId,
          status: "CONFIRMED",
        },
      });
    }

    // Get updated count
    const confirmedCount = await prisma.eventAttendance.count({
      where: { eventId, status: "CONFIRMED" },
    });

    return NextResponse.json({
      success: true,
      eventId,
      participantId: targetParticipantId,
      status: newStatus,
      isAttending: newStatus === "CONFIRMED",
      attendeeCount: confirmedCount,
    });
  } catch (error) {
    console.error("Toggle event attendance error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de votre présence." },
      { status: 500 }
    );
  }
}
