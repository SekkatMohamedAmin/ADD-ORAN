import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { generateRegistrationReference } from "@/lib/sequences";
import { checkPossibleDuplicates } from "@/lib/duplicates";
import { createSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // 1. Account details
    const phone = formData.get("phone")?.toString()?.trim() || "";
    const password = formData.get("password")?.toString() || "";
    const email = formData.get("email")?.toString()?.trim() || null;
    const whatsapp = formData.get("whatsapp")?.toString()?.trim() || null;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Le numéro de téléphone et le mot de passe sont obligatoires." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit comporter au moins 6 caractères." },
        { status: 400 }
      );
    }

    // 2. Identity details
    const firstName = formData.get("firstName")?.toString()?.trim() || "";
    const lastName = formData.get("lastName")?.toString()?.trim() || "";
    const dateOfBirthRaw = formData.get("dateOfBirth")?.toString() || "";
    const placeOfBirth = formData.get("placeOfBirth")?.toString()?.trim() || "";
    const address = formData.get("address")?.toString()?.trim() || null;
    const bloodType = formData.get("bloodType")?.toString()?.trim() || null;

    if (!firstName || !lastName || !dateOfBirthRaw || !placeOfBirth) {
      return NextResponse.json(
        { error: "Le prénom, le nom, la date et le lieu de naissance sont obligatoires." },
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

    // Calculate age automatically (age < 18 => minor)
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    const isMinor = age < 18;

    // 3. Disciplines
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

    // 4. Duplicate Check
    const duplicateWarningDismissed = formData.get("duplicateWarningDismissed") === "true";
    if (!duplicateWarningDismissed) {
      const duplicateResult = await checkPossibleDuplicates({
        firstName,
        lastName,
        phone,
        dateOfBirth,
      });

      if (duplicateResult.hasPossibleDuplicate) {
        return NextResponse.json(
          {
            duplicateWarning: true,
            matches: duplicateResult.matches,
          },
          { status: 200 }
        );
      }
    }

    // 5. Engagement & Parental Authorization
    const engagementAccepted = formData.get("engagementAccepted") === "true";
    if (!engagementAccepted) {
      return NextResponse.json(
        { error: "Vous devez accepter formellement l'engagement et le règlement du club." },
        { status: 400 }
      );
    }

    const guardianName = formData.get("guardianName")?.toString()?.trim() || null;
    const parentalAccepted = formData.get("parentalAccepted") === "true";

    if (isMinor) {
      if (!guardianName || !parentalAccepted) {
        return NextResponse.json(
          { error: "Pour les mineurs, la déclaration parentale et le nom du tuteur légal sont obligatoires." },
          { status: 400 }
        );
      }
    }

    // 6. Required Documents
    const photoFile = formData.get("photo") as File | null;
    const nationalIdFile = formData.get("nationalId") as File | null;
    const medicalCertificateFile = formData.get("medicalCertificate") as File | null;
    const parentalIdFile = formData.get("parentalId") as File | null;

    if (!photoFile || !nationalIdFile || !medicalCertificateFile) {
      return NextResponse.json(
        { error: "La photo, la pièce d'identité et le certificat médical sont obligatoires." },
        { status: 400 }
      );
    }

    if (isMinor && !parentalIdFile) {
      return NextResponse.json(
        { error: "La pièce d'identité du parent/tuteur légal est obligatoire pour les mineurs." },
        { status: 400 }
      );
    }

    // 7. Get or Create Season
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

    // Process file buffers
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const nationalIdBuffer = Buffer.from(await nationalIdFile.arrayBuffer());
    const medicalBuffer = Buffer.from(await medicalCertificateFile.arrayBuffer());
    const parentalIdBuffer = parentalIdFile
      ? Buffer.from(await parentalIdFile.arrayBuffer())
      : null;

    // Save files into private storage
    const storedPhoto = await storage.save(photoBuffer, photoFile.name, photoFile.type || "image/jpeg");
    const storedNationalId = await storage.save(nationalIdBuffer, nationalIdFile.name, nationalIdFile.type || "image/jpeg");
    const storedMedical = await storage.save(medicalBuffer, medicalCertificateFile.name, medicalCertificateFile.type || "application/pdf");
    const storedParentalId = parentalIdBuffer && parentalIdFile
      ? await storage.save(parentalIdBuffer, parentalIdFile.name, parentalIdFile.type || "image/jpeg")
      : null;

    // Execute atomic transaction for user, participant, sequential reference, and registration
    const result = await prisma.$transaction(async (tx) => {
      // 1. User
      const cleanPhone = phone.replace(/[\s-]/g, "");
      const passwordHash = await bcrypt.hash(password, 10);

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

      // 2. Participant
      const participant = await tx.participant.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          dateOfBirth,
          placeOfBirth,
          phone: cleanPhone,
          email,
          whatsapp,
          address,
          bloodType,
          isMinor,
        },
      });

      // 3. Sequential Reference
      const reference = await generateRegistrationReference(activeSeason.code, tx);

      // 4. Registration
      const registration = await tx.registration.create({
        data: {
          reference,
          seasonId: activeSeason.id,
          participantId: participant.id,
          status: "SUBMITTED",
          engagementAccepted: true,
          engagementAcceptedAt: new Date(),
          engagementVersion: "v1.0-2026",
          duplicateWarningDismissed,
          submittedAt: new Date(),
        },
      });

      // 5. Link Disciplines
      const disciplines = await tx.discipline.findMany({
        where: { slug: { in: selectedDisciplineSlugs } },
      });

      for (const disc of disciplines) {
        await tx.registrationDiscipline.create({
          data: {
            registrationId: registration.id,
            disciplineId: disc.id,
          },
        });
      }

      // 6. Record Documents
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

      await tx.document.create({
        data: {
          participantId: participant.id,
          registrationId: registration.id,
          type: "NATIONAL_ID",
          storagePath: storedNationalId.storagePath,
          originalFilename: storedNationalId.filename,
          mimeType: storedNationalId.mimeType,
          fileSize: storedNationalId.fileSize,
          status: "PENDING",
        },
      });

      await tx.document.create({
        data: {
          participantId: participant.id,
          registrationId: registration.id,
          type: "MEDICAL_CERTIFICATE",
          storagePath: storedMedical.storagePath,
          originalFilename: storedMedical.filename,
          mimeType: storedMedical.mimeType,
          fileSize: storedMedical.fileSize,
          status: "PENDING",
        },
      });

      if (isMinor && storedParentalId && parentalIdFile) {
        await tx.document.create({
          data: {
            participantId: participant.id,
            registrationId: registration.id,
            type: "PARENT_NATIONAL_ID",
            storagePath: storedParentalId.storagePath,
            originalFilename: storedParentalId.filename,
            mimeType: storedParentalId.mimeType,
            fileSize: storedParentalId.fileSize,
            status: "PENDING",
          },
        });

        await tx.parentalAuthorization.create({
          data: {
            participantId: participant.id,
            registrationId: registration.id,
            guardianName,
            declarationAccepted: true,
            acceptedAt: new Date(),
            authorizationVersion: "v1.0-2026",
            ipAddress: request.headers.get("x-forwarded-for") || "local",
          },
        });
      }

      return { user, participant, registration };
    });

    // Audit log
    await logAudit({
      action: "REGISTRATION_SUBMITTED",
      userId: result.user.id,
      registrationId: result.registration.id,
      details: {
        reference: result.registration.reference,
        isMinor,
        disciplines: selectedDisciplineSlugs,
      },
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
    });

    // Create session cookie so the participant is logged in immediately
    await createSession(result.user.id);

    return NextResponse.json({
      success: true,
      reference: result.registration.reference,
      registrationId: result.registration.id,
      isMinor,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors de l'enregistrement de l'inscription." },
      { status: 500 }
    );
  }
}
