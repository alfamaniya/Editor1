import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const ROOT = new URL("../../", import.meta.url);
const css = await readFile(new URL("style.css", ROOT), "utf8");
const divider = await readFile(new URL("backup/core-old/workspace-divider/workspace-divider.js", ROOT), "utf8");

test("toolbar does not include the accidental offline download action", async () => {
  const shell = await readFile(new URL("index.html", ROOT), "utf8");
  assert.doesNotMatch(shell, /id="buildOffline"/);
  assert.doesNotMatch(shell, /core\/offline-build-action\/offline-build-action\.js/);
  const manifest = await readFile(new URL("scripts/offline-manifest.json", ROOT), "utf8");
  assert.doesNotMatch(manifest, /offline-build-action\.js/);
});

test("workspace flex panes and frames shrink without overflow", () => {
  assert.match(css, /\.split\s*\{[^}]*display:\s*flex/);
  assert.match(css, /\.split\s*\{[^}]*min-height:\s*0/);
  assert.match(css, /\.pane\s*\{[^}]*min-width:\s*0/);
  assert.match(css, /\.pane-content\s*\{[^}]*min-height:\s*0/);
  assert.match(css, /\.workspace-frame\s*\{[^}]*width:\s*100%/);
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



test("mobile workspace view controls and touch-sized editor surfaces are available", async () => {
  const shell = await readFile(new URL("index.html", ROOT), "utf8");
  assert.match(shell, /viewport-fit=cover/);
  assert.match(shell, /class="mobile-workspace-tabs"/);
  assert.match(shell, /data-workspace="editor"/);
  assert.match(shell, /data-workspace="preview"/);
  assert.match(css, /safe-area-inset-top/);
  assert.match(css, /safe-area-inset-bottom/);
  assert.match(css, /\.mobile-workspace-editor\s+#rightPane\s*\{\s*display:\s*none/);
  assert.match(css, /\.mobile-workspace-preview\s+#leftPane\s*\{\s*display:\s*none/);
  assert.match(css, /body\.visual-mode\s+#rightPane\s*\{\s*display:\s*flex/);
  assert.match(css, /@media\(max-height:500px\) and \(orientation:landscape\)/);
  const editorCss = await readFile(new URL("core/editor/editor.css", ROOT), "utf8");
  assert.match(editorCss, /@media\s*\(max-width:\s*700px\)/);
  assert.match(editorCss, /\.editor-tab[^}]*min-height:\s*44px/);
  const bridge = await readFile(new URL("core/editor-bridge.js", ROOT), "utf8");
  assert.match(bridge, /function setMobileWorkspace\(view\)/);
  assert.match(bridge, /workspaceBeforeVisual/);
  const visualCss = await readFile(new URL("core/visual-editor/visual-editor.css", ROOT), "utf8");
  assert.match(visualCss, /@media\(max-width:700px\)/);
  assert.match(visualCss, /min-height:44px/);
  assert.match(css, /height:56dvh/);
});

test("unrelated legacy modules do not load mobile workspace switchers", async () => {
  const shell = await readFile(new URL("index.html", ROOT), "utf8");
  const mobileCssPaths = [
    "backup/core-old/header/header.css",
    "core/new-page-action/new-page-action.css",
    "backup/core-old/clear-tabs/clear-tabs.css",
    "backup/core-old/project-reset/project-reset.css",
    "backup/core-old/clear-project-cookies/clear-project-cookies.css",
    "core/completion-catalog/completion-catalog.css",
    "core/tag-suggestions/tag-suggestions.css"
  ];
  for (const path of mobileCssPaths) {
    const source = await readFile(new URL(path, ROOT), "utf8");
    assert.doesNotMatch(source, /@media\s*\(\s*max-width\s*:/i, path + " should not contain mobile width overrides");
    assert.doesNotMatch(source, /@media[^{}]*pointer\s*:\s*coarse/i, path + " should not contain touch-pointer responsive overrides");
  }
  assert.doesNotMatch(shell, /mobile-workspace-switcher|mobile-extra-keys|mobile-workspace\.js|mobile-extra-keys\.js/);
  const manifest = await readFile(new URL("scripts/offline-manifest.json", ROOT), "utf8");
  assert.doesNotMatch(manifest, /mobile-workspace|mobile-extra-keys/);
});

test("editor content overflow stays inside its scroll host", async () => {
  const editorCss = await readFile(new URL("core/editor/editor.css", ROOT), "utf8");
  assert.match(editorCss, /\.editor-host\s*\{[^}]*min-width:\s*0[^}]*overflow:\s*auto/s);
  assert.match(editorCss, /\.alfacode-editor-layout[^}]*width:\s*max-content/);
  assert.match(editorCss, /\.alfacode-editor-layout[^}]*min-width:\s*100%/);
  assert.match(editorCss, /\.alfacode-gutter-host[^}]*flex:\s*0\s+0\s+42px/);
  assert.match(editorCss, /\.alfacode-gutter-host[^}]*width:\s*42px/);
  assert.match(editorCss, /\.alfacode-gutter-host[^}]*max-width:\s*42px/);
  assert.match(editorCss, /\.alfacode-editor-canvas[^}]*min-width:\s*max-content/);
});
