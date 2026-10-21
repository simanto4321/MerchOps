export const profile = {
  name: "Mehedi Ashraf Simanto",
  headline:
    "Evaluation Specialist candidate · CSE recent graduate · multi-domain LLM evaluation",
  location: "Dhaka, Bangladesh · Remote-ready",
  email: "msimanto46@gmail.com",
  universityEmail: "mehedi.simanto01@northsouth.edu",
  github: "https://github.com/simanto4321",
  githubHandle: "simanto4321",
  linkedin: "https://www.linkedin.com/in/mehedi-simanto-1000641a7",
  phone: null as string | null,
  targetRole: "Evaluation Specialist / Recent Grad — micro1",
  summary: [
    "CSE graduate from North South University (expected Dec 2026) who already builds the same kind of work this role requires: original eval cases, multi-step reasoning prompts, rubric scoring, and documented research trails across coding, systems, finance, and clinical epidemiology.",
    "I design challenging question–answer pairs, triangulate answers across primary sources, score fluent model-style answers with explicit rubrics, and raise difficulty when probes score ≥4/5 without synthesis — with a logged DRAFT → probe → final item trail.",
    "I incorporate reviewer feedback into revisions, keep gold keys guideline-aligned, and treat written precision as part of the deliverable.",
  ],
  education: {
    school: "North South University",
    degree: "B.Sc. in Computer Science & Engineering",
    period: "2021 – Dec 2026 (expected)",
    location: "Dhaka, Bangladesh",
    highlights: [
      "Coursework spanning algorithms, AI, software engineering, and systems — applied through production-shaped open-source projects.",
      "Independent research habit: every flagship repo ships architecture docs, tests, CI, and honest metrics — not slideware.",
    ],
  },
  experience: [
    {
      org: "Independent AI / Systems Portfolio",
      role: "Builder · Evaluator · Sole contributor",
      period: "2024 – Present",
      bullets: [
        "Shipped 20+ public repositories covering LLM evaluation harnesses, agent workflows, NL→SQL safety, data quality, and LoRA fine-tuning.",
        "Wrote batch eval pipelines with JSONL test cases, pluggable validators, rubric dimensions (accuracy / clarity / helpfulness), and Markdown + JSON reports.",
        "Built multi-agent incident workflows with an evaluation harness scoring triage accuracy, remediation quality, and resolution rate.",
        "Authored a multi-domain Frontier Eval Sample Pack (ML, HTTP, Postgres, Basel LCR finance, diagnostic PPV) with capability probes, difficulty raises, and a two-round reviewer revision trail.",
      ],
    },
    {
      org: "ICMA NSU Student Chapter",
      role: "Director of Logistics",
      period: "Mar 2023 – Present",
      bullets: [
        "Owned event logistics and delivery reliability for a student organization — planning, coordination, and accountable execution under deadlines.",
      ],
    },
  ],
  skills: {
    evaluation: [
      "LLM response evaluation & rubric scoring",
      "Multi-step / synthesis question design",
      "Source triangulation & citation discipline",
      "Multi-domain items (coding, finance, clinical epi)",
      "Capability probes & difficulty iteration logs",
      "Reviewer feedback → revision trails",
      "Agent scenario harnesses & replay",
      "AST / programmatic validators",
    ],
    technical: [
      "Python",
      "TypeScript",
      "FastAPI",
      "React",
      "PostgreSQL",
      "LoRA / PEFT",
      "sqlglot validation",
      "Docker · CI",
    ],
    soft: [
      "Written precision (English)",
      "Attention to detail",
      "Self-direction in remote work",
      "Analytical synthesis",
      "Guideline adherence & review loops",
    ],
  },
  whyMicro1: [
    "Scope match: original hard Q&A, research with citations, multi-step reasoning, probe-and-raise difficulty, and refine from reviewer feedback — all evidenced in the sample pack.",
    "Domain range beyond coding: finance (Basel LCR) and clinical epidemiology (PPV/prevalence) items sit beside ML/systems tasks, showing I can ramp into specialized domains with primary sources.",
    "As a recent grad with reproducible eval tooling (llm-eval-harness) plus documented process discipline, I can contribute as a contractor while aligning to project guidelines quickly.",
  ],
  gapsClosed: [
    {
      gap: "Domain breadth",
      fix: "Added EV-04 (finance / LCR) and EV-05 (clinical epidemiology / PPV) with Basel + CDC triangulation.",
    },
    {
      gap: "Model-test → iterate difficulty",
      fix: "Logged DRAFT → capability probe → raised final items; reproducible script scripts/probe-difficulty.py.",
    },
    {
      gap: "Reviewer feedback loops",
      fix: "Two-round reviewer revision trail with explicit feedback → author actions → guideline alignment.",
    },
  ],
} as const;
