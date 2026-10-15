import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { generateRegistrationReference } from "@/lib/sequences";
import { logAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { error: "Veuillez vous connecter pour inscrire un enfant." },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // 1. Child Identity
    const firstName = formData.get("firstName")?.toString()?.trim() || "";
    const lastName = formData.get("lastName")?.toString()?.trim() || "";
    const dateOfBirthRaw = formData.get("dateOfBirth")?.toString() || "";
    const placeOfBirth = formData.get("placeOfBirth")?.toString()?.trim() || "";
    const address = formData.get("address")?.toString()?.trim() || null;
    const bloodType = formData.get("bloodType")?.toString()?.trim() || null;

    if (!firstName || !lastName || !dateOfBirthRaw || !placeOfBirth) {
      return NextResponse.json(
        { error: "Le prénom, le nom, la date et le lieu de naissance de l'enfant sont obligatoires." },
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

    // Automatically check minor status
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    const isMinor = age < 18;

    // 2. Disciplines
    const disciplinesRaw = formData.get("disciplines")?.toString() || "[]";
    let selectedDisciplineSlugs: string[] = [];
    try {
      selectedDisciplineSlugs = JSON.parse(disciplinesRaw);
    } catch {
      selectedDisciplineSlugs = [disciplinesRaw];
    }

    if (!Array.isArray(selectedDisciplineSlugs) || selectedDisciplineSlugs.length === 0) {
      return NextResponse.json(
        { error: "Veuillez sélectionner au moins une discipline sportive." },
        { status: 400 }
      );
    }

    // 3. Parental Authorization
    const guardianName = formData.get("guardianName")?.toString()?.trim() || "Parent / Tuteur Légal";
    const parentalAccepted = formData.get("parentalAccepted") === "true";
    const engagementAccepted = formData.get("engagementAccepted") === "true";

    if (!parentalAccepted || !engagementAccepted) {
      return NextResponse.json(
        { error: "L'autorisation parentale et l'engagement du club doivent être formellement acceptés." },
        { status: 400 }
      );
    }

    // 4. Required Files
    const photoFile = formData.get("photo") as File | null;
    const nationalIdFile = formData.get("nationalId") as File | null;
    const medicalCertificateFile = formData.get("medicalCertificate") as File | null;
    const parentalIdFile = formData.get("parentalId") as File | null;

    if (!photoFile || !nationalIdFile || !medicalCertificateFile) {
      return NextResponse.json(
        { error: "La photo de l'enfant, sa pièce d'identité et son certificat médical sont obligatoires." },
        { status: 400 }
      );
    }

    // Check if parental ID is uploaded or can be borrowed from existing child's documents
    let storedParentalIdPath: string | null = null;
    let storedParentalIdFilename = "piece-identite-tuteur.jpg";
    let storedParentalIdMime = "image/jpeg";
    let storedParentalIdSize = 0;

    if (parentalIdFile && parentalIdFile.size > 0) {
      const buffer = Buffer.from(await parentalIdFile.arrayBuffer());
      const stored = await storage.save(buffer, parentalIdFile.name, parentalIdFile.type || "image/jpeg");
      storedParentalIdPath = stored.storagePath;
      storedParentalIdFilename = stored.filename;
      storedParentalIdMime = stored.mimeType;
      storedParentalIdSize = stored.fileSize;
    } else {
      // Look for previously uploaded parent ID document under this user's participants
      const existingParentDoc = await prisma.document.findFirst({
        where: {
          participant: { userId: user.id },
          type: "PARENT_NATIONAL_ID",
        },
        orderBy: { createdAt: "desc" },
      });

      if (existingParentDoc) {
        storedParentalIdPath = existingParentDoc.storagePath;
        storedParentalIdFilename = existingParentDoc.originalFilename;
        storedParentalIdMime = existingParentDoc.mimeType;
        storedParentalIdSize = existingParentDoc.fileSize;
      } else {
        return NextResponse.json(
          { error: "La pièce d'identité du parent/tuteur légal est obligatoire pour inscrire un enfant." },
          { status: 400 }
        );
      }
    }

    // 5. Active Season
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

    // Process and save child files
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const nationalIdBuffer = Buffer.from(await nationalIdFile.arrayBuffer());
    const medicalBuffer = Buffer.from(await medicalCertificateFile.arrayBuffer());

    const storedPhoto = await storage.save(photoBuffer, photoFile.name, photoFile.type || "image/jpeg");
    const storedNationalId = await storage.save(nationalIdBuffer, nationalIdFile.name, nationalIdFile.type || "image/jpeg");
    const storedMedical = await storage.save(medicalBuffer, medicalCertificateFile.name, medicalCertificateFile.type || "application/pdf");

    // Atomic transaction to create participant, registration, disciplines, documents, parental authorization
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Child Participant
      const participant = await tx.participant.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          dateOfBirth,
          placeOfBirth,
          phone: user.phone,
          address,
          bloodType,
          isMinor,
        },
      });

      // 2. Generate sequential registration reference
      const reference = await generateRegistrationReference(activeSeason.code, tx);

      // 3. Create Registration
      const registration = await tx.registration.create({
        data: {
          reference,
          seasonId: activeSeason.id,
          participantId: participant.id,
          status: "SUBMITTED",
          engagementAccepted: true,
          engagementAcceptedAt: new Date(),
          engagementVersion: "v1.0-2026",
        },
      });

      // 4. Link Disciplines
      const allDisciplines = await tx.discipline.findMany({
        where: { slug: { in: selectedDisciplineSlugs } },
      });

      for (const disc of allDisciplines) {
        await tx.registrationDiscipline.create({
          data: {
            registrationId: registration.id,
            disciplineId: disc.id,
          },
        });
      }

      // 5. Create Documents
      await tx.document.createMany({
        data: [
          {
            participantId: participant.id,
            registrationId: registration.id,
            type: "PHOTO",
            storagePath: storedPhoto.storagePath,
            originalFilename: storedPhoto.filename,
            mimeType: storedPhoto.mimeType,
            fileSize: storedPhoto.fileSize,
            status: "PENDING",
          },
          {
            participantId: participant.id,
            registrationId: registration.id,
            type: "NATIONAL_ID",
            storagePath: storedNationalId.storagePath,
            originalFilename: storedNationalId.filename,
            mimeType: storedNationalId.mimeType,
            fileSize: storedNationalId.fileSize,
            status: "PENDING",
          },
          {
            participantId: participant.id,
            registrationId: registration.id,
            type: "MEDICAL_CERTIFICATE",
            storagePath: storedMedical.storagePath,
            originalFilename: storedMedical.filename,
            mimeType: storedMedical.mimeType,
            fileSize: storedMedical.fileSize,
            status: "PENDING",
          },
          {
            participantId: participant.id,
            registrationId: registration.id,
            type: "PARENT_NATIONAL_ID",
            storagePath: storedParentalIdPath,
            originalFilename: storedParentalIdFilename,
            mimeType: storedParentalIdMime,
            fileSize: storedParentalIdSize,
            status: "PENDING",
          },
        ],
      });

      // 6. Create Parental Authorization
      await tx.parentalAuthorization.create({
        data: {
          participantId: participant.id,
          registrationId: registration.id,
          guardianName,
          declarationAccepted: true,
          acceptedAt: new Date(),
          authorizationVersion: "v1.0-2026",
          ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
        },
      });

      // 7. Audit Log
      await tx.auditLog.create({
        data: {
          action: "CHILD_ENROLLED_BY_PARENT",
          userId: user.id,
          registrationId: registration.id,
          details: JSON.stringify({
            childName: `${firstName} ${lastName}`,
            reference,
            parentPhone: user.phone,
          }),
        },
      });

      return { participant, registration };
    });

    return NextResponse.json({
      success: true,
      message: `L'inscription de ${firstName} a été enregistrée avec succès.`,
      reference: result.registration.reference,
      participantId: result.participant.id,
      registrationId: result.registration.id,
    });
  } catch (error) {
    console.error("Add child error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de l'inscription de l'enfant." },
      { status: 500 }
    );
  }
}
