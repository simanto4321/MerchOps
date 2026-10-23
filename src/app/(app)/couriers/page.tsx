import { redirect } from "next/navigation";
import { CouriersDesk } from "@/components/couriers-desk";
import { getCurrentUser, canManageAudit } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CouriersPage() {
  const user = await getCurrentUser();
  if (!user || !canManageAudit(user.role)) {
    redirect("/dashboard");
  }

  return <CouriersDesk />;
}
