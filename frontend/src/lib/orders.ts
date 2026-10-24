import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { writeAuditLog } from "./audit";
import { stringifyTags } from "./utils";
import type { DeliveryStatus, SourceChannel } from "./types";

export async function nextOrderNumber(tx?: Prisma.TransactionClient) {
  const client = tx ?? prisma;
  const latest = await client.order.findFirst({
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });
  const match = latest?.orderNumber.match(/ORD-(\d+)/);
  const next = match ? Number(match[1]) + 1 : 1001;
  return `ORD-${next}`;
}

export async function createOrder(params: {
  customerName: string;
  customerPhone: string;
  sourceChannel: SourceChannel;
  parcelValue?: number;
  adminComments?: string;
  tags?: string[];
  createdById?: string;
  items: {
    productId: string;
    orderedQuantity: number;
    unitPrice?: number;
  }[];
}) {
  const products = await prisma.product.findMany({
    where: { id: { in: params.items.map((i) => i.productId) } },
  });

  const lineItems = params.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);
    const unitPrice = item.unitPrice ?? product.retailPrice;
    return {
      productId: item.productId,
      orderedQuantity: item.orderedQuantity,
      acceptedQuantity: 0,
      returnedQuantity: 0,
      unitPrice,
      lineTotal: unitPrice * item.orderedQuantity,
    };
  });

  const totalAmount = lineItems.reduce((s, i) => s + i.lineTotal, 0);

  const order = await prisma.$transaction(async (tx) => {
    const orderNumber = await nextOrderNumber(tx);
    for (const item of lineItems) {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stockQuantity < item.orderedQuantity) {
        throw new Error(`Insufficient stock for ${product.sku}`);
      }
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.orderedQuantity } },
      });
      await writeAuditLog({
        tx,
        userId: params.createdById,
        action: "STOCK_UPDATE",
        entityType: "Product",
        entityId: item.productId,
        previousValue: { stockQuantity: product.stockQuantity },
        newValue: {
          stockQuantity: product.stockQuantity - item.orderedQuantity,
          reason: "ORDER_RESERVE",
          orderNumber,
        },
      });
    }

    const created = await tx.order.create({
      data: {
        orderNumber,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
        sourceChannel: params.sourceChannel,
        totalAmount,
        parcelValue: params.parcelValue ?? totalAmount,
        adminComments: params.adminComments,
        tags: stringifyTags(params.tags ?? []),
        createdById: params.createdById,
        items: {
          create: lineItems.map(({ productId, orderedQuantity, acceptedQuantity, returnedQuantity, unitPrice }) => ({
            productId,
            orderedQuantity,
            acceptedQuantity,
            returnedQuantity,
            unitPrice,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    await writeAuditLog({
      tx,
      userId: params.createdById,
      action: "CREATE_ORDER",
      entityType: "Order",
      entityId: created.id,
      newValue: {
        orderNumber,
        totalAmount,
        customerPhone: params.customerPhone,
      },
    });

    return created;
  });

  return order;
}

export async function updateOrderStatus(params: {
  orderId: string;
  userId?: string;
  deliveryStatus: DeliveryStatus;
  reasonCode?: string | null;
  adminComments?: string | null;
  parcelValue?: number;
}) {
  const existing = await prisma.order.findUnique({
    where: { id: params.orderId },
  });
  if (!existing) throw new Error("Order not found");

  const updated = await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: params.orderId },
      data: {
        deliveryStatus: params.deliveryStatus,
        reasonCode: params.reasonCode ?? existing.reasonCode,
        adminComments: params.adminComments ?? existing.adminComments,
        parcelValue: params.parcelValue ?? existing.parcelValue,
      },
    });

    await writeAuditLog({
      tx,
      userId: params.userId,
      action: "STATUS_CHANGE",
      entityType: "Order",
      entityId: order.id,
      previousValue: {
        deliveryStatus: existing.deliveryStatus,
        reasonCode: existing.reasonCode,
        adminComments: existing.adminComments,
      },
      newValue: {
        deliveryStatus: order.deliveryStatus,
        reasonCode: order.reasonCode,
        adminComments: order.adminComments,
      },
    });

    return order;
  });

  return updated;
}

export async function applyPartialOrExchange(params: {
  orderId: string;
  userId?: string;
  mode: "PARTIAL" | "EXCHANGE";
  items: { orderItemId: string; acceptedQuantity: number; returnedQuantity: number }[];
  reasonCode?: string;
  adminComments?: string;
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: true },
  });
  if (!order) throw new Error("Order not found");

  return prisma.$transaction(async (tx) => {
    let netSale = 0;

    for (const adj of params.items) {
      const item = order.items.find((i) => i.id === adj.orderItemId);
      if (!item) throw new Error("Order item not found");

      const accepted = Math.max(0, adj.acceptedQuantity);
      const returned = Math.max(0, adj.returnedQuantity);
      if (accepted + returned > item.orderedQuantity) {
        throw new Error("Accepted + returned cannot exceed ordered quantity");
      }

      const previouslyReturned = item.returnedQuantity;
      const returnDelta = returned - previouslyReturned;

      if (returnDelta > 0) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: returnDelta } },
        });
        await writeAuditLog({
          tx,
          userId: params.userId,
          action: "STOCK_UPDATE",
          entityType: "Product",
          entityId: item.productId,
          newValue: {
            increment: returnDelta,
            reason: params.mode === "EXCHANGE" ? "EXCHANGE_RETURN" : "PARTIAL_RETURN",
            orderNumber: order.orderNumber,
          },
        });
      }

      await tx.orderItem.update({
        where: { id: item.id },
        data: {
          acceptedQuantity: accepted,
          returnedQuantity: returned,
        },
      });

      netSale += accepted * item.unitPrice;
    }

    const updated = await tx.order.update({
      where: { id: order.id },
      data: {
        deliveryStatus:
          params.mode === "EXCHANGE"
            ? "EXCHANGE"
            : "PARTIAL",
        totalAmount: netSale,
        parcelValue: netSale,
        reasonCode: params.reasonCode ?? order.reasonCode,
        adminComments: params.adminComments ?? order.adminComments,
      },
      include: { items: { include: { product: true } } },
    });

    await writeAuditLog({
      tx,
      userId: params.userId,
      action: params.mode === "EXCHANGE" ? "EXCHANGE" : "PARTIAL_RETURN",
      entityType: "Order",
      entityId: order.id,
      previousValue: {
        totalAmount: order.totalAmount,
        items: order.items,
      },
      newValue: {
        totalAmount: updated.totalAmount,
        items: params.items,
      },
    });

    return updated;
  });
}

export async function mergeOrders(params: {
  primaryOrderId: string;
  secondaryOrderId: string;
  userId?: string;
}) {
  if (params.primaryOrderId === params.secondaryOrderId) {
    throw new Error("Cannot merge an order into itself");
  }

  return prisma.$transaction(async (tx) => {
    const [primary, secondary] = await Promise.all([
      tx.order.findUnique({
        where: { id: params.primaryOrderId },
        include: { items: true },
      }),
      tx.order.findUnique({
        where: { id: params.secondaryOrderId },
        include: { items: true },
      }),
    ]);
    if (!primary || !secondary) throw new Error("Order not found");

    for (const item of secondary.items) {
      await tx.orderItem.create({
        data: {
          orderId: primary.id,
          productId: item.productId,
          orderedQuantity: item.orderedQuantity,
          acceptedQuantity: item.acceptedQuantity,
          returnedQuantity: item.returnedQuantity,
          unitPrice: item.unitPrice,
        },
      });
    }

    const mergedTags = Array.from(
      new Set([
        ...JSON.parse(primary.tags || "[]"),
        ...JSON.parse(secondary.tags || "[]"),
        "merged",
      ]),
    );

    const updatedPrimary = await tx.order.update({
      where: { id: primary.id },
      data: {
        totalAmount: primary.totalAmount + secondary.totalAmount,
        parcelValue: primary.parcelValue + secondary.parcelValue,
        tags: JSON.stringify(mergedTags),
        adminComments: [primary.adminComments, secondary.adminComments, `Merged ${secondary.orderNumber}`]
          .filter(Boolean)
          .join(" | "),
      },
      include: { items: { include: { product: true } } },
    });

    await tx.order.update({
      where: { id: secondary.id },
      data: {
        mergedIntoId: primary.id,
        deliveryStatus: "FAILED",
        reasonCode: "Merged into another order",
        adminComments: `Merged into ${primary.orderNumber}`,
      },
    });

    await tx.inboxMessage.updateMany({
      where: { orderId: secondary.id },
      data: { orderId: primary.id, status: "MERGED" },
    });

    await writeAuditLog({
      tx,
      userId: params.userId,
      action: "MERGE_ORDERS",
      entityType: "Order",
      entityId: primary.id,
      previousValue: { primary: primary.orderNumber, secondary: secondary.orderNumber },
      newValue: { mergedInto: primary.orderNumber, totalAmount: updatedPrimary.totalAmount },
    });

    return updatedPrimary;
  });
}

export type OrderListFilters = {
  channel?: SourceChannel;
  /** Delivery status, or WAITING (= PENDING + IN_PROGRESS) */
  status?: DeliveryStatus | "WAITING";
  q?: string;
  from?: Date;
  to?: Date;
};

export function buildOrderWhere(filters: OrderListFilters): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = { mergedIntoId: null };
  if (filters.channel) where.sourceChannel = filters.channel;
  if (filters.status === "WAITING") {
    where.deliveryStatus = { in: ["PENDING", "IN_PROGRESS"] };
  } else if (filters.status) {
    where.deliveryStatus = filters.status;
  }
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = filters.from;
    if (filters.to) where.createdAt.lte = filters.to;
  }
  if (filters.q) {
    where.OR = [
      { orderNumber: { contains: filters.q } },
      { customerName: { contains: filters.q } },
      { customerPhone: { contains: filters.q } },
      { adminComments: { contains: filters.q } },
      { reasonCode: { contains: filters.q } },
    ];
  }
  return where;
}
