"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function AdSpendForm({
  products,
}: {
  products: { id: string; sku: string; name: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    campaignName: "",
    productId: "",
    amount: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        productId: form.productId || null,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Failed");
      return;
    }
    setForm({ campaignName: "", productId: "", amount: "", notes: "" });
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
        Log ad boost spend
      </h2>
      <div className="mt-3 grid gap-2 md:grid-cols-4">
        <Input
          placeholder="Campaign name"
          value={form.campaignName}
          onChange={(e) => setForm({ ...form, campaignName: e.target.value })}
        />
        <select
          className="h-9 rounded-md border border-stone-300 px-2 text-sm"
          value={form.productId}
          onChange={(e) => setForm({ ...form, productId: e.target.value })}
        >
          <option value="">General / unassigned</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.sku} — {p.name}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="Amount (BDT)"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <Button
          disabled={busy || !form.campaignName || !form.amount}
          onClick={submit}
        >
          Add spend
        </Button>
      </div>
      <Input
        className="mt-2"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}
