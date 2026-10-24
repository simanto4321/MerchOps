"use client";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-stone-900">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        {error.message || "Unexpected error in the operations desk."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-[#0c2a26] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
