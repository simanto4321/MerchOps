import { cookies } from "next/headers";
import { prisma } from "./prisma";
import type { Role } from "./types";

export const SESSION_COOKIE = "merchops_user_id";

export async function getCurrentUser() {
  const jar = await cookies();
  const userId = jar.get(SESSION_COOKIE)?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export function canViewCosts(role: string) {
  return role === "ADMIN";
}

export function canEditPrices(role: string) {
  return role === "ADMIN";
}

export function canManageAudit(role: string) {
  return role === "ADMIN";
}

export function asRole(role: string): Role {
  return role as Role;
}
