"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    role: string;
  } | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale } = useI18n();
  const { push: toast } = useToast();

  async function logout() {
    await fetch("/api/session", { method: "DELETE" });
    toast(locale === "bn" ? "সাইন আউট" : "Signed out", "info");
    router.replace("/login");
    router.refresh();
  }

  const nav = [
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/orders", label: t.nav.orders, icon: ClipboardList },
    { href: "/inbox", label: t.nav.inbox, icon: Inbox },
    { href: "/inventory", label: t.nav.inventory, icon: Boxes },
    { href: "/couriers", label: t.nav.deliveries, icon: Truck },
    { href: "/analytics", label: t.nav.analytics, icon: LineChart },
    { href: "/audit", label: t.nav.audit, icon: Shield },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <div className="desk-surface min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="app-shell-aside border-b border-teal-950 text-stone-100 lg:border-b-0 lg:border-r lg:border-teal-950/80">
        <div className="px-5 py-7">
          <Link href="/" className="block">
            <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-teal-50">
              {t.brand}
            </p>
            <p className="mt-1 text-xs text-teal-200/70">{t.brandTag}</p>
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
          {nav.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-all duration-200",
                  active
                    ? "bg-teal-50/15 text-white shadow-[inset_3px_0_0_0_#f0b429]"
                    : "text-teal-100/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-teal-200/50 hover:text-teal-100"
          >
            <Home className="h-3.5 w-3.5" />
            {t.nav.home}
          </Link>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 bg-white px-4 py-3 sm:px-6">
          <div>
            <p className="text-sm font-semibold tracking-tight text-stone-900">
              {t.shell.title}
            </p>
            <p className="text-xs text-stone-500">{t.shell.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageToggleLight />
            <RoleSwitcher user={user} />
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 text-xs font-medium text-stone-700 hover:bg-stone-50"
              title={locale === "bn" ? "সাইন আউট" : "Sign out"}
            >
              <LogOutIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {locale === "bn" ? "আউট" : "Out"}
              </span>
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
