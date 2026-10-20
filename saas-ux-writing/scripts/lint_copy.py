#!/usr/bin/env python3
"""Lightweight heuristic linter for SaaS UI copy.

Usage:
  python scripts/lint_copy.py "Initiate deployment process"
  python scripts/lint_copy.py path/to/strings.txt

This intentionally reports review hints rather than hard errors.
"""

from __future__ import annotations

import pathlib
import re
import sys

RULES = [
    (r"\bsuccessfully\b", "Usually redundant in success states."),
    (r"\butili[sz]e\b", "Prefer 'use' unless the distinction matters."),
    (r"\binitiate\b", "Prefer a direct verb such as 'start', 'create', 'run', or 'deploy'."),
    (r"\binvocation\b", "Likely internal Agent terminology; consider 'run' or 'tool call'."),
    (r"\boperation\b", "Often too abstract; name the user action or object."),
    (r"\bperform\b", "Check whether a more specific verb can replace 'perform'."),
    (r"\bfunctionality\b", "Prefer the feature or action name."),
    (r"\bplease\s+(?:click|select|enter|choose|provide)\b", "Usually remove 'please' in compact UI instructions."),
    (r"\bclick here\b", "Use a label that describes the outcome."),
    (r"\bsomething went wrong\b", "Use a specific failure and recovery step when known."),
    (r"\bunknown error\b", "Expose a useful next step even when the cause is unknown."),
    (r"!{2,}", "Avoid excessive exclamation marks in product UI."),
]

AMBIGUOUS_BUTTONS = {"submit", "proceed", "continue", "confirm", "execute"}


def lint(text: str) -> list[str]:
    findings: list[str] = []
    lowered = text.strip().lower()

    for pattern, message in RULES:
        if re.search(pattern, text, flags=re.IGNORECASE):
            findings.append(message)

    if lowered in AMBIGUOUS_BUTTONS:
        findings.append("As a standalone button label, describe the outcome more specifically.")

    words = re.findall(r"\b\w+\b", text)
    if len(words) > 24:
        findings.append("Long for interface copy; check whether this can be split or shortened.")

    return findings


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: lint_copy.py <text or file>")
        return 2

    arg = " ".join(sys.argv[1:])
    path = pathlib.Path(arg)
    text = path.read_text(encoding="utf-8") if path.exists() and path.is_file() else arg

    findings = lint(text)
    if not findings:
        print("No obvious SaaS UX writing issues found.")
        return 0

    for i, finding in enumerate(findings, 1):
        print(f"{i}. {finding}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
