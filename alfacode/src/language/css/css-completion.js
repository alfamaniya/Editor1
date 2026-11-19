const CSS_PROPERTIES = [
  "align-content","align-items","align-self","animation","background","background-color","background-image","border","border-radius","bottom","box-shadow","box-sizing","color","column-gap","cursor","display","flex","flex-basis","flex-direction","flex-wrap","font-family","font-size","font-weight","gap","grid-template-columns","grid-template-rows","height","justify-content","left","line-height","margin","max-height","max-width","min-height","min-width","opacity","overflow","padding","position","right","text-align","text-decoration","text-transform","top","transform","transition","vertical-align","visibility","white-space","width","z-index"
];
const COMMON_VALUES = ["auto","inherit","initial","unset","revert","none","normal","0","1rem","100%"];
const VALUE_CATALOG = {
  display:["block","inline","inline-block","flex","inline-flex","grid","inline-grid","none","contents"],
  position:["static","relative","absolute","fixed","sticky"],
  "flex-direction":["row","row-reverse","column","column-reverse"],
  "flex-wrap":["nowrap","wrap","wrap-reverse"],
  "justify-content":["flex-start","flex-end","center","space-between","space-around","space-evenly"],
  "align-items":["stretch","flex-start","flex-end","center","baseline"],
  "text-align":["left","right","center","justify","start","end"],
  "font-weight":["normal","bold","bolder","lighter","100","200","300","400","500","600","700","800","900"],
  "overflow":["visible","hidden","clip","scroll","auto"],
  visibility:["visible","hidden","collapse"],
  cursor:["auto","default","pointer","move","not-allowed","text","grab","grabbing"],
  "box-sizing":["content-box","border-box"],
  "background-color":["transparent","currentColor","red","blue","black","white"],
  color:["currentColor","transparent","red","blue","black","white"],
  "border-style":["none","solid","dashed","dotted","double"],
  "text-decoration":["none","underline","overline","line-through"],
  "white-space":["normal","nowrap","pre","pre-wrap","pre-line","break-spaces"],
  "animation":["none","ease","linear","ease-in","ease-out","ease-in-out"]
};
const DESCRIPTIONS = {
  color:"Text color",display:"Formatting context",position:"Positioning scheme",
  "background-color":"Background color","font-size":"Text size","margin":"Outer spacing",
  padding:"Inner spacing","width":"Element width","height":"Element height",
  "justify-content":"Main-axis alignment","align-items":"Cross-axis alignment",
  "border-radius":"Rounded corners","box-shadow":"Element shadow"
};

function insideCommentOrString(source, cursor) {
  const before = source.slice(0, cursor);
  const commentStart = before.lastIndexOf("/*");
  const commentEnd = before.lastIndexOf("*/");
  if (commentStart > commentEnd) return true;
  let quote = null;
  let escaped = false;
  for (const char of before) {
    if (escaped) { escaped = false; continue; }
    if (char === "\\") { escaped = true; continue; }
    if (quote) { if (char === quote) quote = null; continue; }
    if (char === "'" || char === '"') quote = char;
  }
  return Boolean(quote);
}

function currentDeclaration(source, cursor) {
  const prefix = source.slice(0, cursor);
  const brace = prefix.lastIndexOf("{");
  const close = prefix.lastIndexOf("}");
  if (brace < close) return { mode:"selector", segment:prefix.slice(close + 1) };
  const segment = prefix.slice(brace + 1).split(";").at(-1);
  return { mode:segment.includes(":") ? "value" : "property", segment };
}

function makeOptions(items, query, from, to, kind) {
  const normalized = query.toLowerCase();
  return items.filter(item => item.label.toLowerCase().startsWith(normalized))
    .slice(0, 10).map(item => Object.freeze({
      ...item, kind, from, to, insertText:item.insertText ?? item.label
    }));
}

export function getCSSCompletionSuggestions(source, cursor, options = {}) {
  if (typeof source !== "string") throw new TypeError("CSS completion source must be a string.");
  if (!Number.isInteger(cursor) || cursor < 0 || cursor > source.length) {
    throw new RangeError("CSS completion cursor is outside the source.");
  }
  if (insideCommentOrString(source, cursor)) return null;
  const state = currentDeclaration(source, cursor);
  const limit = Math.max(1, Math.min(10, options.limit ?? 10));

  if (state.mode === "selector") {
    const match = state.segment.match(/([.#:[A-Za-z_-][\w-]*)$/);
    if (!match || match[1].length < 1) return null;
    const query = match[1];
    const from = cursor - query.length;
    const candidates = Array.isArray(options.catalog) && options.catalog.length
      ? options.catalog.filter(record => record.enabled !== false && record.mode === "selector")
      : [".container","#app",":hover",":focus",":active","::before","::after","button","div","body","html"]
        .map(label => ({label,description:"Selector"}));
    const optionsList = makeOptions(candidates, query, from, cursor, "selector").slice(0,limit);
    return optionsList.length ? {language:"css",mode:"selector",query,from,to:cursor,options:optionsList} : null;
  }

  const colon = state.segment.lastIndexOf(":");
  if (state.mode === "property") {
    const match = state.segment.match(/([A-Za-z-]*)$/);
    if (!match || !match[1]) return null;
    const query = match[1];
    const from = cursor - query.length;
    const propertyRecords = Array.isArray(options.catalog) && options.catalog.length
      ? options.catalog.filter(record => record.enabled !== false && record.mode === "property")
      : CSS_PROPERTIES.map(label => ({ label, description:DESCRIPTIONS[label] ?? "CSS property" }));
    const optionsList = makeOptions(propertyRecords, query, from, cursor, "property").slice(0,limit);
    return optionsList.length ? {language:"css",mode:"property",query,from,to:cursor,options:optionsList} : null;
  }

  const valuePrefix = state.segment.slice(colon + 1).match(/([A-Za-z-]*)$/)?.[1] ?? "";
  const property = state.segment.slice(0,colon).trim().toLowerCase();
  const valueRecords = Array.isArray(options.catalog) && options.catalog.length
    ? options.catalog.filter(record => record.enabled !== false && record.mode === "value" &&
        (record.propertyName === "*" || record.propertyName === property))
    : [...new Set([...(VALUE_CATALOG[property] ?? []),...COMMON_VALUES])]
        .map(label => ({label,description:"Value for "+property}));
  const optionsList = makeOptions(valueRecords,
    valuePrefix,cursor-valuePrefix.length,cursor,"value").slice(0,limit);
  return optionsList.length ? {language:"css",mode:"value",query:valuePrefix,from:cursor-valuePrefix.length,to:cursor,options:optionsList} : null;
}
export default getCSSCompletionSuggestions;

export function getCSSCompletionCatalog() {
  const items = [];
  const add = (category, values, describe) => values.forEach(label =>
    items.push({category,label,description:describe(label)}));
  add("ویژگی‌های CSS", CSS_PROPERTIES, label => DESCRIPTIONS[label] ?? "CSS property");
  add("انتخابگرهای نمونه", [".container","#app",":hover",":focus",":active","::before","::after","button","div","body","html"], () => "CSS selector");
  add("مقادیر عمومی", COMMON_VALUES, () => "Common CSS value");
  for (const [property, values] of Object.entries(VALUE_CATALOG)) {
    add("مقادیر " + property, values, () => "Value for " + property);
  }
  const unique = new Map();
  for (const item of items) unique.set(item.category + "\\0" + item.label, item);
  return [...unique.values()];
}
