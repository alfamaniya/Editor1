import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getHTMLTagSuggestions } from "../src/language/html/html-completion.js";
import { getCSSCompletionSuggestions } from "../src/language/css/css-completion.js";
import { getJavaScriptCompletionSuggestions } from "../src/language/javascript/javascript-completion.js";
import { loadCompletionCatalogs } from "../../core/completion-catalog/catalog-loader.js";

async function records(file) {
  const payload = JSON.parse(await readFile(new URL("../data/completions." + file + ".json", import.meta.url), "utf8"));
  return payload.records.filter(record => record.enabled !== false);
}

test("live HTML completion accepts catalog records and retains contextual candidates", async () => {
  const catalog = await records("html");
  const result = getHTMLTagSuggestions("<html><body><", 13, { catalog, limit: 10 });
  assert.ok(result);
  assert.ok(result.options.some(option => option.label === "div"));
  assert.ok(result.options.every(option => option.kind === "open"));
});

test("live CSS completion uses catalog properties, values, at-rules, functions and units", async () => {
  const catalog = await records("css");
  const propertySource = ".box { dis";
  const property = getCSSCompletionSuggestions(propertySource, propertySource.length, { catalog });
  assert.ok(property?.options.some(option => option.label === "display"));
  const valueSource = ".box { display: fl";
  const value = getCSSCompletionSuggestions(valueSource, valueSource.length, { catalog });
  assert.ok(value?.options.some(option => option.label === "flex"));
  const atRule = getCSSCompletionSuggestions("@med", 4, { catalog });
  assert.ok(atRule?.options.some(option => option.label === "@media"));
  const functionPrefix = ".box { width: va";
  const functionSuggestion = getCSSCompletionSuggestions(functionPrefix, functionPrefix.length, { catalog });
  assert.ok(functionSuggestion?.options.some(option => option.label === "var()"));
  const functionSource = ".box { width: va(";
  const fn = getCSSCompletionSuggestions(functionSource, functionSource.length, { catalog });
  assert.ok(fn?.options.some(option => option.label === "var()"));
  const unitSource = ".box { width: 12p";
  const unit = getCSSCompletionSuggestions(unitSource, unitSource.length, { catalog });
  assert.ok(unit?.options.some(option => option.label === "px"));
});

test("live JavaScript completion uses catalog identifiers and owner-scoped members", async () => {
  const catalog = await records("javascript");
  const identifier = getJavaScriptCompletionSuggestions("new Abort", 9, { catalog });
  assert.ok(identifier?.options.some(option => option.label === "AbortController"));
  const literal = getJavaScriptCompletionSuggestions("nu", 2, { catalog });
  assert.ok(literal?.options.some(option => option.label === "null" && option.kind === "literal"));
  const member = getJavaScriptCompletionSuggestions("document.query", 14, { catalog });
  assert.ok(member?.options.some(option => option.label === "querySelector"));
  assert.ok(member.options.every(option => option.kind === "method"));
});

test("catalog loader consumes embedded offline JSON without network requests", async () => {
  const makePayload = language => ({
    schemaVersion: 1,
    catalogVersion: 1,
    records: [
      { id: language + ":active", label: "active", enabled: true },
      { id: language + ":disabled", label: "disabled", enabled: false }
    ]
  });
  globalThis.__ALFACODE_COMPLETION_CATALOGS__ = {
    html: makePayload("html"),
    css: makePayload("css"),
    javascript: makePayload("javascript")
  };
  try {
    const catalogs = await loadCompletionCatalogs({
      fetcher: async () => { throw new Error("Offline loader must not fetch"); }
    });
    for (const language of ["html", "css", "javascript"]) {
      assert.equal(catalogs[language].records.length, 1);
      assert.equal(catalogs[language].records[0].label, "active");
      assert.equal(catalogs[language].error, null);
    }
  } finally {
    delete globalThis.__ALFACODE_COMPLETION_CATALOGS__;
  }
});
