"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  CHANNEL_LABELS,
  REASON_CODES,
  STATUS_COLORS,
  STATUS_LABELS,
} from "@/lib/constants";
import { formatBdt } from "@/lib/utils";

type Product = {
  id: string;
  sku: string;
  name: string;
  retailPrice: number;
  stockQuantity: number;
};

type OrderItem = {
  id: string;
  orderedQuantity: number;
  acceptedQuantity: number;
  returnedQuantity: number;
  unitPrice: number;
  product: { id: string; sku: string; name: string };
};

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  sourceChannel: string;
  totalAmount: number;
  parcelValue: number;
  deliveryStatus: string;
  reasonCode: string | null;
  adminComments: string | null;
  tags: string[];
  createdAt: string;
  items: OrderItem[];
};

const channels = Object.keys(CHANNEL_LABELS);
const statuses = Object.keys(STATUS_LABELS);

export function OrdersDesk({
  initialOrders,
  products,
  initialQ = "",
  initialStatus = "",
  initialShowEntry = false,
}: {
  initialOrders: Order[];
  products: Product[];
  initialQ?: string;
  initialStatus?: string;
  initialShowEntry?: boolean;
}) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [q, setQ] = useState(initialQ);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [showEntry, setShowEntry] = useState(initialShowEntry);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (channel && o.sourceChannel !== channel) return false;
      if (status && o.deliveryStatus !== status) return false;
      if (q) {
        const hay = `${o.orderNumber} ${o.customerName} ${o.customerPhone} ${o.adminComments ?? ""} ${o.reasonCode ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [orders, channel, status, q]);

  async function refresh() {
    const params = new URLSearchParams();
    if (channel) params.set("channel", channel);
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    const res = await fetch(`/api/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    router.refresh();
  }

  async function patchOrder(id: string, body: Record<string, unknown>) {
    setBusy(id);
    setError(null);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) {
      setError(data.error ?? "Update failed");
      return;
    }
    await refresh();
    if (selected?.id === id) {
      const detail = await fetch(`/api/orders/${id}`).then((r) => r.json());
      setSelected(detail.order);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
            Orders
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Search phone or order ID. Change status in the row. Use comments for
            morning call-backs.
          </p>
        </div>
        <Button
          className="rounded-full"
          onClick={() => setShowEntry((v) => !v)}
        >
          {showEntry ? "Close" : "+ Pack parcels"}
        </Button>
      </div>

      {showEntry ? (
        <QuickOrderEntry
          products={products}
          onCreated={async () => {
            setShowEntry(false);
            await refresh();
          }}
        />
      ) : null}

      <div className="grid gap-2 rounded-xl border border-stone-200 bg-white p-3 shadow-sm sm:grid-cols-4">
        <Input
          placeholder="Search phone, order ID, comment…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="h-9 rounded-md border border-stone-300 bg-white px-2 text-sm"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        >
          <option value="">All channels</option>
          {channels.map((c) => (
            <option key={c} value={c}>
              {CHANNEL_LABELS[c]}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-md border border-stone-300 bg-white px-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <Button variant="secondary" onClick={refresh}>
          Apply filters
        </Button>
      </div>

      {error ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Channel</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Parcel</th>
              <th className="px-3 py-2">Quick comment</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-stone-500">
                  No orders match these filters.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="border-b border-stone-100 align-top">
                  <td className="px-3 py-3">
                    <button
                      className="font-medium text-teal-900 hover:underline"
                      onClick={() => setSelected(order)}
                    >
                      {order.orderNumber}
                    </button>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {order.tags.map((t) => (
                        <Badge key={t} className="bg-stone-100 text-stone-700">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-stone-500">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {CHANNEL_LABELS[order.sourceChannel]}
                  </td>
                  <td className="px-3 py-3">
                    <Badge className={STATUS_COLORS[order.deliveryStatus]}>
                      {STATUS_LABELS[order.deliveryStatus]}
                    </Badge>
                    {order.reasonCode ? (
                      <p className="mt-1 text-xs text-stone-500">
                        {order.reasonCode}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">{formatBdt(order.parcelValue)}</td>
                  <td className="px-3 py-3">
                    <InlineComment
                      disabled={busy === order.id}
                      value={order.adminComments ?? ""}
                      onSave={(adminComments) =>
                        patchOrder(order.id, {
                          action: "edit",
                          adminComments,
                        })
                      }
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      <select
                        className="h-8 rounded-md border border-stone-300 bg-white px-2 text-xs"
                        disabled={busy === order.id}
                        value={order.deliveryStatus}
                        onChange={(e) =>
                          patchOrder(order.id, {
                            action: "status",
                            deliveryStatus: e.target.value,
                            reasonCode:
                              e.target.value === "FAILED"
                                ? order.reasonCode || "Customer didn't pick up"
                                : order.reasonCode,
                          })
                        }
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelected(order)}
                      >
                        Partial / exchange
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected ? (
        <OrderDetailPanel
          order={selected}
          allOrders={orders}
          busy={busy === selected.id}
          onClose={() => setSelected(null)}
          onPatch={(body) => patchOrder(selected.id, body)}
        />
      ) : null}
    </div>
  );
}

function InlineComment({
  value,
  onSave,
  disabled,
}: {
  value: string;
  onSave: (v: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState(value);
  return (
    <div className="flex min-w-[200px] gap-1">
      <Input
        className="h-8 text-xs"
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. Manik phone unreachable"
      />
      <Button
        size="sm"
        variant="secondary"
        disabled={disabled || text === value}
        onClick={() => onSave(text)}
      >
        Save
      </Button>
    </div>
  );
}

function OrderDetailPanel({
  order,
  allOrders,
  busy,
  onClose,
  onPatch,
}: {
  order: Order;
  allOrders: Order[];
  busy: boolean;
  onClose: () => void;
  onPatch: (body: Record<string, unknown>) => void;
}) {
  const [reasonCode, setReasonCode] = useState(order.reasonCode ?? "");
  const [comments, setComments] = useState(order.adminComments ?? "");
  const [items, setItems] = useState(
    order.items.map((i) => ({
      orderItemId: i.id,
      acceptedQuantity: i.acceptedQuantity || i.orderedQuantity,
      returnedQuantity: i.returnedQuantity || 0,
      orderedQuantity: i.orderedQuantity,
      label: `${i.product.sku} × ${i.orderedQuantity}`,
    })),
  );
  const [mergeId, setMergeId] = useState("");

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-stone-900/40 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-stone-200 bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              {order.orderNumber}
            </h2>
            <p className="text-sm text-stone-600">
              {order.customerName} · {order.customerPhone} ·{" "}
              {CHANNEL_LABELS[order.sourceChannel]}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-xs text-stone-500">Reason code</span>
            <select
              className="h-9 w-full rounded-md border border-stone-300 bg-white px-2"
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
            >
              <option value="">—</option>
              {REASON_CODES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block text-xs text-stone-500">Side comments</span>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            disabled={busy}
            onClick={() =>
              onPatch({
                action: "status",
                deliveryStatus: order.deliveryStatus,
                reasonCode,
                adminComments: comments,
              })
            }
          >
            Save comments
          </Button>
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Partial / exchange quantities
        </h3>
        <div className="mt-2 space-y-2">
          {items.map((item, idx) => (
            <div
              key={item.orderItemId}
              className="grid grid-cols-3 gap-2 rounded-lg border border-stone-100 bg-stone-50 p-2 text-sm"
            >
              <div className="col-span-3 font-medium">{item.label}</div>
              <label>
                <span className="text-xs text-stone-500">Accepted</span>
                <Input
                  type="number"
                  min={0}
                  max={item.orderedQuantity}
                  value={item.acceptedQuantity}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = {
                      ...item,
                      acceptedQuantity: Number(e.target.value),
                    };
                    setItems(next);
                  }}
                />
              </label>
              <label>
                <span className="text-xs text-stone-500">Returned</span>
                <Input
                  type="number"
                  min={0}
                  max={item.orderedQuantity}
                  value={item.returnedQuantity}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = {
                      ...item,
                      returnedQuantity: Number(e.target.value),
                    };
                    setItems(next);
                  }}
                />
              </label>
              <div className="flex items-end text-xs text-stone-500">
                Ordered {item.orderedQuantity}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            disabled={busy}
            onClick={() =>
              onPatch({
                action: "partial",
                items,
                reasonCode: reasonCode || "Partial accept",
                adminComments: comments,
              })
            }
          >
            Apply partial
          </Button>
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() =>
              onPatch({
                action: "exchange",
                items,
                reasonCode: reasonCode || "Exchange requested",
                adminComments: comments,
              })
            }
          >
            Apply exchange
          </Button>
        </div>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Merge into this order
        </h3>
        <div className="mt-2 flex gap-2">
          <select
            className="h-9 flex-1 rounded-md border border-stone-300 bg-white px-2 text-sm"
            value={mergeId}
            onChange={(e) => setMergeId(e.target.value)}
          >
            <option value="">Select secondary order…</option>
            {allOrders
              .filter((o) => o.id !== order.id)
              .map((o) => (
                <option key={o.id} value={o.id}>
                  {o.orderNumber} · {o.customerName}
                </option>
              ))}
          </select>
          <Button
            variant="outline"
            disabled={!mergeId || busy}
            onClick={() =>
              onPatch({ action: "merge", secondaryOrderId: mergeId })
            }
          >
            Merge
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuickOrderEntry({
  products,
  onCreated,
}: {
  products: Product[];
  onCreated: () => void;
}) {
  const [rows, setRows] = useState([
    {
      customerName: "",
      customerPhone: "",
      sourceChannel: "PHONE",
      productId: products[0]?.id ?? "",
      qty: 1,
      parcelValue: "",
    },
  ]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    const bulk = rows.map((r) => ({
      customerName: r.customerName || `Parcel ${r.customerPhone}`,
      customerPhone: r.customerPhone,
      sourceChannel: r.sourceChannel,
      parcelValue: r.parcelValue ? Number(r.parcelValue) : undefined,
      items: [
        {
          productId: r.productId,
          orderedQuantity: Number(r.qty),
        },
      ],
    }));
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bulk }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to create orders");
      return;
    }
    onCreated();
  }

  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4">
      <h2 className="font-[family-name:var(--font-display)] text-xl">
        Quick parcel entry
      </h2>
      <p className="mt-1 text-sm text-stone-600">
        Enter multiple parcels by phone after packing. Parcel value is calculated
        or overridden per row.
      </p>
      <div className="mt-3 space-y-2">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="grid gap-2 rounded-lg border border-stone-200 bg-white p-2 md:grid-cols-6"
          >
            <Input
              placeholder="Phone"
              value={row.customerPhone}
              onChange={(e) => {
                const next = [...rows];
                next[idx] = { ...row, customerPhone: e.target.value };
                setRows(next);
              }}
            />
            <Input
              placeholder="Customer name"
              value={row.customerName}
              onChange={(e) => {
                const next = [...rows];
                next[idx] = { ...row, customerName: e.target.value };
                setRows(next);
              }}
            />
            <select
              className="h-9 rounded-md border border-stone-300 px-2 text-sm"
              value={row.sourceChannel}
              onChange={(e) => {
                const next = [...rows];
                next[idx] = { ...row, sourceChannel: e.target.value };
                setRows(next);
              }}
            >
              {channels.map((c) => (
                <option key={c} value={c}>
                  {CHANNEL_LABELS[c]}
                </option>
              ))}
            </select>
            <select
              className="h-9 rounded-md border border-stone-300 px-2 text-sm"
              value={row.productId}
              onChange={(e) => {
                const next = [...rows];
                next[idx] = { ...row, productId: e.target.value };
                setRows(next);
              }}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.sku} ({p.stockQuantity})
                </option>
              ))}
            </select>
            <Input
              type="number"
              min={1}
              value={row.qty}
              onChange={(e) => {
                const next = [...rows];
                next[idx] = { ...row, qty: Number(e.target.value) };
                setRows(next);
              }}
            />
            <Input
              placeholder="Parcel ৳"
              value={row.parcelValue}
              onChange={(e) => {
                const next = [...rows];
                next[idx] = { ...row, parcelValue: e.target.value };
                setRows(next);
              }}
            />
          </div>
        ))}
      </div>
      {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() =>
            setRows((r) => [
              ...r,
              {
                customerName: "",
                customerPhone: "",
                sourceChannel: "PHONE",
                productId: products[0]?.id ?? "",
                qty: 1,
                parcelValue: "",
              },
            ])
          }
        >
          Add row
        </Button>
        <Button disabled={busy || products.length === 0} onClick={submit}>
          {busy ? "Saving…" : `Create ${rows.length} order(s)`}
        </Button>
      </div>
    </div>
  );
}
