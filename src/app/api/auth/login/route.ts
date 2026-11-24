import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Pre-computed dummy hash to prevent timing attacks when user does not exist
const DUMMY_HASH = "$2a$10$wN1qG8k2Y9b3eZ5f8mQ4y.7v8R0t1U2w3X4y5Z6a7B8c9D0e1F2g3";

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

    const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");
    const candidatePhones = new Set<string>([phone.trim(), cleaned]);
    if (cleaned.startsWith("+213")) {
      candidatePhones.add("0" + cleaned.slice(4));
      candidatePhones.add(cleaned.slice(4));
      candidatePhones.add("00213" + cleaned.slice(4));
    } else if (cleaned.startsWith("00213")) {
      candidatePhones.add("0" + cleaned.slice(5));
      candidatePhones.add(cleaned.slice(5));
      candidatePhones.add("+213" + cleaned.slice(5));
    } else if (cleaned.startsWith("0") && cleaned.length >= 9) {
      candidatePhones.add("+213" + cleaned.slice(1));
      candidatePhones.add("00213" + cleaned.slice(1));
      candidatePhones.add(cleaned.slice(1));
    } else if (!cleaned.startsWith("0") && !cleaned.startsWith("+") && cleaned.length >= 8) {
      candidatePhones.add("0" + cleaned);
      candidatePhones.add("+213" + cleaned);
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: Array.from(candidatePhones).map((p) => ({ phone: p })),
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

    // Always perform bcrypt compare to eliminate timing side-channels
    const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
    const passwordMatch = await bcrypt.compare(password, hashToCompare);
    if (!user || !passwordMatch) {
      return NextResponse.json(
        { error: "Identifiants invalides. Vérifiez votre numéro de téléphone ou mot de passe." },
        { status: 401 }
      );
    }

    // Create session
    await createSession(user.id);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          role: user.role,
          participant: user.participants[0] || null,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
