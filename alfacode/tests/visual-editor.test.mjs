import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const ROOT = new URL("../../", import.meta.url);
const visual = await readFile(new URL("core/visual-editor/visual-editor.js", ROOT), "utf8");
const visualCSS = await readFile(new URL("core/visual-editor/visual-editor.css", ROOT), "utf8");
const editor = await readFile(new URL("core/editor/editor.js", ROOT), "utf8");

test("body selection creates a valid body selector instead of body child combinator", () => {
  assert.match(visual, /if\(el===document\.body\)return "body"/);
  assert.match(visual, /return parts\.length\?"body > "\+parts\.join\(" > "\):"body"/);
});

test("Visual CSS updates merge declarations into an existing matching rule", () => {
  assert.match(editor, /function mergeRuleBody\(existingBody, updates\)/);
  assert.match(editor, /mergedCSS = chunks.join/);
  assert.match(editor, /if \(!merged\) unmatchedRules\.push/);
  assert.match(editor, /updates\.forEach/);
});

const controls = await readFile(new URL("core/visual-editor/property-controls.js", ROOT), "utf8");
const previewHTML = await readFile(new URL("core/preview/preview.html", ROOT), "utf8");

test("shared inspector controls provide reusable fields and draft lifecycle", () => {
  assert.match(controls, /function createDraftState\(\)/);
  assert.match(controls, /begin\(source\)/);
  assert.match(controls, /commit\(\)/);
  assert.match(controls, /cancel\(\)/);
  assert.match(controls, /reset\(properties\)/);
  assert.match(controls, /function createField/);
  assert.match(controls, /window\.Editor1PropertyControls/);
});

test("Visual Editor uses shared controls and category reset action", () => {
  assert.match(visual, /const shared=window\.Editor1PropertyControls/);
  assert.match(visual, /drafts\.begin\(state\.draft\)/);
  assert.match(visual, /drafts\.cancel\(\)/);
  assert.match(visual, /drafts\.commit\(\)/);
  assert.match(visual, /function resetCategory\(cat\)/);
  assert.match(visual, /data-reset/);
  assert.match(previewHTML, /property-controls\.js/);
  assert.match(previewHTML, /visual-editor\.js/);
});

test("Color inspector exposes core color editing tools", () => {
  assert.match(visual, /renderColorControls/);
  assert.match(visual, /addColorRow\("Background","background-color","backgroundColor"\)/);
  assert.match(visual, /addColorRow\("Text","color","color"\)/);
  assert.match(visual, /addColorRow\("Border","border-color","borderColor"\)/);
  assert.match(visual, /Gradient background/);
  assert.match(visual, /linear-gradient/);
  assert.match(visual, /radial-gradient/);
  assert.match(visual, /#RRGGBB/);
  assert.match(visualCSS, /visual-color-swatches/);
});

test("Color reset clears drafts and rerenders its specialized control panel", () => {
  assert.match(visual, /if\(cat==="color"\)renderColorControls\(\)/);
  assert.match(visual, /state\.draft\[prop\]=""\;if\(drafts\)drafts\.set\(prop,""/);
});

test("Visual preview picker shows a non-interactive hovered element identity tooltip", () => {
  assert.match(visual, /editor1-visual-identity-tip/);
  assert.match(visual, /function identityFor\(el\)/);
  assert.match(visual, /el\.id\?\("\#\+el\.id\)/);
  assert.match(visual, /\.classList\]/);
  assert.match(visual, /pointer-events:none/);
  assert.match(visual, /function moveIdentity\(e\)/);
  assert.match(visual, /Math\.max\(pad,Math\.min/);
  assert.match(visual, /function hideIdentity\(\)/);
  assert.match(visual, /hideIdentity\(\)/);
});
