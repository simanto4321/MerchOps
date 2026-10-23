import { AccessDenied } from "@/components/access-denied";
import { CouriersDesk } from "@/components/couriers-desk";
import { getCurrentUser, canManageAudit } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CouriersPage() {
  const user = await getCurrentUser();
  if (!user || !canManageAudit(user.role)) {
    return <AccessDenied />;
  }

  return <CouriersDesk />;
}
