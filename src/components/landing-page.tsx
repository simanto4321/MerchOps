"use client";

import Link from "next/link";
import { ArrowRight, Link2, ShieldCheck, Workflow } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { LanguageToggle } from "./language-toggle";
import { COURIER_PRESETS } from "@/lib/couriers";

/**
 * Landing: text never overlays a loading photo.
 * Mobile = image strip then solid copy. Desktop = split columns.
 */
export function LandingPage() {
  const { t, locale } = useI18n();
  const L = t.landing;

  return (
    <div className="min-h-screen bg-[#041916] text-stone-100">
      {/* Mobile image strip — separate from text */}
      <div
        className="h-44 w-full bg-cover bg-center sm:h-56 lg:hidden"
        style={{ backgroundImage: "url(/images/warehouse-hero.jpg)" }}
        aria-hidden
      />

      <div className="lg:grid lg:min-h-screen lg:grid-cols-2">
        {/* Solid copy column */}
        <div className="flex min-h-0 flex-col bg-[#041916]">
          <header className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
            <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-teal-50">
              {t.brand}
            </p>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <Link
                href="/login"
                className="hidden gold-btn sm:inline-flex !rounded-md !px-3 !py-1.5"
              >
                {L.ctaApp}
              </Link>
            </div>
          </header>

          <div className="flex flex-1 flex-col justify-center px-5 pb-14 pt-6 sm:px-8 sm:pb-20">
            <nav className="mb-8 hidden gap-6 text-sm text-teal-100/80 md:flex">
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

            <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-teal-50 sm:text-6xl md:text-7xl">
              {L.heroBrand}
            </p>
            <h1 className="mt-6 max-w-xl text-xl font-medium leading-snug text-teal-50 sm:text-2xl">
              {L.heroHeadline}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-teal-100/75 sm:text-base">
              {L.heroSub}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="gold-btn">
                {L.heroPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login?next=/couriers"
                className="inline-flex items-center gap-2 rounded-md border border-teal-100/30 bg-white/5 px-5 py-2.5 text-sm font-medium text-teal-50"
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
        </div>

        {/* Desktop image column — never under type */}
        <div
          className="hidden bg-cover bg-center lg:block"
          style={{ backgroundImage: "url(/images/warehouse-hero.jpg)" }}
          aria-hidden
        />
      </div>

      <section id="product" className="border-t border-teal-900/40 bg-[#071f1c] py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
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
            ].map((f) => (
              <article key={f.title} className="border-t border-teal-700/40 pt-5">
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
                className="flex items-center gap-3 rounded-xl border border-teal-800/60 bg-[#071f1c] px-4 py-3"
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
            href="/login?next=/couriers"
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
            href="/login"
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
