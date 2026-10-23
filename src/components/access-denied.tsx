"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export function AccessDenied({
  titleEn = "Admin only",
  titleBn = "শুধু অ্যাডমিন",
  bodyEn = "Switch to an Admin account from the top-right to open this page.",
  bodyBn = "এই পেজ খুলতে উপরের ডানদিকে অ্যাডমিন অ্যাকাউন্টে যান।",
}: {
  titleEn?: string;
  titleBn?: string;
  bodyEn?: string;
  bodyBn?: string;
}) {
  const { locale } = useI18n();
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50/80 px-6 py-10 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-stone-900">
        {locale === "bn" ? titleBn : titleEn}
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        {locale === "bn" ? bodyBn : bodyEn}
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex rounded-full bg-[#0c2a26] px-5 py-2.5 text-sm font-semibold text-white"
      >
        {locale === "bn" ? "হোমে ফিরুন" : "Back to home"}
      </Link>
    </div>
  );
}
