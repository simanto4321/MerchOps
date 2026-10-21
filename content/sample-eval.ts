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
};

export const sampleEvalMeta = {
  title: "Frontier Eval Sample Pack",
  subtitle:
    "Original multi-step items with source triangulation — written for the micro1 Evaluation Specialist scope",
  authored: "Mehedi Ashraf Simanto",
  date: "October 2026",
  method: [
    "Draft a question that cannot be answered from a single FAQ-style page.",
    "Pull 3+ independent sources; prefer primary docs, standards, or peer-reviewed summaries.",
    "Write a gold answer that synthesizes — then map each key claim to citations.",
    "List trap answers models commonly invent; define grader notes for partial credit.",
    "Raise difficulty if a strong model would pass with shallow recall alone.",
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
];
