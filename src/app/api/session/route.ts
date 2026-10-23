import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/session";
import { writeAuditLog } from "@/lib/audit";
import { loginSchema } from "@/lib/validation";

function publicUser(user: {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

export async function POST(req: Request) {
  const body = await req.json();

  // Role switcher inside the desk
  if (body.userId && !body.pin) {
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
      newValue: { role: user.role, via: "switcher" },
    });
    return NextResponse.json({ user: publicUser(user) });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Username and PIN required" },
      { status: 400 },
    );
  }

  const username = parsed.data.username.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.pin !== parsed.data.pin) {
    return NextResponse.json(
      { error: "Invalid username or PIN" },
      { status: 401 },
    );
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  await writeAuditLog({
    userId: user.id,
    action: "LOGIN",
    entityType: "User",
    entityId: user.id,
    newValue: { role: user.role, username: user.username },
  });

  return NextResponse.json({ user: publicUser(user) });
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
  jar.delete(SESSION_COOKIE);
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
