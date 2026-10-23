import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <AppShell
      user={
        user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          : null
      }
    >
      {children}
    </AppShell>
  );
}
