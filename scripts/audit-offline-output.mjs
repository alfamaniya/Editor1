import fs from "node:fs/promises";
import assert from "node:assert/strict";

const outputPath = new URL("../offline/AlfaCode-Offline.html", import.meta.url);
const html = await fs.readFile(outputPath, "utf8");
assert.match(html, /<!doctype html>/i, "standalone document doctype is present");
assert.match(html, /editorFrame\.srcdoc\s*=/, "editor is embedded as srcdoc");
assert.match(html, /previewFrame\.srcdoc\s*=/, "preview is embedded as srcdoc");
assert.match(html, /window\.__ALFACODE_COMPLETION_CATALOGS__\s*=/, "offline catalog payload is embedded");
assert.doesNotMatch(html, /id="buildOffline"/, "offline build toolbar action is removed");
assert.doesNotMatch(html, /Offline file ready|Building offline|Build Offline File/, "offline build action UI and feedback are removed");
assert.match(html, /window\.__ALFACODE_OFFLINE_BUILD__\s*=\s*true/, "standalone offline build marker is embedded");
for (const language of ["html", "css", "javascript"]) {
  const source = JSON.parse(await fs.readFile(new URL("../alfacode/data/completions." + language + ".json", import.meta.url), "utf8"));
  assert.ok(html.includes(source.records[0].id), language + " catalog sample is embedded");
  for (const record of source.records) {
    assert.ok(html.includes(record.id), language + " record missing from offline payload: " + record.id);
  }
}
assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=|<link\b[^>]*\bhref\s*=|<iframe\b[^>]*\bsrc\s*=/i,
  "no external script, stylesheet or iframe source remains");
assert.doesNotMatch(html, /(?:https?|wss?|ftp):\/\/|(?<![\w:])\/\/(?:localhost|(?:\d{1,3}\.){3}\d{1,3}|[a-z0-9-]+(?:\.[a-z0-9-]+)+)/i,
  "no external network endpoint remains");
console.log("Offline artifact audit passed: embedded editor, preview and all source catalog records; no external runtime resources.");
