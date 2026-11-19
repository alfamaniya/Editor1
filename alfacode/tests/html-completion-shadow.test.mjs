import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getHTMLTagSuggestions } from "../src/language/html/html-completion.js";
import { parseHTML } from "../src/language/html/html-parser.js";
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

// Read the actual open-element path from the parser tree. The semantic context
// used by catalog records is deliberately kept separate from the real parent.
function getOpenTagState(source) {
  const parsed = parseHTML(source);
  const path = [];
  let children = parsed.root.children;

  while (children) {
    const openElement = [...children].reverse().find(node =>
      node.type === "Element" && !node.selfClosing &&
      node.closeStart === undefined && node.end === source.length
    );
    if (!openElement) break;
    path.push(openElement.name.toLowerCase());
    children = openElement.children;
  }

  const parent = path.at(-1) ?? "root";
  const isSVG = path.includes("svg");
  const context = isSVG ? "svg" : parent === "html" ? "root" : parent;
  return { parent, context, isSVG };
}

// Shadow adapter: JSON supplies enabled state and metadata. Existing Legacy
// candidates remain eligible as a compatibility floor; explicit parentTags
// constrain additional JSON coverage, not established Legacy behavior.
function getJSONShadowSuggestions(legacy, records, source, tagStart) {
  if (!legacy) return null;
  const state = getOpenTagState(source.slice(0, tagStart));
  const legacyLabels = new Set(legacy.options.map(option => option.label.toLowerCase()));
  const candidates = records.filter(record => {
    if (record.enabled !== true || record.operation !== "open") return false;
    if (record.namespace !== (state.isSVG ? "svg" : "html")) return false;
    const name = record.tagName.toLowerCase();
    const legacyCompatible = legacyLabels.has(name);
    const parentAllowed = !record.parentTags?.length ||
      record.parentTags.some(value => value.toLowerCase() === state.parent) ||
      legacyCompatible;
    if (!parentAllowed) return false;
    if (record.contexts?.length && !record.contexts.includes(state.context) && !legacyCompatible) return false;
    return true;
  });

  const legacyOrder = new Map(legacy.options.map((option, index) =>
    [option.label.toLowerCase(), index]));
  const rank = record => Number.isInteger(record.rank) ? record.rank :
    Number.isInteger(record.order) ? record.order : Number.MAX_SAFE_INTEGER;
  const query = legacy.query?.toLowerCase() ?? "";
  const ordered = candidates
    .filter(record => record.tagName.toLowerCase().startsWith(query))
    .sort((a, b) => {
      const aLegacy = legacyOrder.get(a.tagName.toLowerCase());
      const bLegacy = legacyOrder.get(b.tagName.toLowerCase());
      if (aLegacy !== undefined && bLegacy !== undefined) return aLegacy - bLegacy;
      if (aLegacy !== undefined) return -1;
      if (bLegacy !== undefined) return 1;
      return rank(a) - rank(b) || a.order - b.order;
    });

  const hasJumpClose = legacy.mode === "chain" &&
    legacy.options.some(option => option.kind === "jump-close");
  const candidateLimit = Math.max(0, legacy.options.length - (hasJumpClose ? 1 : 0));
  const jsonOptions = ordered.slice(0, candidateLimit).map(record => ({
    label: record.tagName,
    kind: legacy.mode === "chain" ? "child" : "open",
    isVoid: record.isVoid,
    description: record.description,
    from: legacy.from,
    to: legacy.to
  }));

  // close/jump-close are stack operations, not catalog operations.
  if (legacy.mode === "close") return normalizeLegacy(legacy);
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
    const tagStart = fixture.source.slice(0, fixture.cursor).match(/<\/?[A-Za-z][A-Za-z0-9:-]*$/)?.index
      ?? fixture.cursor;
    const shadow = getJSONShadowSuggestions(legacy, records, fixture.source, tagStart);

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

  console.log("HTML shadow fixtures:", htmlCompletionFixtures.length,
    "behavioral differences:", differences.length,
    JSON.stringify(differences));
  assert.equal(differences.length, 0,
    "JSON shadow output must preserve the full Legacy option labels and ordering; inspect the diagnostic diff above.");
  assert.equal(htmlCompletionFixtures.length, 32);
});
