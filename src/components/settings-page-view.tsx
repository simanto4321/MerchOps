"use client";

import { Database } from "lucide-react";
import { SettingsForm } from "./settings-form";
import { useI18n } from "@/lib/i18n/provider";
import Link from "next/link";

export function SettingsPageView({
  initial,
}: {
  initial: { key: string; value: string }[];
}) {
  const { t, locale } = useI18n();

  return (
    <div className="space-y-5">
      <div className="rise-in">
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
          {t.settings.title}
        </h1>
        <p className="mt-1 text-sm text-stone-600">{t.settings.subtitle}</p>
        <p className="mt-2 text-sm">
          <Link href="/couriers" className="font-medium text-teal-800 hover:underline">
            {t.nav.deliveries} →
          </Link>
        </p>
      </div>

      <div className="rise-in flex items-start gap-3 rounded-2xl border border-stone-200/90 bg-white/90 p-4 shadow-[0_10px_30px_-18px_rgba(12,42,38,0.45)]">
        <span className="rounded-lg bg-[#0c2a26] p-2 text-[#f0b429]">
          <Database className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-stone-900">
            {locale === "bn" ? "Prisma ডেটাবেস" : "Prisma database"}
          </p>
          <p className="mt-1 text-sm text-stone-600">
            {locale === "bn"
              ? "লোকাল SQLite (prisma/dev.db)। প্রোডাকশনে provider = postgresql সেট করুন।"
              : "Local SQLite (prisma/dev.db). For production, set provider = postgresql."}
          </p>
        </div>
      </div>

      <SettingsForm initial={initial} />
    </div>
  );
}
