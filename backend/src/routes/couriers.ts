import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { getCourierAdapter, listCourierAdapters } from "../couriers/registry";
import {
  shipWithCourier,
  testCourierConnection,
} from "../services/shipping";

const prisma = new PrismaClient();

export const courierRoutes = new Hono();

courierRoutes.get("/adapters", (c) =>
  c.json({
    adapters: listCourierAdapters(),
    note: "All shipping goes through CourierAdapter — routes never call provider HTTP directly.",
  }),
);

courierRoutes.post("/:connectionId/test", async (c) => {
  const connectionId = c.req.param("connectionId");
  const connection = await prisma.deliveryConnection.findUnique({
    where: { id: connectionId },
  });
  if (!connection) return c.json({ error: "Courier not found" }, 404);

  const result = await testCourierConnection(connection.provider, {
    apiBaseUrl: connection.apiBaseUrl,
    apiKey: connection.apiKey,
    apiSecret: connection.apiSecret,
    storeId: connection.storeId,
    configJson: connection.configJson,
  });

  await prisma.deliveryConnection.update({
    where: { id: connection.id },
    data: {
      status: result.ok ? "CONNECTED" : "ERROR",
      lastError: result.ok ? null : result.message,
      lastSyncedAt: new Date(),
    },
  });

  return c.json(result);
});

courierRoutes.post("/:connectionId/ship", async (c) => {
  const connectionId = c.req.param("connectionId");
  const body = await c.req.json();
  const connection = await prisma.deliveryConnection.findUnique({
    where: { id: connectionId },
  });
  if (!connection) return c.json({ error: "Courier not found" }, 404);
  if (connection.status !== "CONNECTED" || !connection.apiKey) {
    return c.json(
      { error: "Courier is not connected. Save API key and Connect first." },
      400,
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: body.orderId },
    include: { items: true },
  });
  if (!order) return c.json({ error: "Order not found" }, 404);

  const adapter = getCourierAdapter(connection.provider);
  const result = await shipWithCourier(
    connection.provider,
    {
      apiBaseUrl: connection.apiBaseUrl,
      apiKey: connection.apiKey,
      apiSecret: connection.apiSecret,
      storeId: connection.storeId,
      configJson: connection.configJson,
    },
    {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      parcelValue: order.parcelValue,
      itemCount: order.items.length,
      notes: order.adminComments,
    },
  );

  if (!result.ok) {
    await prisma.deliveryConnection.update({
      where: { id: connection.id },
      data: { status: "ERROR", lastError: result.message },
    });
    return c.json({ error: result.message }, 400);
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      deliveryStatus: "IN_PROGRESS",
      adminComments: [order.adminComments, `Shipped via ${adapter.provider} · ${result.consignmentId}`]
        .filter(Boolean)
        .join(" | "),
    },
  });

  await prisma.deliveryConnection.update({
    where: { id: connection.id },
    data: { lastSyncedAt: new Date(), lastError: null },
  });

  return c.json({
    ok: true,
    ...result,
    layer: "CourierAdapter",
  });
});
