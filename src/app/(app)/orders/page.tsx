import { OrdersDesk } from "@/components/orders-desk";
import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; new?: string }>;
}) {
  const params = await searchParams;
  const [orders, products] = await Promise.all([
    prisma.order.findMany({
      where: { mergedIntoId: null },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        sku: true,
        name: true,
        retailPrice: true,
        stockQuantity: true,
      },
    }),
  ]);

  return (
    <OrdersDesk
      initialOrders={orders.map((o) => ({
        ...o,
        tags: parseTags(o.tags),
        createdAt: o.createdAt.toISOString(),
      }))}
      products={products}
      initialQ={params.q ?? ""}
      initialStatus={params.status ?? ""}
      initialShowEntry={params.new === "1"}
    />
  );
}
