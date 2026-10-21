export const profile = {
  name: "Mehedi Ashraf Simanto",
  headline:
    "Evaluation Specialist candidate · CSE recent graduate · LLM & agent evaluation",
  location: "Dhaka, Bangladesh · Remote-ready",
  email: "msimanto46@gmail.com",
  universityEmail: "mehedi.simanto01@northsouth.edu",
  github: "https://github.com/simanto4321",
  githubHandle: "simanto4321",
  linkedin: "https://www.linkedin.com/in/mehedi-simanto-1000641a7",
  phone: null as string | null,
  targetRole: "Evaluation Specialist / Recent Grad — micro1",
  summary: [
    "CSE graduate from North South University (expected Dec 2026) who already builds the same kind of work this role requires: original eval cases, multi-step reasoning prompts, rubric scoring, and documented research trails.",
    "I design challenging question–answer pairs, triangulate answers across sources, score model outputs against explicit rubrics, and iterate difficulty when models pass too easily — offline, with reproducible reports.",
    "Comfortable working independently, writing with precision, and treating quality standards as non-negotiable.",
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
      "Agent scenario harnesses & replay",
      "Difficulty iteration against model outcomes",
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
    "My public work already maps to micro1’s scope: original hard Q&A, research with citations, multi-step reasoning, testing against models, and refining from feedback.",
    "I care about frontier capability gaps — not trivia. The sample eval pack in this CV shows how I construct questions that require synthesis, not single-source lookup.",
    "As a recent grad with domain depth in coding, analytics, and systems, I can contribute immediately as a contractor while ramping on project-specific guidelines.",
  ],
} as const;
