import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const ROOT = new URL("../../", import.meta.url);
const css = await readFile(new URL("style.css", ROOT), "utf8");
const divider = await readFile(new URL("core/workspace-divider/workspace-divider.js", ROOT), "utf8");

test("workspace grid and panels are allowed to shrink without overflowing", () => {
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+6px\s+minmax\(0,\s*1fr\)/);
  assert.match(css, /grid-template-rows:\s*minmax\(0,\s*1fr\)/);
  assert.match(css, /\.workspace-panel[^}]*min-width:\s*0/);
  assert.match(css, /\.section-frame[^}]*width:\s*100%/);
  assert.match(css, /\.section-frame[^}]*max-width:\s*100%/);
});

test("split-panel sizing is observed independently from window resize", () => {
  assert.match(divider, /new ResizeObserver\(/);
  assert.match(divider, /resizeObserver\.observe\(workspace\)/);
  assert.match(divider, /resizeObserver\.observe\(panel\)/);
  assert.match(divider, /resizeObserver\?\.disconnect\(\)/);
});

test("iframe resize notification is sent on panel resize and divider movement", () => {
  assert.match(divider, /dispatchEvent\(new Event\("resize"\)\)/);
  assert.match(divider, /querySelectorAll\("\.workspace-panel"\)\.forEach\(panel => this\.notifyFrameResize\(panel\)\)/);
});


test("main responsive breakpoints are based on viewport width rather than pointer type", async () => {
  const responsiveCssPaths = [
    "style.css",
    "core/editor/editor.css",
    "core/header/header.css",
    "core/mobile-workspace/mobile-workspace.css"
  ];
  for (const path of responsiveCssPaths) {
    const source = await readFile(new URL(path, ROOT), "utf8");
    assert.doesNotMatch(source, /@media[^{}]*pointer:\s*coarse[^{}]*max-height:\s*1000px/i, path + " should not depend on pointer type");
    assert.match(source, /@media\s*\(max-width:\s*700px\)/, path + " should use the viewport-width breakpoint");
  }
});

test("editor content overflow stays inside its scroll host", async () => {
  const editorCss = await readFile(new URL("core/editor/editor.css", ROOT), "utf8");
  assert.match(editorCss, /\.editor-host\s*\{[^}]*min-width:\s*0[^}]*overflow:\s*auto/s);
  assert.match(editorCss, /\.alfacode-editor-layout[^}]*min-width:\s*max-content/);
});
