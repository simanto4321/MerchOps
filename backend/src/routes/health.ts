import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const healthRoutes = new Hono();

healthRoutes.get("/", async (c) => {
  try {
    const [users, orders, products] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
    ]);
    return c.json({
      ok: true,
      service: "merchops-backend",
      time: new Date().toISOString(),
      db: { connected: true, provider: "postgresql", users, orders, products },
      flags: {
        demoAccounts: process.env.ALLOW_DEMO_ACCOUNTS !== "false",
        roleSwitch: process.env.ALLOW_ROLE_SWITCH === "true",
      },
    });
  } catch (error) {
    return c.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "DB unavailable",
      },
      503,
    );
  }
});
