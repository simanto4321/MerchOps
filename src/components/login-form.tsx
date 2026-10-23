"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Database } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LanguageToggle } from "./language-toggle";
import { useI18n } from "@/lib/i18n/provider";

const demos = [
  { email: "admin@merchops.local", pin: "1234", role: "ADMIN" },
  { email: "staff@merchops.local", pin: "5678", role: "STAFF" },
  { email: "guest@merchops.local", pin: "0000", role: "GUEST" },
];

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [email, setEmail] = useState(demos[0].email);
  const [pin, setPin] = useState(demos[0].pin);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pin }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }
    router.replace(nextPath.startsWith("/") ? nextPath : "/dashboard");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/warehouse-hero.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#041916]/95 via-[#0c2a26]/88 to-[#0c2a26]/55" />
        <div
          className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px]"
          aria-hidden
        />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-teal-50">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-3xl tracking-tight"
          >
            {t.brand}
          </Link>
          <div>
            <p className="font-[family-name:var(--font-display)] text-5xl leading-tight">
              {locale === "bn" ? "অপস ডেস্ক" : "Ops desk"}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-teal-100/70">
              {locale === "bn"
                ? "অর্ডার, স্টক, কুরিয়ার ও অডিট—এক জায়গায়। Prisma দিয়ে ডেটা সেভ হয়।"
                : "Orders, stock, couriers, and audit—one place. Data persists with Prisma."}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-md border border-teal-700/50 bg-[#071f1c]/70 px-3 py-1.5 text-xs text-teal-100/80">
              <Database className="h-3.5 w-3.5 text-[#f0b429]" />
              Prisma · SQLite (Postgres-ready)
            </p>
          </div>
          <p className="text-xs text-teal-200/45">{t.brandTag}</p>
        </div>
      </aside>

      <div className="flex flex-col bg-[#041916] text-teal-50 lg:bg-[#071f1c]">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-2xl lg:hidden"
          >
            {t.brand}
          </Link>
          <div className="ml-auto">
            <LanguageToggle />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-16 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f0b429]/90">
            MerchOps
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
            {locale === "bn" ? "ডেস্কে প্রবেশ" : "Sign in to the desk"}
          </h1>
          <p className="mt-2 text-sm text-teal-100/65">
            {locale === "bn"
              ? "ডেমো ইমেইল ও PIN—লাইভের আগে হ্যাশড পাসওয়ার্ডে বদলাবেন।"
              : "Demo email + PIN. Swap to hashed passwords before public launch."}
          </p>

          <form
            onSubmit={submit}
            className="mt-8 space-y-3 rounded-xl border border-teal-800/60 bg-[#0a2824]/90 p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.6)]"
          >
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs text-teal-200/70">Email</span>
              <Input
                className="h-11 border-teal-800/80 bg-[#041916] text-teal-50 placeholder:text-teal-200/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs text-teal-200/70">PIN</span>
              <Input
                className="h-11 border-teal-800/80 bg-[#041916] text-teal-50"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <Button
              className="gold-btn h-11 w-full border-0 text-[#1a1408] hover:bg-[#f5c451]"
              disabled={busy}
              type="submit"
            >
              {busy ? "…" : locale === "bn" ? "প্রবেশ করুন" : "Enter desk"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-7 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-200/45">
              {locale === "bn" ? "দ্রুত ডেমো" : "Quick demo"}
            </p>
            {demos.map((d) => (
              <button
                key={d.email}
                type="button"
                onClick={() => {
                  setEmail(d.email);
                  setPin(d.pin);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-teal-800/40 bg-[#041916]/80 px-3.5 py-2.5 text-left text-sm transition hover:border-[#f0b429]/40"
              >
                <span>
                  <span className="font-semibold text-white">{d.role}</span>
                  <span className="ml-2 text-teal-100/45">{d.email}</span>
                </span>
                <span className="font-mono text-xs text-[#f0b429]">{d.pin}</span>
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
