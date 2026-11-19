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
  const types = {html:["tag"],css:["property","selector","value","at-rule","function","unit"],javascript:["identifier","member","snippet","literal"]};
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
      if(r.type === "member" && !["static-method","instance-method","static-property","instance-property","host-method"].includes(r.memberKind)) add(p+".memberKind","required valid classification for JavaScript members");
      if(r.type === "snippet" && r.enabled !== false) add(p+".enabled","JavaScript snippets must remain disabled");
      if(r.type === "literal" && !["boolean","null"].includes(r.literalKind)) add(p+".literalKind","must be boolean or null for JavaScript literals");
      if(r.type === "identifier" && r.category === "کلمات کلیدی" && !["reserved","strict-reserved","contextual-reserved","contextual","future-reserved"].includes(r.keywordKind)) add(p+".keywordKind","required valid classification for JavaScript keywords");
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
  const expected = { html: 146, css: 929, javascript: 689 };
  for (const [language, catalog] of Object.entries(catalogs)) {
    assert.equal(catalog.records.length, expected[language], language);
    assert.ok(catalog.records.every(record => record.language === language),
      language + " file must not contain records from another language");
  }
  const records = (await readCatalog()).records;
  assert.equal(records.length, 1764);
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


test("CSS-10 standard math, color, gradient and transform functions and common units are present",async()=>{const {css}=await readCatalogFiles();for(const label of ["var()","calc()","min()","max()","clamp()","env()","rgb()","rgba()","hsl()","hsla()","hwb()","lab()","lch()","oklab()","oklch()","color()","color-mix()","linear-gradient()","repeating-linear-gradient()","radial-gradient()","repeating-radial-gradient()","conic-gradient()","repeating-conic-gradient()","translate()","translateX()","translateY()","translateZ()","translate3d()","scale()","scaleX()","scaleY()","scale3d()","rotate()","rotateX()","rotateY()","rotateZ()","rotate3d()","skew()","skewX()","skewY()","matrix()","matrix3d()","perspective()","cubic-bezier()","steps()","minmax()","repeat()","fit-content()","round()","mod()","rem()"])assert.ok(css.records.some(r=>r.type==="function"&&r.label===label),"missing CSS function: "+label);for(const label of ["px","em","rem","ex","ch","cap","ic","lh","rlh","vw","vh","vmin","vmax","svw","svh","lvw","lvh","dvw","dvh","cm","mm","in","pt","pc","Q","%","deg","rad","grad","turn","s","ms","fr"])assert.ok(css.records.some(r=>r.type==="unit"&&r.label===label),"missing CSS unit: "+label);});


test("CSS-11 property values are associated only with their owning properties",async()=>{const {css}=await readCatalogFiles();for(const key of ["display:list-item","display:table","display:table-row","display:table-cell","cursor:wait","cursor:help","cursor:crosshair","cursor:zoom-in","cursor:zoom-out","border-style:hidden","border-style:groove","border-style:ridge","border-style:inset","border-style:outset","text-align:match-parent","flex:none","flex:auto","flex:initial","align-self:auto","align-self:stretch","align-self:flex-start","align-self:flex-end","align-self:center","align-self:baseline","vertical-align:baseline","vertical-align:sub","vertical-align:super","vertical-align:top","vertical-align:text-top","vertical-align:middle","vertical-align:bottom","vertical-align:text-bottom","animation:infinite","animation:alternate","animation:forwards","animation:backwards","animation:both"]){const [property,...parts]=key.split(":");const value=parts.join(":");assert.ok(css.records.some(r=>r.type==="value"&&r.propertyName===property&&r.label===value),"missing scoped CSS value: "+key);}});


test("CSS-12 final audit: IDs, semantic keys, value owners and typed syntax are valid",async()=>{const {css}=await readCatalogFiles();const ids=css.records.map(r=>r.id);assert.equal(new Set(ids).size,ids.length);const keys=css.records.map(r=>r.type==="value"?r.type+":"+r.propertyName+":"+r.label:r.type+":"+r.label);assert.equal(new Set(keys).size,keys.length);const properties=new Set(css.records.filter(r=>r.type==="property").map(r=>r.label));assert.ok(css.records.filter(r=>r.type==="value").every(r=>r.propertyName==="*"||properties.has(r.propertyName)));for(const type of ["at-rule","function","unit"])assert.ok(css.records.filter(r=>r.type===type).every(r=>r.mode===type&&r.insertText));assert.ok(css.records.every(r=>r.description&&r.description!=="CSS property"&&r.description!=="CSS selector"&&r.description!=="Common CSS value"));});


test("CSS-11 follow-up: every catalog property has at least one property-scoped value",async()=>{const {css}=await readCatalogFiles();const properties=css.records.filter(r=>r.type==="property").map(r=>r.label);const owners=new Set(css.records.filter(r=>r.type==="value"&&r.propertyName!=="*").map(r=>r.propertyName));for(const property of properties)assert.ok(owners.has(property),"property has no scoped values: "+property);});

test("JS-1 covers ECMAScript reserved words and classifies contextual names", async () => {
  const { javascript } = await readCatalogFiles();
  const keywords = javascript.records.filter(record => record.category === "کلمات کلیدی");
  const byLabel = new Map(keywords.map(record => [record.label, record]));
  const alwaysReserved = [
    "break","case","catch","class","const","continue","debugger","default","delete","do",
    "else","export","extends","finally","for","function","if","import","in","instanceof",
    "new","return","super","switch","this","throw","try","typeof","var","void","while","with"
  ];
  for (const word of alwaysReserved) {
    assert.equal(byLabel.get(word)?.keywordKind, "reserved", "incorrect classification: " + word);
  }
  for (const word of ["let","static"]) assert.equal(byLabel.get(word)?.keywordKind, "strict-reserved");
  for (const word of ["await","yield"]) assert.equal(byLabel.get(word)?.keywordKind, "contextual-reserved");
  for (const word of ["async","from","of","as","get","set","meta","target"]) {
    assert.equal(byLabel.get(word)?.keywordKind, "contextual", "missing contextual keyword: " + word);
  }
  assert.equal(byLabel.get("with")?.enabled, false, "with must remain disabled for ordinary suggestions");
});

test("JS-1 separates fixed language literals from keywords and global identifiers", async () => {
  const { javascript } = await readCatalogFiles();
  const literals = javascript.records.filter(record => record.type === "literal");
  assert.deepEqual(literals.map(record => record.label).sort(), ["false","null","true"]);
  assert.ok(literals.every(record => record.mode === "literal"));
  const byLabel = new Map(javascript.records.map(record => [record.label, record]));
  assert.equal(byLabel.get("this")?.category, "کلمات کلیدی");
  assert.equal(byLabel.get("undefined")?.category, undefined);
  assert.equal(byLabel.get("NaN")?.category, undefined);
});

test("JS-1 keeps future-reserved and next-edition syntax out of ordinary suggestions", async () => {
  const { javascript } = await readCatalogFiles();
  const byLabel = new Map(javascript.records.map(record => [record.label, record]));
  for (const word of ["enum","implements","interface","package","private","protected","public"]) {
    assert.equal(byLabel.get(word)?.keywordKind, "future-reserved");
    assert.equal(byLabel.get(word)?.enabled, false);
  }
  assert.equal(byLabel.get("using")?.keywordKind, "contextual");
  assert.equal(byLabel.get("using")?.standardStatus, "stage-4-es2027");
  assert.equal(byLabel.get("using")?.enabled, false);
});


test("JS-2 includes standard ECMAScript globals and conversion/checking functions", async () => {
  const { javascript } = await readCatalogFiles();
  const globals = new Map(javascript.records.filter(r => r.category === "اشیاء و توابع سراسری").map(r => [r.label,r]));
  for (const name of ["BigInt","Function","globalThis","Number","String","Object","Date","RegExp","Map","Set","Symbol","Error","AggregateError","RangeError","ReferenceError","SyntaxError","TypeError","URIError","isFinite","isNaN","encodeURI","encodeURIComponent","decodeURI","decodeURIComponent"]) {
    assert.ok(globals.has(name), "missing JS-2 global: " + name);
  }
  assert.equal(globals.get("URL")?.runtimeScope,"web-api","URL must remain distinct from ECMAScript built-ins");
  assert.equal(globals.get("URL")?.standardSource,"WHATWG URL");
  for (const name of ["escape","unescape"]) {
    assert.equal(globals.get(name)?.enabled,false);
    assert.equal(globals.get(name)?.availability,"deprecated");
  }
});

test("JS-2 records static and prototype APIs with explicit member kinds", async () => {
  const { javascript } = await readCatalogFiles();
  const members = new Map(javascript.records.filter(r => r.type === "member").map(r => [r.label,r]));
  const expected = [
    "Number.isFinite","Number.isSafeInteger","Number.prototype.toFixed",
    "String.fromCodePoint","String.raw","String.prototype.includes","String.prototype.replaceAll",
    "String.prototype.isWellFormed","Object.entries","Object.fromEntries","Object.hasOwn",
    "Object.prototype.hasOwnProperty","Date.now","Date.prototype.toISOString",
    "RegExp.prototype.exec","RegExp.prototype.test","RegExp.escape",
    "Map.prototype.get","Map.prototype.set","Map.prototype.size",
    "Set.prototype.union","Set.prototype.isSubsetOf","Symbol.for","Symbol.iterator",
    "Error.isError","Error.prototype.toString","BigInt.asUintN","Function.prototype.bind"
  ];
  for (const label of expected) assert.ok(members.has(label),"missing JS-2 member: "+label);
  for (const record of members.values()) {
    assert.ok(["static-method","instance-method","static-property","instance-property","host-method"].includes(record.memberKind),record.label);
    assert.ok(record.standardSource,record.label+" must identify its source family");
  }
});

test("JS-2 Set composition APIs and their edition metadata are represented", async () => {
  const { javascript } = await readCatalogFiles();
  const members = new Map(javascript.records.filter(r => r.type === "member").map(r => [r.label,r]));
  for (const name of ["difference","intersection","isDisjointFrom","isSubsetOf","isSupersetOf","symmetricDifference","union"]) {
    assert.equal(members.get("Set.prototype."+name)?.standardStatus,"es2025",name);
  }
  assert.equal(members.get("Object.groupBy")?.standardStatus,"es2024");
  assert.equal(members.get("Map.groupBy")?.standardStatus,"es2024");
  assert.equal(members.get("RegExp.escape")?.standardStatus,"es2025");
});

test("JS-2 separates URL Web API records from ECMAScript built-ins", async () => {
  const { javascript } = await readCatalogFiles();
  const urlRecords = javascript.records.filter(r => r.label === "URL" || r.label.startsWith("URL.") || r.label.startsWith("URL.prototype."));
  assert.ok(urlRecords.length >= 15);
  assert.ok(urlRecords.every(r => r.runtimeScope === "web-api" && r.standardSource === "WHATWG URL"));
  const objectUrlMethods = new Set(["URL.createObjectURL","URL.revokeObjectURL"]);
  for (const record of urlRecords) {
    if (objectUrlMethods.has(record.label)) assert.equal(record.availability,"window-and-dedicated-worker");
    else assert.equal(record.availability,"browser-and-worker");
  }
});

test("JS-2 does not expose deprecated global URI escape helpers by default", async () => {
  const { javascript } = await readCatalogFiles();
  const byLabel = new Map(javascript.records.map(r => [r.label,r]));
  for (const name of ["escape","unescape"]) {
    assert.equal(byLabel.get(name)?.enabled,false);
    assert.equal(byLabel.get(name)?.standardStatus,"deprecated");
  }
});


test("JS-2 keeps ES2027 resource-management APIs out of current default suggestions", async () => {
  const { javascript } = await readCatalogFiles();
  const byLabel = new Map(javascript.records.map(record => [record.label,record]));
  for (const label of ["using","Symbol.dispose","Symbol.asyncDispose","SuppressedError","DisposableStack","AsyncDisposableStack"]) {
    assert.equal(byLabel.get(label)?.standardStatus,"stage-4-es2027",label);
    assert.equal(byLabel.get(label)?.enabled,false,label);
    assert.equal(byLabel.get(label)?.availability,"future-standard",label);
  }
});

test("JS-2 marks limited and non-standard Error APIs accurately", async () => {
  const { javascript } = await readCatalogFiles();
  const byLabel = new Map(javascript.records.map(record => [record.label,record]));
  assert.equal(byLabel.get("Error.isError")?.standardStatus,"es2026");
  assert.equal(byLabel.get("Error.isError")?.enabled,false);
  assert.equal(byLabel.get("Error.isError")?.availability,"limited-compatibility");
  assert.equal(byLabel.get("Error.instance.stack")?.standardSource,"implementation-defined");
  assert.equal(byLabel.get("Error.instance.stack")?.enabled,false);
});


test("JS-3 covers standard Array instance methods and separates mutators from copying methods", async () => {
  const { javascript } = await readCatalogFiles();
  const members = new Map(javascript.records.filter(r => r.type === "member").map(r => [r.label,r]));
  const expected = [
    "Array.prototype.at","Array.prototype.concat","Array.prototype.copyWithin","Array.prototype.entries",
    "Array.prototype.every","Array.prototype.fill","Array.prototype.filter","Array.prototype.find",
    "Array.prototype.findIndex","Array.prototype.findLast","Array.prototype.findLastIndex","Array.prototype.flat",
    "Array.prototype.flatMap","Array.prototype.forEach","Array.prototype.includes","Array.prototype.indexOf",
    "Array.prototype.join","Array.prototype.keys","Array.prototype.lastIndexOf","Array.prototype.map",
    "Array.prototype.pop","Array.prototype.push","Array.prototype.reduce","Array.prototype.reduceRight",
    "Array.prototype.reverse","Array.prototype.shift","Array.prototype.slice","Array.prototype.some",
    "Array.prototype.sort","Array.prototype.splice","Array.prototype.toLocaleString","Array.prototype.toReversed",
    "Array.prototype.toSorted","Array.prototype.toSpliced","Array.prototype.toString","Array.prototype.unshift",
    "Array.prototype.values","Array.prototype.with","Array.prototype.[Symbol.iterator]",
    "Array.prototype.constructor","Array.prototype.length","Array.prototype.[Symbol.unscopables]"
  ];
  for (const label of expected) assert.ok(members.has(label),"missing JS-3 member: "+label);
  const mutators = ["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"];
  for (const name of mutators) { const desc = members.get("Array.prototype."+name)?.description; assert.ok(desc.includes("تغیی‌دهنده") || desc.includes("تغییردهنده") || name === "sort",name); }
  for (const name of ["toReversed","toSorted","toSpliced","with"]) assert.ok(members.get("Array.prototype."+name)?.description.includes("بدون تغییر آرایه اصلی"),name);
  for (const name of ["constructor","length","[Symbol.unscopables]"]) assert.equal(members.get("Array.prototype."+name)?.memberKind,"instance-property");
});


test("JS-4 completes String and Number standard constructor and prototype properties", async () => {
  const { javascript } = await readCatalogFiles();
  const members = new Map(javascript.records.filter(r => r.type === "member").map(r => [r.label,r]));
  const stringExpected = [
    "String.fromCharCode","String.fromCodePoint","String.raw",
    "String.prototype.constructor","String.prototype.[Symbol.iterator]",
    "String.length","String.prototype.at","String.prototype.charAt",
    "String.prototype.charCodeAt","String.prototype.codePointAt","String.prototype.concat",
    "String.prototype.endsWith","String.prototype.includes","String.prototype.indexOf",
    "String.prototype.lastIndexOf","String.prototype.localeCompare","String.prototype.match",
    "String.prototype.matchAll","String.prototype.normalize","String.prototype.padEnd",
    "String.prototype.padStart","String.prototype.repeat","String.prototype.replace",
    "String.prototype.replaceAll","String.prototype.search","String.prototype.slice",
    "String.prototype.split","String.prototype.startsWith","String.prototype.substring",
    "String.prototype.toLocaleLowerCase","String.prototype.toLocaleUpperCase",
    "String.prototype.toLowerCase","String.prototype.toUpperCase","String.prototype.trim",
    "String.prototype.trimEnd","String.prototype.trimStart","String.prototype.toString",
    "String.prototype.valueOf","String.prototype.isWellFormed","String.prototype.toWellFormed",
    "String.prototype"
  ];
  for (const label of stringExpected) assert.ok(members.has(label),"missing JS-4 String member: "+label);
  for (const label of ["Number.isFinite","Number.isInteger","Number.isNaN","Number.isSafeInteger","Number.parseFloat","Number.parseInt",
    "Number.prototype.constructor","Number.prototype.toExponential","Number.prototype.toFixed","Number.prototype.toLocaleString",
    "Number.prototype.toPrecision","Number.prototype.toString","Number.prototype.valueOf",
    "Number.EPSILON","Number.MAX_SAFE_INTEGER","Number.MIN_SAFE_INTEGER","Number.MAX_VALUE","Number.MIN_VALUE",
    "Number.NaN","Number.POSITIVE_INFINITY","Number.NEGATIVE_INFINITY","Number.prototype"]) {
    assert.ok(members.has(label),"missing JS-4 Number member: "+label);
  }
  assert.equal(members.get("String.prototype.[Symbol.iterator]")?.memberKind,"instance-method");
  assert.equal(members.get("String.prototype.constructor")?.memberKind,"instance-property");
  assert.equal(members.get("String.length")?.memberKind,"instance-property");
  assert.equal(members.get("Number.prototype.constructor")?.memberKind,"instance-property");
  for (const label of ["String.name","String.prototype","Number.length","Number.name","Number.prototype"]) {
    assert.equal(members.get(label)?.memberKind,"static-property",label);
  }
});

test("JS-5 Object, Date and RegExp constructor/prototype coverage", async () => {
  const records = (await readCatalog()).records.filter(r => r.language === "javascript" && r.type === "member");
  const byLabel = new Map(records.map(r => [r.label, r]));
  const expected = {
    "Object.prototype": "static-property",
    "Object.length": "static-property",
    "Object.name": "static-property",
    "Object.prototype.constructor": "instance-property",
    "Object.prototype.[Symbol.toStringTag]": "instance-property",
    "Date.prototype": "static-property",
    "Date.length": "static-property",
    "Date.name": "static-property",
    "Date.prototype.constructor": "instance-property",
    "Date.prototype.[Symbol.toPrimitive]": "instance-method",
    "Date.prototype.[Symbol.toStringTag]": "instance-property",
    "RegExp.prototype": "static-property",
    "RegExp.length": "static-property",
    "RegExp.name": "static-property",
    "RegExp.prototype.constructor": "instance-property",
    "RegExp.prototype.lastIndex": "instance-property",
    "RegExp.prototype.toString": "instance-method",
    "RegExp.prototype.[Symbol.match]": "instance-method",
    "RegExp.prototype.[Symbol.matchAll]": "instance-method",
    "RegExp.prototype.[Symbol.replace]": "instance-method",
    "RegExp.prototype.[Symbol.search]": "instance-method",
    "RegExp.prototype.[Symbol.split]": "instance-method",
    "RegExp.prototype.[Symbol.toStringTag]": "instance-property"
  };
  for (const [label, memberKind] of Object.entries(expected)) {
    const record = byLabel.get(label);
    assert.ok(record, "missing JS-5 member: " + label);
    assert.equal(record.memberKind, memberKind, label);
    assert.equal(record.enabled, true, label);
    assert.equal(record.standardSource, "ECMA-262 2026", label);
  }
  assert.equal(Object.keys(expected).length, 23);
});

test("JS-6 completes Math, JSON and keyed-collection built-ins", async () => {
  const members = (await readCatalog()).records.filter(r => r.language === "javascript" && r.type === "member");
  const byLabel = new Map(members.map(r => [r.label, r]));
  const expectedLabels = [
  "Math.acos",
  "Math.acosh",
  "Math.asin",
  "Math.asinh",
  "Math.atan",
  "Math.atanh",
  "Math.atan2",
  "Math.cbrt",
  "Math.expm1",
  "Math.clz32",
  "Math.cos",
  "Math.cosh",
  "Math.exp",
  "Math.fround",
  "Math.hypot",
  "Math.imul",
  "Math.log",
  "Math.log1p",
  "Math.log2",
  "Math.log10",
  "Math.pow",
  "Math.sign",
  "Math.sin",
  "Math.sinh",
  "Math.tan",
  "Math.tanh",
  "Math.trunc",
  "Math.E",
  "Math.LN10",
  "Math.LN2",
  "Math.LOG10E",
  "Math.LOG2E",
  "Math.PI",
  "Math.SQRT1_2",
  "Math.SQRT2",
  "Math.f16round",
  "Math.sumPrecise",
  "Math.[Symbol.toStringTag]",
  "JSON.rawJSON",
  "JSON.isRawJSON",
  "JSON.[Symbol.toStringTag]",
  "Map.[Symbol.species]",
  "Map.name",
  "Map.length",
  "Map.prototype",
  "Map.prototype.getOrInsert",
  "Map.prototype.getOrInsertComputed",
  "Map.prototype.[Symbol.toStringTag]",
  "Map.prototype.[Symbol.iterator]",
  "Set.[Symbol.species]",
  "Set.name",
  "Set.length",
  "Set.prototype",
  "Set.prototype.[Symbol.toStringTag]",
  "Set.prototype.[Symbol.iterator]",
  "WeakMap.name",
  "WeakMap.length",
  "WeakMap.prototype",
  "WeakMap.prototype.delete",
  "WeakMap.prototype.get",
  "WeakMap.prototype.set",
  "WeakMap.prototype.has",
  "WeakMap.prototype.getOrInsert",
  "WeakMap.prototype.getOrInsertComputed",
  "WeakMap.prototype.[Symbol.toStringTag]",
  "WeakSet.name",
  "WeakSet.length",
  "WeakSet.prototype",
  "WeakSet.prototype.delete",
  "WeakSet.prototype.has",
  "WeakSet.prototype.add",
  "WeakSet.prototype.[Symbol.toStringTag]"
];
  for (const label of expectedLabels) {
    const record = byLabel.get(label);
    assert.ok(record, "missing JS-6 member: " + label);
    assert.equal(record.enabled, true, label);
    assert.ok(["static-method","instance-method","static-property","instance-property"].includes(record.memberKind), label);
    assert.equal(record.standardSource, "ECMA-262 2026", label);
  }
  assert.equal(expectedLabels.length, 72);
  assert.equal(byLabel.get("Math.f16round")?.standardStatus, "es2025");
  assert.equal(byLabel.get("Math.sumPrecise")?.standardStatus, "es2026");
  for (const label of ["JSON.rawJSON","JSON.isRawJSON","Map.prototype.getOrInsert","Map.prototype.getOrInsertComputed","WeakMap.prototype.getOrInsert","WeakMap.prototype.getOrInsertComputed"]) {
    assert.equal(byLabel.get(label)?.standardStatus, "es2026", label);
  }
  for (const label of ["Map.prototype.[Symbol.iterator]","Set.prototype.[Symbol.iterator]"]) {
    assert.equal(byLabel.get(label)?.memberKind, "instance-method", label);
  }
  for (const label of ["Map.[Symbol.species]","Set.[Symbol.species]","Math.[Symbol.toStringTag]","JSON.[Symbol.toStringTag]"]) {
    assert.equal(byLabel.get(label)?.memberKind, "static-property", label);
  }
});

test("JS-7 completes Promise static, prototype, and async control members", async () => {
  const records = (await readCatalog()).records.filter(r => r.language === "javascript");
  const members = new Map(records.filter(r => r.type === "member").map(r => [r.label,r]));
  const labels = [
  "Promise.any",
  "Promise.withResolvers",
  "Promise.try",
  "Promise.[Symbol.species]",
  "Promise.name",
  "Promise.length",
  "Promise.prototype",
  "Promise.prototype.constructor",
  "Promise.prototype.then",
  "Promise.prototype.catch",
  "Promise.prototype.finally",
  "Promise.prototype.[Symbol.toStringTag]"
];
  for (const label of labels) {
    const record = members.get(label);
    assert.ok(record, "missing JS-7 Promise member: " + label);
    assert.equal(record.enabled,true,label);
    assert.equal(record.standardSource,"ECMA-262 2026",label);
  }
  assert.equal(labels.length,12);
  assert.equal(members.get("Promise.withResolvers")?.standardStatus,"es2024");
  assert.equal(members.get("Promise.try")?.standardStatus,"es2025");
  assert.equal(members.get("Promise.any")?.standardStatus,"es2021");
  assert.equal(members.get("Promise.prototype.then")?.memberKind,"instance-method");
  assert.equal(members.get("Promise.prototype.finally")?.memberKind,"instance-method");
  const keywords=new Set(records.filter(r=>r.type==="identifier"&&r.category==="کلمات کلیدی").map(r=>r.label));
  assert.ok(keywords.has("async"));
  assert.ok(keywords.has("await"));
});

test("JS-8 covers curated DOM and HTML form interface records", async () => {
  const records = (await readCatalog()).records.filter(r => r.language === "javascript");
  const members = records.filter(r => r.type === "member");
  const byLabel = new Map(members.map(r => [r.label, r]));
  const expectedLabels = [
  "Node.prototype.nodeType",
  "Node.prototype.nodeName",
  "Node.prototype.nodeValue",
  "Node.prototype.textContent",
  "Node.prototype.parentNode",
  "Node.prototype.parentElement",
  "Node.prototype.childNodes",
  "Node.prototype.firstChild",
  "Node.prototype.lastChild",
  "Node.prototype.nextSibling",
  "Node.prototype.previousSibling",
  "Node.prototype.ownerDocument",
  "Node.prototype.isConnected",
  "Node.prototype.baseURI",
  "Node.prototype.cloneNode",
  "Node.prototype.contains",
  "Node.prototype.appendChild",
  "Node.prototype.insertBefore",
  "Node.prototype.removeChild",
  "Node.prototype.replaceChild",
  "Node.prototype.normalize",
  "Node.prototype.compareDocumentPosition",
  "Node.prototype.getRootNode",
  "Node.prototype.hasChildNodes",
  "ParentNode.append",
  "ParentNode.prepend",
  "ParentNode.replaceChildren",
  "ChildNode.before",
  "ChildNode.after",
  "ChildNode.remove",
  "ChildNode.replaceWith",
  "EventTarget.prototype.addEventListener",
  "EventTarget.prototype.removeEventListener",
  "EventTarget.prototype.dispatchEvent",
  "Document.prototype.createTextNode",
  "Document.prototype.createDocumentFragment",
  "Document.prototype.createAttribute",
  "Document.prototype.createComment",
  "Document.prototype.importNode",
  "Document.prototype.adoptNode",
  "Document.prototype.activeElement",
  "Document.prototype.body",
  "Document.prototype.head",
  "Document.prototype.forms",
  "Document.prototype.title",
  "Document.prototype.documentElement",
  "Element.prototype.id",
  "Element.prototype.className",
  "Element.prototype.classList",
  "Element.prototype.attributes",
  "Element.prototype.tagName",
  "Element.prototype.innerHTML",
  "Element.prototype.outerHTML",
  "Element.prototype.children",
  "Element.prototype.childElementCount",
  "Element.prototype.firstElementChild",
  "Element.prototype.lastElementChild",
  "Element.prototype.previousElementSibling",
  "Element.prototype.nextElementSibling",
  "Element.prototype.getAttribute",
  "Element.prototype.setAttribute",
  "Element.prototype.removeAttribute",
  "Element.prototype.hasAttribute",
  "Element.prototype.toggleAttribute",
  "Element.prototype.matches",
  "Element.prototype.closest",
  "Element.prototype.querySelector",
  "Element.prototype.querySelectorAll",
  "Element.prototype.insertAdjacentHTML",
  "Element.prototype.insertAdjacentText",
  "Element.prototype.insertAdjacentElement",
  "Element.prototype.remove",
  "Element.prototype.replaceWith",
  "Element.prototype.attachShadow",
  "Element.prototype.scrollIntoView",
  "HTMLElement.prototype.hidden",
  "HTMLElement.prototype.style",
  "HTMLElement.prototype.tabIndex",
  "HTMLElement.prototype.title",
  "HTMLElement.prototype.lang",
  "HTMLElement.prototype.dir",
  "HTMLElement.prototype.contentEditable",
  "HTMLElement.prototype.innerText",
  "HTMLElement.prototype.outerText",
  "HTMLElement.prototype.accessKey",
  "HTMLElement.prototype.focus",
  "HTMLElement.prototype.blur",
  "HTMLElement.prototype.click",
  "DOMTokenList.prototype.value",
  "DOMTokenList.prototype.length",
  "DOMTokenList.prototype.add",
  "DOMTokenList.prototype.remove",
  "DOMTokenList.prototype.toggle",
  "DOMTokenList.prototype.contains",
  "DOMTokenList.prototype.replace",
  "DOMTokenList.prototype.item",
  "HTMLFormElement.prototype.action",
  "HTMLFormElement.prototype.method",
  "HTMLFormElement.prototype.elements",
  "HTMLFormElement.prototype.name",
  "HTMLFormElement.prototype.target",
  "HTMLFormElement.prototype.enctype",
  "HTMLFormElement.prototype.autocomplete",
  "HTMLFormElement.prototype.submit",
  "HTMLFormElement.prototype.requestSubmit",
  "HTMLFormElement.prototype.reset",
  "HTMLFormElement.prototype.checkValidity",
  "HTMLFormElement.prototype.reportValidity",
  "HTMLInputElement.prototype.value",
  "HTMLInputElement.prototype.valueAsNumber",
  "HTMLInputElement.prototype.checked",
  "HTMLInputElement.prototype.type",
  "HTMLInputElement.prototype.disabled",
  "HTMLInputElement.prototype.required",
  "HTMLInputElement.prototype.name",
  "HTMLInputElement.prototype.placeholder",
  "HTMLInputElement.prototype.files",
  "HTMLInputElement.prototype.form",
  "HTMLInputElement.prototype.validity",
  "HTMLInputElement.prototype.selectionStart",
  "HTMLInputElement.prototype.selectionEnd",
  "HTMLInputElement.prototype.select",
  "HTMLInputElement.prototype.setRangeText",
  "HTMLInputElement.prototype.checkValidity",
  "HTMLInputElement.prototype.reportValidity",
  "HTMLTextAreaElement.prototype.value",
  "HTMLTextAreaElement.prototype.rows",
  "HTMLTextAreaElement.prototype.cols",
  "HTMLTextAreaElement.prototype.disabled",
  "HTMLTextAreaElement.prototype.required",
  "HTMLTextAreaElement.prototype.maxLength",
  "HTMLTextAreaElement.prototype.minLength",
  "HTMLTextAreaElement.prototype.selectionStart",
  "HTMLTextAreaElement.prototype.selectionEnd",
  "HTMLTextAreaElement.prototype.form",
  "HTMLTextAreaElement.prototype.select",
  "HTMLTextAreaElement.prototype.setRangeText",
  "HTMLTextAreaElement.prototype.checkValidity",
  "HTMLTextAreaElement.prototype.reportValidity",
  "HTMLSelectElement.prototype.value",
  "HTMLSelectElement.prototype.selectedIndex",
  "HTMLSelectElement.prototype.options",
  "HTMLSelectElement.prototype.multiple",
  "HTMLSelectElement.prototype.disabled",
  "HTMLSelectElement.prototype.required",
  "HTMLSelectElement.prototype.form",
  "HTMLSelectElement.prototype.add",
  "HTMLSelectElement.prototype.remove",
  "HTMLSelectElement.prototype.checkValidity",
  "HTMLSelectElement.prototype.reportValidity",
  "HTMLButtonElement.prototype.type",
  "HTMLButtonElement.prototype.disabled",
  "HTMLButtonElement.prototype.name",
  "HTMLButtonElement.prototype.value",
  "HTMLButtonElement.prototype.form"
];
  assert.equal(expectedLabels.length, 155);
  for (const label of expectedLabels) {
    const record = byLabel.get(label);
    assert.ok(record, "missing JS-8 member: " + label);
    assert.equal(record.enabled, true, label);
    assert.ok(["instance-method","instance-property"].includes(record.memberKind), label);
    assert.equal(record.runtimeScope, "web-api", label);
    assert.equal(record.availability, "window-only", label);
    assert.ok(["WHATWG DOM","WHATWG HTML"].includes(record.standardSource), label);
    assert.ok(Number.isInteger(record.order) && record.order > 0, label);
  }
  assert.match(byLabel.get("Element.prototype.insertAdjacentHTML")?.description || "", /XSS/);
  assert.match(byLabel.get("HTMLFormElement.prototype.submit")?.description || "", /requestSubmit/);
  assert.ok(!members.some(r => r.label === "HTMLElement.anchorElement" && r.enabled), "experimental anchorElement must not be enabled");
});
