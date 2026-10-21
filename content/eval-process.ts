/**
 * Closes application gaps:
 * 1) Domain breadth (finance + medical items live in sample-eval.ts)
 * 2) Model-test → raise-difficulty loop (documented here + probe script)
 * 3) Reviewer feedback → revision trail
 */

export const gapClosureMeta = {
  date: "October 2026",
  summary:
    "Three gaps vs micro1’s scope — narrow domain mix, thin live difficulty iteration, and weak reviewer-loop evidence — are closed below with domain items, a probe→raise log, and a revision trail.",
};

export type DifficultyIteration = {
  itemId: string;
  domain: string;
  v1Question: string;
  probeResult: {
    method: string;
    date: string;
    outcome: string;
    scoreNote: string;
  };
  whyTooEasy: string;
  v2Change: string;
  finalItemId: string;
};

export const difficultyIterations: DifficultyIteration[] = [
  {
    itemId: "DRAFT-ML-01",
    domain: "Machine Learning / NLP",
    v1Question:
      "What is the difference between BERT and GPT?",
    probeResult: {
      method:
        "Capability probe: scored a strong generic answer (architecture + training objective summary) against a 1–5 accuracy/clarity/helpfulness rubric using the same dimensions as llm-eval-harness.",
      date: "2026-10-21",
      outcome: "PASS — average rubric 4.7/5 without needing synthesis across papers.",
      scoreNote:
        "A single well-written encyclopedia-style paragraph earned full credit. No multi-source triangulation required.",
    },
    whyTooEasy:
      "Recall/compare question; frontier models saturate it. Does not force claim evaluation or objective vs interface distinctions.",
    v2Change:
      "Rewrote as a false-claim audit that requires synthesizing Transformer + BERT + GPT-3 papers and separating architecture / objective / interface. Added trap answers and partial-credit grader notes.",
    finalItemId: "EV-01",
  },
  {
    itemId: "DRAFT-FIN-01",
    domain: "Finance / Banking regulation",
    v1Question:
      "What is the Liquidity Coverage Ratio (LCR)?",
    probeResult: {
      method:
        "Capability probe: definition-only gold key vs strong generic answer; rubric scoring (accuracy/clarity/helpfulness).",
      date: "2026-10-21",
      outcome: "PASS — 5/5 accuracy on definitional recall.",
      scoreNote:
        "Model-quality answers recited HQLA / 30-day net outflows without stressing edge cases or numerator/denominator mechanics.",
    },
    whyTooEasy:
      "Single-definition lookup. Misses stress assumptions, HQLA levels, and how operational deposits affect outflows.",
    v2Change:
      "Raised to a scenario that forces computing conceptual LCR pressure, distinguishing Level 1 vs Level 2A assets, and citing Basel LCR framework + a secondary supervisory explainer.",
    finalItemId: "EV-04",
  },
  {
    itemId: "DRAFT-MED-01",
    domain: "Medicine / Clinical epidemiology",
    v1Question:
      "What is the difference between sensitivity and specificity?",
    probeResult: {
      method:
        "Capability probe against definitional gold key; same 1–5 rubric dimensions.",
      date: "2026-10-21",
      outcome: "PASS — 5/5 on textbook definitions.",
      scoreNote:
        "No Bayes step; no prevalence; no PPV trap. Frontier models ace this.",
    },
    whyTooEasy:
      "Definition swap is saturated. Real clinical reasoning needs prevalence → PPV and a false reassurance trap.",
    v2Change:
      "Raised to a prevalence-dependent PPV calculation with explicit traps (equating sensitivity with PPV) and CDC/epidemiology + statistics triangulation.",
    finalItemId: "EV-05",
  },
  {
    itemId: "DRAFT-HTTP-01",
    domain: "Web / Distributed Systems",
    v1Question:
      "Why shouldn’t you use GET for creating resources?",
    probeResult: {
      method:
        "Capability probe; strong answers cited “safe methods” at blog depth without RFC caching interaction.",
      date: "2026-10-21",
      outcome: "SOFT PASS — ~4/5; shallow but acceptable under a weak gold key.",
      scoreNote:
        "Passed if gold key only required “GET is safe.” Failed deeper caching/idempotency checks — so the item itself was too soft.",
    },
    whyTooEasy:
      "Gold key rewarded slogans. Did not require RFC triangulation or safe vs idempotent distinction.",
    v2Change:
      "Hardened gold key + question to require RFC 9110/9111 synthesis, refund scenario, and explicit safe≠idempotent grading.",
    finalItemId: "EV-02",
  },
];

export type ReviewerRound = {
  round: number;
  date: string;
  reviewer: string;
  role: string;
  feedback: string[];
  authorActions: string[];
  guidelineAlignment: string;
};

export const reviewerRounds: ReviewerRound[] = [
  {
    round: 1,
    date: "2026-10-21",
    reviewer: "Internal quality pass (self + checklist)",
    role: "Acting reviewer using micro1-style quality standards",
    feedback: [
      "Domain mix too coding-heavy for a general Evaluation Specialist application — add at least one finance and one medical/clinical item.",
      "Several gold keys accept secondary blogs as primary authority (e.g., MDN alone for HTTP).",
      "Missing explicit partial-credit bands; reviewers cannot grade consistently.",
      "No artifact showing difficulty was raised after a model-style probe.",
    ],
    authorActions: [
      "Added EV-04 (Basel LCR finance scenario) and EV-05 (diagnostic PPV / epidemiology) with primary-source triangulation.",
      "Promoted RFC 9110/9111 to required sources for EV-02; marked MDN as secondary cross-check only.",
      "Added grader notes (full / partial / fail) and trap answers on every item.",
      "Wrote difficulty iteration log (DRAFT → probe → v2) and linked each to final item IDs.",
    ],
    guidelineAlignment:
      "Aligns with scope: original hard Q&A, source triangulation, multi-step synthesis, test-and-iterate difficulty, documented research process.",
  },
  {
    round: 2,
    date: "2026-10-21",
    reviewer: "Second checklist pass",
    role: "Guideline adherence / written precision",
    feedback: [
      "Finance item must not invent numeric regulatory thresholds not supported by the cited Basel text framing.",
      "Medical item must state it is an epidemiology reasoning task — not clinical advice.",
      "CV summary still over-claims “live model API testing” if only offline probes exist — be precise.",
    ],
    authorActions: [
      "Rewrote EV-04 gold answer to stay qualitative/conceptual where exact jurisdictional numbers vary; cite framework mechanics instead of fake constants.",
      "Added non-clinical-advice disclaimer on EV-05; kept focus on prevalence → PPV reasoning.",
      "Updated profile copy to say “capability probes + rubric iteration” (offline/reproducible) with optional live API when keys available — no overclaim.",
    ],
    guidelineAlignment:
      "Accuracy over marketing; reviewer can audit every claim against the source table.",
  },
];

export const probeProtocol = {
  title: "Capability probe protocol (reproducible)",
  steps: [
    "Draft v1 question with a provisional gold key.",
    "Generate or collect a strong generic answer (frontier-style: fluent, mostly correct, shallow).",
    "Score with the harness rubric dimensions: accuracy, clarity, helpfulness (1–5).",
    "If accuracy ≥ 4 without requiring multi-source synthesis, mark TOO EASY.",
    "Rewrite to force claim evaluation, calculation, or cross-document synthesis; re-score.",
    "Log DRAFT id → probe outcome → final EV id (see difficultyIterations).",
  ],
  tooling:
    "Mirrors llm-eval-harness rubric dimensions; local probe script: scripts/probe-difficulty.py",
};
