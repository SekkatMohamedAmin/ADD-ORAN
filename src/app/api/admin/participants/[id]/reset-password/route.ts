import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

function generateSecureTemporaryPassword(): string {
  // Generates a clean, readable temporary password like ADD-839201
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
  return `ADD-${randomSixDigits}`;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { id } = await context.params;

    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Adhérent introuvable." },
        { status: 404 }
      );
    }

    if (!participant.user) {
      return NextResponse.json(
        { error: "Aucun compte utilisateur associé à cet adhérent." },
        { status: 404 }
      );
    }

    let { newPassword } = await request.json().catch(() => ({}));
    if (!newPassword || typeof newPassword !== "string" || !newPassword.trim()) {
      newPassword = generateSecureTemporaryPassword();
    } else {
      newPassword = newPassword.trim();
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit comporter au moins 6 caractères." },
        { status: 400 }
      );
    }

    // Hash the new password with bcrypt
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user password in database
    await prisma.user.update({
      where: { id: participant.userId },
      data: { passwordHash },
    });

    // Invalidate existing sessions for security
    await prisma.session.deleteMany({
      where: { userId: participant.userId },
    });

    // Audit log
    await logAudit({
      action: "PASSWORD_RESET",
      userId: admin.id,
      details: {
        action: "ADMIN_RESET_USER_PASSWORD",
        participantId: participant.id,
        participantName: `${participant.firstName} ${participant.lastName}`,
        userPhone: participant.user.phone,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès.",
      temporaryPassword: newPassword,
      userPhone: participant.user.phone,
      participantName: `${participant.firstName} ${participant.lastName}`,
    });
  } catch (error: any) {
    console.error("Admin reset user password error:", error);
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }
    return NextResponse.json(
      { error: error.message || "Erreur interne lors de la réinitialisation du mot de passe." },
      { status: 500 }
    );
  }
}
