import { DashboardView } from "@/components/dashboard-view";
import { getDashboardMetrics } from "@/lib/analytics";
import { getCurrentUser, canViewCosts } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const showCosts = !!user && canViewCosts(user.role);
  const metrics = await getDashboardMetrics();

  return <DashboardView metrics={metrics} showCosts={showCosts} />;
}
