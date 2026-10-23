import { AccessDenied } from "@/components/access-denied";
import { SettingsPageView } from "@/components/settings-page-view";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canManageAudit } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user || !canManageAudit(user.role)) {
    return <AccessDenied />;
  }

  const settings = await prisma.appSetting.findMany({ orderBy: { key: "asc" } });

  return <SettingsPageView initial={settings} />;
}
