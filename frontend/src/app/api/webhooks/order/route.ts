import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import type { SourceChannel } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { notifyTelegram } from "@/lib/telegram";
import { stringifyTags } from "@/lib/utils";

/**
 * Ingest orders from external channels (WhatsApp / IG / FB / TikTok bots).
 * POST JSON: { channel, customerName, customerPhone, items:[{sku, qty}], comments? }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const channel = (body.channel as SourceChannel) || "OTHER";

    const skus: { sku: string; qty: number; unitPrice?: number }[] =
      body.items ?? [];
    const products = await prisma.product.findMany({
      where: { sku: { in: skus.map((s) => s.sku) } },
    });

    const items = skus.map((s) => {
      const product = products.find((p) => p.sku === s.sku);
      if (!product) throw new Error(`Unknown SKU: ${s.sku}`);
      return {
        productId: product.id,
        orderedQuantity: s.qty,
        unitPrice: s.unitPrice,
      };
    });

    const order = await createOrder({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      sourceChannel: channel,
      adminComments: body.comments,
      tags: body.tags ?? [channel.toLowerCase(), "webhook"],
      items,
    });

    if (body.inboxBody) {
      await prisma.inboxMessage.create({
        data: {
          channel,
          customerName: body.customerName,
          customerPhone: body.customerPhone,
          body: body.inboxBody,
          status: "LINKED",
          orderId: order.id,
          tags: stringifyTags(["order", "webhook"]),
        },
      });
    }

    await notifyTelegram(
      `Webhook order ${order.orderNumber} via ${channel}\n` +
        `${order.customerName} · ${order.customerPhone} · ৳${order.totalAmount}`,
    );

    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook failed" },
      { status: 400 },
    );
  }
}
