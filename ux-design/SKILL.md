---
name: ux-design
description: >-
  Use when designing or reviewing product UX — especially settings, forms,
  preferences, empty states, or save/confirm flows — or when an agent-built UI
  dumps inputs with a bottom Save button. Teaches Linear/Plane-inspired
  interaction philosophy from live product observation, not visual styling.
metadata:
  author: Patrick Tien
  version: "1.0.0"
---
# UX design (Linear / Plane–inspired)

Teach **interaction philosophy**, not CSS or visual polish. Apply before shipping settings, forms, preferences, empty states, or any screen that collects configuration.

Grounded in **live product observation** of Linear (`linear.app`) and Plane (`app.plane.so`) settings, plus their public Method / Manifesto writing. Prefer live patterns below when they conflict with secondary writeups.

## North-star principles

1. **Opinionated defaults, then preferences** — Ship one really good path. Settings are for taste, edges, and education — not to paper over weak defaults.
2. **Simple first, then powerful** — Value before configuration tax. Don’t force day-one modeling.
3. **Config close to work** — Scope settings: personal / workspace / team / project. Project-only knobs live next to the project.
4. **Clarity over jargon** — Name objects what users already call them.
5. **Keyboard and mouse both first-class** — Command palette, shortcut entry to settings, contextual menus with shortcut hints.

## Primary anti-pattern (reject this)

**One long page of every input + selects + toggles + destructive actions, with a single Save at the bottom.**

It conflates save semantics, kills progressive disclosure, dumps unresolved product decisions into settings, and creates admin busywork before value.

Neither Linear nor Plane does this in settings.

## Typed save model (verified live)

Pick the commit model by **control type**. Never one footer Save that mixes them.

| Control type | Pattern | Live evidence |
|---|---|---|
| Independent toggle / single preference | **Save immediately on change**. Quiet feedback optional. **No footer Save.** | **Plane:** feature switches toast `Updating project feature…` → `Success! Project feature updated successfully.` (also `Enabling/Disabling …` for sub-toggles). **Linear:** preference toggles (e.g. Underline links) commit instantly with **no toast and no Save button**; reload keeps the value. |
| Single text field (title, description, name) | Prefer **commit on blur** (or per-field autosave) with a short status toast — not a page-level Save. | **Linear:** Profile title → toast `Profile updated`; workspace name → `Workspace name updated`; team description → `Team description updated`. No visible Save/Update even when dirty. |
| Multi-field identity that must stay consistent as one unit | Dirty-tracking; primary action **disabled until dirty**; explicit submit; toast on success. Reverting the edit without submit re-disables the button. | **Plane:** Workspace General and Project General — `Update workspace` / `Update project` stay disabled until a field changes; on click, button empties/disables while toast `Workspace updated successfully`. |
| Revealed sub-form after enabling a feature | Own **Discard / Save** (or equivalent) scoped to that sub-form — not the page footer. | **Plane:** Enabling Auto-schedule cycles reveals Cycle Title, Duration, Cooldown, start day, future cycles, auto-rollover + Discard/Save. |
| Destructive / irreversible | Name the object and consequence; raise the friction with the risk (type-to-confirm, email code, soft-delete window). | **Plane:** Delete project = alertdialog + type project name; Archive = confirm without type-to-confirm. **Linear:** Delete workspace emails a verification code + acknowledgement checkbox before Delete enables; team delete copy mentions a restoration window. |
| Reversible mutations | Prefer Undo / soft-delete windows over confirm spam when the product supports it. | Linear Method / changelogs emphasize undo; treat as product-level, not every settings toast (Linear save toasts had **no Undo**). |

### How this kills the anti-pattern

- Toggles never wait for a bottom Save.
- Text fields don’t share a Save with unrelated toggles.
- Atomic multi-field units (name + slug + timezone) get one explicit Update — only when dirty.
- Destructive actions never share that Update button.

## Settings IA & progressive disclosure (verified live)

**Both products**
- Left **settings sidebar** + right pane; each concern is its **own URL**, not one mega scroll.
- Grouped sections (Administration / Features / Personal / …).
- Plan/role gates inline (“Upgrade”, “Available on Business”) without hiding the existence of the feature entirely when education matters.

**Plane (live)**
- Workspace settings vs **project settings** (project settings live under the project; General / Features / Work structure / Execution).
- Feature pages: enable switch first; some sub-controls appear only after enable (Auto-schedule).
- Empty states: short why-empty copy + primary CTA (`No estimates yet` → Add estimate system; `No Webhook added yet` → Add webhook).

**Linear (live)**
- Personal / Issues / Projects / Features / Integrations / Administration / Your teams.
- **Summary → drill-in**: team hub lists General, Members, workflow, triage, cycles as links; chevron rows open child URLs. Row lists often hold the toggle/select inline.
- Nav **search** filters settings in place.
- Progressive: e.g. Priority inbox off → priority notification types don’t open; on → drill-in with type checkboxes.
- Customize sidebar is a **modal** exception; settings trees stay pages.

## Surfaces

- **Settings = pages** (sidebar IA). Don’t bury entire settings trees in modals.
- **Quick customize / pickers** may be modal or command menu.
- Empty states: why empty + one clear primary CTA (+ optional secondary).
- Density: scannable label + control rows; avoid one-field-per-viewport for settings lists.
- Onboarding gates Continue until the **minimum** field is filled (Plane: name required, password optional; role/intent steps offer Skip).

## Pre-ship checklist

**IA**
- [ ] Scoped sections; one concern per page/URL
- [ ] Permission / plan / feature gating explained when locked
- [ ] Entity-local config lives next to that entity

**Defaults & disclosure**
- [ ] Strong defaults; user can work before configuring
- [ ] Primary controls visible; advanced behind enablement or drill-in
- [ ] Preferences reserved for taste, not weak product decisions

**Save model**
- [ ] Toggles autosave on change
- [ ] Single fields: blur/autosave **or** dirty Update for true multi-field atoms — pick one model per control type
- [ ] No mixed mega-Save at the bottom of a dump of inputs
- [ ] Destructive never shares the Update button

**Feedback & safety**
- [ ] Quiet success/error (toast near action, or silent commit like Linear toggles)
- [ ] Destructive friction matches irreversibility (type name / email code / soft-delete)
- [ ] Prefer Undo for reversible ops when the product supports it

**Keyboard & empty**
- [ ] Full keyboard reach; shortcut to open settings when relevant
- [ ] Empty state with CTA

**Education**
- [ ] Tip or purpose copy on non-obvious settings

## Review prompt (when auditing an existing UI)

1. What is the **scope** of this screen? Does it mix scopes?
2. Which controls should **autosave** vs need an atomic submit vs commit on blur?
3. What is hidden until a prerequisite is on?
4. Can the user get value with **zero** of these settings changed?
5. Are we using settings to avoid making a product opinion?
6. Does destructive friction match irreversibility?
7. Is the empty/error state a guided next step?
8. Would this screen still make sense if we removed the bottom Save?

## Out of scope

Do not prescribe colors, typography, border radii, or component libraries. Visual craft is separate; this skill is interaction and information architecture only.

## Source anchors

**Live (primary for interaction claims)**
- Plane cloud workspace settings + project settings (observed in-product)
- Linear workspace settings + account preferences (observed in-product)

**Official writing (philosophy)**
- https://linear.app/method/introduction
- https://linear.app/now/settings-are-not-a-design-failure
- https://plane.so/manifesto
- https://plane.so/operating-manual
- https://docs.plane.so/projects/project-settings
