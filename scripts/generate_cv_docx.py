#!/usr/bin/env python3
"""Generate Mehedi Ashraf Simanto micro1 Evaluation Specialist CV as .docx."""

from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.shared import Inches, Pt, RGBColor


OUT = Path(__file__).resolve().parents[1] / "public" / "Mehedi-Ashraf-Simanto-micro1-CV.docx"
ARTIFACT = Path("/opt/cursor/artifacts") / "Mehedi-Ashraf-Simanto-micro1-CV.docx"


def set_run_font(run, name="Calibri", size=11, bold=False, color=None):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:eastAsia"), name)
    run.font.size = Pt(size)
    run.bold = bold
    if color:
        run.font.color.rgb = color


def add_hr(paragraph):
    p = paragraph._p
    pPr = p.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "12")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "0F6E6A")
    pBdr.append(bottom)
    pPr.append(pBdr)


def heading(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text.upper())
    set_run_font(run, size=12, bold=True, color=RGBColor(0x0F, 0x6E, 0x6A))
    add_hr(p)
    return p


def bullet(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.space_before = Pt(0)
    if bold_prefix:
        r = p.add_run(bold_prefix)
        set_run_font(r, size=10, bold=True)
        r2 = p.add_run(text)
        set_run_font(r2, size=10)
    else:
        r = p.add_run(text)
        set_run_font(r, size=10)
    return p


def main():
    doc = Document()
    for section in doc.sections:
        section.top_margin = Inches(0.6)
        section.bottom_margin = Inches(0.6)
        section.left_margin = Inches(0.7)
        section.right_margin = Inches(0.7)

    # Name
    name = doc.add_paragraph()
    name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    name.paragraph_format.space_after = Pt(2)
    r = name.add_run("Mehedi Ashraf Simanto")
    set_run_font(r, name="Georgia", size=22, bold=True, color=RGBColor(0x10, 0x23, 0x28))

    role = doc.add_paragraph()
    role.alignment = WD_ALIGN_PARAGRAPH.CENTER
    role.paragraph_format.space_after = Pt(2)
    r = role.add_run(
        "Evaluation Specialist / Recent Grad candidate — micro1"
    )
    set_run_font(r, size=11, bold=True, color=RGBColor(0x0A, 0x4F, 0x4C))

    contact = doc.add_paragraph()
    contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    contact.paragraph_format.space_after = Pt(6)
    r = contact.add_run(
        "Dhaka, Bangladesh · Remote-ready  |  msimanto46@gmail.com  |  "
        "mehedi.simanto01@northsouth.edu\n"
        "GitHub: github.com/simanto4321  |  "
        "LinkedIn: linkedin.com/in/mehedi-simanto-1000641a7"
    )
    set_run_font(r, size=9, color=RGBColor(0x5A, 0x6B, 0x70))

    heading(doc, "Summary")
    for text in [
        "CSE graduate from North South University (expected Dec 2026) who builds evaluation-shaped work: original eval cases, multi-step reasoning prompts, rubric scoring, and documented research trails across coding, systems, finance, and clinical epidemiology.",
        "Designs challenging Q&A pairs, triangulates primary sources, scores fluent model-style answers with explicit rubrics, and raises difficulty when probes score ≥4/5 without synthesis — with a logged DRAFT → probe → final item trail. Incorporates reviewer feedback into revisions and keeps gold keys guideline-aligned.",
    ]:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.SINGLE
        r = p.add_run(text)
        set_run_font(r, size=10)

    heading(doc, "Education")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(1)
    r = p.add_run("B.Sc. in Computer Science & Engineering — North South University")
    set_run_font(r, size=10, bold=True)
    p2 = doc.add_paragraph()
    p2.paragraph_format.space_after = Pt(2)
    r = p2.add_run("2021 – Dec 2026 (expected) · Dhaka, Bangladesh")
    set_run_font(r, size=9, color=RGBColor(0x5A, 0x6B, 0x70))
    bullet(
        doc,
        "Coursework in algorithms, AI, software engineering, and systems — applied through production-shaped open-source projects.",
    )
    bullet(
        doc,
        "Independent research habit: flagship repos ship architecture docs, tests, CI, and honest metrics.",
    )

    heading(doc, "Experience")
    p = doc.add_paragraph()
    r = p.add_run("Builder · Evaluator · Sole contributor")
    set_run_font(r, size=10, bold=True)
    r = p.add_run(" — Independent AI / Systems Portfolio")
    set_run_font(r, size=10)
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("2024 – Present")
    set_run_font(r, size=9, color=RGBColor(0x5A, 0x6B, 0x70))
    for b in [
        "Shipped 20+ public repositories: LLM evaluation harnesses, agent workflows, NL→SQL safety, data quality, and LoRA fine-tuning.",
        "Wrote batch eval pipelines with JSONL test cases, pluggable validators, rubric dimensions (accuracy / clarity / helpfulness), and Markdown + JSON reports.",
        "Built multi-agent incident workflows with an evaluation harness scoring triage accuracy, remediation quality, and resolution rate.",
        "Authored a multi-domain Frontier Eval Sample Pack (ML, HTTP, Postgres, Basel LCR finance, diagnostic PPV) with capability probes, difficulty raises, and a two-round reviewer revision trail.",
    ]:
        bullet(doc, b)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    r = p.add_run("Director of Logistics")
    set_run_font(r, size=10, bold=True)
    r = p.add_run(" — ICMA NSU Student Chapter")
    set_run_font(r, size=10)
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    r = p.add_run("Mar 2023 – Present")
    set_run_font(r, size=9, color=RGBColor(0x5A, 0x6B, 0x70))
    bullet(
        doc,
        "Owned event logistics and delivery reliability — planning, coordination, and accountable execution under deadlines.",
    )

    heading(doc, "Selected projects (updated October 2026)")
    projects = [
        (
            "LLM Eval Harness",
            "https://github.com/simanto4321/llm-eval-harness",
            "Batch evaluation package: JSONL cases, category validators, multi-dimension rubric scoring, offline reproducible reports.",
        ),
        (
            "LLM Eval Starter",
            "https://github.com/simanto4321/llm-eval-starter",
            "Mock LLM coding comparison with AST validation, complexity checks, and automated Markdown evaluation reports.",
        ),
        (
            "AgentOps Desk",
            "https://github.com/simanto4321/agentops-desk",
            "Multi-agent incident workflow with human approval gate, deterministic replay, and scenario evaluation harness.",
        ),
        (
            "QueryPilot",
            "https://github.com/simanto4321/querypilot",
            "Safe NL→SQL analytics agent with sqlglot validation, governance guards, and execution traces.",
        ),
        (
            "LLM Fine-Tune (LoRA)",
            "https://github.com/simanto4321/llm-finetune-lora",
            "DistilBERT + LoRA with baseline comparison, reproducibility manifests, and MODEL_CARD.md.",
        ),
        (
            "Contract Intelligence Reviewer",
            "https://github.com/simanto4321/claude-contract-intelligence",
            "Explainable contract-risk rules with reviewer-inspectable rationales (FastAPI + dashboard).",
        ),
    ]
    for title, url, desc in projects:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(title)
        set_run_font(r, size=10, bold=True)
        r = p.add_run(f" — {url}")
        set_run_font(r, size=8, color=RGBColor(0x5A, 0x6B, 0x70))
        bullet(doc, desc)

    heading(doc, "Gaps closed for micro1 fit")
    bullet(doc, "Added finance (Basel LCR) and clinical epidemiology (PPV) items with primary-source triangulation.", "Domain breadth: ")
    bullet(doc, "DRAFT → capability probe → raised finals; scripts/probe-difficulty.py.", "Difficulty iteration: ")
    bullet(doc, "Two-round revision trail with feedback → actions → guideline alignment.", "Reviewer loops: ")

    heading(doc, "Skills")
    bullet(
        doc,
        "Rubric scoring; multi-step synthesis design; source triangulation; multi-domain items; capability probes & difficulty logs; reviewer revision trails; agent scenario harnesses; AST validators",
        "Evaluation: ",
    )
    bullet(
        doc,
        "Python; TypeScript; FastAPI; React; PostgreSQL; LoRA/PEFT; sqlglot; Docker · CI",
        "Technical: ",
    )
    bullet(
        doc,
        "Written precision (English); attention to detail; self-direction; analytical synthesis; guideline adherence",
        "Work style: ",
    )

    heading(doc, "Why micro1")
    for w in [
        "Scope match: original hard Q&A, research with citations, multi-step reasoning, probe-and-raise difficulty, and refine from reviewer feedback.",
        "Domain range beyond coding: finance (Basel LCR) and clinical epidemiology (PPV) beside ML/systems tasks.",
        "Recent grad with reproducible eval tooling (llm-eval-harness) plus documented process discipline — ready for contractor guidelines.",
    ]:
        bullet(doc, w)

    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    r = p.add_run(
        "Work sample: Frontier Eval Sample Pack (multi-domain Q&A, probes, reviewer trail) available with this application package."
    )
    set_run_font(r, size=8, color=RGBColor(0x5A, 0x6B, 0x70))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    ARTIFACT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT)
    doc.save(ARTIFACT)
    # Also save .doc-compatible copy name by duplicating docx (Word opens both);
    # true legacy .doc needs LibreOffice convert.
    print(f"Wrote {OUT}")
    print(f"Wrote {ARTIFACT}")


if __name__ == "__main__":
    main()
