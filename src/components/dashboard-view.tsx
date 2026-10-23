"use client";

import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { Badge } from "@/components/ui/badge";
import { CHANNEL_LABELS, STATUS_COLORS, STATUS_LABELS } from "@/lib/constants";
import { formatBdt } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

type Metrics = Awaited<
  ReturnType<typeof import("@/lib/analytics").getDashboardMetrics>
>;

export function DashboardView({
  metrics: m,
  showCosts,
}: {
  metrics: Metrics;
  showCosts: boolean;
}) {
  const { t } = useI18n();
  const d = t.dash;

  return (
    <div className="space-y-8">
      <div className="rise-in">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-stone-900 sm:text-4xl">
          {d.title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-stone-600">{d.subtitle}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard shine label={d.ordersToday} value={String(m.dailyOrders)} />
        <MetricCard label={d.ordersMonth} value={String(m.monthlyOrderCount)} />
        <MetricCard
          label={d.pending}
          value={String(m.pendingCount)}
          tone={m.pendingCount > 0 ? "warn" : "good"}
        />
        <MetricCard
          label={d.openInbox}
          value={String(m.openInbox)}
          hint={t.landing.feat1Title}
        />
        {showCosts ? (
          <>
            <MetricCard
              label={d.monthlyRevenue}
              value={formatBdt(m.monthlyRevenue)}
              tone="good"
            />
            <MetricCard
              label={d.inventoryValue}
              value={formatBdt(m.inventoryValue)}
            />
            <MetricCard
              label={d.factoryValue}
              value={formatBdt(m.factoryInventoryValue)}
              hint={d.adminOnly}
            />
            <MetricCard
              label={d.netAfterAds}
              value={formatBdt(m.netAfterAds)}
              hint={`${formatBdt(m.totalAdSpend)} ads · ${formatBdt(m.grossProfit)} gross`}
              tone={m.netAfterAds >= 0 ? "good" : "bad"}
            />
          </>
        ) : (
          <MetricCard
            label={d.financialLocked}
            value={d.adminOnly}
            hint={d.financialLockedHint}
            tone="warn"
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rise-in rounded-2xl border border-stone-200/90 bg-white/90 p-5 shadow-[0_12px_40px_-24px_rgba(12,42,38,0.4)]">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {d.followUps}
            </h2>
            <Link href="/orders?status=FAILED" className="text-sm text-teal-800">
              {d.viewFailed} →
            </Link>
          </div>
          {m.failedFollowUps.length === 0 ? (
            <p className="text-sm text-stone-500">—</p>
          ) : (
            <ul className="space-y-3">
              {m.failedFollowUps.map((o) => (
                <li
                  key={o.id}
                  className="rounded-xl border border-stone-100 bg-stone-50/80 px-3 py-2"
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
                    {o.reasonCode ?? "—"}
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

        <section className="rise-in rounded-2xl border border-stone-200/90 bg-white/90 p-5 shadow-[0_12px_40px_-24px_rgba(12,42,38,0.4)]">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {d.lowStock}
            </h2>
            <Link href="/inventory" className="text-sm text-teal-800">
              {d.inventoryLink} →
            </Link>
          </div>
          {m.lowStock.length === 0 ? (
            <p className="text-sm text-stone-500">—</p>
          ) : (
            <ul className="space-y-2">
              {m.lowStock.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-2 text-sm"
                >
                  <span>
                    <span className="font-medium">{p.sku}</span> · {p.name}
                  </span>
                  <span className="font-medium text-amber-900">
                    {p.stockQuantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {showCosts && m.adProfitByProduct.length > 0 ? (
        <section className="rise-in rounded-2xl border border-stone-200/90 bg-white/90 p-5 shadow-[0_12px_40px_-24px_rgba(12,42,38,0.4)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {d.adTable}
            </h2>
            <Link href="/analytics" className="text-sm text-teal-800">
              {d.fullReport} →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="py-2 pr-3">SKU</th>
                  <th className="py-2 pr-3">Units</th>
                  <th className="py-2 pr-3">Revenue</th>
                  <th className="py-2 pr-3">Ad</th>
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
                        <Badge className="bg-rose-100 text-rose-900">Loss</Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-900">OK</Badge>
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
