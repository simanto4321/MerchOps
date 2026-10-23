"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Inbox,
  PackagePlus,
} from "lucide-react";
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

  const actions = [
    {
      href: "/orders",
      label: d.openOrders,
      icon: ClipboardList,
      tone: "primary" as const,
    },
    {
      href: "/inbox",
      label: d.openInbox,
      icon: Inbox,
      tone: "default" as const,
    },
    {
      href: "/orders?new=1",
      label: d.packParcels,
      icon: PackagePlus,
      tone: "default" as const,
    },
    {
      href: "/orders?status=FAILED",
      label: d.retryFailed,
      icon: AlertTriangle,
      tone: "warn" as const,
      badge: m.failedFollowUps.length || undefined,
    },
  ];

  return (
    <div className="space-y-7">
      <div className="rise-in">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-800/70">
          MerchOps
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-stone-900 sm:text-4xl">
          {d.title}
        </h1>
        <p className="mt-1 max-w-xl text-sm text-stone-600">{d.subtitle}</p>
      </div>

      <section className="rise-in">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          {d.doNow}
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.label}
                href={a.href}
                className={
                  a.tone === "primary"
                    ? "group flex items-center justify-between gap-3 rounded-2xl bg-[#0c2a26] px-4 py-4 text-white shadow-sm transition hover:bg-[#143833]"
                    : a.tone === "warn"
                      ? "group flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-950 transition hover:border-amber-300"
                      : "group flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-stone-900 transition hover:border-teal-700/30 hover:bg-teal-50/40"
                }
              >
                <span className="flex items-center gap-3">
                  <span
                    className={
                      a.tone === "primary"
                        ? "rounded-xl bg-white/10 p-2"
                        : "rounded-xl bg-stone-100 p-2 text-stone-700"
                    }
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold">{a.label}</span>
                </span>
                <span className="flex items-center gap-2">
                  {a.badge ? (
                    <span className="rounded-md bg-amber-200 px-1.5 py-0.5 text-[11px] font-bold">
                      {a.badge}
                    </span>
                  ) : null}
                  <ArrowRight className="h-4 w-4 opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rise-in">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          {d.snapshot}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            shine
            href="/orders"
            label={d.ordersToday}
            value={String(m.dailyOrders)}
          />
          <MetricCard
            href="/orders"
            label={d.ordersMonth}
            value={String(m.monthlyOrderCount)}
          />
          <MetricCard
            href="/orders?status=WAITING"
            label={d.pending}
            value={String(m.pendingCount)}
            tone={m.pendingCount > 0 ? "warn" : "good"}
          />
          <MetricCard
            href="/inbox"
            label={d.openInboxMetric}
            value={String(m.openInbox)}
          />
        </div>
      </section>

      {showCosts ? (
        <section className="rise-in">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            {d.money}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              href="/analytics"
              label={d.monthlyRevenue}
              value={formatBdt(m.monthlyRevenue)}
              tone="good"
            />
            <MetricCard
              href="/inventory"
              label={d.inventoryValue}
              value={formatBdt(m.inventoryValue)}
            />
            <MetricCard
              label={d.factoryValue}
              value={formatBdt(m.factoryInventoryValue)}
              hint={d.adminOnly}
            />
            <MetricCard
              href="/analytics"
              label={d.netAfterAds}
              value={formatBdt(m.netAfterAds)}
              tone={m.netAfterAds >= 0 ? "good" : "bad"}
            />
          </div>
        </section>
      ) : (
        <div className="rise-in rounded-2xl border border-dashed border-stone-300 bg-white/60 px-4 py-3 text-sm text-stone-600">
          <span className="font-medium text-stone-800">{d.financialLocked}: </span>
          {d.financialLockedHint}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="panel rise-in p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-700/80">
                {d.needsAttention}
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
                {d.followUps}
              </h2>
            </div>
            <Link
              href="/orders?status=FAILED"
              className="text-sm font-medium text-teal-800 hover:underline"
            >
              {d.viewFailed}
            </Link>
          </div>
          {m.failedFollowUps.length === 0 ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-4 text-sm text-emerald-900">
              {d.noFollowUps}
            </p>
          ) : (
            <ul className="space-y-2">
              {m.failedFollowUps.map((o) => (
                <li
                  key={o.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-100 bg-stone-50/80 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-stone-900">
                        {o.orderNumber}
                      </span>
                      <Badge className={STATUS_COLORS[o.deliveryStatus]}>
                        {STATUS_LABELS[o.deliveryStatus]}
                      </Badge>
                      <span className="text-xs text-stone-500">
                        {CHANNEL_LABELS[o.sourceChannel]}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-stone-700">
                      {o.reasonCode ?? "—"}
                      {o.adminComments ? ` · ${o.adminComments}` : ""}
                    </p>
                    <p className="text-xs text-stone-500">
                      {o.customerName} · {o.customerPhone}
                    </p>
                  </div>
                  <Link
                    href="/orders"
                    className="shrink-0 rounded-lg bg-[#0c2a26] px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    {d.open}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel rise-in p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
              {d.lowStock}
            </h2>
            <Link
              href="/inventory"
              className="text-sm font-medium text-teal-800 hover:underline"
            >
              {d.inventoryLink}
            </Link>
          </div>
          {m.lowStock.length === 0 ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-4 text-sm text-emerald-900">
              {d.noLowStock}
            </p>
          ) : (
            <ul className="space-y-2">
              {m.lowStock.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2.5 text-sm"
                >
                  <span>
                    <span className="font-semibold">{p.sku}</span>
                    <span className="text-stone-600"> · {p.name}</span>
                  </span>
                  <span className="font-bold text-amber-950">{p.stockQuantity}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {showCosts && m.adProfitByProduct.some((r) => r.lossFlag) ? (
        <section className="rise-in rounded-2xl border border-rose-200 bg-rose-50/40 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
              {d.adTable}
            </h2>
            <Link href="/analytics" className="text-sm font-medium text-teal-800">
              {d.fullReport} →
            </Link>
          </div>
          <ul className="space-y-2">
            {m.adProfitByProduct
              .filter((r) => r.lossFlag)
              .map((row) => (
                <li
                  key={row.productId}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm"
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
