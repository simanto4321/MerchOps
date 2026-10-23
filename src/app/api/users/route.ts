import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { role: "asc" },
    select: { id: true, name: true, email: true, role: true },
  });
  return NextResponse.json({ users });
}
