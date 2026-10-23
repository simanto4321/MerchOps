"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function SettingsForm({
  initial,
}: {
  initial: { key: string; value: string }[];
}) {
  const map = Object.fromEntries(initial.map((s) => [s.key, s.value]));
  const [token, setToken] = useState(map.telegram_bot_token ?? "");
  const [chatId, setChatId] = useState(map.telegram_chat_id ?? "");
  const [notifyOn, setNotifyOn] = useState(map.telegram_notify_on ?? "[]");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        settings: [
          { key: "telegram_bot_token", value: token },
          { key: "telegram_chat_id", value: chatId },
          { key: "telegram_notify_on", value: notifyOn },
        ],
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error ?? "Save failed");
      return;
    }
    setMessage("Settings saved. New orders and failed deliveries will notify Telegram when configured.");
  }

  return (
    <div className="max-w-xl space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <label className="block text-sm">
        <span className="mb-1 block text-xs text-stone-500">Telegram bot token</span>
        <Input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="123456:ABC…"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs text-stone-500">Telegram chat / channel ID</span>
        <Input
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          placeholder="-100…"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-xs text-stone-500">
          Notify on (JSON array)
        </span>
        <Input value={notifyOn} onChange={(e) => setNotifyOn(e.target.value)} />
      </label>
      <Button disabled={busy} onClick={save}>
        Save webhook settings
      </Button>
      {message ? <p className="text-sm text-stone-600">{message}</p> : null}
      <p className="text-xs text-stone-500">
        Channel webhook ingest: <code>POST /api/webhooks/order</code> with{" "}
        <code>channel</code>, <code>customerName</code>, <code>customerPhone</code>,{" "}
        <code>items:[&#123;sku, qty&#125;]</code>.
      </p>
    </div>
  );
}
