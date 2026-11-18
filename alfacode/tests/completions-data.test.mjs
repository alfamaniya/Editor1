import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const catalogFiles = {
  html: new URL("../data/completions.html.json", import.meta.url),
  css: new URL("../data/completions.css.json", import.meta.url),
  javascript: new URL("../data/completions.javascript.json", import.meta.url)
};
async function readCatalogFiles() {
  return Object.fromEntries(await Promise.all(
    Object.entries(catalogFiles).map(async ([language, url]) => [
      language,
      JSON.parse(await readFile(url, "utf8"))
    ])
  ));
}
async function readCatalog() {
  const catalogs = await readCatalogFiles();
  const versions = Object.values(catalogs);
  return {
    schemaVersion: versions[0].schemaVersion,
    catalogVersion: versions[0].catalogVersion,
    records: Object.values(catalogs).flatMap(catalog => catalog.records)
  };
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
  const types = {html:["tag"],css:["property","selector","value","at-rule","function","unit"],javascript:["identifier","member","snippet"]};
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

test("all three language catalog JSON files are readable and parse successfully", async () => {
  const catalogs = await readCatalogFiles();
  assert.deepEqual(Object.keys(catalogs).sort(), ["css", "html", "javascript"]);
  for (const catalog of Object.values(catalogs)) {
    assert.ok(catalog && typeof catalog === "object");
    assert.ok(Array.isArray(catalog.records));
  }
});
test("each language catalog has a supported and consistent envelope", async () => {
  const catalogs = await readCatalogFiles();
  const versions = new Set();
  for (const [language, catalog] of Object.entries(catalogs)) {
    assert.equal(catalog.schemaVersion, 1, language);
    assert.ok(Number.isInteger(catalog.catalogVersion) && catalog.catalogVersion >= 1, language);
    assert.ok(Array.isArray(catalog.records), language);
    versions.add(catalog.catalogVersion);
  }
  assert.equal(versions.size, 1, "all language catalogs must use the same catalogVersion");
});
test("each language file contains only its language and expected record count", async () => {
  const catalogs = await readCatalogFiles();
  const expected = { html: 146, css: 489, javascript: 114 };
  for (const [language, catalog] of Object.entries(catalogs)) {
    assert.equal(catalog.records.length, expected[language], language);
    assert.ok(catalog.records.every(record => record.language === language),
      language + " file must not contain records from another language");
  }
  const records = (await readCatalog()).records;
  assert.equal(records.length, 749);
});
test("each language file and the merged catalog satisfy the catalog schema", async () => {
  const catalogs = await readCatalogFiles();
  for (const [language, catalog] of Object.entries(catalogs)) {
    assert.deepEqual(validateCatalog(catalog), [], language);
  }
  assert.deepEqual(validateCatalog(await readCatalog()), []);
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

test("HTML-1 text, heading, quotation, code, bidi and edit tags are present", async () => {
  const { html } = await readCatalogFiles();
  const expected = [
    "h3","h4","h5","h6","hgroup","blockquote","pre",
    "b","u","mark","small","s","cite","q","dfn","abbr",
    "code","var","samp","kbd","data","time",
    "sub","sup","ruby","rt","rp","bdi","bdo","wbr","ins","del"
  ];
  const actual = new Set(html.records.map(record => record.tagName));
  for (const tag of expected) assert.ok(actual.has(tag), "missing HTML tag: " + tag);
  assert.equal(expected.length, 32);
});

test("HTML-2 semantic sectioning and grouping tags are present with valid metadata", async () => {
  const { html } = await readCatalogFiles();
  const byTag = new Map(html.records.map(record => [record.tagName, record]));
  const expected = ["aside", "address", "figure", "figcaption"];
  for (const tag of expected) {
    assert.ok(byTag.has(tag), "missing HTML-2 tag: " + tag);
    const record = byTag.get(tag);
    assert.equal(record.namespace, "html");
    assert.equal(record.operation, "open");
    assert.equal(record.isVoid, false);
    assert.equal(record.enabled, true);
  }
  assert.equal(byTag.get("aside").category, "بخش‌بندی و ناوبری");
  assert.equal(byTag.get("address").category, "بخش‌بندی و ناوبری");
  assert.equal(byTag.get("figure").category, "گروه‌بندی محتوا");
  assert.equal(byTag.get("figcaption").category, "گروه‌بندی محتوا");
  assert.deepEqual(byTag.get("figcaption").parentTags, ["figure"]);
  assert.equal(expected.length, 4);
});


test("HTML-3 responsive images, media and image-map elements have valid metadata", async () => {
  const { html } = await readCatalogFiles();
  const byTag = new Map(html.records.map(record => [record.tagName, record]));
  for (const tag of ["picture","source","audio","video","track","map","area"]) {
    assert.ok(byTag.has(tag), "missing HTML-3 tag: " + tag);
    assert.equal(byTag.get(tag).namespace, "html");
  }
  for (const tag of ["source","track","area"]) assert.equal(byTag.get(tag).isVoid, true);
  assert.deepEqual(byTag.get("area").parentTags, ["map"]);
  assert.deepEqual(byTag.get("track").parentTags, ["audio","video"]);
  assert.ok(byTag.get("source").parentTags.includes("picture"));
});

test("HTML-4 menu and list semantics are represented", async () => {
  const { html } = await readCatalogFiles();
  const menu = html.records.find(record => record.tagName === "menu" && record.namespace === "html");
  const li = html.records.find(record => record.tagName === "li" && record.namespace === "html");
  assert.ok(menu);
  assert.ok(li.parentTags.includes("menu"));
  assert.equal(menu.isVoid, false);
});

test("HTML-5 form grouping, suggestions and output elements are present", async () => {
  const { html } = await readCatalogFiles();
  const byTag = new Map(html.records.map(record => [record.tagName, record]));
  for (const tag of ["fieldset","legend","output","datalist","meter","progress"]) assert.ok(byTag.has(tag), "missing HTML-5 tag: " + tag);
  assert.deepEqual(byTag.get("legend").parentTags, ["fieldset"]);
  for (const tag of ["fieldset","legend","output","datalist","meter","progress"]) assert.equal(byTag.get(tag).isVoid, false);
});

test("HTML-6 table column element has the correct void and parent metadata", async () => {
  const { html } = await readCatalogFiles();
  const col = html.records.find(record => record.tagName === "col" && record.namespace === "html");
  assert.ok(col);
  assert.equal(col.isVoid, true);
  assert.deepEqual(col.parentTags, ["colgroup"]);
});

test("HTML-7 interactive, embedded and template elements are present", async () => {
  const { html } = await readCatalogFiles();
  const byTag = new Map(html.records.map(record => [record.tagName, record]));
  for (const tag of ["details","summary","dialog","iframe","embed","object","template","slot","canvas"]) assert.ok(byTag.has(tag), "missing HTML-7 tag: " + tag);
  assert.deepEqual(byTag.get("summary").parentTags, ["details"]);
  assert.equal(byTag.get("embed").isVoid, true);
  for (const tag of ["details","summary","dialog","iframe","object","template","slot","canvas"]) assert.equal(byTag.get(tag).isVoid, false);
});

test("HTML-8 SVG definitions, reuse, text and filter primitives use SVG namespace", async () => {
  const { html } = await readCatalogFiles();
  const svg = html.records.filter(record => record.namespace === "svg");
  const byTag = new Map(svg.map(record => [record.tagName, record]));
  for (const tag of ["defs","use","symbol","title","desc","image","textPath","tspan","linearGradient","radialGradient","stop","pattern","clipPath","mask","filter","feGaussianBlur","feOffset","feBlend","feColorMatrix","feComposite","feFlood","feMerge","feMergeNode","marker","foreignObject"]) {
    assert.ok(byTag.has(tag), "missing SVG tag: " + tag);
  }
  assert.deepEqual(byTag.get("stop").parentTags, ["linearGradient","radialGradient"]);
  assert.deepEqual(byTag.get("feMergeNode").parentTags, ["feMerge"]);
  assert.ok(svg.every(record => record.contexts.includes("svg")));
});

test("HTML-9 ordinary catalog contains no deprecated legacy HTML tags", async () => {
  const { html } = await readCatalogFiles();
  const legacy = new Set(["acronym","applet","basefont","big","center","dir","font","frame","frameset","marquee","menuitem","nobr","noembed","noframes","param","plaintext","rb","rtc","strike","tt","xmp"]);
  const present = html.records.filter(record => record.namespace === "html" && legacy.has(record.tagName));
  assert.deepEqual(present.map(record => record.tagName), []);
});

test("HTML-10 search is a current standardized element and remains distinct from input search", async () => {
  const { html } = await readCatalogFiles();
  const search = html.records.find(record => record.namespace === "html" && record.tagName === "search");
  assert.ok(search);
  assert.equal(search.isVoid, false);
  assert.equal(search.enabled, true);
  assert.equal(search.operation, "open");
});


test("CSS-1 box model and logical sizing properties are present", async () => {
 const {css}=await readCatalogFiles(); const names=new Set(css.records.filter(r=>r.type==="property").map(r=>r.label));
 for(const name of ["margin-block","margin-block-start","margin-block-end","margin-inline","margin-inline-start","margin-inline-end","padding-block","padding-block-start","padding-block-end","padding-inline","padding-inline-start","padding-inline-end","border-width","border-style","border-color","border-top","border-right","border-bottom","border-left","outline","outline-width","outline-style","outline-color","outline-offset","aspect-ratio","block-size","inline-size","min-block-size","max-block-size","min-inline-size","max-inline-size"]) assert.ok(names.has(name),"missing CSS-1 property: "+name);
});


test("CSS-2 Color and backgrounds records are present", async () => {
 const {css}=await readCatalogFiles();
 const keys=new Set(css.records.map(r=>r.type+":"+r.label));
 for(const label of ["background-position","background-size","background-repeat","background-attachment","background-origin","background-clip","background-blend-mode","mix-blend-mode","object-fit","object-position","image-rendering","isolation","background-repeat:repeat","background-repeat:repeat-x","background-repeat:repeat-y","background-repeat:no-repeat","background-repeat:space","background-repeat:round","background-size:cover","background-size:contain","background-size:auto","background-attachment:scroll","background-attachment:fixed","background-attachment:local","background-origin:border-box","background-origin:padding-box","background-origin:content-box","background-clip:border-box","background-clip:padding-box","background-clip:content-box","background-clip:text","object-fit:fill","object-fit:contain","object-fit:cover","object-fit:none","object-fit:scale-down","image-rendering:auto","image-rendering:smooth","image-rendering:pixelated"]) { const found=css.records.some(r=>r.label===label||r.propertyName+":"+r.label===label); assert.ok(found,"missing CSS-2 record: "+label); }
});


test("CSS-3 typography and text properties and values are present", async()=>{const {css}=await readCatalogFiles();for(const label of ["font-style","font-variant","font-stretch","font-feature-settings","font-kerning","font-optical-sizing","font-variation-settings","font-size-adjust","text-indent","text-overflow","text-shadow","text-decoration-line","text-decoration-color","text-decoration-style","text-underline-offset","letter-spacing","word-spacing","word-break","overflow-wrap","hyphens","writing-mode","text-orientation","direction","font-style:italic","font-style:oblique","font-style:normal","text-overflow:clip","text-overflow:ellipsis","word-break:normal","word-break:break-all","word-break:keep-all","overflow-wrap:normal","overflow-wrap:anywhere","overflow-wrap:break-word","hyphens:none","hyphens:manual","hyphens:auto","writing-mode:horizontal-tb","writing-mode:vertical-rl","writing-mode:vertical-lr","text-orientation:mixed","text-orientation:upright","text-orientation:sideways","text-decoration-line:underline","text-decoration-line:overline","text-decoration-line:line-through","text-decoration-line:none"])assert.ok(css.records.some(r=>r.label===label||r.propertyName+":"+r.label===label),"missing CSS-3: "+label);});


test("CSS-4 Flexbox properties and scoped alignment values are present",async()=>{const {css}=await readCatalogFiles();for(const label of ["flex-grow","flex-shrink","flex-flow","justify-items","place-content","place-items","place-self","row-gap","align-content:normal","align-content:space-between","align-content:space-around","align-content:space-evenly","align-content:stretch","align-content:center"])assert.ok(css.records.some(r=>r.label===label||r.propertyName+":"+r.label===label),"missing CSS-4: "+label);});


test("CSS-5 Grid properties and placement values are present",async()=>{const {css}=await readCatalogFiles();for(const label of ["grid-template-areas","grid-auto-columns","grid-auto-rows","grid-auto-flow","grid-area","grid-column","grid-column-start","grid-column-end","grid-row","grid-row-start","grid-row-end","justify-self","grid-auto-flow:row","grid-auto-flow:column","grid-auto-flow:dense","grid-auto-flow:row dense","grid-auto-flow:column dense","grid-template-areas:none","grid-column:auto","grid-row:auto","justify-items:start","justify-items:end","justify-items:center","justify-items:stretch","justify-self:start","justify-self:end","justify-self:center","justify-self:stretch"])assert.ok(css.records.some(r=>r.label===label||r.propertyName+":"+r.label===label),"missing CSS-5: "+label);});


test("CSS-6 positioning, overflow and containment records are present",async()=>{const {css}=await readCatalogFiles();for(const label of ["inset","inset-block","inset-block-start","inset-block-end","inset-inline","inset-inline-start","inset-inline-end","float","clear","overflow-x","overflow-y","contain","content-visibility","contain-intrinsic-size","float:left","float:right","float:inline-start","float:inline-end","float:none","clear:left","clear:right","clear:both","clear:inline-start","clear:inline-end","clear:none","overflow-x:visible","overflow-x:hidden","overflow-x:clip","overflow-x:scroll","overflow-x:auto","overflow-y:visible","overflow-y:hidden","overflow-y:clip","overflow-y:scroll","overflow-y:auto","display:flow-root"])assert.ok(css.records.some(r=>r.label===label||r.propertyName+":"+r.label===label),"missing CSS-6: "+label);});


test("CSS-7 combinators, attribute selectors, pseudo-classes and pseudo-elements are present",async()=>{const {css}=await readCatalogFiles();const labels=new Set(css.records.filter(r=>r.type==="selector").map(r=>r.label));for(const label of ["*",">","+","~","[attr]","[attr=\"value\"]","[attr^=\"value\"]","[attr$=\"value\"]","[attr*=\"value\"]","[attr~=\"value\"]","[attr|=\"value\"]",":first-child",":last-child",":only-child",":nth-child()",":nth-last-child()",":first-of-type",":last-of-type",":only-of-type",":nth-of-type()",":nth-last-of-type()",":empty",":root",":not()",":is()",":where()",":has()",":focus-visible",":focus-within",":checked",":disabled",":enabled",":required",":optional",":valid",":invalid",":in-range",":out-of-range",":read-only",":read-write",":placeholder-shown",":target",":lang()",":dir()",":defined","::marker","::selection","::placeholder","::first-letter","::first-line","::backdrop","::file-selector-button","::part()"])assert.ok(labels.has(label),"missing CSS-7 selector: "+label);});


test("CSS-8 visual effects, transitions, animations and scroll snapping are present",async()=>{const {css}=await readCatalogFiles();for(const label of ["border-image","border-image-source","border-image-slice","border-image-width","border-image-outset","border-image-repeat","filter","backdrop-filter","transform-origin","transform-style","perspective","perspective-origin","backface-visibility","transition-property","transition-duration","transition-timing-function","transition-delay","animation-name","animation-duration","animation-timing-function","animation-delay","animation-iteration-count","animation-direction","animation-fill-mode","animation-play-state","scroll-behavior","scroll-snap-type","scroll-snap-align","transform-style:flat","transform-style:preserve-3d","backface-visibility:visible","backface-visibility:hidden","transition-timing-function:ease","transition-timing-function:ease-in","transition-timing-function:ease-out","transition-timing-function:ease-in-out","transition-timing-function:linear","animation-direction:normal","animation-direction:reverse","animation-direction:alternate","animation-direction:alternate-reverse","animation-fill-mode:none","animation-fill-mode:forwards","animation-fill-mode:backwards","animation-fill-mode:both","animation-play-state:running","animation-play-state:paused","scroll-behavior:auto","scroll-behavior:smooth","scroll-snap-align:start","scroll-snap-align:end","scroll-snap-align:center"])assert.ok(css.records.some(r=>r.label===label||r.propertyName+":"+r.label===label),"missing CSS-8: "+label);});


test("CSS-9 standard conditional, grouping and registration at-rules are present",async()=>{const {css}=await readCatalogFiles();for(const label of ["@media","@supports","@container","@layer","@import","@namespace","@page","@font-face","@keyframes","@counter-style","@property","@scope","@starting-style","@charset","@font-feature-values"])assert.ok(css.records.some(r=>r.type==="at-rule"&&r.label===label),"missing CSS-9 at-rule: "+label);});
