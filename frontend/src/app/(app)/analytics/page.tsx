import { AccessDenied } from "@/components/access-denied";
import { AdSpendForm } from "@/components/ad-spend-form";
import { MetricCard } from "@/components/metric-card";
import { Badge } from "@/components/ui/badge";
import { getDashboardMetrics } from "@/lib/analytics";
import { formatBdt } from "@/lib/utils";
import { getCurrentUser, canViewCosts } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { APP_TIMEZONE, dhakaMonthLabel, formatDhakaDateTime } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user || !canViewCosts(user.role)) {
    return <AccessDenied />;
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

  const monthLabel = dhakaMonthLabel();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Ads & monthly P&amp;L
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          {monthLabel} · {APP_TIMEZONE} · Campaign spend vs factory COGS and
          retail sales. Loss flags appear when ads wipe out margin.
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

      <div className="grid gap-3 sm:grid-cols-2">
        <MetricCard
          label="Inventory retail value"
          value={formatBdt(metrics.inventoryValue)}
        />
        <MetricCard
          label="Factory inventory value"
          value={formatBdt(metrics.factoryInventoryValue)}
          hint="True cost basis"
        />
      </div>

      <AdSpendForm products={products} />

      <section className="overflow-x-auto rounded-2xl border border-stone-200 bg-white p-5">
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
            {metrics.adProfitByProduct.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-stone-500">
                  No sales or ad spend this month yet.
                </td>
              </tr>
            ) : (
              metrics.adProfitByProduct.map((row) => (
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
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Recent ad spend entries
        </h2>
        {spends.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">No ad spend logged yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {spends.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-stone-100 bg-stone-50/80 px-3 py-2"
              >
                <div>
                  <div className="font-medium">{s.campaignName}</div>
                  <div className="text-xs text-stone-500">
                    {s.product?.name ?? "General"} ·{" "}
                    {formatDhakaDateTime(s.spentAt)}
                  </div>
                </div>
                <div className="font-medium">{formatBdt(s.amount)}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
