import test from "node:test";
import assert from "node:assert/strict";
import { createBlankRecord, parseCatalogImport, serializeCatalog, validateCatalogDraft } from "../../core/completion-catalog/catalog-manager.js";

test("TSV import preserves clipboard columns and converts typed values", () => {
  const rows = parseCatalogImport(["label","description","order","enabled","contexts"].join("\\t") + "\\n" + ["main","Main content","2","true",'["body"]'].join("\\t"), "html");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].label, "main");
  assert.equal(rows[0].description, "Main content");
  assert.equal(rows[0].order, 2);
  assert.equal(rows[0].enabled, true);
  assert.deepEqual(rows[0].contexts, ["body"]);
});

test("CSV import handles quoted commas and escaped quotes", () => {
  const rows = parseCatalogImport(["label,description",'main,"A, ""quoted"" description"'].join("\\n"), "html");
  assert.equal(rows[0].description, 'A, "quoted" description');
});

test("JSON import accepts catalog envelopes and record arrays", () => {
  assert.deepEqual(parseCatalogImport('{"records":[{"label":"display"}]}', "css"), [{ label: "display", language: "css" }]);
  assert.deepEqual(parseCatalogImport('[{"label":"Date"}]', "javascript"), [{ label: "Date", language: "javascript" }]);
  assert.throws(() => parseCatalogImport('{"items":[]}', "html"), /records/);
});

test("draft validation catches missing fields, duplicate IDs and semantic duplicates", () => {
  const first = { id:"a",language:"css",type:"property",category:"x",label:"display",description:"x",mode:"property",insertText:"display",order:1,enabled:true };
  const second = { ...first, id:"a" };
  const errors = validateCatalogDraft("css", [first, second]);
  assert.ok(errors.some(error => error.index === 1 && error.field === "id"));
  assert.ok(errors.some(error => error.index === 1 && error.field === "label"));
});

test("draft validation enforces safe JavaScript snippet defaults", () => {
  const snippet = { id:"s",language:"javascript",type:"snippet",category:"x",label:"sample",description:"x",mode:"snippet",insertText:"sample()",order:1,enabled:true };
  assert.ok(validateCatalogDraft("javascript", [snippet]).some(error => error.field === "enabled"));
  snippet.enabled = false;
  assert.deepEqual(validateCatalogDraft("javascript", [snippet]), []);
});

test("blank records provide language-specific starting fields", () => {
  assert.equal(createBlankRecord("html").namespace, "html");
  assert.equal(createBlankRecord("css").mode, "property");
  assert.equal(createBlankRecord("javascript").mode, "identifier");
  assert.throws(() => createBlankRecord("ruby"), /پشتیبانی/);
});

test("serialization emits a versioned JSON catalog", () => {
  const result = JSON.parse(serializeCatalog("css", 2, []));
  assert.deepEqual(result, { schemaVersion: 1, catalogVersion: 2, records: [] });
});
