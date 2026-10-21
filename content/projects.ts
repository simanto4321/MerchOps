/**
 * Selected GitHub projects for the micro1 Evaluation Specialist application.
 * Narratives reframed for Oct 2026 — frontier LLM/agent eval, not generic “portfolio apps.”
 * Original repos: github.com/simanto4321
 */

export type Project = {
  id: string;
  name: string;
  repo: string;
  url: string;
  stack: string[];
  selectedBecause: string;
  originalFocus: string;
  updatedFor2026: string;
  cvBullets: string[];
  micro1Signals: string[];
  statusNote: string;
};

export const selectionRationale = {
  date: "October 2026",
  criteria: [
    "Direct overlap with designing, scoring, or iterating on model/agent outputs",
    "Evidence of multi-step analytical reasoning (not CRUD demos)",
    "Documented process: rubrics, validators, citations, architecture notes",
    "Runnable and honest — tests/CI/metrics, not marketing copy",
  ],
  notSelectedNote:
    "Clinic admin (doctor-tracker), n8n kits, and general full-stack demos were deprioritized for this application — strong engineering, weaker eval signal.",
};

export const projects: Project[] = [
  {
    id: "llm-eval-harness",
    name: "LLM Eval Harness",
    repo: "simanto4321/llm-eval-harness",
    url: "https://github.com/simanto4321/llm-eval-harness",
    stack: ["Python", "JSONL datasets", "Rubric scoring", "CLI reports"],
    selectedBecause:
      "Closest match to the role: batch evaluation of LLM responses with test cases, validators, and rubrics.",
    originalFocus:
      "Installable CLI that scores canned model responses offline across coding, reasoning, and formatting categories.",
    updatedFor2026:
      "Reframed as a frontier-eval practice bench: author hard prompts, encode gold expectations, run pluggable checks, score accuracy/clarity/helpfulness (1–5), and emit reviewer-ready Markdown + JSON reports. Designed so difficulty can be raised when models saturate easy items — the same loop micro1 expects (write → test against models → iterate).",
    cvBullets: [
      "Built a batch evaluation package that loads JSONL test cases, runs category validators, and applies multi-dimension rubric scoring.",
      "Produced aggregate per-model stats and winner selection with offline MockProvider — no API key required for reproducible local runs.",
      "Structured cases for coding, reasoning, and formatting so failures are diagnosable (syntax, wrong complexity, vague answers).",
    ],
    micro1Signals: [
      "Original Q&A / prompt design",
      "Documented scoring logic",
      "Iterate difficulty",
      "Attention to written precision in reports",
    ],
    statusNote:
      "Updated Oct 2026 narrative for micro1; codebase remains the public harness at the URL above.",
  },
  {
    id: "llm-eval-starter",
    name: "LLM Eval Starter",
    repo: "simanto4321/llm-eval-starter",
    url: "https://github.com/simanto4321/llm-eval-starter",
    stack: ["Python", "AST validation", "Rubrics"],
    selectedBecause:
      "Shows programmatic ground-truth checking — not vibes-based grading.",
    originalFocus:
      "Side-by-side mock model comparison on a coding puzzle with AST/stdlib/O(n) checks.",
    updatedFor2026:
      "Positioned as a micro-eval protocol: define a task with hard constraints, validate candidate solutions programmatically, layer human-style rubrics, and write an audit report. Mirrors how evaluation specialists separate “sounds right” from “is correct.”",
    cvBullets: [
      "Compared two mock LLM coding outputs using AST syntax checks, stdlib-only rules, complexity heuristics, and rubric scores.",
      "Automated Markdown evaluation reports with clear pass/fail rationale — useful for reviewer handoff.",
    ],
    micro1Signals: [
      "Analytical checking",
      "Written documentation of findings",
      "Coding-domain expertise",
    ],
    statusNote: "Updated Oct 2026 framing; compact starter kept for clarity of method.",
  },
  {
    id: "agentops-desk",
    name: "AgentOps Desk",
    repo: "simanto4321/agentops-desk",
    url: "https://github.com/simanto4321/agentops-desk",
    stack: ["TypeScript", "React", "Eval harness", "Replay"],
    selectedBecause:
      "Agent evaluation — scenarios, traces, scoring — aligns with micro1’s agent/RL environment work.",
    originalFocus:
      "Multi-agent incident-response workflow with tool sandbox, human approval, durable state, and deterministic replay.",
    updatedFor2026:
      "Reframed for the agent-eval era: scenario harness scores triage accuracy, remediation quality, and resolution rate; traces expose cost/latency; replay makes failures inspectable. Same skills as writing multi-step agent tasks and judging whether the agent reasoned, tool-used, and resolved correctly.",
    cvBullets: [
      "Implemented a multi-agent incident workflow (triage → investigate → remediate → execute) with a human approval gate for high-risk actions.",
      "Added an evaluation harness that scores scenario outcomes and supports deterministic replay for debugging agent decisions.",
    ],
    micro1Signals: [
      "Multi-step synthesis tasks",
      "Agent outcome analysis",
      "Self-directed systems thinking",
    ],
    statusNote:
      "Oct 2026 update emphasizes evaluation harness + scenario scoring over the SRE demo story.",
  },
  {
    id: "querypilot",
    name: "QueryPilot",
    repo: "simanto4321/querypilot",
    url: "https://github.com/simanto4321/querypilot",
    stack: ["Python", "FastAPI", "sqlglot", "React"],
    selectedBecause:
      "Forces multi-hop analytical reasoning with a correctness boundary — synthesis, not lookup.",
    originalFocus:
      "Safe natural-language-to-SQL agent with read-only validation and governance approval.",
    updatedFor2026:
      "Treated as an analytical-eval sandbox: questions require schema understanding + compositional reasoning; answers are checked by sqlglot and policy gates. Demonstrates how I design tasks where the “right answer” must be derived and verified, then documented via execution traces.",
    cvBullets: [
      "Built an NL→SQL analytics agent with single-SELECT validation, governance guards, and human approval for row-level access.",
      "Kept an offline deterministic provider so reasoning paths stay testable without live LLM spend.",
    ],
    micro1Signals: [
      "Multi-step analytical questions",
      "Correctness verification",
      "Process documentation via traces",
    ],
    statusNote: "Narrative updated for eval-specialist evidence (Oct 2026).",
  },
  {
    id: "llm-finetune-lora",
    name: "LLM Fine-Tune (LoRA)",
    repo: "simanto4321/llm-finetune-lora",
    url: "https://github.com/simanto4321/llm-finetune-lora",
    stack: ["Python", "Transformers", "PEFT/LoRA", "Model card"],
    selectedBecause:
      "Shows understanding of how labeled data quality shapes model behavior — critical for training-data roles.",
    originalFocus:
      "DistilBERT sentiment classification with LoRA adapters, baselines, and a model card.",
    updatedFor2026:
      "Emphasized data discipline: stratified splits, baseline comparison, reproducibility manifests, and a model card covering intended use and limits. Connects to micro1’s pipeline: expert-quality labels → measurable capability gains.",
    cvBullets: [
      "Fine-tuned DistilBERT with LoRA (~1% trainable params) against a bag-of-words baseline with reproducible manifests.",
      "Wrote MODEL_CARD.md documenting intended use, evaluation, and limitations — treating documentation as part of the deliverable.",
    ],
    micro1Signals: [
      "Interest in frontier training data",
      "Label/eval literacy",
      "Written precision",
    ],
    statusNote: "Oct 2026 framing ties fine-tuning hygiene to evaluation/data quality.",
  },
  {
    id: "claude-contract-intelligence",
    name: "Contract Intelligence Reviewer",
    repo: "simanto4321/claude-contract-intelligence",
    url: "https://github.com/simanto4321/claude-contract-intelligence",
    stack: ["Python", "FastAPI", "Explainable rules", "React"],
    selectedBecause:
      "Domain-style risk judgment with explainable criteria — mirrors expert evaluation in specialized domains.",
    originalFocus:
      "Contract risk reviewer using deterministic, explainable rules (Claude-style simulation).",
    updatedFor2026:
      "Reframed as an evaluation rubric in code: every finding must cite a clause signal and a rule rationale. Practices the same muscle as writing gold answers with sources — no opaque scores.",
    cvBullets: [
      "Implemented explainable contract-risk rules that surface why a clause is flagged, not just a risk score.",
      "Paired a FastAPI engine with a review dashboard so decisions stay inspectable by a human reviewer.",
    ],
    micro1Signals: [
      "Source-backed reasoning",
      "Reviewer-friendly explanations",
      "Domain analytical thinking",
    ],
    statusNote:
      "Honestly labeled as a rules simulation; updated for evaluation-specialist storytelling (Oct 2026).",
  },
];

export const featuredProjectIds = [
  "llm-eval-harness",
  "agentops-desk",
  "querypilot",
  "llm-eval-starter",
] as const;
