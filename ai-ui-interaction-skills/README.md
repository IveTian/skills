# AI UI Interaction Skill

A reusable skill package for Coding Agents that prevents static, "everything-visible" UI generation.

## Structure

```text
ai-ui-interaction-skill/
├── SKILL.md
├── templates/
│   └── interaction-contract.md
└── subskills/
    ├── interaction-planning/
    │   └── SKILL.md
    ├── design-rules/
    │   └── SKILL.md
    └── ui-validation/
        └── SKILL.md
```

## Recommended invocation

Use the root `SKILL.md` for every UI implementation task.

The root skill forces this sequence:

```text
requirements
→ interaction planning
→ design rules
→ implementation
→ UI validation
→ fix if needed
```

## Core philosophy

The coding agent must not generate:

```text
Requirement → Component Tree
```

It should generate:

```text
Requirement
→ User Intent
→ Action
→ State Transition
→ Visibility
→ Presentation Mode
→ Component Tree
```

This specifically addresses common AI-generated UI failures such as:
- create forms permanently visible beside a `New` button
- edit forms shown before an item is selected
- filters always expanded
- dead buttons
- modal content duplicated inline
- all controls exposed at once
- screenshot-driven "visual completeness"
