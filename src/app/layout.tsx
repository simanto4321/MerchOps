import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/session";
import "./globals.css";

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "MerchOps — Inventory & Order Desk",
  description:
    "Centralized inventory, multi-channel orders, partial deliveries, and immutable audit logs.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${body.variable} ${display.variable} antialiased`}>
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
      </body>
    </html>
  );
}
