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
        <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-white sm:text-3xl">
          {t.brand}
        </p>
        <nav className="hidden items-center gap-8 text-sm text-teal-100/75 md:flex">
          <a href="#product" className="transition hover:text-white">
            {L.navProduct}
          </a>
          <a href="#couriers" className="transition hover:text-white">
            {L.navCouriers}
          </a>
          <a href="#security" className="transition hover:text-white">
            {L.navSecurity}
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Link href="/login" className="hidden gold-btn sm:inline-flex">
            {L.ctaApp}
          </Link>
        </div>
      </header>

      {/* Full-bleed hero — brand first */}
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2400&q=80')] bg-cover bg-center"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#041916]/96 via-[#0c2a26]/88 to-[#0c2a26]/45"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px]"
          aria-hidden
        />

        <div
          className={cn(
            "mx-auto flex max-w-6xl flex-col justify-end px-5 pb-20 pt-28 sm:px-8 sm:pb-28 transition-all duration-700",
            ready ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
          )}
        >
          <p className="font-[family-name:var(--font-display)] text-6xl leading-[0.9] tracking-tight text-white sm:text-8xl md:text-9xl">
            {L.heroBrand}
          </p>
          <h1 className="mt-7 max-w-xl text-xl font-medium leading-snug text-teal-50/95 sm:text-2xl md:text-3xl">
            {L.heroHeadline}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-teal-100/70 sm:text-base">
            {L.heroSub}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/login" className="gold-btn px-7 py-3">
              {L.heroPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login?next=/couriers"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/12"
            >
              {L.heroSecondary}
            </Link>
          </div>
          <ul className="mt-12 flex flex-wrap gap-2 text-xs sm:text-sm">
            {[L.trust1, L.trust2, L.trust3].map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/15 bg-black/20 px-3.5 py-1.5 text-teal-100/80 backdrop-blur"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="product" className="border-t border-teal-900/50 bg-[#06201c] py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className={cn("max-w-2xl", ready && "rise-in")}>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-white sm:text-5xl">
              {L.sectionOpsTitle}
            </h2>
            <p className="mt-4 text-base text-teal-100/65">{L.sectionOpsBody}</p>
            <p className="mt-3 text-sm font-medium text-[#f0b429]">{L.stepHint}</p>
          </div>

          <div className="mt-16 grid border-t border-teal-800/40 md:grid-cols-3">
            {features.map((f, i) => (
              <article
                key={f.n}
                className={cn(
                  "border-b border-teal-800/40 py-10 md:border-b-0 md:border-l md:px-8",
                  i === 0 && "md:border-l-0 md:pl-0",
                )}
              >
                <p className="font-[family-name:var(--font-display)] text-5xl text-[#f0b429]">
                  {f.n}
                </p>
                <h3 className="mt-5 text-xl font-semibold text-white">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-teal-100/65">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="couriers" className="bg-[#0a2824] py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-white sm:text-4xl">
                {L.courierTitle}
              </h2>
              <p className="mt-3 text-teal-100/65">{L.courierBody}</p>
            </div>
            <Link href="/login?next=/couriers" className="gold-btn self-start">
              {L.heroSecondary}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-2.5">
            {COURIER_PRESETS.map((c) => (
              <span
                key={c.provider}
                className="inline-flex items-center gap-2.5 rounded-full border border-teal-700/40 bg-[#06201c] px-4 py-2.5 text-sm text-teal-50"
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

      <section id="security" className="border-t border-teal-900/40 bg-[#06201c] py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-3xl text-white sm:text-5xl">
            {L.securityTitle}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-teal-100/65">
            {L.securityBody}
          </p>
        </div>
      </section>

      <footer className="border-t border-teal-900/50 bg-[#031512] py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-[family-name:var(--font-display)] text-4xl text-white">
              {t.brand}
            </p>
            <p className="mt-3 text-sm text-teal-100/60">{L.footerCta}</p>
          </div>
          <Link href="/login" className="gold-btn px-7 py-3">
            {L.footerBtn}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
