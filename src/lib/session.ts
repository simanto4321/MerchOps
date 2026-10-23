import { cookies } from "next/headers";
import { prisma } from "./prisma";
import type { Role } from "./types";

export const SESSION_COOKIE = "merchops_user_id";

export async function getCurrentUser() {
  const jar = await cookies();
  const userId = jar.get(SESSION_COOKIE)?.value;
  if (!userId) {
    return prisma.user.findFirst({ where: { role: "ADMIN" } });
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return prisma.user.findFirst({ where: { role: "ADMIN" } });
  }
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
