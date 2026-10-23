import type { Metadata } from "next";
import { DM_Sans, Fraunces, Noto_Sans_Bengali } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/provider";
import { ToastProvider } from "@/components/toast";
import "./globals.css";

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MerchOps — Inventory & Order Desk",
  description:
    "Centralized inventory, multi-channel orders, courier APIs, and immutable audit logs for Bangladesh retail.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${body.variable} ${display.variable} ${bengali.variable} antialiased`}
      >
        <LanguageProvider>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
