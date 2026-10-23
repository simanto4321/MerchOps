import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import {
  buildOrderWhere,
  createOrder,
} from "@/lib/orders";
import { notifyTelegram } from "@/lib/telegram";
import { parseTags } from "@/lib/utils";
import type { DeliveryStatus, SourceChannel } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel") as SourceChannel | null;
  const status = searchParams.get("status") as DeliveryStatus | null;
  const q = searchParams.get("q") ?? undefined;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const orders = await prisma.order.findMany({
    where: buildOrderWhere({
      channel: channel || undefined,
      status: status || undefined,
      q,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    }),
    include: {
      items: { include: { product: true } },
      createdBy: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    orders: orders.map((o) => ({ ...o, tags: parseTags(o.tags) })),
  });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    if (Array.isArray(body.bulk)) {
      const created = [];
      for (const entry of body.bulk) {
        const order = await createOrder({
          customerName: entry.customerName,
          customerPhone: entry.customerPhone,
          sourceChannel: entry.sourceChannel ?? "PHONE",
          parcelValue: entry.parcelValue,
          adminComments: entry.adminComments,
          tags: entry.tags,
          createdById: user?.id,
          items: entry.items,
        });
        created.push(order);
      }
      await notifyTelegram(
        `MerchOps: ${created.length} parcel(s) entered.\n` +
          created.map((o) => `${o.orderNumber} · ${o.customerPhone} · ৳${o.parcelValue}`).join("\n"),
      );
      return NextResponse.json({ orders: created });
    }

    const order = await createOrder({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      sourceChannel: body.sourceChannel ?? "PHONE",
      parcelValue: body.parcelValue,
      adminComments: body.adminComments,
      tags: body.tags,
      createdById: user?.id,
      items: body.items,
    });

    await notifyTelegram(
      `MerchOps new order ${order.orderNumber}\n` +
        `${order.customerName} · ${order.customerPhone}\n` +
        `${order.sourceChannel} · ৳${order.totalAmount}`,
    );

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 400 },
    );
  }
}
