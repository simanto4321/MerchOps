import { prisma } from "./prisma";
import type { DeliveryStatus } from "./types";

const soldStatuses: DeliveryStatus[] = ["DELIVERED", "PARTIAL"];

export async function getDashboardMetrics() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    products,
    dailyOrders,
    monthlyOrders,
    pendingCount,
    failedFollowUps,
    adSpends,
    openInbox,
  ] = await Promise.all([
    prisma.product.findMany(),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.order.findMany({
      where: { createdAt: { gte: startOfMonth } },
      include: { items: true },
    }),
    prisma.order.count({
      where: {
        deliveryStatus: { in: ["PENDING", "IN_PROGRESS"] },
      },
    }),
    prisma.order.findMany({
      where: {
        deliveryStatus: "FAILED",
        OR: [{ reasonCode: { not: null } }, { adminComments: { not: null } }],
      },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
    prisma.adSpend.findMany({
      where: { spentAt: { gte: startOfMonth } },
      include: { product: true },
    }),
    prisma.inboxMessage.count({ where: { status: "OPEN" } }),
  ]);

  const inventoryValue = products.reduce(
    (sum, p) => sum + p.retailPrice * p.stockQuantity,
    0,
  );
  const factoryInventoryValue = products.reduce(
    (sum, p) => sum + p.factoryCost * p.stockQuantity,
    0,
  );
  const lowStock = products.filter((p) => p.stockQuantity <= p.lowStockThreshold);

  const monthlyRevenue = monthlyOrders
    .filter((o) => soldStatuses.includes(o.deliveryStatus as DeliveryStatus))
    .reduce((sum, o) => {
      const accepted = o.items.reduce(
        (s, i) => s + i.acceptedQuantity * i.unitPrice,
        0,
      );
      return sum + (accepted || o.totalAmount);
    }, 0);

  const monthlyCogs = monthlyOrders
    .filter((o) => soldStatuses.includes(o.deliveryStatus as DeliveryStatus))
    .reduce((sum, o) => {
      return (
        sum +
        o.items.reduce((s, i) => {
          const product = products.find((p) => p.id === i.productId);
          const qty = i.acceptedQuantity || i.orderedQuantity;
          return s + (product?.factoryCost ?? 0) * qty;
        }, 0)
      );
    }, 0);

  const totalAdSpend = adSpends.reduce((s, a) => s + a.amount, 0);
  const grossProfit = monthlyRevenue - monthlyCogs;
  const netAfterAds = grossProfit - totalAdSpend;

  const adProfitByProduct = products.map((product) => {
    const spend = adSpends
      .filter((a) => a.productId === product.id)
      .reduce((s, a) => s + a.amount, 0);
    const unitsSold = monthlyOrders
      .filter((o) => soldStatuses.includes(o.deliveryStatus as DeliveryStatus))
      .flatMap((o) => o.items)
      .filter((i) => i.productId === product.id)
      .reduce((s, i) => s + (i.acceptedQuantity || i.orderedQuantity), 0);
    const revenue = unitsSold * product.retailPrice;
    const cogs = unitsSold * product.factoryCost;
    const net = revenue - cogs - spend;
    return {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      spend,
      unitsSold,
      revenue,
      cogs,
      net,
      lossFlag: spend > 0 && net <= 0,
    };
  });

  return {
    dailyOrders,
    monthlyOrderCount: monthlyOrders.length,
    monthlyRevenue,
    monthlyCogs,
    grossProfit,
    totalAdSpend,
    netAfterAds,
    inventoryValue,
    factoryInventoryValue,
    pendingCount,
    lowStock,
    failedFollowUps,
    openInbox,
    adProfitByProduct: adProfitByProduct.filter((r) => r.spend > 0 || r.unitsSold > 0),
  };
}
