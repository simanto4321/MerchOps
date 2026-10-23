"use client";

import { SettingsForm } from "./settings-form";
import { useI18n } from "@/lib/i18n/provider";
import Link from "next/link";
import { APP_TIMEZONE } from "@/lib/time";

export function SettingsPageView({
  initial,
}: {
  initial: { key: string; value: string }[];
}) {
  const { t, locale } = useI18n();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
          {t.settings.title}
        </h1>
        <p className="mt-1 text-sm text-stone-600">{t.settings.subtitle}</p>
        <p className="mt-2 text-sm text-stone-500">
          {locale === "bn" ? "সময় অঞ্চল" : "Timezone"}: {APP_TIMEZONE}
        </p>
        <p className="mt-2 text-sm">
          <Link
            href="/couriers"
            className="font-medium text-teal-800 hover:underline"
          >
            {t.nav.deliveries} →
          </Link>
        </p>
      </div>

      <SettingsForm initial={initial} />
    </div>
  );
}
