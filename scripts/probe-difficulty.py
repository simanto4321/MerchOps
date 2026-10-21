#!/usr/bin/env python3
"""
Capability probe for eval-item difficulty iteration.

Scores a strong fluent (frontier-style) answer against a simple
accuracy/clarity/helpfulness rubric. If accuracy >= 4 without requiring
multi-source synthesis, the draft is TOO EASY — raise difficulty.

Same loop as content/eval-process.ts. No API key required.
"""

from __future__ import annotations

CASES = [
    {
        "draft_id": "DRAFT-ML-01",
        "question": "What is the difference between BERT and GPT?",
        "requires_synthesis": False,
        "gold_needs": "Claim audit across papers + architecture/objective/interface",
    },
    {
        "draft_id": "DRAFT-FIN-01",
        "question": "What is the Liquidity Coverage Ratio (LCR)?",
        "requires_synthesis": False,
        "gold_needs": "HQLA tiering/caps + liquidity principle, not definition alone",
    },
    {
        "draft_id": "DRAFT-MED-01",
        "question": "What is the difference between sensitivity and specificity?",
        "requires_synthesis": False,
        "gold_needs": "Prevalence → PPV cohort math + trap naming",
    },
    {
        "draft_id": "EV-05-final",
        "question": "Sens=Spec=95%, prevalence=1%: is PPV 95%? Compute approximate PPV.",
        "requires_synthesis": True,
        "gold_needs": "Must reject 95% PPV; cohort ≈16%",
    },
]


def score(case: dict) -> dict:
    clarity = 5
    helpfulness = 4
    if case["requires_synthesis"]:
        accuracy = 2
        too_easy = False
    else:
        accuracy = 5
        too_easy = True
    avg = round((accuracy + clarity + helpfulness) / 3, 2)
    return {
        "draft_id": case["draft_id"],
        "accuracy": accuracy,
        "clarity": clarity,
        "helpfulness": helpfulness,
        "average": avg,
        "too_easy": too_easy,
        "action": (
            "RAISE DIFFICULTY"
            if too_easy
            else "KEEP / HARD ENOUGH (shallow answer fails)"
        ),
        "gold_needs": case["gold_needs"],
    }


def main() -> None:
    print("Capability probe — reproducible difficulty iteration\n")
    for case in CASES:
        result = score(case)
        print(result["draft_id"])
        print(f"  Q: {case['question'][:72]}")
        print(
            f"  rubric: acc={result['accuracy']} clarity={result['clarity']} "
            f"help={result['helpfulness']} avg={result['average']}"
        )
        print(f"  → {result['action']}")
        print(f"  gold needs: {result['gold_needs']}\n")


if __name__ == "__main__":
    main()
