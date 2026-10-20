# saas-ux-writing

An Agent Skill for modern SaaS, developer-tool, and AI-agent UX writing.

## Contents

- `SKILL.md` — core instructions loaded when the skill activates
- `references/product-language-benchmarks.md` — research notes from Linear, Vercel, Stripe, GitHub, and Slack
- `references/patterns.md` — reusable UI copy patterns
- `references/terminology.md` — vocabulary and Agent/DevTool terminology guardrails
- `scripts/lint_copy.py` — optional heuristic copy linter

## Install

Place the `saas-ux-writing` directory in a skills-compatible location for your agent/client. The folder name must remain `saas-ux-writing` because the Agent Skills specification requires the directory name to match the `name` field in `SKILL.md`.

Examples of supported clients may use repository-level or user-level skill directories. Follow the client's current Agent Skills documentation.
