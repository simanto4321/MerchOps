import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canManageAudit } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const user = await getCurrentUser();
  if (!user || !canManageAudit(user.role)) {
    redirect("/");
  }

  const logs = await prisma.auditLog.findMany({
    include: {
      user: { select: { name: true, email: true, role: true } },
    },
    orderBy: { timestamp: "desc" },
    take: 150,
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Immutable audit trail
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Every price change, order edit, stock update, and login is recorded with
          previous and new values. Admin-only.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Entity</th>
              <th className="px-3 py-2">Previous</th>
              <th className="px-3 py-2">New</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-stone-100 align-top">
                <td className="px-3 py-3 text-xs text-stone-500 whitespace-nowrap">
                  {log.timestamp.toLocaleString("en-GB", {
                    timeZone: "Asia/Dhaka",
                  })}{" "}
                  Asia/Dhaka
                </td>
                <td className="px-3 py-3">
                  <div className="font-medium">{log.user?.name ?? "System"}</div>
                  <div className="text-xs text-stone-500">
                    {log.user?.role ?? "—"}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <Badge className="bg-stone-100 text-stone-800">{log.action}</Badge>
                </td>
                <td className="px-3 py-3 text-xs">
                  {log.entityType ?? "—"}
                  {log.entityId ? (
                    <div className="font-mono text-[11px] text-stone-400">
                      {log.entityId.slice(0, 10)}…
                    </div>
                  ) : null}
                </td>
                <td className="px-3 py-3">
                  <pre className="max-w-xs overflow-x-auto whitespace-pre-wrap rounded bg-stone-50 p-2 text-[11px] text-stone-600">
                    {log.previousValue ?? "—"}
                  </pre>
                </td>
                <td className="px-3 py-3">
                  <pre className="max-w-xs overflow-x-auto whitespace-pre-wrap rounded bg-teal-50/60 p-2 text-[11px] text-stone-700">
                    {log.newValue ?? "—"}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
