import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0c2a26] px-6 text-center text-teal-50">
      <p className="font-[family-name:var(--font-display)] text-5xl">MerchOps</p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-teal-100/70">
        That route does not exist in the ops desk.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 rounded-full bg-[#f0b429] px-5 py-2.5 text-sm font-bold text-[#1a1408]"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
