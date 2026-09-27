import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { logAudit } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const documentRecord = await prisma.document.findUnique({
      where: { id },
      include: {
        participant: true,
      },
    });

    if (!documentRecord) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Check authorization: Owner or Admin
    const isOwner = documentRecord.participant.userId === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden access to private document" }, { status: 403 });
    }

    // Read file from private storage
    const fileBuffer = await storage.read(documentRecord.storagePath);
    if (!fileBuffer) {
      return NextResponse.json({ error: "File content not found on server storage" }, { status: 404 });
    }

    // Audit log if admin viewed participant document
    if (isAdmin && !isOwner) {
      await logAudit({
        action: "DOCUMENT_VIEWED",
        userId: user.id,
        registrationId: documentRecord.registrationId || undefined,
        details: {
          documentId: documentRecord.id,
          documentType: documentRecord.type,
          participantId: documentRecord.participantId,
        },
      });
    }

    // Stream response with strict security headers
    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": documentRecord.mimeType,
        "Content-Disposition": `inline; filename="${documentRecord.originalFilename}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error retrieving private document:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
