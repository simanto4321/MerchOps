import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/session";
import { isProd } from "./config";

const BCRYPT_ROUNDS = 10;

export async function hashPin(pin: string) {
  return bcrypt.hash(pin, BCRYPT_ROUNDS);
}

export async function verifyPin(pin: string, pinHash: string) {
  // Support legacy plaintext during transition
  if (!pinHash.startsWith("$2")) {
    return pin === pinHash;
  }
  return bcrypt.compare(pin, pinHash);
}

export type PublicUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
};

export function toPublicUser(user: {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

export async function setSessionCookie(userId: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProd(),
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function loginWithUsernamePin(
  username: string,
  pin: string,
): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({
    where: { username: username.trim().toLowerCase() },
  });
  if (!user) return null;
  const ok = await verifyPin(pin, user.pin);
  if (!ok) return null;
  return toPublicUser(user);
}

/** Plain PIN hints for demo UI — never read hashes from DB */
export const DEMO_ACCOUNT_HINTS = [
  {
    username: "admin",
    pin: "1234",
    role: "ADMIN",
    name: "Ayesha Rahman",
  },
  {
    username: "staff",
    pin: "5678",
    role: "STAFF",
    name: "Manik Hasan",
  },
  {
    username: "guest",
    pin: "0000",
    role: "GUEST",
    name: "Guest Viewer",
  },
] as const;
