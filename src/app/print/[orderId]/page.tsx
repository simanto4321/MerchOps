import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { formatBdt, parseTags } from "@/lib/utils";
import { CHANNEL_LABELS, STATUS_LABELS } from "@/lib/constants";
import { PrintActions } from "@/components/print-actions";

export const dynamic = "force-dynamic";

export default async function PackingSlipPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  const tags = parseTags(order.tags);

  return (
    <div className="mx-auto max-w-2xl bg-white p-6 text-stone-900 print:p-0">
      <div className="mb-6 flex items-start justify-between gap-3 print:hidden">
        <Link href="/orders" className="text-sm text-teal-800 hover:underline">
          ← Back to orders
        </Link>
        <PrintActions />
      </div>

      <header className="border-b border-stone-200 pb-4">
        <p className="font-[family-name:var(--font-display)] text-3xl">MerchOps</p>
        <p className="text-sm text-stone-500">Packing slip / parcel label</p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-500">Order</p>
          <p className="text-xl font-semibold">{order.orderNumber}</p>
          <p className="text-sm text-stone-600">
            {STATUS_LABELS[order.deliveryStatus]} ·{" "}
            {CHANNEL_LABELS[order.sourceChannel]}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-500">Customer</p>
          <p className="text-lg font-semibold">{order.customerName}</p>
          <p className="text-sm">{order.customerPhone}</p>
        </div>
      </div>

      {tags.length > 0 ? (
        <p className="mt-3 text-sm text-stone-600">Tags: {tags.join(", ")}</p>
      ) : null}

      <table className="mt-6 w-full text-left text-sm">
        <thead className="border-b border-stone-200 text-xs uppercase text-stone-500">
          <tr>
            <th className="py-2">SKU</th>
            <th className="py-2">Item</th>
            <th className="py-2">Qty</th>
            <th className="py-2">Unit</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((i) => (
            <tr key={i.id} className="border-b border-stone-100">
              <td className="py-2 font-medium">{i.product.sku}</td>
              <td className="py-2">{i.product.name}</td>
              <td className="py-2">{i.orderedQuantity}</td>
              <td className="py-2">{formatBdt(i.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between border-t border-stone-200 pt-4 text-sm">
        <div>
          <p>Parcel value</p>
          <p className="text-xs text-stone-500">
            {order.createdAt.toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })}{" "}
            Asia/Dhaka
          </p>
        </div>
        <p className="text-2xl font-semibold">{formatBdt(order.parcelValue)}</p>
      </div>

      {order.adminComments ? (
        <p className="mt-4 rounded-lg bg-stone-50 p-3 text-sm">
          Note: {order.adminComments}
        </p>
      ) : null}

      <p className="mt-8 text-center text-xs text-stone-400">
        Packed by {user.name} · MerchOps
      </p>
    </div>
  );
}
