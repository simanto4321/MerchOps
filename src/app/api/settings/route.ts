import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canManageAudit } from "@/lib/session";
import { writeAuditLog } from "@/lib/audit";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !canManageAudit(user.role)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const settings = await prisma.appSetting.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user || !canManageAudit(user.role)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const body = await req.json();
  const entries: { key: string; value: string }[] = body.settings ?? [];

  const updated = [];
  for (const entry of entries) {
    const previous = await prisma.appSetting.findUnique({ where: { key: entry.key } });
    const row = await prisma.appSetting.upsert({
      where: { key: entry.key },
      create: { key: entry.key, value: entry.value },
      update: { value: entry.value },
    });
    updated.push(row);
    await writeAuditLog({
      userId: user.id,
      action: "SETTINGS_CHANGE",
      entityType: "AppSetting",
      entityId: row.id,
      previousValue: previous,
      newValue: { key: entry.key, value: entry.key.includes("token") ? "[redacted]" : entry.value },
    });
  }

  return NextResponse.json({ settings: updated });
}
