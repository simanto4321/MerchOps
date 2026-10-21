import type { Metadata } from "next";
import { Figtree, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Mehedi Ashraf Simanto · Evaluation Specialist CV",
  description:
    "CV and project portfolio tailored for the micro1 Evaluation Specialist / Recent Grad role — LLM evaluation, multi-step Q&A design, source triangulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}
      >
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
