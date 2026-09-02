---
name: ai-ui-interaction-guard
description: "Prevents AI coding agents from flattening interactive product flows into static pages by enforcing interaction planning, product UI rules, and post-implementation validation."
---

# AI UI Interaction Design Guard

## Purpose

This skill prevents AI coding agents from flattening interactive product flows into static pages.

The core rule is:

> Do not translate requirements directly into a component tree.  
> First derive user intent, actions, UI states, transitions, visibility, and presentation mode.

This skill should be invoked for any task involving:
- creating or editing UI
- CRUD pages
- forms
- tables
- dashboards
- settings
- filters
- menus
- onboarding
- dialogs, sheets, drawers, popovers
- multi-step flows
- empty/loading/error states
- responsive interaction

## Required workflow

Always execute these subskills in order:

1. `subskills/interaction-planning/SKILL.md`
   - derive interaction model before implementation
   - decide what is visible by default
   - decide which controls open modal/sheet/popover/etc.
   - define state transitions

2. `subskills/design-rules/SKILL.md`
   - apply product UI rules
   - enforce progressive disclosure
   - avoid "everything visible at once"
   - select the correct presentation primitive

3. Implement the UI.

4. `subskills/ui-validation/SKILL.md`
   - inspect final implementation
   - validate behavior, state, visibility, hierarchy, and interaction
   - reject superficially complete but behaviorally incorrect UI

Do not skip step 1 even if the requested UI appears simple.

---

## Global principles

### 1. Interaction model before component tree

Never start from:

```text
Requirement -> Components
```

Use:

```text
User intent
-> action
-> state transition
-> UI state
-> presentation
-> component tree
```

### 2. Mentioned UI does not imply default visibility

If a requirement mentions:
- create form
- edit form
- filters
- advanced settings
- destructive action
- details
- secondary options

do NOT assume these should be permanently visible.

Determine whether they should appear:
- inline
- modal/dialog
- drawer/sheet
- popover
- dropdown/menu
- disclosure/accordion
- dedicated page
- contextual panel

### 3. Buttons must cause meaningful transitions

A visible action control must not exist merely as decoration.

Examples:
- `New` -> opens creation flow
- `Edit` -> enters edit state
- `Delete` -> opens confirmation
- `Filter` -> reveals filter controls
- `More` -> opens contextual menu
- `Save` -> submits, shows progress, success/error feedback

### 4. Optimize for product behavior, not screenshot completeness

Do not expose hidden states just to make every requirement visible in a screenshot.

A correct default-state screenshot may intentionally omit:
- forms
- confirmations
- advanced settings
- contextual actions
- dropdown contents
- modal contents

### 5. Prefer progressive disclosure

Keep the default page focused on:
- current task
- primary information
- primary action
- necessary navigation

Reveal secondary or task-specific UI after user intent is expressed.

---

## Hard failure conditions

The implementation must be considered incorrect if any of these occur without explicit product justification:

- A create form is permanently shown beside a `New` or `Create` button.
- An edit form is visible before selecting an item to edit.
- A `Delete` action immediately deletes without confirmation when the action is destructive and non-trivial.
- A button has no meaningful interaction.
- Modal content is duplicated inline on the page.
- All filter controls are permanently expanded despite a compact filter trigger.
- Advanced configuration is mixed into the primary flow by default.
- Empty/loading/error/success states are absent when the flow requires them.
- Interactive elements are implemented only visually and have no state transitions.
- The implementation satisfies the noun list in the prompt but not the implied user flow.

---

## Output expected before coding

Before implementation, produce or internally derive an Interaction Contract using:

`templates/interaction-contract.md`

For simple tasks this can be terse, but it must exist conceptually.

---

## Output expected after coding

Run the UI validation subskill and produce one of:

- `PASS`
- `PASS WITH ISSUES`
- `FAIL`

If `FAIL`, fix the UI before considering the task complete.
