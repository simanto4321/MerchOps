"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  Boxes,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  LineChart,
  Shield,
  Settings,
  Truck,
  Home,
  Search,
  PackagePlus,
  AlertTriangle,
  LogOut as LogOutIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleSwitcher } from "./role-switcher";
import { LanguageToggleLight } from "./language-toggle";
import { useI18n } from "@/lib/i18n/provider";
import { useToast } from "./toast";

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { id: string; name: string; email: string; role: string } | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const { push: toast } = useToast();
  const [q, setQ] = useState("");

  async function logout() {
    await fetch("/api/session", { method: "DELETE" });
    toast(t.shell.signedIn === "You" ? "Signed out" : "সাইন আউট", "info");
    router.replace("/login");
    router.refresh();
  }

  const isAdmin = user?.role === "ADMIN";

  const daily = [
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/orders", label: t.nav.orders, icon: ClipboardList },
    { href: "/inbox", label: t.nav.inbox, icon: Inbox },
    { href: "/inventory", label: t.nav.inventory, icon: Boxes },
  ];

  const admin = isAdmin
    ? [
        { href: "/couriers", label: t.nav.deliveries, icon: Truck },
        { href: "/analytics", label: t.nav.analytics, icon: LineChart },
        { href: "/audit", label: t.nav.audit, icon: Shield },
        { href: "/settings", label: t.nav.settings, icon: Settings },
      ]
    : [];

  function isActive(href: string) {
    return href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/orders?q=${encodeURIComponent(term)}` : "/orders");
  }

  const NavLink = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive(href)
          ? "bg-white text-[#0c2a26] shadow-sm"
          : "text-teal-100/70 hover:bg-white/10 hover:text-white",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );

  return (
    <div className="desk-surface min-h-screen pb-20 lg:grid lg:grid-cols-[248px_1fr] lg:pb-0">
      <aside className="app-shell-aside hidden text-stone-100 lg:flex lg:min-h-screen lg:flex-col">
        <div className="px-5 py-7">
          <Link href="/" className="block">
            <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-white">
              {t.brand}
            </p>
            <p className="mt-1 text-xs text-teal-200/55">{t.brandTag}</p>
          </Link>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto px-3 pb-6">
          <div>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f0b429]/70">
              {t.nav.groupDaily}
            </p>
            <nav className="space-y-1">
              {daily.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>
          </div>
          {admin.length > 0 ? (
            <div>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-200/40">
                {t.nav.groupAdmin}
              </p>
              <nav className="space-y-1">
                {admin.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </nav>
            </div>
          ) : null}
        </div>

        <div className="border-t border-white/10 px-3 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-teal-200/45 hover:text-teal-100"
          >
            <Home className="h-3.5 w-3.5" />
            {t.nav.home}
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#f4f8f6]/90 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6">
            <div className="min-w-0 flex-1">
              <p className="font-[family-name:var(--font-display)] text-lg text-stone-900">
                {t.shell.title}
              </p>
              <p className="text-xs text-stone-500">{t.shell.subtitle}</p>
            </div>
            <form
              onSubmit={onSearch}
              className="order-last flex w-full items-center gap-2 sm:order-none sm:max-w-xs sm:flex-1"
            >
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t.shell.searchPlaceholder}
                  className="h-10 w-full rounded-xl border border-stone-200 bg-white pl-9 pr-3 text-sm outline-none ring-[#0c2a26]/15 focus:ring-2"
                />
              </div>
            </form>
            <LanguageToggleLight />
            <RoleSwitcher user={user} />
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 text-xs font-medium text-stone-700 hover:bg-stone-50"
              title="Sign out"
            >
              <LogOutIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Out</span>
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pb-3.5 sm:px-6">
            <Link
              href="/orders"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0c2a26] px-3.5 py-2 text-xs font-semibold text-white shadow-sm"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              {t.shell.quickOrders}
            </Link>
            <Link
              href="/inbox"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-800"
            >
              <Inbox className="h-3.5 w-3.5" />
              {t.shell.quickInbox}
            </Link>
            <Link
              href="/orders?new=1"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-800"
            >
              <PackagePlus className="h-3.5 w-3.5" />
              {t.shell.quickNew}
            </Link>
            <Link
              href="/orders?status=FAILED"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-950"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {t.shell.quickFailed}
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-stone-200 bg-white/95 px-1 py-1.5 backdrop-blur lg:hidden">
        {daily.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium",
                active ? "text-[#0c2a26]" : "text-stone-500",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.25]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
