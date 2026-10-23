"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Database } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LanguageToggleLight } from "./language-toggle";
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
    <div className="relative isolate min-h-screen overflow-hidden">
      {/* Full-bleed warehouse behind everything (mobile + desktop) */}
      <Image
        src="/images/warehouse-hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/88 via-white/72 to-[#e8f0ec]/55"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[#0c1210] sm:text-3xl"
          >
            {t.brand}
          </Link>
          <LanguageToggleLight />
        </header>

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-16 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0c1210]">
            MerchOps
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[#0c1210] sm:text-4xl">
            {locale === "bn" ? "ডেস্কে প্রবেশ" : "Sign in to the desk"}
          </h1>
          <p className="mt-2 text-sm text-[#0c1210]/70">
            {locale === "bn"
              ? "ডেমো ইমেইল ও PIN—লাইভের আগে হ্যাশড পাসওয়ার্ডে বদলাবেন।"
              : "Demo email + PIN. Swap to hashed passwords before public launch."}
          </p>

          <form
            onSubmit={submit}
            className="mt-8 space-y-3 rounded-2xl border border-stone-200/90 bg-white/90 p-5 shadow-[0_24px_60px_-28px_rgba(12,42,38,0.35)] backdrop-blur-md"
          >
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-[#0c1210]/65">
                Email
              </span>
              <Input
                className="h-11 border-stone-300 bg-white text-[#0c1210] placeholder:text-stone-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-medium text-[#0c1210]/65">
                PIN
              </span>
              <Input
                className="h-11 border-stone-300 bg-white text-[#0c1210]"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="text-sm text-rose-700">{error}</p> : null}
            <Button
              className="gold-btn h-11 w-full border-0 hover:bg-[#f5c451]"
              disabled={busy}
              type="submit"
            >
              {busy ? "…" : locale === "bn" ? "প্রবেশ করুন" : "Enter desk"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-7 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0c1210]/45">
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
                className="flex w-full items-center justify-between rounded-xl border border-stone-200/90 bg-white/80 px-3.5 py-2.5 text-left text-sm text-[#0c1210] backdrop-blur transition hover:border-[#f0b429]/60 hover:bg-white"
              >
                <span>
                  <span className="font-semibold">{d.role}</span>
                  <span className="ml-2 text-[#0c1210]/45">{d.email}</span>
                </span>
                <span className="font-mono text-xs font-semibold text-[#9a6b00]">
                  {d.pin}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-8 inline-flex items-center gap-2 self-start rounded-md border border-stone-200/80 bg-white/75 px-3 py-1.5 text-xs text-[#0c1210]/70 backdrop-blur">
            <Database className="h-3.5 w-3.5 text-[#9a6b00]" />
            Prisma · SQLite (Postgres-ready)
          </p>
        </main>
      </div>
    </div>
  );
}
