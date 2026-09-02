---
name: interaction-planning
description: "Derives user intents, actions, UI states, transitions, visibility rules, and presentation modes before UI implementation."
---

# Subskill: Interaction Planning

## Goal

Convert product requirements into an explicit interaction model before writing UI code.

The purpose is to prevent the coding agent from treating every noun in the requirement as something that must be visible on the default screen.

---

## Step 1: Extract user intents

Identify what the user is trying to do.

Examples:
- browse records
- create a record
- edit a record
- inspect details
- delete a record
- filter results
- change settings
- perform a bulk action

Do not start by listing components.

Bad:

```text
Page needs:
- button
- form
- table
```

Good:

```text
User can:
- browse records
- start creating a record
- submit creation
- cancel creation
```

---

## Step 2: Identify actions

For each intent, identify the initiating action.

Example:

| Intent | Trigger |
|---|---|
| Create item | `New` button |
| Edit item | row action / Edit |
| Delete item | row action / Delete |
| Filter | Filter button |
| View details | row click / Details |

Every important trigger should map to a visible state transition.

---

## Step 3: Define UI states

At minimum, consider:

- idle/default
- loading
- empty
- active interaction state
- submitting
- success
- error

For CRUD flows also consider:

- creating
- editing(itemId)
- confirmingDelete(itemId)
- viewingDetails(itemId)

Do not create unnecessary states, but do not collapse meaningful interaction into one static layout.

---

## Step 4: Define transitions

Express the flow as transitions.

Example:

```text
idle
  -- New.click -->
creating

creating
  -- Cancel.click -->
idle

creating
  -- Submit -->
submitting

submitting
  -- success -->
idle

submitting
  -- error -->
creating + error
```

If a control exists but no transition can be written for it, the interaction is underspecified.

---

## Step 5: Decide visibility

For each UI region, define when it should be visible.

Example:

```yaml
createForm:
  visible_when:
    - creating
    - submitting

createButton:
  visible_when:
    - idle

deleteConfirmation:
  visible_when:
    - confirmingDelete
```

Default visibility must be intentional.

Use this question:

> Does the user need this element before they express intent to use it?

If no, prefer hidden/on-demand presentation.

---

## Step 6: Choose presentation mode

Choose the smallest appropriate interaction surface.

### Inline

Use when:
- interaction is central to the page
- content must remain continuously visible
- editing is lightweight
- surrounding context is essential

### Modal / Dialog

Use when:
- task is short and focused
- user should temporarily leave the browsing context
- create/edit action is secondary to the main page
- form can be completed without navigating elsewhere

Common:
- create record
- edit small/medium record
- confirm destructive action

### Drawer / Sheet

Use when:
- form/details are medium complexity
- retaining page context is valuable
- side-by-side context helps
- details may be longer than a dialog

### Popover

Use when:
- interaction is lightweight
- it belongs to a specific trigger
- options are compact

Common:
- quick filters
- date selection
- small configuration

### Dropdown / Menu

Use for:
- contextual commands
- secondary actions
- overflow actions

### Disclosure / Accordion

Use for:
- optional advanced settings
- grouped secondary configuration

### Dedicated page

Use when:
- task is complex
- user may spend substantial time
- deep linking matters
- there are many sections
- the form is itself a primary workflow

---

## Heuristic rules

### New/Create

If the page's primary purpose is browsing/managing records and there is a `New` or `Create` button:

Default assumption:
- form is hidden
- clicking the action opens modal/sheet/dedicated route

Do NOT render the form inline by default unless requirements clearly ask for inline creation.

### Edit

Do not show an edit form until an item is selected.

### Delete

Use confirmation for destructive actions unless:
- undo is immediate and reliable
- deletion is trivial/reversible
- product requirements explicitly say otherwise

### Filters

Prefer:
- compact visible filters when they are frequently used and few in number
- trigger + popover/sheet when filters are many or secondary

### Advanced settings

Hide behind:
- disclosure
- secondary section
- dedicated settings area

---

## Required pre-code artifact

Before coding, generate this compact interaction contract:

```yaml
page_goal:
primary_user_intents:

states:

actions:

transitions:

visibility:

presentation_decisions:

edge_states:
  loading:
  empty:
  error:
  success:
```

This may remain internal, but implementation must follow it.
