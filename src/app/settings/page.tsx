import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings-form";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canManageAudit } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user || !canManageAudit(user.role)) {
    redirect("/");
  }

  const settings = await prisma.appSetting.findMany({ orderBy: { key: "asc" } });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Integrations & alerts
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Route order and failure alerts to a Telegram bot channel. Configure
          inbound webhooks for Instagram / WhatsApp / Facebook bots.
        </p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
