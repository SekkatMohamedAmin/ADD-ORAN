import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { logAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const registrationId = formData.get("registrationId")?.toString();

    if (!registrationId) {
      return NextResponse.json({ error: "Identifiant d'inscription manquant" }, { status: 400 });
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        participant: true,
        documents: true,
      },
    });

    if (!registration) {
      return NextResponse.json({ error: "Inscription introuvable" }, { status: 404 });
    }

    if (registration.participant.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Process replaced documents
    const docTypes = ["PHOTO", "NATIONAL_ID", "MEDICAL_CERTIFICATE", "PARENT_NATIONAL_ID", "PARENTAL_ID", "PARENTAL_AUTHORIZATION"] as const;
    const replacedTypes: string[] = [];

    // Check direct single file replacement first: file + docType or type
    const directFile = formData.get("file") as File | null;
    const directType = (formData.get("type") || formData.get("docType"))?.toString();
    const directDocId = formData.get("documentId")?.toString();

    if (directFile && directFile.size > 0 && (directType || directDocId)) {
      const buffer = Buffer.from(await directFile.arrayBuffer());
      const stored = await storage.save(buffer, directFile.name, directFile.type || "application/octet-stream");

      const existingDoc = directDocId
        ? registration.documents.find((d) => d.id === directDocId)
        : registration.documents.find((d) => d.type === directType);

      if (existingDoc) {
        await prisma.document.update({
          where: { id: existingDoc.id },
          data: {
            storagePath: stored.storagePath,
            originalFilename: stored.filename,
            mimeType: stored.mimeType,
            fileSize: stored.fileSize,
            status: "PENDING",
            rejectionReason: null,
          },
        });
        replacedTypes.push(existingDoc.type);
      } else if (directType) {
        await prisma.document.create({
          data: {
            participantId: registration.participantId,
            registrationId: registration.id,
            type: directType,
            storagePath: stored.storagePath,
            originalFilename: stored.filename,
            mimeType: stored.mimeType,
            fileSize: stored.fileSize,
            status: "PENDING",
          },
        });
        replacedTypes.push(directType);
      }
    }

    // Process keyed files (photo, medicalCertificate, nationalId, parentalId, parentNationalId, parentalAuthorization)
    for (const docType of docTypes) {
      const fileKey = docType.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      const altKey = docType === "PARENT_NATIONAL_ID" ? "parentalId" : docType === "PARENTAL_ID" ? "parentNationalId" : null;
      const file = (formData.get(fileKey) || (altKey ? formData.get(altKey) : null)) as File | null;

      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const stored = await storage.save(buffer, file.name, file.type || "application/octet-stream");

        // Mark previous document as replaced or update it
        const existingDoc = registration.documents.find((d) => d.type === docType || (docType.startsWith("PARENT") && d.type.startsWith("PARENT")));
        if (existingDoc) {
          await prisma.document.update({
            where: { id: existingDoc.id },
            data: {
              storagePath: stored.storagePath,
              originalFilename: stored.filename,
              mimeType: stored.mimeType,
              fileSize: stored.fileSize,
              status: "PENDING",
              rejectionReason: null,
            },
          });
        } else {
          await prisma.document.create({
            data: {
              participantId: registration.participantId,
              registrationId: registration.id,
              type: docType,
              storagePath: stored.storagePath,
              originalFilename: stored.filename,
              mimeType: stored.mimeType,
              fileSize: stored.fileSize,
              status: "PENDING",
            },
          });
        }
        replacedTypes.push(docType);
      }
    }

    // Optional updated identity fields
    const updatedAddress = formData.get("address")?.toString()?.trim();
    const updatedBloodType = formData.get("bloodType")?.toString()?.trim();
    if (updatedAddress || updatedBloodType) {
      await prisma.participant.update({
        where: { id: registration.participantId },
        data: {
          address: updatedAddress || registration.participant.address,
          bloodType: updatedBloodType || registration.participant.bloodType,
        },
      });
    }

    // Transition status to UNDER_REVIEW and clear previous correction flag
    const updatedReg = await prisma.registration.update({
      where: { id: registration.id },
      data: {
        status: "UNDER_REVIEW",
        correctionReason: null,
        correctionFields: null,
        reviewedAt: null,
        reviewedBy: null,
      },
    });

    // Log audit
    await logAudit({
      action: "REGISTRATION_RESUBMITTED",
      userId: user.id,
      registrationId: registration.id,
      details: {
        reference: registration.reference,
        replacedDocuments: replacedTypes,
      },
    });

    return NextResponse.json({
      success: true,
      status: updatedReg.status,
      message: "Votre dossier a été mis à jour et renvoyé pour réexamen.",
    });
  } catch (error) {
    console.error("Resubmit error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur lors du réenvoi du dossier." },
      { status: 500 }
    );
  }
}
