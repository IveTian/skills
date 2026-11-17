---
name: ui-design-craft
description: >-
  Use when designing, implementing, or reviewing visual UI craft: typography,
  spacing, optical alignment, icon/button geometry, dark-mode surfaces,
  sidebars, tables, shadows, and corner radius. Synthesizes Michael Filipiuk's
  inspected design tips; complements ux-design, which covers interaction and
  save flows.
---
# UI design craft

Apply Michael Filipiuk-inspired visual craft without copying a single brand or prescribing one look for every product. This skill addresses how interfaces LOOK and read, not settings information architecture, save behavior, or workflow UX; use `ux-design` for those.

## Evidence and boundaries

Synthesized on 2026-11-17 from a bounded sample of roughly two dozen public posts across 2024–2026, including multi-slide image threads and five inspected videos. Not an exhaustive review of his account or a private course. The linked source index distinguishes images, video, and text. Never claim an unexamined poster/title card demonstrates a rule. Source examples are not universal design tokens.

These are craft heuristics, not usability-test results or accessibility standards. Apply to the actual typeface, audience, density, platform, and existing design system. Existing libraries are fine: deliberately configure them rather than ship their defaults accidentally. Preserve the product's own visual identity.

## Workflow

1. **Inspect before prescribing.** Look at the current screen and its default, hover, selected, focused, disabled, error, loading, and long-content states. Identify the dominant visual problem; do not start by changing colors arbitrarily.
2. **Establish a small system.** Reuse or define semantic type roles, spacing tokens, color roles, radius/shadow tokens, and one coherent icon family. Do not introduce a new value for each component.
3. **Fix hierarchy and grouping first.** Decide what should read first, what belongs together, and where sections break. Reduce competing emphases; use space and backgrounds before adding more borders.
4. **Build bottom-up.** Refine a list item/button/row with its states, then a section, then the whole region. Check the region in context, not just an isolated component.
5. **Run an optical pass.** Inspect visible glyphs rather than only their bounding boxes: icon/text weight, baseline, asymmetric shapes, icon-side inset, resting-state alignment.
6. **Stress real content.** Test long labels, localization, larger system text, dense and empty data, keyboard focus, touch, and narrow screens.
7. **Validate rendered output.** Compare before/after at actual size. Measure accessibility separately. Describe the reason for each change and label any example measurements as examples, not commandments.

## 1. Typography: fewer choices, clear jobs

- Use a short role-based system: headings, labels, body. Share sizes where appropriate; distinguish labels with weight and paragraphs with line-height.
- Regular and Medium are useful starting weights for compact product UI, not an upper limit. Use stronger weights when the face, hierarchy, or audience needs them.
- Avoid a different size and weight for every block. Consolidate nearly identical styles before adding new ones.
- The 2025 type-system thread shows a broader reusable library. The 2026 video reduces one screen to a smaller subset. A token library and the tokens used on one page need not be identical.
- **Observed example, not a required scale:** the fewer-type-sizes video retains 20/14/13 and weights 500/400, removing 28/16/12 and 700/600 in that screen. The transferable lesson is to reduce competing levels, not to make all applications use these numbers.
- Never interpret small labels in a desktop mockup as a mandate for tiny body copy. Check legibility and enlargement, not just screenshot aesthetics.

Sources: [type-system image thread](https://x.com/MichaelFilipiuk/status/1893967866808164532), [verified fewer-sizes video](https://x.com/MichaelFilipiuk/status/2115791791568105887).

## 2. Buttons and icons: optical balance, not equal boxes

For an icon+text button that looks uneven, evaluate in this order:
1. Reduce excess inset on the **icon side**, independently from the text-side inset.
2. Check whether the icon is visually oversized relative to the label.
3. Tighten an unnecessarily loose icon-label gap.
4. Nudge asymmetric glyphs such as a play triangle only when their visible mass looks off-center.

The verified button video demonstrates all four adjustments. It does not establish universal pixel values or require shrinking every icon.

- Match icon stroke's perceived weight to adjacent type. A light label with a heavy icon, or bold label with a hairline icon, can feel mismatched.
- Size, stroke, typeface, and icon family all affect the result; compare actual rendering, not nominal values alone.
- Optical tightening changes visible glyph geometry, not the minimum interactive hit area. Do not make touch targets tiny to achieve a compact appearance.

Sources: [verified button video](https://x.com/MichaelFilipiuk/status/2122314262064546248), [font/icon comparison image](https://x.com/MichaelFilipiuk/status/1805167742125035783), [rare-tips images](https://x.com/MichaelFilipiuk/status/1887446382187061515).

## 3. Spacing: relationships before grids

- Inspect spacing when a layout feels subtly wrong. Equal gaps everywhere flatten grouping; distinguish page inset, component inset, related-item gaps, and section gaps.
- Use a coherent small scale, but do not assume one mandatory spacing scale works for every product. Avoid fake precision without a reason.
- More space is not always better. Dense desktop data and touch-first consumer layouts have different requirements.
- The verified mobile video increases edge insets, list-row height, and several internal/section gaps. It shows that different relationships need different adjustments, not that every gap should increase by the same amount.
- For chat, the author's text-supported tip is to group by turn: smaller gaps inside a message and larger gaps between turns. Its motion example was not inspected, so do not invent its exact parameters.

Sources: [verified mobile-spacing video](https://x.com/MichaelFilipiuk/status/2119417935899111679), [spacing-scale text](https://x.com/MichaelFilipiuk/status/2111439443932700808), [chat-turn text](https://x.com/MichaelFilipiuk/status/2121588227476017624).

## 4. Sidebars: align the resting state

- Build the list item first, including default/hover/selected, then group items into sections.
- Align the repeated unselected labels/icons to a stable axis. Let selection backgrounds surround that axis; do not align everything to the selected pill's outer edge.
- Complex navigation can use sections; simple navigation may need only one list. Icons on every item versus only section headers is a context choice, not a universal rule.
- The verified cleanup video improves inset/alignment, reduces excessive icon emphasis, and replaces hard separators with clearer whitespace grouping. Use the principle, not ambiguous numerical annotations.
- A compact desktop row example is not a comfortable touch target. Adapt density and hit area for the input method.

Sources: [sidebar construction image thread](https://x.com/MichaelFilipiuk/status/1896524509655744751), [alignment images](https://x.com/MichaelFilipiuk/status/1887446382187061515), [verified cleanup video](https://x.com/MichaelFilipiuk/status/2113239967006855524), [sidebar A/B image, no declared winner](https://x.com/MichaelFilipiuk/status/2114343979705860153).

## 5. Color and surfaces: assign jobs

- Prefer a small semantic palette—canvas, surface, border, primary/secondary content, accent, status—to an unassigned pile of swatches. Add roles when a real state needs one.
- Try grouping with shared backgrounds and whitespace instead of outlining every container. Keep borders that communicate useful boundaries, input affordances, or dense data structure.
- In dark mode, reduce unnecessarily harsh **surface relationships**, not text legibility. The verified dark-mode video lightens a pure-black canvas to dark gray while retaining bright text. It is not a demonstration of dimming all text.
- An earlier image tip prefers darker cards on a gray canvas. This is the author's surface treatment, not a universal elevation model; compare against the product's established system.
- Do not confuse restrained colors with missing focus, selected, error, or disabled-state distinctions.

Sources: [cleanup image thread](https://x.com/MichaelFilipiuk/status/1890342392257212573), [verified dark-mode video](https://x.com/MichaelFilipiuk/status/2120866217984737304), [earlier dark-surface images](https://x.com/MichaelFilipiuk/status/1887446382187061515).

## 6. Light, shadows, and radius

- When using dimensional effects, keep a coherent light direction: highlights on the lit edge, shadows away from the light. Avoid conflicting inner highlights and drop shadows.
- Prefer subtle, soft shadows over heavy outlines disguised as shadows; reuse existing shadow tokens where they work. Flat interfaces may need no shadow.
- On short wide controls, evaluate modest rounding versus a full pill. The author critiques an awkward intermediate shape; this is a context-dependent aesthetic judgment, not a ban on medium radii.

Sources: [light/shadow image thread](https://x.com/MichaelFilipiuk/status/1886778413618233500), [cleanup image thread](https://x.com/MichaelFilipiuk/status/1890342392257212573).

## 7. Tables: refine rows and states

- Build repeated rows as components rather than unrelated vertical column stacks. In code, preserve semantic table structure when the content is tabular.
- Prefer a row boundary over a separate divider object in each cell, when a boundary is needed.
- Give cells enough horizontal padding for hover/selection backgrounds; don't judge only the unhighlighted state.
- Left-align text; generally right-align comparable numeric values, especially money. Keep units and formatting consistent.
- Truncate or progressively expand long prose, but provide access to the full content. A hover-only tooltip is not sufficient for touch/keyboard users.
- On mobile consider cards/lists that preserve the important fields. If cross-column comparison is essential, retain an accessible table/scroll alternative rather than forcing cards mechanically.

Source: [table image thread, slides inspected](https://x.com/MichaelFilipiuk/status/1888890604392001834).

## Accessibility guardrails (synthesis, not attributed to the author)

- Optical balance never excuses unreadable text or insufficient text/control contrast. Validate with appropriate accessibility measurements.
- Preserve visible keyboard focus and full keyboard access.
- Keep hit areas appropriate to the platform even if the glyph or visible control looks compact.
- Test text enlargement, long labels, localization, and small screens; don't hardcode heights that clip enlarged text.
- Make selected/error/status information understandable without color alone.
- Preserve semantic labels, reading order, table relationships, and full-text access when simplifying visuals.
- Dark-mode surface softening and lighter font weights require actual legibility checks; neither is automatically better.

## Common mistakes to reject

- Equal numerical icon/text padding mistaken for optical balance.
- A new font size/weight for every block; a heavy icon beside light text.
- All gaps equal, making unrelated groups merge.
- Aligning the whole sidebar to one selected highlight instead of repeated resting labels.
- Borders around everything, or shadows with contradictory light directions.
- Copying this designer's look as the only acceptable taste.
- Promoting example pixel values to universal tokens.
- Treating one before/after video as evidence that all icons must shrink, all fonts must lighten, or all mobile gaps must grow.

## Review checklist

- [ ] Existing product identity retained; small semantic token system used.
- [ ] Clear hierarchy with few competing type styles.
- [ ] Icon weight, optical centering, inset, and gap checked at actual size.
- [ ] Related content grouped; sections clearly separated.
- [ ] Sidebar default/selected axes consistent.
- [ ] Canvas/surface contrast intentional; text and control contrast measured.
- [ ] Shadows and radius coherent, not added by habit.
- [ ] Tables checked in hover/selection, long-content, and mobile states.
- [ ] Keyboard, touch targets, text enlargement, and full content access verified.

When reviewing, return prioritized findings with the visible problem, proposed adjustment, and rationale. When implementing, apply the changes and verify rendered output. Be explicit about anything not inspected. Do not substitute a lecture about style for the requested deliverable.

## Provenance and scope limits

Image evidence includes complete content slides recovered from public reply threads, not just cover cards. Video evidence comprises the button, dark-mode, fewer-type-sizes, mobile-spacing, and sidebar-cleanup clips linked above. Other captions are text-supported only. Older archive years and all inner slides of a color-series title card were not fully recovered; paid ui-principles.com content was not used. These are sourced craft heuristics with separately stated implementation/accessibility safeguards, not an official course, endorsement, or exhaustive catalog.
