# Mehedi Ashraf Simanto — micro1 Evaluation Specialist CV

Application package for **micro1 · Evaluation Specialist / Recent Grad**: interactive CV, selected GitHub projects reframed for October 2026, and a Frontier Eval Sample Pack with source triangulation.

## Run locally

```bash
npm install
npm run dev -- --port 4321 --hostname 127.0.0.1
```

Open [http://127.0.0.1:4321](http://127.0.0.1:4321).

| Route | Contents |
|-------|----------|
| `/` | Tailored CV overview |
| `/projects` | Six selected repos + Oct 2026 updates |
| `/sample-eval` | Multi-domain Q&A + difficulty probes + reviewer trail |
| `/print` | Print / Save as PDF |

Plain-text CV: [`public/Mehedi-Ashraf-Simanto-micro1-CV.md`](public/Mehedi-Ashraf-Simanto-micro1-CV.md)

Difficulty probe (no API key):

```bash
python3 scripts/probe-difficulty.py
```

## Project selection

Chosen for eval signal (not generic full-stack demos):

1. [llm-eval-harness](https://github.com/simanto4321/llm-eval-harness)
2. [llm-eval-starter](https://github.com/simanto4321/llm-eval-starter)
3. [agentops-desk](https://github.com/simanto4321/agentops-desk)
4. [querypilot](https://github.com/simanto4321/querypilot)
5. [llm-finetune-lora](https://github.com/simanto4321/llm-finetune-lora)
6. [claude-contract-intelligence](https://github.com/simanto4321/claude-contract-intelligence)

Narratives live in `content/projects.ts` and were updated for the present frontier-eval context while linking to the real GitHub artifacts.

## Stack

Next.js · TypeScript · Tailwind CSS · Framer Motion
