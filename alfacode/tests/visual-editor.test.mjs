// #visual-editor.test.mjs: فایل visual editor.test مربوط به بخش tests پروژه
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

test("Visual Inspector exposes full property categories and exact CSS controls", () => {
  for (const category of ["color","background","border","outline","size","shadow","spacing","typography","layout","flex","grid","position","effects","transform","transition","animation","content","scroll","svg","responsive","custom","presets"]) {
    assert.match(visual, new RegExp('data-cat="' + category + '"'));
  }
  for (const property of ["border-top-left-radius","border-image-source","outline-offset","background-image","grid-template-columns","grid-template-areas","flex-flow","backdrop-filter","mask-composite","transform-origin","animation-timeline","scroll-snap-type","stroke-dasharray","container-type","box-shadow","text-shadow","CSS declaration"]) {
    assert.ok(visual.includes(property), "missing Visual Inspector property: " + property);
  }
  assert.ok(visual.includes("function renderCustomControls()"));
  assert.ok(visual.includes("function validDeclaration(prop,value)"));
  assert.ok(visual.includes("JSON.stringify(computedProperties)"));
  assert.ok(visual.includes("applyShadowPreset"));
  for (const feature of ["parseShadowLayers","splitShadowLayers","text-shadow","Add shadow layer","Inset","Spread","CSS value","window.CSS.supports"]) {
    assert.ok(visual.includes(feature), "missing shadow editor feature: " + feature);
  }
  assert.ok(visual.includes("selectOptions"));
});

test("CSS value suggestions remain editable and allow arbitrary valid CSS values", async () => {
  const controls = await readFile(new URL("core/visual-editor/property-controls.js", ROOT), "utf8");
  assert.ok(controls.includes('document.createElement("datalist")'));
  assert.ok(controls.includes('input.setAttribute("list",list.id)'));
  assert.ok(visual.includes("validDeclaration"));
  assert.ok(visual.includes("Add CSS declaration"));
});

test("Visual workspace uses one right-side panel with Elements and Settings modes", async () => {
  assert.ok(visual.includes('data-mode="elements"'));
  assert.ok(visual.includes('data-mode="settings"'));
  assert.ok(visual.includes("function setMode(mode)"));
  assert.ok(visual.includes('btn.disabled=!state.selector'));
  assert.ok(visual.includes("function enterVisual()"));
  assert.ok(visual.includes("function exitVisual()"));
  assert.match(visual, /<header class="visual-editor-header"><div class="visual-editor-topbar">/);
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
  assert.match(rootCss, /body\.visual-mode\s+#rightPane\{[^}]*top:52px/s);
  assert.match(visualCss, /\.visual-editor-header\s*\{[^}]*height:\s*52px/s);
  assert.match(rootCss, /#visual-editor-shell\.root-portal\{[^}]*position:fixed/s);
  assert.match(rootCss, /root-portal\s+\.visual-editor-right-panel\{[^}]*right:0/s);
  assert.match(visual, /document\.body\.classList\.add\("visual-mode"\)/);
  assert.match(visual, /document\.body\.classList\.remove\("visual-mode"\)/);
  const bridge = await readFile(new URL("core/editor-bridge.js", ROOT), "utf8");
  assert.ok(bridge.includes("alfacode:visual-mode-active"));
  assert.ok(bridge.includes('classList.toggle("visual-mode", data.active)'));
  assert.ok(bridge.includes("function portalVisualShell(active)"));
  assert.ok(bridge.includes("document.body.appendChild(shell)"));
  assert.ok(bridge.includes("visualShellPlaceholder.parentNode.insertBefore(shell, visualShellPlaceholder)"));
});
