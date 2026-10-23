"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LanguageToggleLight } from "./language-toggle";
import { useI18n } from "@/lib/i18n/provider";

type DemoAccount = {
  username: string;
  pin: string;
  role: string;
  name: string;
};

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const { locale, t } = useI18n();
  const [demos, setDemos] = useState<DemoAccount[]>([]);
  // Stable defaults — avoid empty → filled jump when API returns
  const [username, setUsername] = useState("admin");
  const [pin, setPin] = useState("1234");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/users?demo=1")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setDemos((data.users ?? []) as DemoAccount[]);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pin }),
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
    <div className="grid min-h-screen bg-[#e8f0ec] lg:grid-cols-2">
      {/* Form column — solid, no photo under text */}
      <div className="flex min-h-screen flex-col">
        <header className="flex shrink-0 items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
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
          <p className="mt-2 text-sm leading-relaxed text-[#0c1210]/75">
            {locale === "bn"
              ? "ইউজারনেম ও PIN দিয়ে সাইন ইন করুন। ইমেইল শুধু গ্রাহক/ডেলিভারি যোগাযোগের জন্য।"
              : "Sign in with username and PIN. Email is kept for customer and delivery contact."}
          </p>

          <form
            onSubmit={submit}
            className="mt-7 space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_16px_40px_-24px_rgba(12,42,38,0.35)] sm:p-6"
          >
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-semibold text-[#0c1210]">
                {locale === "bn" ? "ইউজারনেম" : "Username"}
              </span>
              <Input
                className="h-11 border-stone-300 bg-white text-[#0c1210] placeholder:text-stone-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="admin"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-xs font-semibold text-[#0c1210]">
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
            {error ? (
              <p className="text-sm font-medium text-rose-700">{error}</p>
            ) : null}
            <Button
              className="gold-btn h-11 w-full border-0 hover:bg-[#f5c451]"
              disabled={busy}
              type="submit"
            >
              {busy ? "…" : locale === "bn" ? "প্রবেশ করুন" : "Enter desk"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {demos.length > 0 ? (
            <div className="mt-7 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0c1210]/50">
                {locale === "bn" ? "দ্রুত অ্যাকাউন্ট" : "Quick accounts"}
              </p>
              {demos.map((d) => (
                <button
                  key={d.username}
                  type="button"
                  onClick={() => {
                    setUsername(d.username);
                    setPin(d.pin);
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-left text-sm text-[#0c1210] hover:border-[#f0b429]/70"
                >
                  <span>
                    <span className="font-semibold">{d.role}</span>
                    <span className="ml-2 text-[#0c1210]/55">@{d.username}</span>
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#9a6b00]">
                    {d.pin}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </main>
      </div>

      {/* Image column — separate from text (desktop only) */}
      <div
        className="hidden min-h-screen bg-cover bg-center lg:block"
        style={{ backgroundImage: "url(/images/warehouse-hero.jpg)" }}
        aria-hidden
      />
    </div>
  );
}
