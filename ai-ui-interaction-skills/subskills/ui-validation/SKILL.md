---
name: ui-interaction-validation
description: "Validates implemented UI state-by-state, checking interaction behavior, visibility, form lifecycle, edge states, and screenshot-completeness traps."
---

# Subskill: UI Interaction Validation

## Goal

Validate the implemented UI as a product interaction, not merely as rendered components.

Run after implementation.

---

## Validation method

Validate the UI state-by-state.

Do NOT judge only from the default screenshot.

For every main action:

1. inspect default state
2. trigger the action
3. inspect resulting state
4. test cancel/close/back
5. test submit/confirm
6. inspect loading/success/error behavior where relevant

---

## A. Default-state checks

Ask:

- Is the primary task obvious?
- Is the primary action discoverable?
- Are secondary interactions unnecessarily expanded?
- Are forms hidden until needed?
- Are dialogs/popovers closed initially?
- Is destructive UI hidden initially?
- Does the page feel like a product screen rather than a component demo?

Fail if a create/edit form is visible by default while a separate action exists to initiate that same task, unless explicitly designed as inline creation.

---

## B. Trigger checks

For every visible action:

- Does it do something?
- Does it enter the expected state?
- Does the expected UI appear?
- Is focus/context correct?
- Is there a clear way to leave the state?

Examples:

```text
New -> creation UI appears
Cancel -> creation UI disappears
Edit -> selected record populates edit UI
Delete -> confirmation or undo-safe deletion
Filter -> filter controls become available
```

---

## C. Visibility checks

Create a visibility matrix:

| UI | idle | creating | editing | confirming delete |
|---|---:|---:|---:|---:|
| Create form | no | yes | no | no |
| Edit form | no | no | yes | no |
| Delete confirm | no | no | no | yes |

Verify implementation matches the intended state model.

---

## D. Form checks

Creation/edit forms must validate:

- fields are usable
- initial values are correct
- validation appears at the right time
- submit has loading state
- double submit is prevented
- success updates the parent state
- error does not silently discard data
- cancel behavior is correct
- reset/close happens at appropriate time

---

## E. Modal / Sheet checks

If using modal/sheet:

- closed initially
- opens only from correct trigger
- title matches task
- primary and secondary actions are clear
- close/cancel works
- submit works
- background context is preserved appropriately
- no duplicate form exists behind it
- focus is trapped/restored when framework supports it
- escape/outside click behavior matches destructive-data-loss risk

---

## F. CRUD checks

### Create
- Default page does not expose create form unless inline creation is intentional.
- `New` opens create flow.
- successful creation updates list/view.

### Edit
- Edit requires selecting a target.
- existing values populate.
- cancel does not mutate.
- save updates correct target.

### Delete
- delete applies to correct target.
- confirmation/undo matches consequence.
- deleted item leaves UI consistently.

---

## G. Edge-state checks

Validate where applicable:

- loading
- empty
- error
- permission denied
- unavailable action
- disabled submit
- network retry
- success

Do not invent all states for every tiny UI, but include states required by the actual workflow.

---

## H. Screenshot-completeness trap

Explicitly test for this failure:

> Did the implementation make hidden/task-specific UI permanently visible merely so all requested elements appear in the default render?

If yes: FAIL.

---

## I. Behavioral completeness score

Score each 0–2:

- interaction model fidelity
- default-state clarity
- progressive disclosure
- action behavior
- state transitions
- form lifecycle
- edge states
- accessibility basics
- responsive behavior
- destructive-action safety

Interpretation:

- 18–20: PASS
- 14–17: PASS WITH ISSUES
- 0–13: FAIL

Any hard-failure condition from the root skill overrides numeric score.

---

## Required validation output

Use:

```text
Result: PASS | PASS WITH ISSUES | FAIL

Interaction model:
- ...

Issues:
- ...

Required fixes:
- ...

Verified flows:
- ...
```

If result is FAIL, implementation is not complete until fixes are applied and validation is rerun.
