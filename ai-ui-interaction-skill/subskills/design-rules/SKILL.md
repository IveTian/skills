# Subskill: Product UI Design Rules

## Goal

Apply product-design constraints after the interaction model is defined.

This subskill exists to prevent "AI dashboard syndrome":
- everything visible
- too many cards
- repeated headings
- forms always expanded
- action buttons with no hierarchy
- settings exposed prematurely
- controls added because they were mentioned in the prompt

---

## Rule 1: Progressive disclosure by default

Only show information or controls when they are relevant to the current task.

Ask:

1. Is this necessary in the default state?
2. Is this used frequently?
3. Does it compete with the primary task?
4. Can it be revealed after user intent?

If it is secondary, hide it behind an appropriate interaction.

---

## Rule 2: One clear primary action per region

For a management page, common hierarchy:

- Primary: New / Create / Add
- Secondary: Filter, Import, Export
- Contextual: Edit, Duplicate, Archive, Delete

Do not render every possible action as equal-weight buttons.

---

## Rule 3: Action location must match object scope

Page-level actions:
- top toolbar/header

Row/item actions:
- row action
- contextual menu
- item detail area

Form actions:
- form footer
- dialog footer
- sticky footer when needed

Do not put item-specific actions in a global toolbar unless selection state justifies it.

---

## Rule 4: Avoid duplicate interaction surfaces

Bad:
- `New` button
- always-visible create form
- plus another create modal

Choose one primary creation flow.

---

## Rule 5: Preserve context intentionally

Choose dialog/sheet/page based on context requirements.

Use modal when interruption is short.

Use sheet when:
- content is longer
- page context matters
- user may inspect underlying content

Use route when:
- task is complex
- navigation/history/deep link matters

---

## Rule 6: Default state should be calm

The first render should not show:
- validation errors
- modal dialogs
- destructive confirmation
- expanded advanced settings
- empty disabled forms
- arbitrary onboarding overlays

unless product state explicitly requires them.

---

## Rule 7: Forms are task surfaces, not decorations

A form should appear because the user is:
- creating
- editing
- configuring
- searching/filtering

A form should not appear just because "form" is mentioned in the requirement.

---

## Rule 8: Hidden states still count as implemented

Do not expose a component merely so that:
- a screenshot can prove it exists
- an evaluator can visually see it
- the requirement list appears complete

Behavioral completeness > visual simultaneous completeness.

---

## Rule 9: Design empty states around the next action

When no data exists:
- explain what is missing
- expose the most relevant next action
- do not duplicate a large permanent creation form unless inline creation is the product pattern

Example:

```text
No projects yet.
Create your first project to get started.

[New project]
```

Then open the creation flow.

---

## Rule 10: Loading, submitting, success and errors are UI

Implementation is incomplete if only the happy static state exists.

For forms:
- prevent duplicate submit
- show progress
- preserve input on recoverable error
- show field errors near fields
- close/reset only on success where appropriate

For modal forms:
- Cancel closes
- close behavior is intentional
- dirty-state handling is considered when loss is meaningful

---

## Rule 11: Destructive actions require friction proportional to consequence

Possible patterns:
- confirmation dialog
- typed confirmation for highly destructive actions
- undo snackbar for reversible deletion

Do not over-confirm trivial actions.

---

## Rule 12: Responsive behavior must preserve interaction hierarchy

On smaller screens:
- dialog may become sheet/full-screen
- dense toolbars may collapse into overflow
- inline panels may stack
- primary action must remain discoverable

Do not simply shrink desktop UI.

---

## CRUD default patterns

### Collection page

Default:

```text
Header
  Title
  Primary action: New
  Optional compact secondary controls

Collection content
  Table/List/Grid
```

Creation form:
- hidden until `New`

Editing:
- hidden until selected

Deletion:
- contextual action + confirmation/undo

### Settings page

Default:
- settings may be directly editable if the page itself is the task

Do not unnecessarily put every setting into modals.

### Search/filter page

High-frequency 1–3 filters:
- may remain visible

Large filter system:
- trigger + popover/sheet/panel

---

## Anti-pattern detector

Flag implementation if it contains patterns such as:

```tsx
<Button>New</Button>
<CreateForm />
<Table />
```

without a strong reason.

Also flag:
- form rendered both inline and in dialog
- `open={true}` on dialogs in normal page state
- action buttons without `onClick`, navigation, submit, or state effect
- edit controls rendered for no selected item
- permanent destructive confirmation UI
