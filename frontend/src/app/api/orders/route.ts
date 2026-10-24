import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { buildOrderWhere, createOrder } from "@/lib/orders";
import { notifyTelegram } from "@/lib/telegram";
import { parseTags } from "@/lib/utils";
import { bulkOrdersSchema, createOrderSchema } from "@/lib/validation";
import type { DeliveryStatus, SourceChannel } from "@/lib/types";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel") as SourceChannel | null;
  const status = searchParams.get("status") as
    | DeliveryStatus
    | "WAITING"
    | null;
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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    if (Array.isArray(body.bulk)) {
      const parsed = bulkOrdersSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message ?? "Invalid bulk payload" },
          { status: 400 },
        );
      }
      const created = [];
      for (const entry of parsed.data.bulk) {
        const order = await createOrder({
          ...entry,
          createdById: user.id,
        });
        created.push(order);
      }
      await notifyTelegram(
        `MerchOps: ${created.length} parcel(s) entered.\n` +
          created
            .map((o) => `${o.orderNumber} · ${o.customerPhone} · ৳${o.parcelValue}`)
            .join("\n"),
      );
      return NextResponse.json({ orders: created });
    }

    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid order" },
        { status: 400 },
      );
    }

    const order = await createOrder({
      ...parsed.data,
      createdById: user.id,
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
