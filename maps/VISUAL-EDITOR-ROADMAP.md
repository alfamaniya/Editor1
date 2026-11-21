<!-- #VISUAL-EDITOR-ROADMAP.md: فایل VISUAL EDITOR ROADMAP مربوط به بخش maps پروژه -->
# Visual Editor Completion Roadmap

**Created:** 19 November 2026  
**Status:** Planned — implementation has not started for this roadmap  
**Scope:** Visual Editor UI redesign, complete setting categories, interaction model, CSS integrity, and verification.  
**Engine constraint:** Do not modify `alfacode/src/` as part of this work unless explicitly authorized.

## Goal
Turn Visual Editor into a polished, capable visual styling tool: select an element in Preview, adjust its appearance through organized controls, preview changes, and commit safely without losing existing CSS.

## Stage A — Visual UI/UX redesign
- [x] Redesign the Visual Editor panel to match Editor1's professional, restrained UI style; latest layout uses one right-side panel with Elements/Settings modes.
- [x] Improve element-selection affordances: selection button, preview hover, element label, and selector path display. Clear/deselect refinements remain pending.
- [x] Establish initial consistent button, icon, input, spacing, and panel styling. Tooltip/control refinements remain pending.
- [ ] Improve contextual settings navigation and panel hierarchy.
- [x] Keep the redesigned interface compact, readable, responsive, and internally scrollable.

## Stage B — Complete primary setting categories
### Color
- [ ] Background and text colors
- [ ] Border color
- [ ] HEX/RGB(A) input and transparency
- [ ] Color swatches/palette
- [ ] Gradient controls (later enhancement)

### Border
- [ ] Linked/unlinked four-side controls
- [ ] Per-side width, style, and color
- [ ] Independent corner radius controls

### Size
- [ ] Width/height and min/max constraints
- [ ] Units: px, %, rem, em, vw, vh
- [ ] Auto, fill, fit-content options
- [ ] Aspect-ratio lock

### Shadow
- [ ] Presets
- [ ] Outer/inner shadow
- [ ] X/Y offset, blur, spread, color, opacity
- [ ] Support multiple shadows where feasible

### Spacing
- [ ] Visual box-model view
- [ ] Margin and padding per side
- [ ] Link/unlink values
- [ ] Unit support and editable values

### Typography
- [ ] Font family, size, weight, italic
- [ ] Color, line height, letter spacing
- [ ] Alignment, decoration, text transform
- [ ] Overflow/wrapping controls where relevant

## Stage C — Advanced layout and effects
- [ ] Layout: display, overflow, z-index
- [ ] Flex: direction, alignment, justify, wrap, gap
- [ ] Grid: rows, columns, gap
- [ ] Position: static/relative/absolute/fixed/sticky and offsets
- [ ] Effects: opacity, blur, grayscale, brightness, saturation
- [ ] Transform: rotate, scale, translate, skew
- [ ] Transition controls and cursor
- [ ] Presets for common layout/style combinations

## Stage D — Shared editing interaction contract
- [ ] One settings subpanel open at a time.
- [ ] Changes are staged as Draft before committing.
- [ ] Live Preview updates while drafting.
- [ ] Apply commits only the intended properties.
- [ ] Cancel/Back discards uncommitted draft changes.
- [ ] Reset affects only the current category unless explicitly requested otherwise.
- [ ] Reopening a category reads and displays current CSS values.
- [ ] Existing unrelated CSS properties remain intact.

## Stage E — CSS integrity and architecture
- [ ] Read existing declarations before presenting controls.
- [ ] Merge by selector and property rather than replacing whole rules.
- [ ] Avoid invalid or incomplete selectors, including a trailing `body >`.
- [ ] Preserve nested constructs such as media queries and other at-rules.
- [ ] Handle `!important`, complex values, and duplicate declarations safely.
- [ ] Keep manual CSS edits and Visual Editor changes synchronized without overwriting each other.
- [ ] Verify repeated elements can be targeted precisely.
- [ ] Keep committed styles through Preview refresh and offline operation.

## Stage F — UI refinement
- [x] Replace glyph placeholders with a consistent offline SVG icon pack (`core/icons/icon-pack.js`) and wire it into the Visual Editor Preview.
- [ ] Use a restrained dark palette with a single accent.
- [ ] Consistent icon language, button sizing, and typography.
- [ ] Prefer clear spacing/dividers over excessive nested borders.
- [ ] Use sliders only where they improve adjustment; retain exact numeric input.
- [ ] Support compact/expanded presentation where useful.

## Stage G — Advanced workflow features (after core is stable)
- [ ] Undo/Redo for Visual Editor changes
- [ ] Reset Element
- [ ] Copy/Paste Style
- [ ] Copy individual property
- [ ] Recent/favorite colors
- [ ] Style presets for border, shadow, typography, etc.
- [ ] Multi-element selection
- [ ] Property search
- [ ] Advanced CSS mode
- [ ] Before/after CSS diff

## Stage H — Tests and acceptance criteria
- [ ] Verify icon package and Visual Editor integration in browser and built offline HTML.
- [ ] Embed only used icons into standalone exported HTML without external icon-file references.
- [ ] Selecting `body` generates the correct selector `body`.
- [ ] Changing body background preserves existing margin, line-height, and other declarations.
- [ ] Reopening Color shows the current color, not a default value.
- [ ] Changing one border side does not modify other sides.
- [ ] Changing corner radius does not alter border width/style.
- [ ] Changing width does not alter height.
- [ ] Changing padding on one side preserves the other sides.
- [ ] Category reset only resets that category.
- [ ] Cancel restores the state before draft changes.
- [ ] Apply updates CSS Editor and Preview correctly.
- [ ] Repeated elements target the intended element.
- [ ] Preview refresh preserves committed Visual Editor CSS.
- [ ] Manual CSS edits do not get clobbered by the visual merge.
- [ ] Offline Visual Editor works.
- [ ] Automated checks pass; manual browser verification is recorded separately.

## Recommended implementation order
1. **Stage A:** UI/UX redesign and shared control standards.
2. **Stage B:** Primary categories, in order: Color, Border, Size, Shadow, Spacing, Typography.
3. **Stage C:** Layout, Flex/Grid, Position, Effects, Transform, Transition, and presets.
4. **Stage D/E:** Draft/apply/cancel/reset behavior and robust CSS merging/integrity.
5. **Stage F/G:** Refinement and workflow extras.
6. **Stage H:** Automated regression coverage plus manual browser/offline verification.

## Work tracking rules
- Mark items complete only after implementation and the relevant verification.
- Keep README and `maps/ROADMAP.md` updated when this roadmap or project status changes.
- This document is the detailed source of truth for Visual Editor completion tasks.


## Property Inspector completion map
- [x] Created a separate detailed controls checklist covering every property category and controls nested within each category.
- [x] Registered the property map in README and the main roadmap.
- [x] Implement shared control behavior with reusable fields, Draft state, Apply/Cancel and category reset (readback behavior still needs category-specific refinement).
- [ ] Implement categories in the ordered sequence defined in `maps/VISUAL-PROPERTIES-ROADMAP.md`.
- [ ] Complete CSS integrity, regression tests, and browser/offline verification.

Detailed property controls map: [`maps/VISUAL-PROPERTIES-ROADMAP.md`](VISUAL-PROPERTIES-ROADMAP.md).


## Color property — implementation started
- [x] Background/Text/Border color pickers with manual HEX input.
- [x] Initial quick palette.
- [x] Opacity slider.
- [x] Linear/Radial gradient controls with angle and two color stops.
- [ ] Per-control clearing, expanded formats, gradient stop management, readback polish and browser/offline validation.


## Color property — implementation started
- [x] Background/Text/Border color pickers with manual HEX input.
- [x] Initial quick palette.
- [x] Opacity slider.
- [x] Linear/Radial gradient controls with angle and two color stops.
- [ ] Per-control clearing, expanded formats, gradient stop management, readback polish and browser/offline validation.


## Single-panel full-screen workspace — implementation started

- [x] Visual mode now expands the root Preview pane to full viewport and hides the normal Header, Footer, Editor pane, and divider.
- [x] Replaced the dual-rail presentation with one fixed right-side panel containing Elements and Settings mode tabs.
- [x] Elements and Inspector content switch within the shared panel; selecting an element opens Settings.
- [x] Exit Visual restores the normal Editor/Preview workspace and toggles the toolbar pressed state.
- [x] Added regression assertions for the single-panel layout, mode switching, and parent workspace communication.
- [ ] Confirm CI run and perform real browser checks for viewport sizing, scroll behavior, selection, and exit/restore.
- [ ] Validate narrow viewport overlay behavior and keyboard accessibility.

**Current implementation supersedes the earlier two-rail layout items below.** The panel is a single right-side panel, not two rails.

## Visual Editor full-screen workspace layout refinement — 20 November 2026
- [ ] Use a single fixed right-side panel instead of left Elements rail plus right Inspector rail.
- [ ] Combine element browsing/insertion and Inspector settings in the same panel, switching panel modes as appropriate.
- [ ] Preview/Canvas fills all remaining width to the left of the panel and full available height.
- [ ] Right panel stays pinned to viewport; panel content and Preview scroll independently; document scroll is disabled while Visual mode is active.
- [ ] Integrate toolbar into full-screen Visual workspace and restore normal Editor safely on exit.
- [ ] Responsive narrow-screen behavior: right panel collapses or overlays when toggled.
- [ ] Manually verify desktop, tablet, mobile layouts and scroll independence.

- [ ] Clicking the Visual button switches the editor into a dedicated full-screen workspace/overlay, replacing the normal editor workspace while active.
- [ ] Left Elements rail and right Inspector rail are fixed/pinned, with viewport-height sizing (`100vh`/dynamic viewport equivalent) and stable panel widths; they do not scroll with the Preview.
- [ ] Preview/Canvas occupies all remaining horizontal space strictly between the two rails and expands/shrinks responsively.
- [ ] Keep each rail's content scrolling independently when it exceeds its height; Preview/canvas scrolling is separate. Prevent the document/page itself from scrolling while Visual workspace is active.
- [ ] Top Visual toolbar stays within the full-screen workspace; workspace uses correct layering and avoids overlap with the normal app header/workspace.
- [ ] On narrow screens, adapt/collapse rails or provide a controlled toggle so Preview remains usable without breaking the fixed-height workspace.
- [ ] Exit/close Visual mode restores the normal editor layout without losing selection, drafts, or committed CSS.
- [ ] Verify at desktop, tablet, and narrow viewport sizes; browser/manual verification is still pending.



- [x] Fixed the regression test harness to import `node:test` and `node:assert/strict` and load the Visual Editor source; the previous CI failure was a test setup `ReferenceError`, not a workspace flex-pane sizing regression.
## Hover element identity tooltip — implementation added (verification pending)
- [x] Added in `core/visual-editor/visual-editor.js`: while Visual mode selection is active, hovering Preview elements shows a compact floating label beside the cursor with the element ID and/or class.
- [x] Display ID and classes when both exist; show whichever exists alone, and use tag name if neither is present.
- [x] Keep label close to the pointer, clamp its position to Preview bounds, and track pointer movement.
- [x] Tooltip is pointer-events-none and hides on Visual mode exit / selection cancellation.
- [x] Supports multiple class names; CSS ellipsis handles long display strings, and the title retains the full label.
- [ ] Automated tests were added for core tooltip behavior; confirm CI passes and perform manual browser verification. (Automated test does not yet exercise all ID/class combinations.)

### CI verification — 20 November 2026
- [x] AlfaCode Tests: **116 passed, 0 failed** (Run 44623052830).
- [x] Offline build and audit completed successfully; generated HTML commit pushed (Run 44623039708).
- [ ] Manual browser checks for layout, scroll independence, selection and exit/restore remain open.


## Mobile Preview regression test correction — 20 November 2026
- [x] Fixed the CSS media-query assertion: it now matches whitespace and literal parentheses correctly instead of escaped-backslash text.
- [ ] Rerun CI to confirm the regression suite passes; this is a test correction, not browser validation.


## Visual panel viewport anchoring — 20 November 2026
- [x] Outer Preview pane fills the entire viewport; removed duplicate right-side panel-width reservation from the root workspace.
- [x] Visual panel anchors to the right edge of its host viewport.
- [x] Inner content preview reserves panel width at desktop and narrow viewport sizes to prevent canvas overlap.
- [x] Added regression assertions for outer pane full width and inner preview width reservation.
- [ ] CI and real browser checks pending.


## Visual host iframe viewport expansion — 20 November 2026
- [x] Identified the panel's containing block: the Visual Editor panel is inside the Preview host iframe, not the top-level Editor1 page.
- [x] Expanded the Preview host iframe itself to fixed viewport dimensions in Visual mode, so the panel can anchor to the true right edge of the browser viewport.
- [x] Added a regression test for the host iframe fixed viewport rule.
- [ ] CI run and manual browser validation pending.


## Visual mode Preview portal fix — 20 November 2026
- [x] Diagnosed clipping caused by Preview iframe remaining inside split-pane/overflow ancestors.
- [x] Temporarily portal `#previewFrame` to `document.body` on Visual mode entry, set it viewport-fixed, then restore its original position and inline style on exit.
- [x] Added regression checks for portal and restore path.
- [ ] CI and manual browser verification pending.


## Corrected Visual panel layout — 20 November 2026
- [x] Keep the Preview iframe in its original workspace pane (do not portal it).
- [x] Portal only the Visual Editor control shell from the Preview iframe into the top-level document to make its fixed panel viewport-relative.
- [x] Load Visual Editor CSS in the top-level page for the portaled panel.
- [x] Preview workspace reserves the right panel width, allowing canvas to fill the remaining space.
- [x] Regression test expectations updated to assert this architecture.
- [ ] CI and browser validation pending.
