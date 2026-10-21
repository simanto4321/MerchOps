/**
 * Sample Evaluation Specialist work product — Oct 2026.
 * Demonstrates: original multi-step Q&A, source triangulation, citations,
 * difficulty rationale, and reviewer-ready documentation.
 */

export type Source = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  accessed: string;
  note: string;
};

export type EvalItem = {
  id: string;
  domain: string;
  difficulty: "hard" | "very-hard";
  question: string;
  whyHard: string;
  goldAnswer: string;
  keyClaims: { claim: string; sources: string[] }[];
  synthesisNote: string;
  graderNotes: string[];
  trapAnswers: string[];
  disclaimer?: string;
};

export const sampleEvalMeta = {
  title: "Frontier Eval Sample Pack",
  subtitle:
    "Original multi-step items with source triangulation — coding, systems, finance, and clinical epidemiology — written for the micro1 Evaluation Specialist scope",
  authored: "Mehedi Ashraf Simanto",
  date: "October 2026",
  domainsCovered: [
    "Machine Learning / NLP",
    "Web / Distributed Systems",
    "Databases",
    "Finance / Banking regulation",
    "Medicine / Clinical epidemiology",
  ],
  method: [
    "Draft a question that cannot be answered from a single FAQ-style page.",
    "Pull 3+ independent sources; prefer primary docs, standards, or peer-reviewed summaries.",
    "Write a gold answer that synthesizes — then map each key claim to citations.",
    "List trap answers models commonly invent; define grader notes for partial credit.",
    "Run a capability probe; raise difficulty if a strong fluent answer scores ≥4/5 without synthesis.",
    "Incorporate reviewer feedback and re-check guideline alignment before locking the item.",
  ],
};

export const sources: Source[] = [
  {
    id: "S1",
    title: "Attention Is All You Need",
    publisher: "NeurIPS 2017 (Vaswani et al.)",
    url: "https://arxiv.org/abs/1706.03762",
    accessed: "2026-10-21",
    note: "Primary paper defining multi-head self-attention and the Transformer encoder–decoder.",
  },
  {
    id: "S2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    publisher: "NAACL 2019 (Devlin et al.)",
    url: "https://arxiv.org/abs/1810.04805",
    accessed: "2026-10-21",
    note: "Primary paper for masked LM + NSP pretraining and bidirectional encoders.",
  },
  {
    id: "S3",
    title: "Language Models are Few-Shot Learners (GPT-3)",
    publisher: "NeurIPS 2020 (Brown et al.)",
    url: "https://arxiv.org/abs/2005.14165",
    accessed: "2026-10-21",
    note: "Primary paper on scaling decoder-only LMs and in-context learning.",
  },
  {
    id: "S4",
    title: "The Illustrated Transformer",
    publisher: "Jay Alammar",
    url: "https://jalammar.github.io/illustrated-transformer/",
    accessed: "2026-10-21",
    note: "Secondary explainer used only to cross-check intuition — not as sole authority.",
  },
  {
    id: "S5",
    title: "RFC 9110 — HTTP Semantics",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc9110",
    accessed: "2026-10-21",
    note: "Authoritative HTTP method/idempotency semantics.",
  },
  {
    id: "S6",
    title: "RFC 9111 — HTTP Caching",
    publisher: "IETF",
    url: "https://www.rfc-editor.org/rfc/rfc9111",
    accessed: "2026-10-21",
    note: "Caching directives and heuristic freshness — used with S5 for triangulation.",
  },
  {
    id: "S7",
    title: "MDN — Idempotent HTTP methods",
    publisher: "MDN Web Docs",
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Idempotent",
    accessed: "2026-10-21",
    note: "Practitioner summary; verified against RFCs before inclusion.",
  },
  {
    id: "S8",
    title: "PostgreSQL 16 Documentation — Indexes / EXPLAIN",
    publisher: "PostgreSQL Global Development Group",
    url: "https://www.postgresql.org/docs/16/indexes.html",
    accessed: "2026-10-21",
    note: "Primary vendor docs for index types and planner behavior.",
  },
  {
    id: "S9",
    title: "Use The Index, Luke — SQL indexing",
    publisher: "Markus Winand",
    url: "https://use-the-index-luke.com/",
    accessed: "2026-10-21",
    note: "Independent practitioner reference for selectivity and covering indexes.",
  },
  {
    id: "S10",
    title: "Basel III: The Liquidity Coverage Ratio and liquidity risk monitoring tools",
    publisher: "Basel Committee on Banking Supervision (BIS)",
    url: "https://www.bis.org/publ/bcbs238.htm",
    accessed: "2026-10-21",
    note: "Primary regulatory framework for LCR (HQLA / net cash outflows).",
  },
  {
    id: "S11",
    title: "Liquidity Coverage Ratio — overview",
    publisher: "Bank for International Settlements",
    url: "https://www.bis.org/basel_framework/chapter/LCR/10.htm",
    accessed: "2026-10-21",
    note: "Basel Framework chapter used to triangulate LCR structure and HQLA tiers.",
  },
  {
    id: "S12",
    title: "Principles for Sound Liquidity Risk Management and Supervision",
    publisher: "Basel Committee on Banking Supervision",
    url: "https://www.bis.org/publ/bcbs144.htm",
    accessed: "2026-10-21",
    note: "Supervisory principles context for why short-term liquidity buffers exist.",
  },
  {
    id: "S13",
    title: "Principles of Epidemiology in Public Health Practice — Lesson 3 (Measures)",
    publisher: "CDC",
    url: "https://www.cdc.gov/csels/dsepd/ss1978/lesson3/index.html",
    accessed: "2026-10-21",
    note: "Primary public-health teaching text for sensitivity, specificity, predictive value.",
  },
  {
    id: "S14",
    title: "Evaluation of Diagnostic Tests",
    publisher: "NCBI Bookshelf / StatPearls",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK557428/",
    accessed: "2026-10-21",
    note: "Secondary clinical reference for PPV/NPV dependence on prevalence.",
  },
  {
    id: "S15",
    title: "Bayes’ theorem — predictive values",
    publisher: "Wikipedia (cross-check only)",
    url: "https://en.wikipedia.org/wiki/Positive_and_negative_predictive_values",
    accessed: "2026-10-21",
    note: "Formula cross-check only; not used as sole authority — verified against CDC/StatPearls.",
  },
];

export const evalItems: EvalItem[] = [
  {
    id: "EV-01",
    domain: "Machine Learning / NLP",
    difficulty: "very-hard",
    question:
      "A teammate claims: “BERT is just a Transformer encoder, so it can do few-shot in-context learning the same way GPT-3 does — you just put examples in the prompt.” Using primary papers, explain what is technically wrong with this claim, what BERT was actually trained to do, and under what conditions an encoder-only model can still be adapted for generation-like tasks. Your answer must distinguish architecture, pretraining objective, and inference-time interface.",
    whyHard:
      "Requires synthesizing three papers (Transformer, BERT, GPT-3), separating architecture from training objective from interface, and rejecting a plausible-sounding conflation. Single-source lookup fails.",
    goldAnswer:
      "The claim mixes three different things. Architecturally, BERT is indeed built from Transformer encoder blocks (bidirectional self-attention), while GPT-3 is a decoder-only (causal) Transformer stack. That architectural difference alone does not decide few-shot prompting behavior. Pretraining does: BERT is trained with masked language modeling (and originally next-sentence prediction), learning bidirectional representations for understanding tasks; it is not trained as an autoregressive next-token predictor. GPT-3 is trained as a large autoregressive language model and demonstrates that scale + that objective yields in-context learning when examples are placed in the prompt. Therefore you cannot “just put examples in the prompt” on a standard BERT checkpoint and expect GPT-3-style few-shot completion — BERT’s inference interface is typically fine-tune then classify/encode, not open-ended continuation. Encoder-only models can still be adapted toward generation-like behavior via span corruption / denoising objectives (e.g., encoder–decoder variants) or by attaching generative heads and further training, but that is a different recipe than GPT-3 in-context learning. Correct evaluation of the claim must keep architecture ≠ objective ≠ prompting interface.",
    keyClaims: [
      {
        claim:
          "Original Transformer defines encoder and decoder stacks with multi-head attention; BERT uses the encoder pattern.",
        sources: ["S1", "S2", "S4"],
      },
      {
        claim:
          "BERT pretraining centers on masked LM (+ NSP in the original paper), targeting bidirectional understanding.",
        sources: ["S2"],
      },
      {
        claim:
          "GPT-3 shows few-shot in-context learning as an emergent behavior of large autoregressive LMs, not of bidirectional MLM encoders by default.",
        sources: ["S3"],
      },
    ],
    synthesisNote:
      "No single abstract states the teammate’s error explicitly; the grader must reward synthesis across S1–S3 and penalize answers that only say “BERT isn’t generative.”",
    graderNotes: [
      "Full credit: separates architecture / objective / interface and cites or accurately paraphrases BERT vs GPT-3 training.",
      "Partial: notes BERT is bidirectional/MLM but never mentions in-context learning or GPT-3.",
      "Fail: claims BERT “is a decoder” or that prompting BERT equals GPT-3 few-shot without adaptation.",
    ],
    trapAnswers: [
      "“BERT can’t do NLP without fine-tuning” (too absolute; ignores probing/feature use).",
      "“Transformers are only for translation” (confuses the 2017 paper’s experiments with the architecture).",
      "“GPT-3 invented attention” (false; attention is from the Transformer paper).",
    ],
  },
  {
    id: "EV-02",
    domain: "Web / Distributed Systems",
    difficulty: "hard",
    question:
      "An API designer says GET /orders/{id}/refund should create a refund because “GET is simpler for browsers.” Argue from HTTP semantics why this is incorrect, what properties GET is expected to have, which method family better fits creating a refund, and how caching interacts with the mistake. Triangulate standards (not blog folklore).",
    whyHard:
      "Needs RFC-level precision on safe/idempotent semantics plus caching side effects — multi-document synthesis (RFC 9110 + 9111 + MDN cross-check).",
    goldAnswer:
      "GET is defined as a safe method: it should not change server state as a result of the request beyond negligible effects like logging. Creating a refund is a state-changing business action, so binding it to GET violates safe semantics and invites catastrophic bugs (prefetchers, crawlers, or HTTP caches may trigger GET). GET is also idempotent, but idempotency alone is not enough — PUT/DELETE are idempotent yet intentionally unsafe. The appropriate pattern is typically POST /orders/{id}/refunds (non-idempotent create) or a carefully designed idempotent POST/PUT with an Idempotency-Key if clients may retry. Caching makes the GET mistake worse: intermediaries may cache GET responses per RFC 9111 heuristics/directives; a “refund via GET” could be served from cache or revalidated in ways that do not match one-shot business intent. MDN’s idempotent glossary aligns with the RFCs but is secondary — the normative basis is RFC 9110 method properties plus RFC 9111 caching behavior.",
    keyClaims: [
      {
        claim: "GET is safe and must not be used for state-changing operations like creating a refund.",
        sources: ["S5", "S7"],
      },
      {
        claim:
          "Idempotency ≠ safety; choosing a method requires both properties for the use case.",
        sources: ["S5", "S7"],
      },
      {
        claim:
          "HTTP caching primarily targets safe retrieval; misuse of GET couples business writes to cache behavior.",
        sources: ["S6", "S5"],
      },
    ],
    synthesisNote:
      "Gold answer must cite or clearly track RFC method properties; MDN alone is insufficient for full credit.",
    graderNotes: [
      "Full credit: safe vs idempotent distinguished; POST (or justified idempotent write) recommended; caching risk named.",
      "Partial: says “don’t use GET for writes” without safe/idempotent distinction.",
      "Fail: defends GET refunds for “simplicity” or confuses PUT with safe.",
    ],
    trapAnswers: [
      "“POST is always wrong for APIs” (false).",
      "“Idempotent means safe” (false).",
      "“Browsers never send GET twice” (false; prefetch/retries exist).",
    ],
  },
  {
    id: "EV-03",
    domain: "Databases / Performance",
    difficulty: "hard",
    question:
      "You observe a PostgreSQL query: SELECT * FROM events WHERE tenant_id = $1 AND created_at > $2 ORDER BY created_at DESC LIMIT 50. An engineer adds an index on (created_at) only. Explain, with indexing principles, why this often fails to help under multi-tenant selectivity, what index shape is more appropriate, and what you would check in EXPLAIN to confirm. Use vendor docs plus an independent indexing reference.",
    whyHard:
      "Requires multi-step reasoning about selectivity, composite indexes, and ORDER BY/LIMIT — not a single “add an index” tip.",
    goldAnswer:
      "A lone btree on (created_at) ignores the highly selective tenant_id predicate common in multi-tenant schemas. The planner may still need to filter many rows belonging to other tenants that share recent timestamps, or it may choose a created_at-ordered scan that is inefficient when tenant_id is selective. A composite index such as (tenant_id, created_at DESC) better matches the equality filter plus range/order, enabling an index range scan that returns rows already ordered for the LIMIT. SELECT * may still force heap fetches unless a covering index includes needed columns; that is a second-order optimization. Confirmation: EXPLAIN (ANALYZE, BUFFERS) should show an Index Scan/Index Only Scan using the composite index with a tight row estimate, not a sequential scan or a large sort node. Cross-check PostgreSQL index documentation with practitioner guidance on leftmost prefix and selectivity (e.g., Use The Index, Luke).",
    keyClaims: [
      {
        claim:
          "Index usefulness depends on matching predicates; leading columns should support equality filters like tenant_id.",
        sources: ["S8", "S9"],
      },
      {
        claim:
          "Composite (tenant_id, created_at) aligns filter + ordering for LIMIT queries better than created_at alone.",
        sources: ["S8", "S9"],
      },
      {
        claim: "EXPLAIN ANALYZE is the verification step for plan shape and actual rows.",
        sources: ["S8"],
      },
    ],
    synthesisNote:
      "Rewards systems thinking: selectivity → index shape → plan verification. Punishes “just index every column.”",
    graderNotes: [
      "Full credit: names composite index rationale + EXPLAIN verification.",
      "Partial: suggests composite index but no EXPLAIN plan criteria.",
      "Fail: insists single-column created_at is always optimal.",
    ],
    trapAnswers: [
      "“Indexes always speed up ORDER BY” (not if the wrong leading column).",
      "“SELECT * is free with any index” (covering/index-only caveats).",
    ],
  },
  {
    id: "EV-04",
    domain: "Finance / Banking regulation",
    difficulty: "very-hard",
    question:
      "A treasury analyst says: “If we swap most of our Level 1 HQLA into higher-yielding Level 2A assets, LCR stays the same because both count as high-quality liquid assets — we just earn more carry.” Using the Basel LCR framework (not a blog summary), explain what is wrong with this claim, how HQLA tiers and caps interact with the LCR ratio’s structure, and what liquidity-risk principle the analyst is ignoring. Stay conceptual: do not invent jurisdiction-specific numeric haircuts.",
    whyHard:
      "Requires synthesizing Basel LCR mechanics (HQLA composition, tiering/caps, outflows) with supervisory liquidity principles — not a one-line definition of LCR.",
    goldAnswer:
      "The claim treats “HQLA” as a homogeneous bucket. Under the Basel LCR framework, the ratio is High-Quality Liquid Assets divided by total net cash outflows over a 30-calendar-day stress scenario. Level 1 assets (e.g., central bank reserves and certain sovereigns meeting criteria) are the highest-quality stock and are treated more favorably than Level 2 assets. Level 2A (and 2B where applicable) assets are eligible only within limits and with haircuts; they are not interchangeable 1:1 with Level 1 for maintaining the same LCR resilience. Swapping Level 1 into Level 2A therefore typically reduces the usable HQLA after haircuts/caps even if market value looks similar, which can lower LCR and weaken the buffer meant to survive acute outflow stress. The analyst also ignores the supervisory point of the standard: short-term liquidity buffers exist so the bank can meet stressed outflows without fire-selling; chasing carry by migrating down the HQLA quality stack trades resilience for yield — the opposite of sound liquidity risk management principles emphasized by the Basel liquidity principles. A correct answer must connect ratio structure (numerator quality constraints) to the risk-management purpose, citing the LCR framework rather than a slogan definition.",
    keyClaims: [
      {
        claim:
          "LCR = HQLA / net cash outflows over a 30-day stress window (Basel LCR framework).",
        sources: ["S10", "S11"],
      },
      {
        claim:
          "HQLA is tiered (Level 1 vs Level 2); Level 2 eligibility is constrained (caps/haircuts), so Level 1≠Level 2A for LCR resilience.",
        sources: ["S10", "S11"],
      },
      {
        claim:
          "Liquidity buffers exist to survive stressed outflows — yield-seeking that degrades buffer quality conflicts with sound liquidity risk management principles.",
        sources: ["S12", "S10"],
      },
    ],
    synthesisNote:
      "Full credit requires tier/cap reasoning plus purpose of the buffer. Definition-only “LCR is HQLA over outflows” is partial at best.",
    graderNotes: [
      "Full credit: explains LCR structure, Level 1 vs Level 2 constraints, and why carry trade weakens resilience; cites Basel framing.",
      "Partial: defines LCR correctly but treats all HQLA as interchangeable.",
      "Fail: invents fake percentages presented as universal law, or claims Level 2A always improves LCR.",
    ],
    trapAnswers: [
      "“LCR only applies to investment banks” (false framing).",
      "“Level 2A assets are identical to Level 1 for regulatory liquidity” (contradicts tiering).",
      "Invented precise haircut numbers presented as if universal without naming a jurisdiction’s rulebook.",
    ],
  },
  {
    id: "EV-05",
    domain: "Medicine / Clinical epidemiology",
    difficulty: "very-hard",
    disclaimer:
      "Epidemiology reasoning task for AI evaluation only — not medical advice and not a diagnosis protocol.",
    question:
      "A screening test for a rare condition has sensitivity 95% and specificity 95%. In a population where prevalence is 1%, a clinician tells a patient: “Your positive result means there is a 95% chance you have the disease.” Using CDC-style definitions of sensitivity/specificity/predictive value (triangulate with an independent clinical reference), show why this statement is wrong, compute the approximate positive predictive value with a 10,000-person cohort walkthrough, and name the cognitive trap.",
    whyHard:
      "Forces Bayes/prevalence reasoning; models often equate sensitivity with PPV. Requires a worked cohort plus definitions from public-health sources.",
    goldAnswer:
      "Sensitivity is P(positive | disease); specificity is P(negative | no disease). Neither is P(disease | positive) — that is positive predictive value (PPV), which depends on prevalence. Walkthrough for 10,000 people at 1% prevalence: ~100 have disease, ~9,900 do not. Sensitivity 95% → ~95 true positives (and ~5 false negatives). Specificity 95% → false-positive rate 5% → ~495 false positives. PPV ≈ 95 / (95+495) ≈ 16%. So a positive result implies roughly one-in-six probability of disease in this population — not 95%. The clinician committed the classic base-rate / PPV trap: confusing a test’s classification accuracy in diseased/non-diseased groups with the post-test probability after a positive result. CDC teaching materials define these measures separately; clinical references emphasize that predictive values move with prevalence even when sensitivity and specificity are fixed.",
    keyClaims: [
      {
        claim:
          "Sensitivity and specificity are conditional on true disease status; PPV/NPV are conditional on test result and depend on prevalence.",
        sources: ["S13", "S14"],
      },
      {
        claim:
          "With prevalence 1%, sens=spec=95%, cohort math yields PPV ≈ 16%, not 95%.",
        sources: ["S13", "S14", "S15"],
      },
      {
        claim:
          "Equating sensitivity with post-test disease probability is a base-rate / PPV confusion.",
        sources: ["S14", "S13"],
      },
    ],
    synthesisNote:
      "Require the cohort arithmetic (or equivalent Bayes). Verbal “PPV depends on prevalence” without numbers is only partial.",
    graderNotes: [
      "Full credit: correct definitions, ~16% PPV via cohort or Bayes, names the trap; sources aligned.",
      "Partial: says PPV depends on prevalence but computes incorrectly or skips numbers.",
      "Fail: agrees the clinician is right, or swaps sensitivity/specificity definitions.",
    ],
    trapAnswers: [
      "“95% sensitivity means 95% PPV” (the exact trap).",
      "“Specificity is irrelevant after a positive test” (false).",
      "Using 50% prevalence silently to make PPV look like 95%.",
    ],
  },
];
