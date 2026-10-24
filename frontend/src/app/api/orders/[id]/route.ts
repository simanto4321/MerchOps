import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canViewCosts } from "@/lib/session";
import {
  applyPartialOrExchange,
  mergeOrders,
  updateOrderStatus,
} from "@/lib/orders";
import { writeAuditLog } from "@/lib/audit";
import { parseTags, stringifyTags } from "@/lib/utils";
import { notifyTelegram } from "@/lib/telegram";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      createdBy: true,
      inboxMessages: true,
    },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const sanitized = {
    ...order,
    tags: parseTags(order.tags),
    items: order.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        factoryCost: canViewCosts(user!.role) ? item.product.factoryCost : null,
      },
    })),
  };

  return NextResponse.json({ order: sanitized });
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const user = await getCurrentUser();
    const body = await req.json();

    if (body.action === "status") {
      const order = await updateOrderStatus({
        orderId: id,
        userId: user?.id,
        deliveryStatus: body.deliveryStatus,
        reasonCode: body.reasonCode,
        adminComments: body.adminComments,
        parcelValue: body.parcelValue,
      });
      if (body.deliveryStatus === "FAILED") {
        await notifyTelegram(
          `⚠ Failed delivery ${order.orderNumber}\n` +
            `${order.customerName} · ${order.reasonCode ?? "no reason"}\n` +
            `${order.adminComments ?? ""}`,
        );
      }
      return NextResponse.json({ order });
    }

    if (body.action === "partial" || body.action === "exchange") {
      const order = await applyPartialOrExchange({
        orderId: id,
        userId: user?.id,
        mode: body.action === "exchange" ? "EXCHANGE" : "PARTIAL",
        items: body.items,
        reasonCode: body.reasonCode,
        adminComments: body.adminComments,
      });
      return NextResponse.json({ order });
    }

    if (body.action === "merge") {
      const order = await mergeOrders({
        primaryOrderId: id,
        secondaryOrderId: body.secondaryOrderId,
        userId: user?.id,
      });
      return NextResponse.json({ order });
    }

    if (body.action === "edit") {
      const existing = await prisma.order.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      if (user?.role === "GUEST") {
        return NextResponse.json(
          { error: "Guests cannot edit orders" },
          { status: 403 },
        );
      }

      const data: Record<string, unknown> = {};
      if (body.adminComments !== undefined) data.adminComments = body.adminComments;
      if (body.reasonCode !== undefined) data.reasonCode = body.reasonCode;
      if (body.tags !== undefined) data.tags = stringifyTags(body.tags);
      if (body.parcelValue !== undefined) data.parcelValue = body.parcelValue;
      if (body.customerName !== undefined) {
        data.customerName = String(body.customerName).trim();
      }
      if (body.customerPhone !== undefined) {
        data.customerPhone = String(body.customerPhone).trim();
      }
      if (body.sourceChannel !== undefined) {
        data.sourceChannel = String(body.sourceChannel);
      }
      if (body.totalAmount !== undefined) {
        if (user?.role !== "ADMIN") {
          return NextResponse.json(
            { error: "Only admins can edit order amounts" },
            { status: 403 },
          );
        }
        data.totalAmount = body.totalAmount;
      }

      const order = await prisma.order.update({ where: { id }, data });
      await writeAuditLog({
        userId: user?.id,
        action: "EDIT_ORDER",
        entityType: "Order",
        entityId: id,
        previousValue: existing,
        newValue: order,
      });
      return NextResponse.json({ order });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 },
    );
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role === "GUEST") {
    return NextResponse.json(
      { error: "Guests cannot delete orders" },
      { status: 403 },
    );
  }
  const existing = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.inboxMessage.updateMany({
    where: { orderId: id },
    data: { orderId: null, status: "OPEN" },
  });
  await prisma.orderItem.deleteMany({ where: { orderId: id } });
  await prisma.order.delete({ where: { id } });
  await writeAuditLog({
    userId: user.id,
    action: "DELETE_ORDER",
    entityType: "Order",
    entityId: id,
    previousValue: existing,
  });
  return NextResponse.json({ ok: true });
}
