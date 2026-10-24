import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/session";
import { writeAuditLog } from "@/lib/audit";
import { loginSchema } from "@/lib/validation";
import { allowRoleSwitch } from "@/server/config";
import {
  clearSessionCookie,
  loginWithUsernamePin,
  setSessionCookie,
  toPublicUser,
} from "@/server/auth";

export async function POST(req: Request) {
  const body = await req.json();

  // Role switcher (dev/demo only unless ALLOW_ROLE_SWITCH=true)
  if (body.userId && !body.pin) {
    if (!allowRoleSwitch()) {
      return NextResponse.json(
        { error: "Role switch disabled" },
        { status: 403 },
      );
    }
    const user = await prisma.user.findUnique({ where: { id: body.userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await setSessionCookie(user.id);
    await writeAuditLog({
      userId: user.id,
      action: "LOGIN",
      entityType: "User",
      entityId: user.id,
      newValue: { role: user.role, via: "switcher" },
    });
    return NextResponse.json({ user: toPublicUser(user) });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Username and PIN required" },
      { status: 400 },
    );
  }

  const user = await loginWithUsernamePin(
    parsed.data.username,
    parsed.data.pin,
  );
  if (!user) {
    return NextResponse.json(
      { error: "Invalid username or PIN" },
      { status: 401 },
    );
  }

  await setSessionCookie(user.id);
  await writeAuditLog({
    userId: user.id,
    action: "LOGIN",
    entityType: "User",
    entityId: user.id,
    newValue: { role: user.role, username: user.username },
  });

  return NextResponse.json({ user });
}

export async function GET() {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  if (!id) return NextResponse.json({ user: null });
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
    },
  });
  return NextResponse.json({ user });
}

export async function DELETE() {
  const jar = await cookies();
  const id = jar.get(SESSION_COOKIE)?.value;
  await clearSessionCookie();
  if (id) {
    await writeAuditLog({
      userId: id,
      action: "LOGIN",
      entityType: "User",
      entityId: id,
      newValue: { action: "LOGOUT" },
    });
  }
  return NextResponse.json({ ok: true });
}
