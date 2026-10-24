import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { SourceChannel } from "@/lib/types";
import { getCurrentUser } from "@/lib/session";
import { parseTags, stringifyTags } from "@/lib/utils";
import { writeAuditLog } from "@/lib/audit";
import { notifyTelegram } from "@/lib/telegram";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const channel = searchParams.get("channel") as SourceChannel | null;

  const messages = await prisma.inboxMessage.findMany({
    where: {
      ...(status ? { status: status as "OPEN" | "LINKED" | "CLOSED" | "MERGED" } : {}),
      ...(channel ? { channel } : {}),
    },
    include: { order: { select: { id: true, orderNumber: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    messages: messages.map((m) => ({ ...m, tags: parseTags(m.tags) })),
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const body = await req.json();
  const message = await prisma.inboxMessage.create({
    data: {
      channel: body.channel ?? "OTHER",
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      body: body.body,
      externalId: body.externalId,
      tags: stringifyTags(body.tags ?? []),
      status: body.orderId ? "LINKED" : "OPEN",
      orderId: body.orderId,
    },
  });

  await notifyTelegram(
    `MerchOps inbox · ${message.channel}\n` +
      `${message.customerName}: ${message.body.slice(0, 180)}`,
  );

  await writeAuditLog({
    userId: user?.id,
    action: "SETTINGS_CHANGE",
    entityType: "InboxMessage",
    entityId: message.id,
    newValue: { channel: message.channel, customerName: message.customerName },
  });

  return NextResponse.json({ message: { ...message, tags: parseTags(message.tags) } });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const existing = await prisma.inboxMessage.findUnique({ where: { id: body.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const message = await prisma.inboxMessage.update({
    where: { id: body.id },
    data: {
      status: body.status ?? existing.status,
      orderId: body.orderId === undefined ? existing.orderId : body.orderId,
      tags: body.tags ? stringifyTags(body.tags) : existing.tags,
    },
    include: { order: { select: { id: true, orderNumber: true } } },
  });

  return NextResponse.json({ message: { ...message, tags: parseTags(message.tags) } });
}
