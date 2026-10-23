"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  LineChart,
  Shield,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleSwitcher } from "./role-switcher";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/analytics", label: "Ad Spend", icon: LineChart },
  { href: "/audit", label: "Audit Logs", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { id: string; name: string; email: string; role: string } | null;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-stone-200 bg-[#0f2f2a] text-stone-100 lg:border-b-0 lg:border-r lg:border-teal-950">
        <div className="px-5 py-6">
          <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-teal-50">
            MerchOps
          </p>
          <p className="mt-1 text-xs text-teal-200/80">
            Inventory · Orders · Audit
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors",
                  active
                    ? "bg-teal-700/50 text-white"
                    : "text-teal-100/75 hover:bg-teal-900/60 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
          <div>
            <p className="text-sm font-medium text-stone-900">
              Centralized order & inventory desk
            </p>
            <p className="text-xs text-stone-500">
              Multi-channel retail ops · Bangladesh BDT
            </p>
          </div>
          <RoleSwitcher user={user} />
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
