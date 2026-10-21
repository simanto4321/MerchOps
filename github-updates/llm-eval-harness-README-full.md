# LLM Response Evaluation Harness

![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![CI](https://github.com/simanto4321/llm-eval-harness/actions/workflows/ci.yml/badge.svg)

Installable batch evaluation package and CLI for LLM-style responses.

Loads JSONL test cases, runs pluggable category checks, applies rubric scoring, aggregates per-model stats, and writes Markdown + JSON reports. Offline scoring works with no API keys.

Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Demo

![CLI score run](docs/assets/cli-score.png)

![Architecture overview](docs/assets/architecture.png)


**Author:** Mehedi Ashraf Simanto

## Features

- Installable package (`llm-eval-harness`) with console script `llm-eval`
- Offline scoring over `data/test_cases.jsonl` (coding, reasoning, formatting)
- Pluggable checks registry (`coding`, `reasoning`, `formatting`, plus custom)
- Provider adapters: `MockProvider` and OpenAI-compatible stub (optional dependency / key)
- Rubric dimensions: accuracy, clarity, helpfulness (1–5)
- Per-model aggregation and winner selection

## Install

```bash
git clone https://github.com/simanto4321/llm-eval-harness.git
cd llm-eval-harness
pip install -e ".[dev]"
```

Core scoring needs no third-party packages. Optional live calls:

```bash
pip install -e ".[openai]"
```

## CLI

Score a dataset and write reports:

```bash
llm-eval score --dataset data/test_cases.jsonl --out-dir reports
```

Outputs:

- `reports/evaluation_report.md`
- `reports/results.json`

## Project structure

```
llm-eval-harness/
â”œâ”€â”€ src/llm_eval_harness/
â”‚   â”œâ”€â”€ loaders.py
â”‚   â”œâ”€â”€ checks.py
â”‚   â”œâ”€â”€ scoring.py
â”‚   â”œâ”€â”€ reports.py
â”‚   â”œâ”€â”€ providers.py
â”‚   â””â”€â”€ cli.py
â”œâ”€â”€ data/test_cases.jsonl
â”œâ”€â”€ examples/
â”œâ”€â”€ tests/
â”œâ”€â”€ pyproject.toml
â””â”€â”€ eval_harness.py          # thin backward-compatible wrapper
```

## Examples

See `examples/offline_score.yaml` and:

```bat
examples\run_offline.bat
```

## Tests

```bash
pytest
```

## Add a test case

Add one JSON object per line to `data/test_cases.jsonl`:

```json
{"id": "my_case", "category": "coding", "prompt": "...", "response": "...", "model": "Model_X", "expect_pass": true}
```

Categories: `coding`, `reasoning`, `formatting`

## Providers

```python
from llm_eval_harness.providers import MockProvider, OpenAICompatibleProvider

mock = MockProvider(canned={"ping": "pong"})
# OpenAICompatibleProvider needs OPENAI_API_KEY (and optional openai extra)
```

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Mehedi Ashraf Simanto.



## Oct 2026 — Evaluation Specialist framing

Reframed for frontier-eval practice: author hard prompts, encode gold expectations, run pluggable checks, score accuracy/clarity/helpfulness (1–5), emit reviewer-ready Markdown + JSON reports, and raise difficulty when models saturate easy items. Built by Mehedi Ashraf Simanto for roles like micro1 Evaluation Specialist.
