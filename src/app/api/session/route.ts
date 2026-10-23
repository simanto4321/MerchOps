import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/session";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  const body = await req.json();
  const user = await prisma.user.findUnique({ where: { id: body.userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  await writeAuditLog({
    userId: user.id,
    action: "LOGIN",
    entityType: "User",
    entityId: user.id,
    newValue: { role: user.role, email: user.email },
  });

  return NextResponse.json({ user });
}

export async function GET() {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return NextResponse.json({ user: null });
  const user = await prisma.user.findUnique({ where: { id } });
  return NextResponse.json({ user });
}
