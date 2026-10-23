import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      time: new Date().toISOString(),
      db: { users, orders, products },
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
