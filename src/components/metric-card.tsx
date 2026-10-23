import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warn" | "good" | "bad";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200/80 bg-white p-4 shadow-sm",
        tone === "warn" && "border-amber-300/80 bg-amber-50/50",
        tone === "good" && "border-emerald-300/80 bg-emerald-50/40",
        tone === "bad" && "border-rose-300/80 bg-rose-50/40",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-stone-900">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-stone-500">{hint}</p> : null}
    </div>
  );
}
