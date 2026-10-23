"use client";

import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-white/20 bg-black/20 p-0.5 text-xs backdrop-blur",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-md px-2.5 py-1 font-medium transition-colors",
          locale === "en"
            ? "bg-white text-stone-900 shadow-sm"
            : "text-white/75 hover:text-white",
        )}
      >
        {t.langEn}
      </button>
      <button
        type="button"
        onClick={() => setLocale("bn")}
        className={cn(
          "rounded-md px-2.5 py-1 font-medium transition-colors",
          locale === "bn"
            ? "bg-white text-stone-900 shadow-sm"
            : "text-white/75 hover:text-white",
        )}
      >
        {t.langBn}
      </button>
    </div>
  );
}

export function LanguageToggleLight({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-stone-200 bg-white p-0.5 text-xs",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-md px-2.5 py-1 font-medium transition-colors",
          locale === "en"
            ? "bg-[#0c2a26] text-teal-50"
            : "text-stone-500 hover:text-stone-800",
        )}
      >
        {t.langEn}
      </button>
      <button
        type="button"
        onClick={() => setLocale("bn")}
        className={cn(
          "rounded-md px-2.5 py-1 font-medium transition-colors",
          locale === "bn"
            ? "bg-[#0c2a26] text-teal-50"
            : "text-stone-500 hover:text-stone-800",
        )}
      >
        {t.langBn}
      </button>
    </div>
  );
}
