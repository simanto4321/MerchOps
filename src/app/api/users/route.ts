import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { allowDemoAccounts, allowRoleSwitch } from "@/server/config";
import { DEMO_ACCOUNT_HINTS } from "@/server/auth";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const demo = searchParams.get("demo") === "1";

  if (demo) {
    if (!allowDemoAccounts()) {
      return NextResponse.json({ users: [] });
    }
    // Plain PIN hints for local login UI — hashes stay in the database only
    return NextResponse.json({ users: DEMO_ACCOUNT_HINTS });
  }

  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!allowRoleSwitch() && me.role !== "ADMIN") {
    return NextResponse.json({
      users: [
        {
          id: me.id,
          name: me.name,
          username: me.username,
          email: me.email,
          role: me.role,
        },
      ],
    });
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
