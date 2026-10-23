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
      {/* Text sits on solid panel — image is beside it (no overlay jump) */}
      <section className="grid overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_18px_50px_-28px_rgba(12,42,38,0.35)] md:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-8 sm:px-7 sm:py-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0c1210]">
            {t.brand}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[#0c1210] sm:text-4xl">
            {d.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#0c1210]/75">
            {d.subtitle}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/orders"
              className="gold-btn !rounded-md !px-4 !py-2 text-xs"
            >
              {t.nav.orders}
            </Link>
            <Link href="/inbox" className="ghost-btn-light">
              {t.nav.inbox}
            </Link>
            <Link href="/inventory" className="ghost-btn-light">
              {t.nav.inventory}
            </Link>
          </div>
        </div>
        <div
          className="min-h-[160px] bg-cover bg-center md:min-h-[260px]"
          style={{ backgroundImage: "url(/images/warehouse-hero.jpg)" }}
          aria-hidden
        />
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={d.ordersToday} value={String(m.dailyOrders)} />
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
        <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[0_12px_40px_-24px_rgba(12,42,38,0.4)]">
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

        <section className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[0_12px_40px_-24px_rgba(12,42,38,0.4)]">
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

      {showCosts && m.adProfitByProduct.some((r) => r.lossFlag) ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {d.adTable}
            </h2>
            <Link href="/analytics" className="text-sm text-teal-800">
              {d.fullReport} →
            </Link>
          </div>
          <ul className="space-y-2">
            {m.adProfitByProduct
              .filter((r) => r.lossFlag)
              .map((row) => (
                <li
                  key={row.productId}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/80 px-3 py-2 text-sm"
                >
                  <span className="font-medium">
                    {row.name}{" "}
                    <span className="text-stone-500">({row.sku})</span>
                  </span>
                  <span className="font-semibold text-rose-800">
                    {formatBdt(row.net)}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
