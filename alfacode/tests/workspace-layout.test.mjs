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



test("mobile-only responsive overrides and controls are removed from the main app", async () => {
  const mobileCssPaths = [
    "style.css",
    "core/editor/editor.css",
    "core/header/header.css",
    "core/new-page-action/new-page-action.css",
    "core/clear-tabs/clear-tabs.css",
    "core/project-reset/project-reset.css",
    "core/clear-project-cookies/clear-project-cookies.css",
    "core/completion-catalog/completion-catalog.css",
    "core/tag-suggestions/tag-suggestions.css"
  ];
  for (const path of mobileCssPaths) {
    const source = await readFile(new URL(path, ROOT), "utf8");
    assert.doesNotMatch(source, /@media\s*\(\s*max-width\s*:/i, path + " should not contain mobile width overrides");
    assert.doesNotMatch(source, /@media[^{}]*pointer\s*:\s*coarse/i, path + " should not contain touch-pointer responsive overrides");
  }
  const shell = await readFile(new URL("index.html", ROOT), "utf8");
  assert.doesNotMatch(shell, /mobile-workspace-switcher|mobile-extra-keys|mobile-workspace\.js|mobile-extra-keys\.js/);
  const manifest = await readFile(new URL("scripts/offline-manifest.json", ROOT), "utf8");
  assert.doesNotMatch(manifest, /mobile-workspace|mobile-extra-keys/);
});

test("editor content overflow stays inside its scroll host", async () => {
  const editorCss = await readFile(new URL("core/editor/editor.css", ROOT), "utf8");
  assert.match(editorCss, /\.editor-host\s*\{[^}]*min-width:\s*0[^}]*overflow:\s*auto/s);
  assert.match(editorCss, /\.alfacode-editor-layout[^}]*min-width:\s*max-content/);
});
