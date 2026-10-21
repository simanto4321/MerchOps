"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { profile } from "../../content/profile";
import { projects, selectionRationale } from "../../content/projects";
import { Section } from "@/components/Section";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const featured = projects.slice(0, 4);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
      <motion.header
        className="relative overflow-hidden rounded-none border border-[var(--line)] bg-[rgba(255,252,246,0.72)] px-6 py-12 sm:px-10 sm:py-16"
        initial="initial"
        animate="animate"
        variants={fade}
        transition={{ duration: 0.55 }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(16,35,40,0.12) 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="relative">
          <p className="font-mono-ui mb-4 text-xs uppercase tracking-[0.2em] text-[var(--copper)]">
            Application package · {profile.targetRole}
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--ink-soft)] sm:text-xl">
            {profile.headline}
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {profile.location}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-md bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
            >
              Email {profile.email}
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-[var(--line)] bg-white/60 px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-white"
            >
              GitHub @{profile.githubHandle}
            </a>
            <Link
              href="/print"
              className="rounded-md border border-[var(--line)] bg-white/60 px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-white"
            >
              Print / save PDF
            </Link>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Section eyebrow="Profile" title="Built for evaluation work, not just demos">
          <div className="prose-tight space-y-4 text-[var(--ink-soft)] leading-relaxed">
            {profile.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Section>

        <Section eyebrow="Why micro1" title="Direct overlap with the scope of work">
          <ul className="space-y-3">
            {profile.whyMicro1.map((item) => (
              <li
                key={item}
                className="border-l-2 border-[var(--accent)] pl-4 text-[var(--ink-soft)] leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[var(--muted)]">
            See the{" "}
            <Link href="/sample-eval" className="font-semibold text-[var(--accent-deep)] underline-offset-2 hover:underline">
              Frontier Eval Sample Pack
            </Link>{" "}
            for original multi-step items with source triangulation.
          </p>
        </Section>

        <Section eyebrow="Education" title={profile.education.school}>
          <p className="text-[var(--ink)] font-semibold">
            {profile.education.degree}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {profile.education.period} · {profile.education.location}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--ink-soft)]">
            {profile.education.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </Section>

        <Section eyebrow="Experience" title="Independent builds + campus leadership">
          <div className="space-y-8">
            {profile.experience.map((job) => (
              <article key={job.org}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl text-[var(--ink)]">
                    {job.role}
                  </h3>
                  <span className="font-mono-ui text-xs text-[var(--muted)]">
                    {job.period}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-[var(--accent-deep)]">
                  {job.org}
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--ink-soft)]">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Project selection · Oct 2026"
          title="Six repos chosen for eval signal"
        >
          <p className="mb-4 max-w-3xl text-[var(--ink-soft)]">
            Selection criteria: {selectionRationale.criteria.join(" · ")}
          </p>
          <p className="mb-8 text-sm text-[var(--muted)]">
            {selectionRationale.notSelectedNote}
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {featured.map((p, i) => (
              <motion.article
                key={p.id}
                className="border border-[var(--line)] bg-[rgba(255,252,246,0.65)] p-5"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <p className="font-mono-ui text-xs uppercase tracking-wider text-[var(--copper)]">
                  {p.stack.slice(0, 3).join(" · ")}
                </p>
                <h3 className="font-display mt-2 text-2xl text-[var(--ink)]">
                  {p.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {p.updatedFor2026}
                </p>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm font-semibold text-[var(--accent-deep)] hover:underline"
                >
                  {p.repo} →
                </a>
              </motion.article>
            ))}
          </div>
          <Link
            href="/projects"
            className="mt-8 inline-flex rounded-md bg-[var(--ink)] px-4 py-2.5 text-sm font-semibold text-[var(--paper)] hover:bg-[var(--ink-soft)]"
          >
            Full selection + Oct 2026 updates
          </Link>
        </Section>

        <Section eyebrow="Skills" title="What I bring to the contractor seat">
          <div className="grid gap-6 sm:grid-cols-3">
            {(
              [
                ["Evaluation", profile.skills.evaluation],
                ["Technical", profile.skills.technical],
                ["Work style", profile.skills.soft],
              ] as const
            ).map(([label, items]) => (
              <div key={label}>
                <h3 className="font-display text-xl text-[var(--ink)]">{label}</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--ink-soft)]">
                  {items.map((s) => (
                    <li key={s} className="border-b border-[var(--line)] pb-2">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <section className="mt-8 border border-[var(--line)] bg-[var(--accent-deep)] px-6 py-10 text-[var(--paper)] sm:px-10">
          <h2 className="font-display text-3xl">Ready to contribute</h2>
          <p className="mt-3 max-w-2xl text-[rgba(243,239,230,0.88)]">
            Open to the micro1 Evaluation Specialist / Recent Grad contractor
            role — remote, guideline-aligned, and accountable for high-quality
            training and evaluation data.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.email}?subject=micro1%20Evaluation%20Specialist%20application%20—%20Mehedi%20Ashraf%20Simanto`}
              className="rounded-md bg-[var(--paper)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-deep)]"
            >
              Contact
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-[rgba(243,239,230,0.35)] px-4 py-2.5 text-sm font-semibold"
            >
              LinkedIn
            </a>
          </div>
        </section>
      </motion.div>
    </main>
  );
}
