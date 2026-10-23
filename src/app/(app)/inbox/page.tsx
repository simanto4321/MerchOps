import { InboxDesk } from "@/components/inbox-desk";
import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const [messages, orders] = await Promise.all([
    prisma.inboxMessage.findMany({
      include: { order: { select: { id: true, orderNumber: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { mergedIntoId: null },
      select: { id: true, orderNumber: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <InboxDesk
      orders={orders}
      initialMessages={messages.map((m) => ({
        ...m,
        tags: parseTags(m.tags),
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
