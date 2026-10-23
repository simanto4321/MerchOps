import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canManageAudit } from "@/lib/session";
import { COURIER_PRESETS } from "@/lib/couriers";
import { writeAuditLog } from "@/lib/audit";

function mask(value: string | null | undefined) {
  if (!value) return "";
  if (value.length <= 4) return "••••";
  return `${"•".repeat(Math.min(8, value.length - 4))}${value.slice(-4)}`;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !canManageAudit(user.role)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  let connections = await prisma.deliveryConnection.findMany({
    orderBy: { displayName: "asc" },
  });

  if (connections.length === 0) {
    await prisma.deliveryConnection.createMany({
      data: COURIER_PRESETS.map((p) => ({
        provider: p.provider,
        displayName: p.displayName,
        apiBaseUrl: p.apiBaseUrl,
        status: "DISCONNECTED",
      })),
    });
    connections = await prisma.deliveryConnection.findMany({
      orderBy: { displayName: "asc" },
    });
  }

  return NextResponse.json({
    connections: connections.map((c) => ({
      ...c,
      apiKeyMasked: mask(c.apiKey),
      apiSecretMasked: mask(c.apiSecret),
      apiKey: undefined,
      apiSecret: undefined,
      hasApiKey: Boolean(c.apiKey),
      hasApiSecret: Boolean(c.apiSecret),
    })),
    presets: COURIER_PRESETS,
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !canManageAudit(user.role)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await req.json();
  const preset = COURIER_PRESETS.find((p) => p.provider === body.provider);

  const connection = await prisma.deliveryConnection.upsert({
    where: { provider: body.provider },
    create: {
      provider: body.provider,
      displayName: body.displayName || preset?.displayName || body.provider,
      apiBaseUrl: body.apiBaseUrl || preset?.apiBaseUrl,
      apiKey: body.apiKey || null,
      apiSecret: body.apiSecret || null,
      storeId: body.storeId || null,
      webhookUrl: body.webhookUrl || null,
      status: body.apiKey ? "CONNECTED" : "DISCONNECTED",
    },
    update: {
      displayName: body.displayName,
      apiBaseUrl: body.apiBaseUrl,
      apiKey: body.apiKey === undefined ? undefined : body.apiKey || null,
      apiSecret: body.apiSecret === undefined ? undefined : body.apiSecret || null,
      storeId: body.storeId === undefined ? undefined : body.storeId || null,
      webhookUrl: body.webhookUrl === undefined ? undefined : body.webhookUrl || null,
    },
  });

  await writeAuditLog({
    userId: user.id,
    action: "SETTINGS_CHANGE",
    entityType: "DeliveryConnection",
    entityId: connection.id,
    newValue: {
      provider: connection.provider,
      status: connection.status,
      hasKey: Boolean(connection.apiKey),
    },
  });

  return NextResponse.json({ connection: { id: connection.id, status: connection.status } });
}
