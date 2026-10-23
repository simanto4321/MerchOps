"use client";

import Image from "next/image";
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
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users?demo=1")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.users ?? []) as DemoAccount[];
        setDemos(list);
        if (list[0]) {
          setUsername(list[0].username);
          setPin(list[0].pin);
        }
      })
      .catch(() => undefined);
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
    <div className="relative min-h-screen">
      {/* Sticky warehouse — does not scroll with the form */}
      <div className="pointer-events-none fixed inset-0 -z-10">
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
          className="absolute inset-0 bg-gradient-to-br from-[#f4f7f5]/95 via-[#eef3f0]/90 to-[#e4ecea]/80"
          aria-hidden
        />
      </div>

      {/* Scrollable login content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex shrink-0 items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[#0c1210] sm:text-3xl"
          >
            {t.brand}
          </Link>
          <LanguageToggleLight />
        </header>

        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10 sm:px-8">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_24px_60px_-24px_rgba(12,42,38,0.4)] sm:p-8">
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

            <form onSubmit={submit} className="mt-7 space-y-3">
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
              <div className="mt-7 space-y-2 border-t border-stone-100 pt-6">
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
                    className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-left text-sm text-[#0c1210] transition hover:border-[#f0b429]/70 hover:bg-white"
                  >
                    <span>
                      <span className="font-semibold">{d.role}</span>
                      <span className="ml-2 text-[#0c1210]/55">
                        @{d.username}
                      </span>
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#9a6b00]">
                      {d.pin}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
