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

test("Visual workspace uses one right-side panel with Elements and Settings modes", async () => {
  assert.ok(visual.includes('data-mode="elements"'));
  assert.ok(visual.includes('data-mode="settings"'));
  assert.ok(visual.includes("function setMode(mode)"));
  assert.ok(visual.includes('btn.disabled=!state.selector'));
  assert.ok(visual.includes("function enterVisual()"));
  assert.ok(visual.includes("function exitVisual()"));
  assert.ok(visual.includes("window.parent.postMessage({type:\"alfacode:visual-mode-active\",active:true}"));
  assert.ok(visual.includes("visual-editor-right-panel"));
  assert.ok(visual.includes("visual-editor-mode-tabs"));
  const visualCss = await readFile(new URL("core/visual-editor/visual-editor.css", ROOT), "utf8");
  assert.match(visualCss, /\.visual-editor-right-panel\s*\{[^}]*right:\s*0/s);
  assert.match(visualCss, /#visual-editor-shell\[data-mode="elements"\]\s+#visual-inspector\s*\{[^}]*display:\s*none/s);
  assert.match(visualCss, /#visual-editor-shell\[data-mode="settings"\]\s+\.visual-editor-elements\s*\{[^}]*display:\s*none/s);
  const rootCss = await readFile(new URL("style.css", ROOT), "utf8");
  assert.match(rootCss, /body\.visual-mode\s+#leftPane[^}]*display:\s*none/s);
  assert.match(rootCss, /body\.visual-mode\s+#rightPane\{[^}]*right:min\(340px,38vw\)/s);
  assert.match(rootCss, /@media\s*\(max-width:\s*650px\)[\s\S]*?body\.visual-mode\s+#rightPane\{[^}]*right:min\(320px,86vw\)/s);
  const bridge = await readFile(new URL("core/editor-bridge.js", ROOT), "utf8");
  assert.ok(bridge.includes("alfacode:visual-mode-active"));
  assert.ok(bridge.includes('classList.toggle("visual-mode", data.active)'));
});
