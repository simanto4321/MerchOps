import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canManageAudit } from "@/lib/session";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || !canManageAudit(user.role)) {
    return NextResponse.json(
      { error: "Admin only — audit logs are restricted" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const limit = Math.min(Number(searchParams.get("limit") ?? 100), 300);

  const logs = await prisma.auditLog.findMany({
    where: action ? { action: action as never } : undefined,
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
    orderBy: { timestamp: "desc" },
    take: limit,
  });

  return NextResponse.json({ logs });
}
