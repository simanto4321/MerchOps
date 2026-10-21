import { evalItems, sampleEvalMeta, sources } from "../../../content/sample-eval";
import { Section } from "@/components/Section";

export const metadata = {
  title: "Frontier Eval Sample Pack · Mehedi Ashraf Simanto",
  description:
    "Original multi-step evaluation items with source triangulation for micro1 Evaluation Specialist applications.",
};

export default function SampleEvalPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <header className="border-b border-[var(--line)] pb-10">
        <p className="font-mono-ui text-xs uppercase tracking-[0.18em] text-[var(--copper)]">
          Work sample · {sampleEvalMeta.date}
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
          {sampleEvalMeta.title}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-[var(--ink-soft)]">
          {sampleEvalMeta.subtitle}
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Author: {sampleEvalMeta.authored}
        </p>
      </header>

      <Section eyebrow="Method" title="How each item was built">
        <ol className="list-decimal space-y-2 pl-5 text-[var(--ink-soft)]">
          {sampleEvalMeta.method.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Sources" title="Triangulation library">
        <div className="overflow-x-auto border border-[var(--line)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--paper-deep)] text-[var(--ink)]">
              <tr>
                <th className="px-3 py-2 font-semibold">ID</th>
                <th className="px-3 py-2 font-semibold">Source</th>
                <th className="px-3 py-2 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.id} className="border-t border-[var(--line)]">
                  <td className="px-3 py-2 font-mono-ui text-xs">{s.id}</td>
                  <td className="px-3 py-2">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[var(--accent-deep)] hover:underline"
                    >
                      {s.title}
                    </a>
                    <div className="text-xs text-[var(--muted)]">
                      {s.publisher} · accessed {s.accessed}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[var(--ink-soft)]">{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="space-y-12">
        {evalItems.map((item) => (
          <article
            key={item.id}
            className="border border-[var(--line)] bg-[rgba(255,252,246,0.72)] p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-ui rounded bg-[var(--ink)] px-2 py-0.5 text-xs text-[var(--paper)]">
                {item.id}
              </span>
              <span className="font-mono-ui text-xs uppercase tracking-wider text-[var(--copper)]">
                {item.domain}
              </span>
              <span className="font-mono-ui text-xs uppercase tracking-wider text-[var(--accent-deep)]">
                {item.difficulty}
              </span>
            </div>

            <h2 className="font-display mt-4 text-2xl text-[var(--ink)] sm:text-3xl">
              Question
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--ink)]">{item.question}</p>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Why this is hard
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
              {item.whyHard}
            </p>

            <h3 className="font-display mt-8 text-2xl text-[var(--ink)]">
              Gold answer
            </h3>
            <p className="mt-3 leading-relaxed text-[var(--ink-soft)]">
              {item.goldAnswer}
            </p>

            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Claim → source map
            </h3>
            <ul className="mt-3 space-y-3">
              {item.keyClaims.map((c) => (
                <li
                  key={c.claim}
                  className="border-l-2 border-[var(--accent)] pl-3 text-sm text-[var(--ink-soft)]"
                >
                  <span className="text-[var(--ink)]">{c.claim}</span>
                  <div className="font-mono-ui mt-1 text-xs text-[var(--accent-deep)]">
                    {c.sources.join(", ")}
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm italic text-[var(--muted)]">
              {item.synthesisNote}
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-[var(--ink)]">
                  Grader notes
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--ink-soft)]">
                  {item.graderNotes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--ink)]">
                  Trap answers
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--ink-soft)]">
                  {item.trapAnswers.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
