import Link from "next/link";
import { projects, selectionRationale } from "../../../content/projects";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Selected projects · Mehedi Ashraf Simanto",
  description:
    "GitHub projects selected and reframed for the micro1 Evaluation Specialist role (October 2026).",
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <header className="border-b border-[var(--line)] pb-10">
        <p className="font-mono-ui text-xs uppercase tracking-[0.18em] text-[var(--copper)]">
          Selection locked · {selectionRationale.date}
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
          Projects updated for this application
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-[var(--ink-soft)]">
          From 22 public repos, six were selected for evaluation signal. Each
          entry keeps the real GitHub artifact but refreshes the narrative for
          today&apos;s frontier-eval work — multi-step questions, rubrics,
          triangulation, and agent scoring.
        </p>
      </header>

      <Section eyebrow="How we chose" title="Selection criteria">
        <ol className="list-decimal space-y-2 pl-5 text-[var(--ink-soft)]">
          {selectionRationale.criteria.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-[var(--muted)]">
          {selectionRationale.notSelectedNote}
        </p>
      </Section>

      <div className="space-y-10">
        {projects.map((p, index) => (
          <article
            key={p.id}
            className="border border-[var(--line)] bg-[rgba(255,252,246,0.7)] p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono-ui text-xs text-[var(--muted)]">
                  {String(index + 1).padStart(2, "0")} / {projects.length}
                </p>
                <h2 className="font-display mt-1 text-3xl text-[var(--ink)]">
                  {p.name}
                </h2>
              </div>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-[var(--line)] bg-white/70 px-3 py-1.5 text-sm font-semibold text-[var(--accent-deep)] hover:bg-white"
              >
                {p.repo}
              </a>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono-ui border border-[var(--line)] bg-[var(--paper-deep)] px-2 py-0.5 text-xs text-[var(--ink-soft)]"
                >
                  {s}
                </span>
              ))}
            </div>

            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="font-mono-ui text-xs uppercase tracking-wider text-[var(--copper)]">
                  Why selected
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {p.selectedBecause}
                </dd>
              </div>
              <div>
                <dt className="font-mono-ui text-xs uppercase tracking-wider text-[var(--copper)]">
                  Original focus
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {p.originalFocus}
                </dd>
              </div>
            </dl>

            <div className="mt-5 border-l-2 border-[var(--accent)] pl-4">
              <p className="font-mono-ui text-xs uppercase tracking-wider text-[var(--accent-deep)]">
                Updated for Oct 2026 · present situation
              </p>
              <p className="mt-2 leading-relaxed text-[var(--ink)]">
                {p.updatedFor2026}
              </p>
            </div>

            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-[var(--ink-soft)]">
              {p.cvBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                micro1 signals
              </p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                {p.micro1Signals.join(" · ")}
              </p>
              <p className="mt-3 text-xs text-[var(--muted)]">{p.statusNote}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-12 text-sm text-[var(--muted)]">
        Next:{" "}
        <Link
          href="/sample-eval"
          className="font-semibold text-[var(--accent-deep)] hover:underline"
        >
          read the Frontier Eval Sample Pack
        </Link>{" "}
        — original items written for this role.
      </p>
    </main>
  );
}
