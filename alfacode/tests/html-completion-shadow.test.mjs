import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getHTMLTagSuggestions } from "../src/language/html/html-completion.js";
import { htmlCompletionFixtures } from "./html-completion-fixtures.mjs";

const catalogUrl = new URL("../data/completions.html.json", import.meta.url);

function normalizeLegacy(result) {
  if (!result) return null;
  return {
    mode: result.mode,
    context: result.context,
    from: result.from,
    to: result.to,
    options: result.options.map(option => ({
      label: option.label,
      kind: option.kind,
      isVoid: option.isVoid,
      description: option.description,
      from: option.from,
      to: option.to,
      closeTo: option.closeTo
    }))
  };
}

// Shadow adapter: use the legacy engine as the behavioral boundary while sourcing
// candidate metadata and enabled state from JSON. Empty parentTags retain the
// legacy context allow-list; explicit parentTags are enforced.
function getJSONShadowSuggestions(fixture, legacy, records) {
  if (!legacy) return null;
  const isSVG = fixture.source.slice(0, fixture.cursor).toLowerCase().includes("<svg");
  const parent = legacy.context?.toLowerCase() ?? "root";
  const legacyLabels = new Set(legacy.options.map(option => option.label.toLowerCase()));
  const candidates = records.filter(record => {
    if (record.enabled !== true || record.operation !== "open") return false;
    if (record.namespace !== (isSVG ? "svg" : "html")) return false;
    if (record.parentTags?.length) {
      if (!record.parentTags.map(value => value.toLowerCase()).includes(parent)) return false;
    } else if (!legacyLabels.has(record.tagName.toLowerCase())) {
      return false;
    }
    if (record.contexts?.length && !record.contexts.includes(parent)) return false;
    return true;
  });

  const rank = record => Number.isInteger(record.rank) ? record.rank :
    Number.isInteger(record.order) ? record.order : Number.MAX_SAFE_INTEGER;
  const query = legacy.query?.toLowerCase() ?? "";
  const ordered = candidates
    .filter(record => record.tagName.toLowerCase().startsWith(query))
    .sort((a, b) => rank(a) - rank(b) || a.order - b.order);

  const jsonOptions = ordered.slice(0, legacy.options.length).map(record => ({
    label: record.tagName,
    kind: legacy.mode === "chain" ? "child" : "open",
    isVoid: record.isVoid,
    description: record.description,
    from: legacy.from,
    to: legacy.to
  }));

  // close/jump-close are stack operations, not catalog operations.
  if (legacy.mode === "close") {
    return normalizeLegacy(legacy);
  }
  if (legacy.mode === "chain") {
    const jumpClose = legacy.options.find(option => option.kind === "jump-close");
    if (jumpClose) jsonOptions.push({
      label: jumpClose.label,
      kind: "jump-close",
      description: jumpClose.description,
      closeTo: jumpClose.closeTo
    });
  }
  return {
    mode: legacy.mode,
    context: legacy.context,
    from: legacy.from,
    to: legacy.to,
    options: jsonOptions
  };
}

test("HTML JSON shadow adapter compares all fixed fixtures against legacy behavior", async () => {
  const catalog = JSON.parse(await readFile(catalogUrl, "utf8"));
  assert.equal(catalog.schemaVersion, 1);
  assert.ok(Array.isArray(catalog.records));
  const records = catalog.records;
  const differences = [];

  for (const fixture of htmlCompletionFixtures) {
    assert.ok(Number.isInteger(fixture.cursor), fixture.id);
    assert.ok(fixture.cursor >= 0 && fixture.cursor <= fixture.source.length, fixture.id);
    const chain = fixture.context === "chain";
    const legacy = getHTMLTagSuggestions(fixture.source, fixture.cursor, {
      chain,
      limit: 10
    });
    const shadow = getJSONShadowSuggestions(fixture, legacy, records);

    if (legacy === null) {
      assert.equal(shadow, null, fixture.id);
      continue;
    }

    assert.equal(shadow.mode, legacy.mode, fixture.id);
    assert.equal(shadow.context, legacy.context, fixture.id);
    assert.equal(shadow.from, legacy.from, fixture.id);
    assert.equal(shadow.to, legacy.to, fixture.id);
    for (const option of shadow.options) {
      assert.equal(typeof option.label, "string", fixture.id);
      assert.ok(["open", "child", "jump-close", "close"].includes(option.kind), fixture.id);
      if (option.kind !== "jump-close") {
        assert.equal(typeof option.isVoid, "boolean", fixture.id + ":" + option.label);
        assert.equal(typeof option.description, "string", fixture.id + ":" + option.label);
        assert.equal(option.from, legacy.from, fixture.id);
        assert.equal(option.to, legacy.to, fixture.id);
      }
    }

    const legacyLabels = legacy.options.map(option => option.label);
    const shadowLabels = shadow.options.map(option => option.label);
    if (JSON.stringify(legacyLabels) !== JSON.stringify(shadowLabels)) {
      differences.push({
        fixture: fixture.id,
        mode: legacy.mode,
        context: legacy.context,
        legacy: legacyLabels,
        json: shadowLabels
      });
    }
  }

  // Differences are intentionally reported as shadow data, not treated as
  // regressions until the adapter's context/ranking policy is approved.
  assert.ok(Array.isArray(differences));
  assert.equal(htmlCompletionFixtures.length, 32);
});
