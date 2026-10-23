"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useI18n } from "@/lib/i18n/provider";
import { COURIER_PRESETS } from "@/lib/couriers";
import { cn } from "@/lib/utils";
import { formatDhakaDateTime } from "@/lib/time";

type Connection = {
  id: string;
  provider: string;
  displayName: string;
  apiBaseUrl: string | null;
  storeId: string | null;
  webhookUrl: string | null;
  status: string;
  lastError: string | null;
  lastSyncedAt: string | null;
  apiKeyMasked: string;
  apiSecretMasked: string;
  hasApiKey: boolean;
  hasApiSecret: boolean;
};

const statusClass: Record<string, string> = {
  CONNECTED: "bg-emerald-100 text-emerald-900",
  DISCONNECTED: "bg-stone-100 text-stone-700",
  ERROR: "bg-rose-100 text-rose-900",
  TESTING: "bg-amber-100 text-amber-900",
};

export function CouriersDesk() {
  const { t, locale } = useI18n();
  const C = t.couriers;
  const router = useRouter();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [drafts, setDrafts] = useState<
    Record<
      string,
      {
        apiKey: string;
        apiSecret: string;
        storeId: string;
        apiBaseUrl: string;
        webhookUrl: string;
      }
    >
  >({});
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/delivery-connections");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to load");
      return;
    }
    setConnections(data.connections ?? []);
    setError(null);
  }

  useEffect(() => {
    load();
  }, []);

  function draft(id: string, c: Connection) {
    return (
      drafts[id] ?? {
        apiKey: "",
        apiSecret: "",
        storeId: c.storeId ?? "",
        apiBaseUrl: c.apiBaseUrl ?? "",
        webhookUrl: c.webhookUrl ?? "",
      }
    );
  }

  async function act(id: string, action: string, extra?: Record<string, string>) {
    setBusy(id);
    setMessage(null);
    setError(null);
    const d = drafts[id] ?? {};
    const res = await fetch(`/api/delivery-connections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        ...d,
        ...extra,
      }),
    });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) {
      setError(data.error ?? "Action failed");
      return;
    }
    setMessage(
      action === "test"
        ? data.ok
          ? "Connection OK"
          : data.connection?.lastError ?? "Test failed"
        : "Saved",
    );
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    await load();
    router.refresh();
  }

  function labelFor(provider: string, fallback: string) {
    const preset = COURIER_PRESETS.find((p) => p.provider === provider);
    if (!preset) return fallback;
    return locale === "bn" ? preset.displayNameBn : preset.displayName;
  }

  function statusLabel(status: string) {
    if (status === "CONNECTED") return C.statusConnected;
    if (status === "ERROR") return C.statusError;
    if (status === "TESTING") return C.statusTesting;
    return C.statusDisconnected;
  }

  return (
    <div className="space-y-6">
      <div className="rise-in">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-stone-900 sm:text-4xl">
          {C.title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-stone-600">{C.subtitle}</p>
      </div>

      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {message}
        </p>
      ) : null}

      {connections.length === 0 ? (
        <p className="text-sm text-stone-500">{C.emptyHint}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {connections.map((c) => {
            const preset = COURIER_PRESETS.find((p) => p.provider === c.provider);
            const d = draft(c.id, c);
            return (
              <article
                key={c.id}
                className="rise-in rounded-2xl border border-stone-200/90 bg-white/95 p-5 shadow-[0_12px_40px_-24px_rgba(12,42,38,0.4)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: preset?.color ?? "#0f766e" }}
                    />
                    <div>
                      <h2 className="font-semibold text-stone-900">
                        {labelFor(c.provider, c.displayName)}
                      </h2>
                      <p className="text-xs text-stone-500">{preset?.docsHint}</p>
                    </div>
                  </div>
                  <Badge className={cn(statusClass[c.status] ?? statusClass.DISCONNECTED)}>
                    {statusLabel(c.status)}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-2">
                  <label className="text-xs text-stone-500">
                    {C.apiKey}
                    {c.hasApiKey ? (
                      <span className="ml-2 text-stone-400">({c.apiKeyMasked})</span>
                    ) : null}
                    <Input
                      className="mt-1"
                      type="password"
                      placeholder="••••••••"
                      value={d.apiKey}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [c.id]: { ...d, apiKey: e.target.value },
                        }))
                      }
                    />
                  </label>
                  <label className="text-xs text-stone-500">
                    {C.apiSecret}
                    {c.hasApiSecret ? (
                      <span className="ml-2 text-stone-400">({c.apiSecretMasked})</span>
                    ) : null}
                    <Input
                      className="mt-1"
                      type="password"
                      placeholder="••••••••"
                      value={d.apiSecret}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [c.id]: { ...d, apiSecret: e.target.value },
                        }))
                      }
                    />
                  </label>
                  <label className="text-xs text-stone-500">
                    {C.storeId}
                    <Input
                      className="mt-1"
                      value={d.storeId}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [c.id]: { ...d, storeId: e.target.value },
                        }))
                      }
                    />
                  </label>
                  <label className="text-xs text-stone-500">
                    {C.baseUrl}
                    <Input
                      className="mt-1"
                      value={d.apiBaseUrl}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [c.id]: { ...d, apiBaseUrl: e.target.value },
                        }))
                      }
                    />
                  </label>
                  <label className="text-xs text-stone-500">
                    {C.webhook}
                    <Input
                      className="mt-1"
                      value={d.webhookUrl}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [c.id]: { ...d, webhookUrl: e.target.value },
                        }))
                      }
                    />
                  </label>
                </div>

                <p className="mt-3 text-xs text-stone-500">
                  {C.lastSync}:{" "}
                  {c.lastSyncedAt
                    ? formatDhakaDateTime(c.lastSyncedAt)
                    : C.never}
                  {c.lastError ? ` · ${c.lastError}` : ""}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={busy === c.id}
                    onClick={() => act(c.id, "save")}
                  >
                    {C.save}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busy === c.id}
                    onClick={() => act(c.id, "connect")}
                  >
                    {C.connect}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === c.id}
                    onClick={() => act(c.id, "test")}
                  >
                    {C.test}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy === c.id}
                    onClick={() => act(c.id, "disconnect")}
                  >
                    {C.disconnect}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
