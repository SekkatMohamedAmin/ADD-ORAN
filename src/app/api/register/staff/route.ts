import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { generateRegistrationReference } from "@/lib/sequences";
import { createSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { CLUB_ROLES, ClubRoleKey } from "@/lib/clubRoles";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // 1. Mandatory Identity Fields
    const firstName = formData.get("firstName")?.toString()?.trim() || "";
    const lastName = formData.get("lastName")?.toString()?.trim() || "";
    const dateOfBirthRaw = formData.get("dateOfBirth")?.toString() || "";
    const bloodType = formData.get("bloodType")?.toString()?.trim() || "";
    const clubRole = formData.get("clubRole")?.toString()?.trim() as ClubRoleKey;
    const phone = formData.get("phone")?.toString()?.trim() || "";
    const password = formData.get("password")?.toString() || "";

    if (!firstName || !lastName || !dateOfBirthRaw || !bloodType || !clubRole || !phone) {
      return NextResponse.json(
        {
          error:
            "Tous les champs obligatoires doivent être renseignés : nom, prénom, fonction, date de naissance, groupe sanguin et téléphone.",
        },
        { status: 400 }
      );
    }

    if (!CLUB_ROLES[clubRole]) {
      return NextResponse.json(
        { error: "Rôle / Fonction d'encadrement invalide." },
        { status: 400 }
      );
    }

    const dateOfBirth = new Date(dateOfBirthRaw);
    if (isNaN(dateOfBirth.getTime())) {
      return NextResponse.json(
        { error: "Date de naissance invalide." },
        { status: 400 }
      );
    }

    // 2. Photo validation
    const photoFile = formData.get("photo") as File | null;
    if (!photoFile || !(photoFile instanceof File) || photoFile.size === 0) {
      return NextResponse.json(
        { error: "La photo d'identité est obligatoire pour l'établissement de la carte officielle." },
        { status: 400 }
      );
    }

    if (!photoFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier photo doit être une image valide (JPG, PNG, WebP)." },
        { status: 400 }
      );
    }

    // 3. Active Season
    let activeSeason = await prisma.season.findFirst({
      where: { isActive: true },
      orderBy: { code: "desc" },
    });

    if (!activeSeason) {
      activeSeason = await prisma.season.create({
        data: {
          code: "2026",
          label: "Saison 2025/2026",
          isActive: true,
        },
      });
    }

    // 4. Save photo in private storage
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const storedPhoto = await storage.save(
      photoBuffer,
      photoFile.name,
      photoFile.type || "image/jpeg"
    );

    // 5. Atomic Transaction
    const cleanPhone = phone.replace(/[\s-]/g, "");
    const effectivePassword = password && password.length >= 6 ? password : cleanPhone;
    const passwordHash = await bcrypt.hash(effectivePassword, 10);

    const result = await prisma.$transaction(async (tx) => {
      // Find or create User
      let user = await tx.user.findFirst({
        where: { OR: [{ phone: cleanPhone }, { phone }] },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            phone: cleanPhone,
            passwordHash,
            role: "PARTICIPANT",
          },
        });
      }

      // Create Participant with Staff role
      const participant = await tx.participant.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          dateOfBirth,
          placeOfBirth: "Oran",
          phone: cleanPhone,
          bloodType,
          clubRole,
          isStaff: true,
          isMinor: false,
        },
      });

      // Generate Reference
      const reference = await generateRegistrationReference(activeSeason.code, tx);

      // Create Registration
      const registration = await tx.registration.create({
        data: {
          reference,
          seasonId: activeSeason.id,
          participantId: participant.id,
          status: "SUBMITTED",
          type: "STAFF",
          engagementAccepted: true,
          engagementAcceptedAt: new Date(),
          engagementVersion: "v1.0-staff-2026",
          submittedAt: new Date(),
        },
      });

      // Attach Photo Document
      await tx.document.create({
        data: {
          participantId: participant.id,
          registrationId: registration.id,
          type: "PHOTO",
          storagePath: storedPhoto.storagePath,
          originalFilename: storedPhoto.filename,
          mimeType: storedPhoto.mimeType,
          fileSize: storedPhoto.fileSize,
          status: "PENDING",
        },
      });

      // Link main disciplines for staff if needed
      const allDisciplines = await tx.discipline.findMany({ where: { isActive: true } });
      for (const disc of allDisciplines) {
        await tx.registrationDiscipline.create({
          data: {
            registrationId: registration.id,
            disciplineId: disc.id,
          },
        });
      }

      return { user, participant, registration };
    });

    // Log Audit Trail
    await logAudit({
      action: "REGISTRATION_SUBMITTED",
      userId: result.user.id,
      registrationId: result.registration.id,
      details: {
        reference: result.registration.reference,
        isStaff: true,
        clubRole,
        roleLabel: CLUB_ROLES[clubRole].labelFr,
      },
    });

    // Create session cookie
    await createSession(result.user.id);

    return NextResponse.json({
      success: true,
      reference: result.registration.reference,
      registrationId: result.registration.id,
      participantId: result.participant.id,
      message: "Dossier d'encadrement / bureau soumis avec succès.",
    });
  } catch (error: any) {
    console.error("Staff registration error:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors de l'enregistrement de la demande." },
      { status: 500 }
    );
  }
}
