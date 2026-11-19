import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const ROOT = new URL("../../", import.meta.url);
const visual = await readFile(new URL("core/visual-editor/visual-editor.js", ROOT), "utf8");

test("Visual preview picker shows a non-interactive hovered element identity tooltip", () => {
  assert.ok(visual.includes("editor1-visual-identity-tip"));
  assert.ok(visual.includes('el.id?("#"+el.id)'));
  assert.ok(visual.includes("el.classList"));
  assert.ok(visual.includes("pointer-events:none"));
  assert.ok(visual.includes("function moveIdentity(e)"));
  assert.ok(visual.includes("Math.max(pad,Math.min"));
  assert.ok(visual.includes("function hideIdentity()"));
  assert.ok(visual.includes("hideIdentity()"));
});
