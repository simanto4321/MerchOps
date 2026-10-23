import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { Badge } from "@/components/ui/badge";
import { getDashboardMetrics } from "@/lib/analytics";
import { CHANNEL_LABELS, STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import { formatBdt } from "@/lib/utils";
import { getCurrentUser, canViewCosts } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const showCosts = !!user && canViewCosts(user.role);
  const m = await getDashboardMetrics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          Ops overview
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-stone-600">
          Daily order pulse, inventory valuation, ad-spend profit flags, and
          morning follow-ups for failed deliveries.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Orders today" value={String(m.dailyOrders)} />
        <MetricCard
          label="Orders this month"
          value={String(m.monthlyOrderCount)}
        />
        <MetricCard
          label="Pending / in progress"
          value={String(m.pendingCount)}
          tone={m.pendingCount > 0 ? "warn" : "good"}
        />
        <MetricCard
          label="Open inbox"
          value={String(m.openInbox)}
          hint="Unified multi-channel queue"
        />
        {showCosts ? (
          <>
            <MetricCard
              label="Monthly revenue"
              value={formatBdt(m.monthlyRevenue)}
              tone="good"
            />
            <MetricCard
              label="Inventory retail value"
              value={formatBdt(m.inventoryValue)}
            />
            <MetricCard
              label="Factory inventory value"
              value={formatBdt(m.factoryInventoryValue)}
              hint="Admin-only cost basis"
            />
            <MetricCard
              label="Net after ads"
              value={formatBdt(m.netAfterAds)}
              hint={`Ad spend ${formatBdt(m.totalAdSpend)} · Gross ${formatBdt(m.grossProfit)}`}
              tone={m.netAfterAds >= 0 ? "good" : "bad"}
            />
          </>
        ) : (
          <MetricCard
            label="Financial metrics"
            value="Admin only"
            hint="Switch to an Admin account to view costs, margins, and ad profitability"
            tone="warn"
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              Morning follow-ups
            </h2>
            <Link href="/orders?status=FAILED" className="text-sm text-teal-800">
              View failed →
            </Link>
          </div>
          {m.failedFollowUps.length === 0 ? (
            <p className="text-sm text-stone-500">No failed deliveries with comments.</p>
          ) : (
            <ul className="space-y-3">
              {m.failedFollowUps.map((o) => (
                <li
                  key={o.id}
                  className="rounded-lg border border-stone-100 bg-stone-50/80 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-stone-900">
                      {o.orderNumber}
                    </span>
                    <Badge className={STATUS_COLORS[o.deliveryStatus]}>
                      {STATUS_LABELS[o.deliveryStatus]}
                    </Badge>
                    <span className="text-xs text-stone-500">
                      {CHANNEL_LABELS[o.sourceChannel]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-stone-700">
                    {o.reasonCode ?? "No reason code"}
                    {o.adminComments ? ` · ${o.adminComments}` : ""}
                  </p>
                  <p className="text-xs text-stone-500">
                    {o.customerName} · {o.customerPhone}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              Low stock alerts
            </h2>
            <Link href="/inventory" className="text-sm text-teal-800">
              Inventory →
            </Link>
          </div>
          {m.lowStock.length === 0 ? (
            <p className="text-sm text-stone-500">All SKUs above threshold.</p>
          ) : (
            <ul className="space-y-2">
              {m.lowStock.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-sm"
                >
                  <span>
                    <span className="font-medium">{p.sku}</span> · {p.name}
                  </span>
                  <span className="font-medium text-amber-900">
                    {p.stockQuantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {showCosts && m.adProfitByProduct.length > 0 ? (
        <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              Ad spend vs profitability
            </h2>
            <Link href="/analytics" className="text-sm text-teal-800">
              Full report →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-stone-200 text-xs uppercase text-stone-500">
                <tr>
                  <th className="py-2 pr-3">Product</th>
                  <th className="py-2 pr-3">Units</th>
                  <th className="py-2 pr-3">Revenue</th>
                  <th className="py-2 pr-3">Ad spend</th>
                  <th className="py-2 pr-3">Net</th>
                  <th className="py-2">Flag</th>
                </tr>
              </thead>
              <tbody>
                {m.adProfitByProduct.map((row) => (
                  <tr key={row.productId} className="border-b border-stone-100">
                    <td className="py-2.5 pr-3">
                      <div className="font-medium">{row.name}</div>
                      <div className="text-xs text-stone-500">{row.sku}</div>
                    </td>
                    <td className="py-2.5 pr-3">{row.unitsSold}</td>
                    <td className="py-2.5 pr-3">{formatBdt(row.revenue)}</td>
                    <td className="py-2.5 pr-3">{formatBdt(row.spend)}</td>
                    <td className="py-2.5 pr-3">{formatBdt(row.net)}</td>
                    <td className="py-2.5">
                      {row.lossFlag ? (
                        <Badge className="bg-rose-100 text-rose-900">
                          Net loss
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-900">
                          OK
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
