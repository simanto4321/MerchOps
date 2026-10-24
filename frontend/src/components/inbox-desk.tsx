"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { CHANNEL_LABELS } from "@/lib/constants";
import { formatDhakaDateTime } from "@/lib/time";

type Message = {
  id: string;
  channel: string;
  customerName: string;
  customerPhone: string | null;
  body: string;
  status: string;
  tags: string[];
  createdAt: string;
  order: { id: string; orderNumber: string } | null;
};

export function InboxDesk({
  initialMessages,
  orders,
}: {
  initialMessages: Message[];
  orders: { id: string; orderNumber: string }[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [form, setForm] = useState({
    channel: "WHATSAPP",
    customerName: "",
    customerPhone: "",
    body: "",
  });
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const res = await fetch("/api/inbox");
    const data = await res.json();
    setMessages(data.messages ?? []);
    router.refresh();
  }

  async function createMessage() {
    setBusy(true);
    await fetch("/api/inbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    setForm({ channel: "WHATSAPP", customerName: "", customerPhone: "", body: "" });
    await refresh();
  }

  async function linkOrder(id: string, orderId: string) {
    await fetch("/api/inbox", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, orderId, status: "LINKED" }),
    });
    await refresh();
  }

  async function closeMessage(id: string) {
    await fetch("/api/inbox", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "CLOSED" }),
    });
    await refresh();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Unified inbox
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Aggregate Instagram, WhatsApp, Facebook, and TikTok inquiries into one
          queue. Link threads to orders or close them.
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Capture inbound message
        </h2>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <select
            className="h-9 rounded-md border border-stone-300 px-2 text-sm"
            value={form.channel}
            onChange={(e) => setForm({ ...form, channel: e.target.value })}
          >
            {Object.keys(CHANNEL_LABELS).map((c) => (
              <option key={c} value={c}>
                {CHANNEL_LABELS[c]}
              </option>
            ))}
          </select>
          <Input
            placeholder="Customer name"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={form.customerPhone}
            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
          />
          <Button disabled={busy || !form.customerName || !form.body} onClick={createMessage}>
            Add to queue
          </Button>
        </div>
        <Textarea
          className="mt-2"
          placeholder="Message body…"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 bg-white/70 px-4 py-8 text-center text-sm text-stone-500">
            Inbox is empty.
          </p>
        ) : (
          messages.map((m) => (
            <article
              key={m.id}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-teal-100 text-teal-900">
                  {CHANNEL_LABELS[m.channel]}
                </Badge>
                <Badge className="bg-stone-100 text-stone-700">{m.status}</Badge>
                {m.tags.map((t) => (
                  <Badge key={t} className="bg-stone-50 text-stone-600">
                    {t}
                  </Badge>
                ))}
                <span className="text-xs text-stone-500">
                  {formatDhakaDateTime(m.createdAt)}
                </span>
              </div>
              <h3 className="mt-2 font-medium">
                {m.customerName}
                {m.customerPhone ? ` · ${m.customerPhone}` : ""}
              </h3>
              <p className="mt-1 text-sm text-stone-700">{m.body}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {m.order ? (
                  <span className="text-sm text-teal-800">
                    Linked to {m.order.orderNumber}
                  </span>
                ) : (
                  <select
                    className="h-8 rounded-md border border-stone-300 px-2 text-xs"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) linkOrder(m.id, e.target.value);
                    }}
                  >
                    <option value="">Link to order…</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber}
                      </option>
                    ))}
                  </select>
                )}
                {m.status !== "CLOSED" ? (
                  <Button size="sm" variant="outline" onClick={() => closeMessage(m.id)}>
                    Close
                  </Button>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
