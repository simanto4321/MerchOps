"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { formatBdt } from "@/lib/utils";
import { useToast } from "./toast";

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

type ColKey =
  | "sku"
  | "name"
  | "stock"
  | "retail"
  | "factory"
  | "margin"
  | "threshold"
  | "alert"
  | "actions";

const ALL_COLS: { key: ColKey; label: string; adminOnly?: boolean }[] = [
  { key: "sku", label: "SKU" },
  { key: "name", label: "Product" },
  { key: "stock", label: "Stock" },
  { key: "retail", label: "Retail" },
  { key: "factory", label: "Factory cost", adminOnly: true },
  { key: "margin", label: "Margin", adminOnly: true },
  { key: "threshold", label: "Low alert" },
  { key: "alert", label: "Status" },
  { key: "actions", label: "Actions" },
];

export function InventoryDesk({
  initialProducts,
  isAdmin,
}: {
  initialProducts: Product[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const { push: toast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<Product>>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newRow, setNewRow] = useState({
    sku: "",
    name: "",
    stockQuantity: "0",
    retailPrice: "0",
    factoryCost: "0",
    costPrice: "0",
    lowStockThreshold: "10",
  });
  const availableCols = ALL_COLS.filter((c) => !c.adminOnly || isAdmin);
  const [visibleCols, setVisibleCols] = useState<ColKey[]>(
    availableCols.map((c) => c.key),
  );

  const colSpan = visibleCols.length || 1;

  function draft(id: string) {
    return drafts[id] ?? {};
  }

  function toggleCol(key: ColKey) {
    setVisibleCols((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
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
      toast(data.error ?? "Update failed", "err");
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
    toast("Product saved", "ok");
    router.refresh();
  }

  async function remove(product: Product) {
    if (!isAdmin) return;
    if (!confirm(`Remove product ${product.sku}?`)) return;
    setBusy(product.id);
    setError(null);
    const res = await fetch(`/api/products?id=${product.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) {
      setError(data.error ?? "Delete failed");
      toast(data.error ?? "Delete failed", "err");
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    toast("Product removed", "ok");
    router.refresh();
  }

  async function addProduct() {
    if (!isAdmin) return;
    setBusy("new");
    setError(null);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sku: newRow.sku.trim(),
        name: newRow.name.trim(),
        stockQuantity: Number(newRow.stockQuantity),
        retailPrice: Number(newRow.retailPrice),
        factoryCost: Number(newRow.factoryCost),
        costPrice: Number(newRow.costPrice || newRow.factoryCost),
        lowStockThreshold: Number(newRow.lowStockThreshold),
      }),
    });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) {
      setError(data.error ?? "Create failed");
      toast(data.error ?? "Create failed", "err");
      return;
    }
    setProducts((prev) => [...prev, data.product]);
    setShowAdd(false);
    setNewRow({
      sku: "",
      name: "",
      stockQuantity: "0",
      retailPrice: "0",
      factoryCost: "0",
      costPrice: "0",
      lowStockThreshold: "10",
    });
    toast("Product added", "ok");
    router.refresh();
  }

  const orderedCols = useMemo(
    () => availableCols.filter((c) => visibleCols.includes(c.key)),
    [availableCols, visibleCols],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">
            Inventory control
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Add or remove product rows, edit stock and prices, show/hide columns.
            {isAdmin
              ? " Factory costs and SKU edits are admin-only."
              : " Factory costs are hidden for staff/guest."}
          </p>
        </div>
        {isAdmin ? (
          <Button className="rounded-full" onClick={() => setShowAdd((v) => !v)}>
            {showAdd ? "Close" : "+ Add product row"}
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-stone-200 bg-white p-3 text-xs shadow-sm">
        <span className="font-semibold uppercase tracking-wide text-stone-500">
          Columns
        </span>
        {availableCols.map((c) => (
          <label
            key={c.key}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-stone-200 px-2.5 py-1"
          >
            <input
              type="checkbox"
              checked={visibleCols.includes(c.key)}
              onChange={() => toggleCol(c.key)}
            />
            {c.label}
          </label>
        ))}
      </div>

      {showAdd && isAdmin ? (
        <div className="grid gap-2 rounded-xl border border-teal-200 bg-teal-50/40 p-4 shadow-sm sm:grid-cols-3 lg:grid-cols-7">
          <Input
            placeholder="SKU"
            value={newRow.sku}
            onChange={(e) => setNewRow({ ...newRow, sku: e.target.value })}
          />
          <Input
            className="sm:col-span-2"
            placeholder="Product name"
            value={newRow.name}
            onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Stock"
            value={newRow.stockQuantity}
            onChange={(e) =>
              setNewRow({ ...newRow, stockQuantity: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Retail"
            value={newRow.retailPrice}
            onChange={(e) =>
              setNewRow({ ...newRow, retailPrice: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Factory cost"
            value={newRow.factoryCost}
            onChange={(e) =>
              setNewRow({ ...newRow, factoryCost: e.target.value })
            }
          />
          <Button
            disabled={busy === "new" || !newRow.sku || !newRow.name}
            onClick={addProduct}
          >
            Save row
          </Button>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              {orderedCols.map((c) => (
                <th key={c.key} className="px-3 py-2">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-3 py-8 text-center text-stone-500"
                >
                  No products. Add a row to start inventory.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const d = draft(p.id);
                const stock = d.stockQuantity ?? p.stockQuantity;
                const threshold = d.lowStockThreshold ?? p.lowStockThreshold;
                const low = stock <= threshold;
                const cells: Record<ColKey, ReactNode> = {
                  sku: isAdmin ? (
                    <Input
                      className="h-8 w-28"
                      value={d.sku ?? p.sku}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [p.id]: { ...d, sku: e.target.value },
                        }))
                      }
                    />
                  ) : (
                    <span className="font-medium">{p.sku}</span>
                  ),
                  name: (
                    <Input
                      className="h-8 min-w-[140px]"
                      value={d.name ?? p.name}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [p.id]: { ...d, name: e.target.value },
                        }))
                      }
                    />
                  ),
                  stock: (
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
                  ),
                  retail: isAdmin ? (
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
                  ),
                  factory: (
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
                  ),
                  margin: p.margin != null ? formatBdt(p.margin) : "—",
                  threshold: (
                    <Input
                      className="h-8 w-20"
                      type="number"
                      value={threshold}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [p.id]: {
                            ...d,
                            lowStockThreshold: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  ),
                  alert: low ? (
                    <Badge className="bg-amber-100 text-amber-900">
                      Low ≤ {threshold}
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-900">OK</Badge>
                  ),
                  actions: (
                    <div className="flex flex-wrap gap-1">
                      <Button
                        size="sm"
                        disabled={busy === p.id || Object.keys(d).length === 0}
                        onClick={() => save(p)}
                      >
                        Save
                      </Button>
                      {isAdmin ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === p.id}
                          onClick={() => remove(p)}
                        >
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  ),
                };
                return (
                  <tr key={p.id} className="border-b border-stone-100">
                    {orderedCols.map((c) => (
                      <td key={c.key} className="px-3 py-3">
                        {cells[c.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
