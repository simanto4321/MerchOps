"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Link2, ShieldCheck, Workflow } from "lucide-react";
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

  return (
    <div className="landing-root min-h-screen text-stone-100">
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-teal-50">
          {t.brand}
        </p>
        <nav className="hidden items-center gap-6 text-sm text-teal-100/80 md:flex">
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
            className="hidden rounded-md bg-teal-50 px-3 py-1.5 text-sm font-medium text-[#0c2a26] transition hover:bg-white sm:inline-flex"
          >
            {L.ctaApp}
          </Link>
        </div>
      </header>

      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2400&q=80')] bg-cover bg-center"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#041916]/95 via-[#0c2a26]/88 to-[#0c2a26]/55"
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px]"
          aria-hidden
        />

        <div
          className={cn(
            "mx-auto flex max-w-6xl flex-col justify-end px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28 transition-all duration-700",
            ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-teal-50 sm:text-7xl md:text-8xl">
            {L.heroBrand}
          </p>
          <h1 className="mt-6 max-w-2xl text-xl font-medium leading-snug text-teal-50/95 sm:text-2xl md:text-3xl">
            {L.heroHeadline}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-teal-100/75 sm:text-base">
            {L.heroSub}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md bg-[#f0b429] px-5 py-2.5 text-sm font-semibold text-[#1a1408] transition hover:bg-[#f5c451]"
            >
              {L.heroPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/couriers"
              className="inline-flex items-center gap-2 rounded-md border border-teal-100/30 bg-white/5 px-5 py-2.5 text-sm font-medium text-teal-50 backdrop-blur transition hover:bg-white/10"
            >
              {L.heroSecondary}
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-teal-100/70 sm:text-sm">
            <li>{L.trust1}</li>
            <li>{L.trust2}</li>
            <li>{L.trust3}</li>
          </ul>
        </div>
      </section>

      <section id="product" className="border-t border-teal-900/40 bg-[#071f1c] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div
            className={cn(
              "max-w-2xl transition-all delay-100 duration-700",
              ready ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-teal-50 sm:text-4xl">
              {L.sectionOpsTitle}
            </h2>
            <p className="mt-3 text-teal-100/70">{L.sectionOpsBody}</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: Workflow, title: L.feat1Title, body: L.feat1Body },
              { icon: Link2, title: L.feat2Title, body: L.feat2Body },
              { icon: ShieldCheck, title: L.feat3Title, body: L.feat3Body },
            ].map((f, i) => (
              <article
                key={f.title}
                className={cn(
                  "border-t border-teal-700/40 pt-5 transition-all duration-700",
                  ready ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
                style={{ transitionDelay: `${150 + i * 80}ms` }}
              >
                <f.icon className="h-5 w-5 text-[#f0b429]" />
                <h3 className="mt-3 text-lg font-semibold text-teal-50">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-teal-100/65">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="couriers" className="bg-[#0a2824] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-teal-50 sm:text-4xl">
            {L.courierTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-teal-100/70">{L.courierBody}</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COURIER_PRESETS.map((c) => (
              <div
                key={c.provider}
                className="flex items-center gap-3 rounded-xl border border-teal-800/60 bg-[#071f1c]/80 px-4 py-3"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: c.color }}
                />
                <div>
                  <p className="text-sm font-medium text-teal-50">
                    {locale === "bn" ? c.displayNameBn : c.displayName}
                  </p>
                  <p className="text-xs text-teal-100/50">{c.provider}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/couriers"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#f0b429] hover:underline"
          >
            {L.heroSecondary}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section id="security" className="border-t border-teal-900/40 bg-[#071f1c] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-teal-50 sm:text-4xl">
            {L.securityTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-teal-100/70">{L.securityBody}</p>
        </div>
      </section>

      <footer className="border-t border-teal-900/50 bg-[#041916] py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl text-teal-50">
              {t.brand}
            </p>
            <p className="mt-2 text-sm text-teal-100/65">{L.footerCta}</p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-md bg-teal-50 px-5 py-2.5 text-sm font-semibold text-[#0c2a26] hover:bg-white"
          >
            {L.footerBtn}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
