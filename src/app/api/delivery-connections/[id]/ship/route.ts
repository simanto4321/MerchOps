import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { writeAuditLog } from "@/lib/audit";
import { updateOrderStatus } from "@/lib/orders";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Create a consignment via a connected courier (soft/demo ship).
 * Body: { orderId }
 */
export async function POST(req: Request, ctx: Ctx) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: connectionId } = await ctx.params;
    const body = await req.json();
    const connection = await prisma.deliveryConnection.findUnique({
      where: { id: connectionId },
    });
    if (!connection) {
      return NextResponse.json({ error: "Courier not found" }, { status: 404 });
    }
    if (connection.status !== "CONNECTED" || !connection.apiKey) {
      return NextResponse.json(
        { error: "Courier is not connected. Save API key and Connect first." },
        { status: 400 },
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: body.orderId },
      include: { items: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const consignmentId = `${connection.provider}-${order.orderNumber}-${Date.now().toString(36)}`;

    await updateOrderStatus({
      orderId: order.id,
      userId: user.id,
      deliveryStatus: "IN_PROGRESS",
      adminComments: [
        order.adminComments,
        `Shipped via ${connection.displayName} · ${consignmentId}`,
      ]
        .filter(Boolean)
        .join(" | "),
      reasonCode: order.reasonCode,
    });

    await writeAuditLog({
      userId: user.id,
      action: "STATUS_CHANGE",
      entityType: "DeliveryConnection",
      entityId: connection.id,
      newValue: {
        action: "SHIP",
        consignmentId,
        orderNumber: order.orderNumber,
        provider: connection.provider,
      },
    });

    await prisma.deliveryConnection.update({
      where: { id: connection.id },
      data: { lastSyncedAt: new Date(), lastError: null },
    });

    return NextResponse.json({
      ok: true,
      consignmentId,
      provider: connection.provider,
      message: `Consignment ${consignmentId} created (demo). Order moved to In Progress.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ship failed" },
      { status: 400 },
    );
  }
}
