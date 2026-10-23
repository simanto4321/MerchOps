import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { buildOrderWhere } from "@/lib/orders";
import { parseTags } from "@/lib/utils";
import type { DeliveryStatus, SourceChannel } from "@/lib/types";

function csvEscape(value: string | number | null | undefined) {
  const s = value == null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel") as SourceChannel | null;
  const status = searchParams.get("status") as DeliveryStatus | "WAITING" | null;
  const q = searchParams.get("q") ?? undefined;

  const orders = await prisma.order.findMany({
    where: buildOrderWhere({
      channel: channel || undefined,
      status: status || undefined,
      q,
    }),
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "orderNumber",
    "customerName",
    "customerPhone",
    "channel",
    "status",
    "totalAmount",
    "parcelValue",
    "reasonCode",
    "adminComments",
    "tags",
    "items",
    "createdAt",
  ];

  const lines = [header.join(",")];
  for (const o of orders) {
    const items = o.items
      .map(
        (i) =>
          `${i.product.sku}x${i.orderedQuantity}(acc:${i.acceptedQuantity}/ret:${i.returnedQuantity})`,
      )
      .join("; ");
    lines.push(
      [
        o.orderNumber,
        o.customerName,
        o.customerPhone,
        o.sourceChannel,
        o.deliveryStatus,
        o.totalAmount,
        o.parcelValue,
        o.reasonCode,
        o.adminComments,
        parseTags(o.tags).join("|"),
        items,
        o.createdAt.toISOString(),
      ]
        .map(csvEscape)
        .join(","),
    );
  }

  const csv = lines.join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="merchops-orders-${Date.now()}.csv"`,
    },
  });
}
