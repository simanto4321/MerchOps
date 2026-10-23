import Link from "next/link";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  tone = "default",
  href,
  shine = false,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warn" | "good" | "bad";
  href?: string;
  shine?: boolean;
}) {
  const className = cn(
    "panel block p-4 transition",
    shine && "metric-shine",
    href && "hover:border-teal-700/30 hover:shadow-[0_20px_50px_-28px_rgba(12,42,38,0.45)]",
    tone === "warn" && "border-amber-200/90 bg-amber-50/60",
    tone === "good" && "border-emerald-200/90 bg-emerald-50/50",
    tone === "bad" && "border-rose-200/90 bg-rose-50/50",
  );

  const inner = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
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
