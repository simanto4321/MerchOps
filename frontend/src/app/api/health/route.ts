import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { allowDemoAccounts, allowRoleSwitch, appName } from "@/server/config";

export async function GET() {
  try {
    const [users, orders, products] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
    ]);
    return NextResponse.json({
      ok: true,
      service: "merchops",
      app: appName,
      time: new Date().toISOString(),
      db: { connected: true, users, orders, products },
      flags: {
        demoAccounts: allowDemoAccounts(),
        roleSwitch: allowRoleSwitch(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "DB unavailable",
      },
      { status: 503 },
    );
  }
}
