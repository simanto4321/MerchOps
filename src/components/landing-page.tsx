"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { LanguageToggle } from "./language-toggle";
import { COURIER_PRESETS } from "@/lib/couriers";
import { cn } from "@/lib/utils";

export function LandingPage() {
  const { t, locale } = useI18n();
  const L = t.landing;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const features = [
    { title: L.feat1Title, body: L.feat1Body, n: "01" },
    { title: L.feat2Title, body: L.feat2Body, n: "02" },
    { title: L.feat3Title, body: L.feat3Body, n: "03" },
  ];

  return (
    <div className="landing-root min-h-screen text-stone-100">
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-teal-50">
          {t.brand}
        </p>
        <nav className="hidden items-center gap-7 text-sm text-teal-100/75 md:flex">
          <a href="#product" className="hover:text-white">
            {L.navProduct}
          </a>
          <a href="#couriers" className="hover:text-white">
            {L.navCouriers}
          </a>
          <a href="#security" className="hover:text-white">
            {L.navSecurity}
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Link
            href="/dashboard"
            className="hidden rounded-full bg-teal-50 px-4 py-1.5 text-sm font-semibold text-[#0c2a26] transition hover:bg-white sm:inline-flex"
          >
            {L.ctaApp}
          </Link>
        </div>
      </header>

      <section className="relative isolate min-h-[86vh] overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=2400&q=80')] bg-cover bg-center"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-br from-[#031512f2] via-[#0c2a26cc] to-[#0c2a2680]"
          aria-hidden
        />

        <div
          className={cn(
            "mx-auto flex max-w-6xl flex-col justify-end px-5 pb-16 pt-24 sm:px-8 sm:pb-24 transition-all duration-700",
            ready ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          )}
        >
          <p className="font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight text-white sm:text-7xl md:text-8xl">
            {L.heroBrand}
          </p>
          <h1 className="mt-6 max-w-xl text-xl font-medium leading-snug text-teal-50 sm:text-2xl md:text-[1.75rem]">
            {L.heroHeadline}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-teal-100/70 sm:text-base">
            {L.heroSub}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-[#f0b429] px-6 py-3 text-sm font-bold text-[#1a1408] transition hover:bg-[#f5c451]"
            >
              {L.heroPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/couriers"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              {L.heroSecondary}
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-xs text-teal-100/65 sm:text-sm">
            <li className="rounded-full border border-white/15 px-3 py-1">{L.trust1}</li>
            <li className="rounded-full border border-white/15 px-3 py-1">{L.trust2}</li>
            <li className="rounded-full border border-white/15 px-3 py-1">{L.trust3}</li>
          </ul>
        </div>
      </section>

      <section id="product" className="bg-[#06201c] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white sm:text-5xl">
              {L.sectionOpsTitle}
            </h2>
            <p className="mt-4 text-base text-teal-100/65">{L.sectionOpsBody}</p>
            <p className="mt-2 text-sm text-[#f0b429]/90">{L.stepHint}</p>
          </div>

          <div className="mt-14 grid gap-0 border-t border-teal-800/50 md:grid-cols-3">
            {features.map((f, i) => (
              <article
                key={f.n}
                className={cn(
                  "border-teal-800/50 py-8 md:border-l md:px-8 md:py-10",
                  i === 0 && "md:border-l-0 md:pl-0",
                  "border-b md:border-b-0",
                )}
              >
                <p className="font-[family-name:var(--font-display)] text-4xl text-[#f0b429]/90">
                  {f.n}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-white">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-teal-100/65">
                  {f.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="couriers" className="bg-[#0a2824] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-white sm:text-4xl">
                {L.courierTitle}
              </h2>
              <p className="mt-3 text-teal-100/65">{L.courierBody}</p>
            </div>
            <Link
              href="/couriers"
              className="inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0c2a26] hover:bg-teal-50"
            >
              {L.heroSecondary}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {COURIER_PRESETS.map((c) => (
              <span
                key={c.provider}
                className="inline-flex items-center gap-2 rounded-full border border-teal-700/50 bg-[#06201c] px-4 py-2 text-sm text-teal-50"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: c.color }}
                />
                {locale === "bn" ? c.displayNameBn : c.displayName}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="border-t border-teal-900/40 bg-[#06201c] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-3xl text-white sm:text-4xl">
            {L.securityTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-teal-100/65">{L.securityBody}</p>
        </div>
      </section>

      <footer className="border-t border-teal-900/50 bg-[#031512] py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-[family-name:var(--font-display)] text-3xl text-white">
              {t.brand}
            </p>
            <p className="mt-2 text-sm text-teal-100/60">{L.footerCta}</p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-[#f0b429] px-6 py-3 text-sm font-bold text-[#1a1408] hover:bg-[#f5c451]"
          >
            {L.footerBtn}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
