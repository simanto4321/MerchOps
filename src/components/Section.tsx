import { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-12 sm:py-16">
      {eyebrow ? (
        <p className="font-mono-ui mb-2 text-xs uppercase tracking-[0.18em] text-[var(--accent-deep)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display mb-6 max-w-3xl text-3xl font-medium tracking-tight text-[var(--ink)] sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}
