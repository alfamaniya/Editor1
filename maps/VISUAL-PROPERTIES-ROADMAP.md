<!-- #VISUAL-PROPERTIES-ROADMAP.md: فایل VISUAL PROPERTIES ROADMAP مربوط به بخش maps پروژه -->
# Visual Editor — Properties & Controls Completion Map

> Status: Planned / not implemented. This map defines the full property inspector and the controls within each property category. The redesigned workspace is the UI foundation; functional controls are to be implemented in stages.

## Core behavior shared by every property panel
- [ ] Read the selected element's current computed and authored CSS values when a category opens.
- [ ] Show authored CSS values as priority; use computed values as fallback without losing source declarations.
- [ ] Keep exact numeric entry and units alongside sliders/visual controls where appropriate.
- [x] Establish a shared draft-state contract: preview live, Apply commits, Cancel restores, and Reset removes only active-category declarations. Full category-level behavior and validation remain pending.
- [ ] Preserve unrelated declarations, shorthand/longhand relationships, and `!important`.
- [ ] Reflect updates in CSS editor and Preview; avoid duplicate rules/declarations.
- [ ] Display a clear indicator when a value is inherited, computed, or explicitly authored.
- [ ] Validate input; prevent invalid CSS from being committed and show inline feedback.
- [ ] Support keyboard navigation, labels, tooltips, focus states, and responsive panel scrolling.
- [ ] Keep shared UI controls visually consistent (field, unit selector, slider, color picker, toggle, segmented button, dropdown).

## Property 01 — Color
### Controls
- [x] Text color (`color`): initial HEX picker and manual HEX field; palette/swatches. RGB/HSL/eyedropper and broader alpha editing remain pending.
- [x] Background color (`background-color`): HEX picker, manual HEX, quick palette.
- [x] Background image/gradient: initial Linear/Radial gradient builder with angle and two color stops; additional stops and presets remain pending.
- [x] Border color: global HEX picker and manual HEX; per-side color controls remain pending.
- [x] Color swatches: initial fixed quick palette; recent/favorites persistence remains pending.
- [ ] Clear/unset action per control (Reset Category exists; per-control clear remains pending).
- [ ] Display source/inherited status; avoid replacing background shorthand unless intentionally editing it.

## Property 02 — Border
- [ ] Border mode: linked sides / independent sides.
- [ ] Width: overall and top/right/bottom/left.
- [ ] Style: none, solid, dashed, dotted, double, groove, ridge, inset, outset.
- [ ] Color: shared and per-side color.
- [ ] Radius: all corners linked/unlinked; top-left, top-right, bottom-right, bottom-left.
- [ ] Radius units: px, %, rem; exact input.
- [ ] Presets: none, subtle, rounded, pill, custom.
- [ ] Preview border sample; reset border-only controls without touching other properties.

## Property 03 — Size
- [ ] Width and height with px, %, rem, em, vw, vh, auto, fit-content, min-content, max-content.
- [ ] Min-width, max-width, min-height, max-height.
- [ ] Aspect ratio lock/unlock; ratio input and common presets.
- [ ] Content sizing modes (auto/fill/fit) where applicable.
- [ ] Overflow: visible, hidden, clip, scroll, auto; overflow-x/y independent.
- [ ] Box sizing: content-box / border-box.
- [ ] Display size preview; do not overwrite the opposite dimension when changing one.

## Property 04 — Shadow
- [ ] Shadow type: outer / inset.
- [ ] Presets: none, subtle, medium, strong, long, glow.
- [ ] X offset, Y offset, blur, spread, color and opacity.
- [ ] Numeric inputs and sliders; negative offsets allowed.
- [ ] Multiple shadows: add, remove, reorder, edit each layer.
- [ ] Preview swatch and CSS value readback.
- [ ] Avoid clobbering unrelated declarations.

## Property 05 — Spacing / Box Model
- [ ] Box model diagram with content, padding, border, margin.
- [ ] Margin: top/right/bottom/left; linked/unlinked; auto; negative values where valid.
- [ ] Padding: four sides; linked/unlinked.
- [ ] Gap / row-gap / column-gap for flex/grid containers.
- [ ] Units: px, %, rem, em, vw, vh; unit switching should preserve meaningful value.
- [ ] Click side in diagram to edit; show exact values.
- [ ] Reset margin/padding/gap separately; avoid changing other categories.

## Property 06 — Typography
- [ ] Font family: installed/system choices and CSS font-family input with fallback stack.
- [ ] Font size: px, rem, em, vw; slider plus exact value.
- [ ] Font weight: 100–900 and named presets.
- [ ] Line height: unitless, px, %, exact entry.
- [ ] Letter spacing and word spacing.
- [ ] Text color and optional highlight/background.
- [ ] Text alignment: left, center, right, justify.
- [ ] Text decoration: none, underline, overline, line-through; style/color/thickness if supported.
- [ ] Text transform: none, uppercase, lowercase, capitalize.
- [ ] Font style: normal, italic, oblique.
- [ ] White-space, text overflow, wrapping, line clamp.
- [ ] Text sample preview; preserve independent typography declarations.

## Property 07 — Layout
- [ ] Display: block, inline, inline-block, flex, inline-flex, grid, inline-grid, none.
- [ ] Flex container controls: direction, wrap, justify-content, align-items, align-content, gap.
- [ ] Flex child controls: grow, shrink, basis, order, align-self.
- [ ] Grid controls: template columns/rows, tracks, auto-flow, auto-fit/auto-fill, gap, align/justify.
- [ ] Grid item: row/column start/end, spans, align-self/justify-self.
- [ ] Layout presets with visual mini-diagrams.
- [ ] Switching display modes warns/keeps values rather than discarding settings.

## Property 08 — Position
- [ ] Position: static, relative, absolute, fixed, sticky.
- [ ] Top/right/bottom/left with units and auto.
- [ ] Inset shorthand and per-side controls.
- [ ] Z-index with exact number.
- [ ] Anchor/offset diagram and containing-block context indication.
- [ ] Sticky options and boundaries; show unsupported/ineffective context clearly.

## Property 09 — Effects
- [ ] Opacity (0–100% and exact decimal).
- [ ] Blur filter.
- [ ] Brightness, contrast, grayscale, saturation, hue rotation, invert, sepia.
- [ ] Filter presets and individually editable filter components.
- [ ] Backdrop-filter where supported.
- [ ] Blend mode (mix-blend-mode / background-blend-mode).
- [ ] Visibility and pointer-events controls.
- [ ] Preserve existing filter chains when editing one effect.

## Property 10 — Transform
- [ ] Translate X/Y/Z; units.
- [ ] Scale X/Y linked/unlinked.
- [ ] Rotate X/Y/Z and 2D rotation.
- [ ] Skew X/Y.
- [ ] Transform origin (preset grid + custom).
- [ ] 3D perspective controls where supported.
- [ ] Reset individual transform component and preview.

## Property 11 — Transition & Animation
- [ ] Transition property: all or selected CSS properties.
- [ ] Duration, delay, timing function; cubic-bezier editor and presets.
- [ ] Preview transition safely.
- [ ] Animation name, duration, delay, iteration count, direction, fill mode, play state.
- [ ] Keyframe timeline/frames editing (future substage).
- [ ] Respect reduced-motion preferences; prevent unexpected animation on apply.

## Property 12 — Content / Element-specific
- [ ] Cursor presets.
- [ ] User-select and pointer-events.
- [ ] List style type/position/image.
- [ ] Object-fit and object-position for media.
- [ ] Aspect-ratio and responsive media sizing.
- [ ] Text wrapping/overflow controls.
- [ ] Element-specific options only when applicable; no irrelevant controls.

## Property 13 — Responsive / Breakpoints
- [ ] Breakpoint selector: base, tablet, mobile, custom.
- [ ] Show current viewport/breakpoint.
- [ ] Edit values scoped to selected breakpoint/media query.
- [ ] Preview changes by viewport size.
- [ ] Preserve existing media-query structure; no accidental global edits.
- [ ] Show cascade/override indicators.

## Property 14 — Presets & Style Utilities
- [ ] Save/reuse presets per category.
- [ ] Copy style / paste style.
- [ ] Copy a single property.
- [ ] Favorite/recent color and value history.
- [ ] Clear/reset selected property.
- [ ] Reset category; Reset element.
- [ ] Before/after preview and CSS diff.

## Property 15 — CSS integrity / merge engine
- [ ] Parse CSS robustly (avoid naive splitting that breaks at nested blocks).
- [ ] Target correct selector and declaration, including repeated elements.
- [ ] Preserve comments, formatting where possible, at-rules, media queries, complex values.
- [ ] Preserve `!important`, custom properties, and shorthand/longhand semantics.
- [ ] Merge property-level edits; do not replace full rules.
- [ ] Detect conflicts from manual CSS edits and show user a safe resolution path.
- [ ] Avoid duplicate declarations and invalid selector generation.
- [ ] Roll back draft changes on Cancel.
- [ ] Update Preview and editor consistently, including offline bundle.

## Suggested implementation sequence
1. [ ] Shared control library and state/readback/draft/apply/cancel/reset contract.
2. [ ] Color + Border.
3. [ ] Size + Spacing / Box Model.
4. [ ] Shadow + Typography.
5. [ ] Layout (Flex/Grid) + Position.
6. [ ] Effects + Transform.
7. [ ] Transition/Animation + element-specific controls.
8. [ ] Responsive breakpoints.
9. [ ] Presets/utilities.
10. [ ] CSS integrity, regression tests, browser and offline verification.

## Acceptance checks
- [ ] Reopening a property shows actual current values.
- [ ] Every control has exact-value entry where relevant.
- [ ] Editing one property preserves unrelated properties.
- [ ] Cancel reverts draft changes; Apply persists them.
- [ ] Category reset only resets that category.
- [ ] Selector and responsive scope are correct.
- [ ] No invalid/duplicate CSS is produced.
- [ ] Manual CSS changes are not silently overwritten.
- [ ] All controls keyboard-accessible and labeled.
- [ ] Automated tests, offline build, and browser interaction checks are documented separately.
