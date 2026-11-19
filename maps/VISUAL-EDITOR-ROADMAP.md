# Visual Editor Completion Roadmap

**Created:** 19 November 2026  
**Status:** Planned — implementation has not started for this roadmap  
**Scope:** Visual Editor UI redesign, complete setting categories, interaction model, CSS integrity, and verification.  
**Engine constraint:** Do not modify `alfacode/src/` as part of this work unless explicitly authorized.

## Goal
Turn Visual Editor into a polished, capable visual styling tool: select an element in Preview, adjust its appearance through organized controls, preview changes, and commit safely without losing existing CSS.

## Stage A — Visual UI/UX redesign
- [ ] Redesign the Visual Editor panel to match Editor1's professional, restrained UI style.
- [ ] Improve element-selection affordances: hover, selected outline, element label/type, and clear/deselect action.
- [ ] Establish consistent button, icon, tooltip, input, slider, spacing, and panel behavior.
- [ ] Improve contextual settings navigation and panel hierarchy.
- [ ] Keep the interface compact, readable, responsive, and internally scrollable.

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
