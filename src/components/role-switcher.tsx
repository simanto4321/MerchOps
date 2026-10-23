"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type UserOption = { id: string; name: string; role: string; email: string };

export function RoleSwitcher({
  user,
}: {
  user: { id: string; name: string; email: string; role: string } | null;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.users ?? []))
      .catch(() => setUsers([]));
  }, []);

  async function switchUser(userId: string) {
    setBusy(true);
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs">
        <span className="text-stone-500">Signed in · </span>
        <span className="font-medium text-stone-900">
          {user?.name ?? "—"} ({user?.role ?? "—"})
        </span>
      </div>
      <select
        className="h-9 rounded-md border border-stone-300 bg-white px-2 text-sm"
        disabled={busy || users.length === 0}
        value={user?.id ?? ""}
        onChange={(e) => switchUser(e.target.value)}
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.role}: {u.name}
          </option>
        ))}
      </select>
      <Button
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={() => user && switchUser(user.id)}
      >
        Refresh
      </Button>
    </div>
  );
}
