import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const demo = searchParams.get("demo") === "1";

  if (demo) {
    // Sign-in shortcuts — loaded from DB (not hardcoded in the UI)
    const users = await prisma.user.findMany({
      orderBy: { role: "asc" },
      select: {
        username: true,
        pin: true,
        role: true,
        name: true,
      },
    });
    return NextResponse.json({ users });
  }

  const users = await prisma.user.findMany({
    orderBy: { role: "asc" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
    },
  });
  return NextResponse.json({ users });
}
