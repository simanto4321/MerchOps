"use client";

import { profile } from "../../../content/profile";
import { projects } from "../../../content/projects";

export default function PrintPage() {
  return (
    <main className="mx-auto max-w-[820px] bg-white px-6 py-8 text-black sm:px-10">
      <div className="no-print mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          Print / Save as PDF
        </button>
        <p className="text-sm text-[var(--muted)] self-center">
          Use your browser print dialog → Save as PDF.
        </p>
      </div>

      <header className="border-b-2 border-black pb-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {profile.name}
        </h1>
        <p className="mt-1 text-sm">
          Evaluation Specialist candidate · CSE · North South University (Dec
          2026)
        </p>
        <p className="mt-2 text-xs">
          {profile.email} · {profile.universityEmail} ·{" "}
          <span className="whitespace-nowrap">{profile.github}</span> ·{" "}
          {profile.location}
        </p>
        <p className="mt-1 text-xs font-semibold">
          Target: {profile.targetRole}
        </p>
      </header>

      <section className="mt-5">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
          Summary
        </h2>
        <p className="mt-2 text-sm leading-snug">{profile.summary[0]}</p>
        <p className="mt-2 text-sm leading-snug">{profile.summary[1]}</p>
      </section>

      <section className="mt-5">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
          Education
        </h2>
        <div className="mt-1 flex flex-wrap justify-between gap-2 text-sm">
          <p className="font-semibold">
            {profile.education.degree}, {profile.education.school}
          </p>
          <p>{profile.education.period}</p>
        </div>
        <ul className="mt-2 list-disc pl-5 text-sm leading-snug">
          {profile.education.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="mt-5">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
          Experience
        </h2>
        {profile.experience.map((job) => (
          <div key={job.org} className="mt-3">
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <p>
                <span className="font-semibold">{job.role}</span> — {job.org}
              </p>
              <p>{job.period}</p>
            </div>
            <ul className="mt-1 list-disc pl-5 text-sm leading-snug">
              {job.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-5">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
          Selected projects (updated Oct 2026)
        </h2>
        {projects.map((p) => (
          <div key={p.id} className="mt-3">
            <p className="text-sm font-semibold">
              {p.name}{" "}
              <span className="font-normal text-neutral-600">— {p.url}</span>
            </p>
            <ul className="mt-1 list-disc pl-5 text-sm leading-snug">
              {p.cvBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-5">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
          Skills
        </h2>
        <p className="mt-2 text-sm leading-snug">
          <span className="font-semibold">Evaluation:</span>{" "}
          {profile.skills.evaluation.join("; ")}
        </p>
        <p className="mt-1 text-sm leading-snug">
          <span className="font-semibold">Technical:</span>{" "}
          {profile.skills.technical.join("; ")}
        </p>
        <p className="mt-1 text-sm leading-snug">
          <span className="font-semibold">Work style:</span>{" "}
          {profile.skills.soft.join("; ")}
        </p>
      </section>

      <section className="mt-5">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
          Why micro1
        </h2>
        <ul className="mt-2 list-disc pl-5 text-sm leading-snug">
          {profile.whyMicro1.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </section>

      <p className="mt-6 text-xs text-neutral-600">
        Accompanying work sample: Frontier Eval Sample Pack (multi-step Q&A with
        source triangulation) available in the application site under Sample
        eval pack.
      </p>
    </main>
  );
}
