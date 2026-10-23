"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const { locale } = useI18n();
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
    <div className="flex min-h-screen flex-col bg-[#031512] text-teal-50">
      <header className="mx-auto flex w-full max-w-md items-center justify-between px-5 py-6">
        <Link href="/" className="font-[family-name:var(--font-display)] text-2xl">
          MerchOps
        </Link>
        <LanguageToggle />
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-16">
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          {locale === "bn" ? "ডেস্কে প্রবেশ" : "Sign in to the desk"}
        </h1>
        <p className="mt-2 text-sm text-teal-100/65">
          {locale === "bn"
            ? "ডেমো ইমেইল ও PIN ব্যবহার করুন। লাইভ লঞ্চের আগে হ্যাশড পাসওয়ার্ডে বদলাবেন।"
            : "Use a demo email + PIN. Replace with hashed passwords before public launch."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-3 rounded-2xl border border-teal-800/60 bg-[#0a2824] p-5">
          <label className="block text-sm">
            <span className="mb-1 block text-xs text-teal-200/70">Email</span>
            <Input
              className="border-teal-800 bg-[#06201c] text-teal-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs text-teal-200/70">PIN</span>
            <Input
              className="border-teal-800 bg-[#06201c] text-teal-50"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button className="w-full rounded-full" disabled={busy} type="submit">
            {busy
              ? "…"
              : locale === "bn"
                ? "প্রবেশ করুন"
                : "Enter desk"}
          </Button>
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-200/50">
            {locale === "bn" ? "দ্রুত ডেমো" : "Quick demo accounts"}
          </p>
          {demos.map((d) => (
            <button
              key={d.email}
              type="button"
              onClick={() => {
                setEmail(d.email);
                setPin(d.pin);
              }}
              className="flex w-full items-center justify-between rounded-xl border border-teal-800/50 bg-[#06201c] px-3 py-2 text-left text-sm hover:border-teal-600"
            >
              <span>
                <span className="font-medium">{d.role}</span>
                <span className="ml-2 text-teal-100/50">{d.email}</span>
              </span>
              <span className="font-mono text-xs text-[#f0b429]">{d.pin}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
