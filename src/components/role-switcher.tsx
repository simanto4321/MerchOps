"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

type UserOption = {
  id: string;
  name: string;
  role: string;
  username: string;
  email: string;
};

export function RoleSwitcher({
  user,
}: {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    role: string;
  } | null;
}) {
  const router = useRouter();
  const { t } = useI18n();
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
    <label className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 text-xs">
      <span className="hidden text-stone-500 sm:inline">{t.shell.signedIn}</span>
      <select
        className="max-w-[140px] bg-transparent text-sm font-medium text-stone-900 outline-none sm:max-w-[180px]"
        disabled={busy || users.length === 0}
        value={user?.id ?? ""}
        onChange={(e) => switchUser(e.target.value)}
        aria-label="Switch role"
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.role} · {u.name.split(" ")[0]}
          </option>
        ))}
      </select>
    </label>
  );
}
