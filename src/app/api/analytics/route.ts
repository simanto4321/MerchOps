import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/analytics";
import { getCurrentUser, canViewCosts } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function GET() {
  const user = await getCurrentUser();
  const metrics = await getDashboardMetrics();
  const showCosts = !!user && canViewCosts(user.role);

  if (!showCosts) {
    return NextResponse.json({
      metrics: {
        dailyOrders: metrics.dailyOrders,
        monthlyOrderCount: metrics.monthlyOrderCount,
        monthlyRevenue: null,
        monthlyCogs: null,
        grossProfit: null,
        totalAdSpend: null,
        netAfterAds: null,
        inventoryValue: null,
        factoryInventoryValue: null,
        pendingCount: metrics.pendingCount,
        lowStock: metrics.lowStock.map((p) => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          stockQuantity: p.stockQuantity,
          lowStockThreshold: p.lowStockThreshold,
        })),
        failedFollowUps: metrics.failedFollowUps,
        openInbox: metrics.openInbox,
        adProfitByProduct: [],
      },
      restricted: true,
    });
  }

  return NextResponse.json({ metrics, restricted: false });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !canViewCosts(user.role)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const body = await req.json();
  const spend = await prisma.adSpend.create({
    data: {
      campaignName: body.campaignName,
      productId: body.productId || null,
      amount: Number(body.amount),
      notes: body.notes,
      spentAt: body.spentAt ? new Date(body.spentAt) : new Date(),
    },
  });
  await writeAuditLog({
    userId: user.id,
    action: "AD_SPEND_UPDATE",
    entityType: "AdSpend",
    entityId: spend.id,
    newValue: spend,
  });
  return NextResponse.json({ spend });
}
