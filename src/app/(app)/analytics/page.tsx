import { redirect } from "next/navigation";
import { AdSpendForm } from "@/components/ad-spend-form";
import { MetricCard } from "@/components/metric-card";
import { Badge } from "@/components/ui/badge";
import { getDashboardMetrics } from "@/lib/analytics";
import { formatBdt } from "@/lib/utils";
import { getCurrentUser, canViewCosts } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user || !canViewCosts(user.role)) {
    redirect("/dashboard");
  }

  const [metrics, products, spends] = await Promise.all([
    getDashboardMetrics(),
    prisma.product.findMany({
      select: { id: true, sku: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.adSpend.findMany({
      include: { product: true },
      orderBy: { spentAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Ad spend & profitability
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Cross-reference campaign spend against factory COGS and retail sales to
          flag net-loss marketing.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Monthly revenue" value={formatBdt(metrics.monthlyRevenue)} />
        <MetricCard label="Factory COGS" value={formatBdt(metrics.monthlyCogs)} />
        <MetricCard label="Ad spend" value={formatBdt(metrics.totalAdSpend)} />
        <MetricCard
          label="Net after ads"
          value={formatBdt(metrics.netAfterAds)}
          tone={metrics.netAfterAds >= 0 ? "good" : "bad"}
        />
      </div>

      <AdSpendForm products={products} />

      <section className="overflow-x-auto rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Product-level profit flags
        </h2>
        <table className="mt-4 w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-stone-200 text-xs uppercase text-stone-500">
            <tr>
              <th className="py-2 pr-3">Product</th>
              <th className="py-2 pr-3">Units sold</th>
              <th className="py-2 pr-3">Revenue</th>
              <th className="py-2 pr-3">COGS</th>
              <th className="py-2 pr-3">Ad spend</th>
              <th className="py-2 pr-3">Net</th>
              <th className="py-2">Flag</th>
            </tr>
          </thead>
          <tbody>
            {metrics.adProfitByProduct.map((row) => (
              <tr key={row.productId} className="border-b border-stone-100">
                <td className="py-2.5 pr-3">
                  <div className="font-medium">{row.name}</div>
                  <div className="text-xs text-stone-500">{row.sku}</div>
                </td>
                <td className="py-2.5 pr-3">{row.unitsSold}</td>
                <td className="py-2.5 pr-3">{formatBdt(row.revenue)}</td>
                <td className="py-2.5 pr-3">{formatBdt(row.cogs)}</td>
                <td className="py-2.5 pr-3">{formatBdt(row.spend)}</td>
                <td className="py-2.5 pr-3">{formatBdt(row.net)}</td>
                <td className="py-2.5">
                  {row.lossFlag ? (
                    <Badge className="bg-rose-100 text-rose-900">Net loss</Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-900">OK</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Recent ad spend entries
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {spends.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-100 bg-stone-50/80 px-3 py-2"
            >
              <div>
                <div className="font-medium">{s.campaignName}</div>
                <div className="text-xs text-stone-500">
                  {s.product?.name ?? "General"} ·{" "}
                  {s.spentAt.toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })} Asia/Dhaka
                </div>
              </div>
              <div className="font-medium">{formatBdt(s.amount)}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
