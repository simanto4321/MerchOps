"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "CV" },
  { href: "/projects", label: "Selected projects" },
  { href: "/sample-eval", label: "Sample eval pack" },
  { href: "/print", label: "Print / PDF" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(243,239,230,0.86)] backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-lg tracking-tight text-[var(--ink)]">
          Mehedi Ashraf Simanto
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-2.5 py-1.5 text-sm transition ${
                  active
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--ink-soft)] hover:bg-[var(--paper-deep)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
