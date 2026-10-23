import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Fraunces, Manrope, Noto_Sans_Bengali } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/provider";
import { ToastProvider } from "@/components/toast";
import type { Locale } from "@/lib/i18n/dictionaries";
import "./globals.css";

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MerchOps — Inventory & Order Desk",
  description:
    "Centralized inventory, multi-channel orders, courier APIs, and immutable audit logs for Bangladesh retail.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jar = await cookies();
  const raw = jar.get("merchops_locale")?.value;
  const initialLocale: Locale = raw === "bn" ? "bn" : "en";

  return (
    <html lang={initialLocale === "bn" ? "bn" : "en"}>
      <body
        className={`${body.variable} ${display.variable} ${bengali.variable} antialiased`}
      >
        <LanguageProvider initialLocale={initialLocale}>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
