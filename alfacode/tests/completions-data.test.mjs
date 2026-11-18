import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const catalogUrl = new URL("../data/completions.json", import.meta.url);
async function readCatalog() {
  return JSON.parse(await readFile(catalogUrl, "utf8"));
}
function semanticKey(r) {
  if (r.language === "html") return [r.language,r.type,r.namespace,r.tagName].join(":");
  if (r.language === "css" && r.type === "value") return [r.language,r.type,r.propertyName,r.label].join(":");
  if (r.language === "css") return [r.language,r.type,r.label].join(":");
  if (r.language === "javascript" && r.type === "member") return [r.language,r.type,r.owner,r.label].join(":");
  return [r.language,r.type,r.label].join(":");
}
function validateCatalog(catalog) {
  const errors = [];
  const add = (path, message) => errors.push({path,message});
  const nonEmpty = v => typeof v === "string" && v.trim().length > 0;
  const stringArray = v => Array.isArray(v) && v.every(nonEmpty);
  const types = {html:["tag"],css:["property","selector","value"],javascript:["identifier","member","snippet"]};
  if (!catalog || typeof catalog !== "object" || Array.isArray(catalog)) return [{path:"$",message:"catalog must be an object"}];
  if (catalog.schemaVersion !== 1) add("$.schemaVersion","must equal 1");
  if (!Number.isInteger(catalog.catalogVersion) || catalog.catalogVersion < 1) add("$.catalogVersion","must be a positive integer");
  if (!Array.isArray(catalog.records)) { add("$.records","must be an array"); return errors; }
  const ids = new Map(), semantics = new Map();
  catalog.records.forEach((r,i) => {
    const p = "$.records[" + i + "]";
    if (!r || typeof r !== "object" || Array.isArray(r)) { add(p,"record must be an object"); return; }
    for (const f of ["id","language","type","category","label","description"]) if (!nonEmpty(r[f])) add(p+"."+f,"must be a non-empty string");
    if (!Number.isInteger(r.order) || r.order < 1) add(p+".order","must be a positive integer");
    if (typeof r.enabled !== "boolean") add(p+".enabled","must be a boolean");
    if (r.rank !== undefined && (!Number.isInteger(r.rank) || r.rank < 1)) add(p+".rank","must be a positive integer when provided");
    if (!types[r.language]) add(p+".language","is not a supported language");
    else if (!types[r.language].includes(r.type)) add(p+".type","is not valid for this language");
    if (nonEmpty(r.id)) { if(ids.has(r.id)) add(p+".id","duplicate ID"); else ids.set(r.id,i); }
    if (r.language === "html" && r.type === "tag") {
      for (const f of ["tagName","operation","namespace"]) if(!nonEmpty(r[f])) add(p+"."+f,"must be a non-empty string");
      if(typeof r.isVoid !== "boolean") add(p+".isVoid","must be a boolean");
      if(!stringArray(r.contexts)) add(p+".contexts","must be an array of non-empty strings");
      if(!stringArray(r.parentTags)) add(p+".parentTags","must be an array of non-empty strings");
      if(r.operation !== "open") add(p+".operation","must equal open");
      if(!["html","svg"].includes(r.namespace)) add(p+".namespace","must be html or svg");
    }
    if(r.language === "css") {
      if(!nonEmpty(r.mode)) add(p+".mode","must be a non-empty string");
      if(!nonEmpty(r.insertText)) add(p+".insertText","must be a non-empty string");
      if(r.mode !== r.type) add(p+".mode","must match type");
      if(r.type === "value" && !nonEmpty(r.propertyName)) add(p+".propertyName","required for CSS values");
    }
    if(r.language === "javascript") {
      if(!nonEmpty(r.mode)) add(p+".mode","must be a non-empty string");
      if(!nonEmpty(r.insertText)) add(p+".insertText","must be a non-empty string");
      if(r.mode !== r.type) add(p+".mode","must match type");
      if(r.type === "member" && !nonEmpty(r.owner)) add(p+".owner","required for JavaScript members");
      if(r.type === "snippet" && r.enabled !== false) add(p+".enabled","JavaScript snippets must remain disabled");
    }
    if(nonEmpty(r.language) && nonEmpty(r.type) && nonEmpty(r.label)) {
      const key = semanticKey(r);
      if(semantics.has(key)) add(p,"duplicate semantic key"); else semantics.set(key,i);
    }
  });
  return errors;
}

test("catalog JSON is readable and parses successfully", async () => {
  const catalog = await readCatalog();
  assert.ok(catalog && typeof catalog === "object");
});
test("catalog envelope has supported schema and version", async () => {
  const c = await readCatalog();
  assert.equal(c.schemaVersion,1);
  assert.ok(Number.isInteger(c.catalogVersion) && c.catalogVersion >= 1);
  assert.ok(Array.isArray(c.records));
});
test("catalog contains the expected language and record counts", async () => {
  const records = (await readCatalog()).records;
  const counts = Object.groupBy(records,r=>r.language);
  assert.equal(records.length,348);
  assert.equal(counts.html?.length,60);
  assert.equal(counts.css?.length,174);
  assert.equal(counts.javascript?.length,114);
});
test("all records satisfy the catalog schema", async () => {
  assert.deepEqual(validateCatalog(await readCatalog()),[]);
});
test("record IDs are unique", async () => {
  const records=(await readCatalog()).records;
  assert.equal(new Set(records.map(r=>r.id)).size,records.length);
});
test("semantic keys are unique and preserve owner-specific values", async () => {
  const records=(await readCatalog()).records;
  const keys=records.map(semanticKey);
  assert.equal(new Set(keys).size,keys.length);
});
test("all JavaScript snippets are disabled", async () => {
  const snippets=(await readCatalog()).records.filter(r=>r.language==="javascript"&&r.type==="snippet");
  assert.equal(snippets.length,8);
  assert.ok(snippets.every(r=>r.enabled===false));
});
test("CSS values and JavaScript members declare owners", async () => {
  const records=(await readCatalog()).records;
  assert.ok(records.filter(r=>r.language==="css"&&r.type==="value").every(r=>typeof r.propertyName==="string"&&r.propertyName.length>0));
  assert.ok(records.filter(r=>r.language==="javascript"&&r.type==="member").every(r=>typeof r.owner==="string"&&r.owner.length>0));
});
test("validator rejects invalid envelope and versions", () => {
  assert.ok(validateCatalog(null).some(e=>e.path==="$"));
  assert.ok(validateCatalog({schemaVersion:2,catalogVersion:1,records:[]}).some(e=>e.path==="$.schemaVersion"));
  assert.ok(validateCatalog({schemaVersion:1,catalogVersion:0,records:[]}).some(e=>e.path==="$.catalogVersion"));
  assert.ok(validateCatalog({schemaVersion:1,catalogVersion:1,records:{}}).some(e=>e.path==="$.records"));
});
test("validator rejects missing common fields and invalid types", () => {
  const c={schemaVersion:1,catalogVersion:1,records:[{id:"",language:"html",type:"tag",category:"x",label:"x",description:"x",order:0,enabled:"yes"}]};
  const paths=validateCatalog(c).map(e=>e.path);
  for(const p of ["$.records[0].id","$.records[0].order","$.records[0].enabled"]) assert.ok(paths.includes(p));
});
test("validator rejects unsupported languages and type combinations", () => {
  const base={id:"x",category:"x",label:"x",description:"x",order:1,enabled:true};
  const c={schemaVersion:1,catalogVersion:1,records:[{...base,language:"ruby",type:"tag"},{...base,id:"y",language:"html",type:"property"}]};
  const paths=validateCatalog(c).map(e=>e.path);
  assert.ok(paths.includes("$.records[0].language"));
  assert.ok(paths.includes("$.records[1].type"));
});
test("validator rejects duplicate IDs and semantic keys", () => {
  const base={language:"javascript",type:"identifier",category:"x",label:"same",description:"x",mode:"identifier",insertText:"same",order:1,enabled:true};
  const c={schemaVersion:1,catalogVersion:1,records:[{...base,id:"dup"},{...base,id:"dup"}]};
  const errors=validateCatalog(c);
  assert.ok(errors.some(e=>e.path==="$.records[1].id"));
  assert.ok(errors.some(e=>e.message==="duplicate semantic key"));
});
test("validator rejects incomplete HTML, CSS and JavaScript records", () => {
  const c={schemaVersion:1,catalogVersion:1,records:[
    {id:"h",language:"html",type:"tag",category:"x",label:"div",description:"x",order:1,enabled:true,tagName:"div",operation:"close",isVoid:"no",contexts:"head",parentTags:[],namespace:"xml"},
    {id:"c",language:"css",type:"value",category:"x",label:"block",description:"x",order:1,enabled:true,mode:"value",insertText:"block"},
    {id:"j",language:"javascript",type:"member",category:"x",label:"log",description:"x",order:1,enabled:true,mode:"member",insertText:"log"}
  ]};
  const paths=validateCatalog(c).map(e=>e.path);
  for(const p of ["$.records[0].isVoid","$.records[0].contexts","$.records[0].operation","$.records[0].namespace","$.records[1].propertyName","$.records[2].owner"]) assert.ok(paths.includes(p),p);
});
test("validator rejects enabled JavaScript snippets", () => {
  const c={schemaVersion:1,catalogVersion:1,records:[{id:"s",language:"javascript",type:"snippet",category:"x",label:"snippet",description:"x",mode:"snippet",insertText:"x",order:1,enabled:true}]};
  assert.ok(validateCatalog(c).some(e=>e.path==="$.records[0].enabled"));
});

test("validator rejects non-object records", () => {
  const catalog = { schemaVersion: 1, catalogVersion: 1, records: [null, "not-a-record", []] };
  const errors = validateCatalog(catalog);
  assert.equal(errors.filter(error => error.message === "record must be an object").length, 3);
});
