import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const ROOT = new URL("../../", import.meta.url);
const visual = await readFile(new URL("core/visual-editor/visual-editor.js", ROOT), "utf8");
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
