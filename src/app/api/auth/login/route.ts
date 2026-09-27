import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Le numéro de téléphone et le mot de passe sont obligatoires." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s-]/g, "");

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phone: cleanPhone }, { phone }],
      },
      include: {
        participants: {
          take: 1,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isMinor: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Identifiants invalides. Vérifiez votre numéro de téléphone ou mot de passe." },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Identifiants invalides. Vérifiez votre numéro de téléphone ou mot de passe." },
        { status: 401 }
      );
    }

    // Create session
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        participant: user.participants[0] || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
