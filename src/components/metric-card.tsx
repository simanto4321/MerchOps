import Link from "next/link";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  tone = "default",
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warn" | "good" | "bad";
  href?: string;
}) {
  const className = cn(
    "block rounded-2xl border border-stone-200 bg-white p-4 transition",
    href && "hover:border-teal-700/35 hover:shadow-sm",
    tone === "warn" && "border-amber-200 bg-amber-50/50",
    tone === "good" && "border-emerald-200 bg-emerald-50/40",
    tone === "bad" && "border-rose-200 bg-rose-50/40",
  );

  const inner = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
        {label}
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl tracking-tight text-stone-900">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-stone-500">{hint}</p> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}
