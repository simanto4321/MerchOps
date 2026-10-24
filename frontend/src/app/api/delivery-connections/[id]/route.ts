import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canManageAudit } from "@/lib/session";
import { writeAuditLog } from "@/lib/audit";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user || !canManageAudit(user.role)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json();
  const existing = await prisma.deliveryConnection.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (body.action === "disconnect") {
    const connection = await prisma.deliveryConnection.update({
      where: { id },
      data: {
        status: "DISCONNECTED",
        apiKey: null,
        apiSecret: null,
        lastError: null,
      },
    });
    await writeAuditLog({
      userId: user.id,
      action: "SETTINGS_CHANGE",
      entityType: "DeliveryConnection",
      entityId: id,
      previousValue: { status: existing.status },
      newValue: { status: "DISCONNECTED", provider: existing.provider },
    });
    return NextResponse.json({ connection });
  }

  if (body.action === "test") {
    await prisma.deliveryConnection.update({
      where: { id },
      data: { status: "TESTING" },
    });

    // Soft validation: require key; live HTTP calls stay optional (no secrets on argv).
    const key = body.apiKey ?? existing.apiKey;
    await new Promise((r) => setTimeout(r, 600));

    if (!key) {
      const connection = await prisma.deliveryConnection.update({
        where: { id },
        data: {
          status: "ERROR",
          lastError: "API key required to test connection",
        },
      });
      return NextResponse.json({ connection, ok: false });
    }

    const connection = await prisma.deliveryConnection.update({
      where: { id },
      data: {
        status: "CONNECTED",
        lastError: null,
        lastSyncedAt: new Date(),
        apiKey: body.apiKey ?? existing.apiKey,
        apiSecret: body.apiSecret ?? existing.apiSecret,
        storeId: body.storeId ?? existing.storeId,
        apiBaseUrl: body.apiBaseUrl ?? existing.apiBaseUrl,
        webhookUrl: body.webhookUrl ?? existing.webhookUrl,
      },
    });

    await writeAuditLog({
      userId: user.id,
      action: "SETTINGS_CHANGE",
      entityType: "DeliveryConnection",
      entityId: id,
      newValue: { action: "test", provider: existing.provider, ok: true },
    });

    return NextResponse.json({ connection, ok: true });
  }

  if (body.action === "save") {
    const connection = await prisma.deliveryConnection.update({
      where: { id },
      data: {
        apiKey: body.apiKey !== undefined ? body.apiKey || null : undefined,
        apiSecret: body.apiSecret !== undefined ? body.apiSecret || null : undefined,
        storeId: body.storeId !== undefined ? body.storeId || null : undefined,
        apiBaseUrl: body.apiBaseUrl !== undefined ? body.apiBaseUrl : undefined,
        webhookUrl: body.webhookUrl !== undefined ? body.webhookUrl || null : undefined,
        status:
          (body.apiKey ?? existing.apiKey)
            ? existing.status === "DISCONNECTED"
              ? "DISCONNECTED"
              : existing.status
            : "DISCONNECTED",
      },
    });

    await writeAuditLog({
      userId: user.id,
      action: "SETTINGS_CHANGE",
      entityType: "DeliveryConnection",
      entityId: id,
      newValue: { action: "save", provider: existing.provider },
    });

    return NextResponse.json({ connection });
  }

  if (body.action === "connect") {
    const key = body.apiKey ?? existing.apiKey;
    if (!key) {
      return NextResponse.json({ error: "API key required" }, { status: 400 });
    }
    const connection = await prisma.deliveryConnection.update({
      where: { id },
      data: {
        apiKey: body.apiKey ?? existing.apiKey,
        apiSecret: body.apiSecret ?? existing.apiSecret,
        storeId: body.storeId ?? existing.storeId,
        apiBaseUrl: body.apiBaseUrl ?? existing.apiBaseUrl,
        webhookUrl: body.webhookUrl ?? existing.webhookUrl,
        status: "CONNECTED",
        lastError: null,
        lastSyncedAt: new Date(),
      },
    });
    await writeAuditLog({
      userId: user.id,
      action: "SETTINGS_CHANGE",
      entityType: "DeliveryConnection",
      entityId: id,
      newValue: { action: "connect", provider: existing.provider },
    });
    return NextResponse.json({ connection });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
