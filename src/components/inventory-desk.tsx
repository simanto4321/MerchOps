"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { formatBdt } from "@/lib/utils";

type Product = {
  id: string;
  sku: string;
  name: string;
  retailPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  costPrice: number | null;
  factoryCost: number | null;
  margin: number | null;
};

export function InventoryDesk({
  initialProducts,
  isAdmin,
}: {
  initialProducts: Product[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<Product>>>({});

  function draft(id: string) {
    return drafts[id] ?? {};
  }

  async function save(product: Product) {
    setBusy(product.id);
    setError(null);
    const changes = draft(product.id);
    const res = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, ...changes }),
    });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) {
      setError(data.error ?? "Update failed");
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? data.product : p)),
    );
    setDrafts((d) => {
      const next = { ...d };
      delete next[product.id];
      return next;
    });
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Inventory control
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Real-time stock, threshold alerts
          {isAdmin
            ? ", factory costs, and retail margins (admin)."
            : ". Factory costs are hidden for staff/guest."}
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Retail</th>
              {isAdmin ? <th className="px-3 py-2">Factory cost</th> : null}
              {isAdmin ? <th className="px-3 py-2">Margin</th> : null}
              <th className="px-3 py-2">Alert</th>
              <th className="px-3 py-2">Save</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const d = draft(p.id);
              const stock = d.stockQuantity ?? p.stockQuantity;
              const low = stock <= p.lowStockThreshold;
              return (
                <tr key={p.id} className="border-b border-stone-100">
                  <td className="px-3 py-3 font-medium">{p.sku}</td>
                  <td className="px-3 py-3">{p.name}</td>
                  <td className="px-3 py-3">
                    <Input
                      className="h-8 w-24"
                      type="number"
                      value={stock}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [p.id]: {
                            ...d,
                            stockQuantity: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </td>
                  <td className="px-3 py-3">
                    {isAdmin ? (
                      <Input
                        className="h-8 w-28"
                        type="number"
                        value={d.retailPrice ?? p.retailPrice}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [p.id]: {
                              ...d,
                              retailPrice: Number(e.target.value),
                            },
                          }))
                        }
                      />
                    ) : (
                      formatBdt(p.retailPrice)
                    )}
                  </td>
                  {isAdmin ? (
                    <td className="px-3 py-3">
                      <Input
                        className="h-8 w-28"
                        type="number"
                        value={d.factoryCost ?? p.factoryCost ?? 0}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [p.id]: {
                              ...d,
                              factoryCost: Number(e.target.value),
                            },
                          }))
                        }
                      />
                    </td>
                  ) : null}
                  {isAdmin ? (
                    <td className="px-3 py-3">
                      {p.margin != null ? formatBdt(p.margin) : "—"}
                    </td>
                  ) : null}
                  <td className="px-3 py-3">
                    {low ? (
                      <Badge className="bg-amber-100 text-amber-900">
                        Low ≤ {p.lowStockThreshold}
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-900">OK</Badge>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <Button
                      size="sm"
                      disabled={busy === p.id || Object.keys(d).length === 0}
                      onClick={() => save(p)}
                    >
                      Save
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
