import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  tone = "default",
  shine = false,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warn" | "good" | "bad";
  shine?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-stone-200/90 bg-white p-4 shadow-[0_10px_30px_-18px_rgba(12,42,38,0.45)]",
        shine && "metric-shine",
        tone === "warn" && "border-amber-300/70 bg-amber-50/70",
        tone === "good" && "border-emerald-300/70 bg-emerald-50/50",
        tone === "bad" && "border-rose-300/70 bg-rose-50/50",
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
        {label}
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl tracking-tight text-stone-900">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-stone-500">{hint}</p> : null}
    </div>
  );
}
