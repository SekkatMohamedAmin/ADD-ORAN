import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "./prisma";

const SESSION_COOKIE_NAME = "add_session_token";
const SESSION_EXPIRATION_DAYS = 30;

export interface AuthUser {
  id: string;
  phone: string;
  role: "ADMIN" | "PARTICIPANT" | string;
  participant?: {
    id: string;
    firstName: string;
    lastName: string;
    isMinor: boolean;
  } | null;
}

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRATION_DAYS);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
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
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    // Session expired
    await prisma.session.delete({ where: { token } }).catch(() => {});
    return null;
  }

  const participant = session.user.participants[0] || null;

  return {
    id: session.user.id,
    phone: session.user.phone,
    role: session.user.role,
    participant,
  };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: { token },
    }).catch(() => {});
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
