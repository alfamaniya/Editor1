import { isVoidElement } from "./html-rules.js";
import { parseHTML } from "./html-parser.js";

/**
 * HTML completion catalogue.
 * Base order follows observed element frequency in HTTP Archive Web Almanac
 * 2024; contextual rules remove elements that do not belong at the cursor.
 */
export const HTML_TAG_CATALOG = Object.freeze([
  { name: "div", rank: 1, description: "Generic block container" },
  { name: "a", rank: 2, description: "Hyperlink" },
  { name: "span", rank: 3, description: "Generic inline container" },
  { name: "li", rank: 4, description: "List item" },
  { name: "script", rank: 5, description: "JavaScript or data block" },
  { name: "img", rank: 6, description: "Image", void: true },
  { name: "p", rank: 7, description: "Paragraph" },
  { name: "link", rank: 8, description: "External resource link", contexts: ["head"], void: true },
  { name: "meta", rank: 9, description: "Document metadata", contexts: ["head"], void: true },
  { name: "i", rank: 10, description: "Text in an alternate voice" },
  { name: "button", rank: 11, description: "Interactive button" },
  { name: "section", rank: 12, description: "Thematic section" },
  { name: "ul", rank: 13, description: "Unordered list" },
  { name: "ol", rank: 14, description: "Ordered list" },
  { name: "h1", rank: 15, description: "Top-level heading" },
  { name: "h2", rank: 16, description: "Second-level heading" },
  { name: "header", rank: 17, description: "Introductory content" },
  { name: "footer", rank: 18, description: "Footer content" },
  { name: "main", rank: 19, description: "Main page content" },
  { name: "article", rank: 20, description: "Independent composition" },
  { name: "nav", rank: 21, description: "Navigation links" },
  { name: "form", rank: 22, description: "Form" },
  { name: "input", rank: 23, description: "Form input", void: true },
  { name: "label", rank: 24, description: "Form label" },
  { name: "textarea", rank: 25, description: "Multiline text input" },
  { name: "select", rank: 26, description: "Selection control" },
  { name: "option", rank: 27, description: "Selection option" },
  { name: "strong", rank: 28, description: "Strong importance" },
  { name: "em", rank: 29, description: "Emphasized text" },
  { name: "br", rank: 30, description: "Line break", void: true },
  { name: "hr", rank: 31, description: "Thematic break", void: true },
  { name: "table", rank: 32, description: "Table" },
  { name: "thead", rank: 33, description: "Table header group" },
  { name: "tbody", rank: 34, description: "Table body group" },
  { name: "tr", rank: 35, description: "Table row" },
  { name: "th", rank: 36, description: "Header cell" },
  { name: "td", rank: 37, description: "Table cell" },
  { name: "title", rank: 38, description: "Document title", contexts: ["head"] },
  { name: "style", rank: 39, description: "Embedded CSS", contexts: ["head"] },
  { name: "base", rank: 40, description: "Base URL", contexts: ["head"], void: true },
  { name: "noscript", rank: 41, description: "Fallback without scripting", contexts: ["head"] },
  { name: "html", rank: 42, description: "Root element", contexts: ["root"] },
  { name: "head", rank: 43, description: "Document metadata container", contexts: ["root"] },
  { name: "body", rank: 44, description: "Document body", contexts: ["root"] }
]);

const SVG_TAGS = [
  "svg", "g", "path", "circle", "rect", "line", "polyline", "polygon", "ellipse", "text"
].map((name, index) => ({ name, rank: index + 1, description: "SVG graphic element" }));

const HEAD_TAGS = ["meta", "link", "title", "script", "style", "base", "noscript"]
  .map((name, index) => ({ ...HTML_TAG_CATALOG.find(item => item.name === name), rank: index + 1 }));

const PHRASING_TAGS = new Set([
  "a", "span", "i", "strong", "em", "img", "script", "button", "input",
  "label", "textarea", "select", "option", "br"
]);

const CONTEXT_TAGS = Object.freeze({
  html: ["head", "body"],
  ul: ["li"],
  ol: ["li"],
  menu: ["li"],
  dl: ["dt", "dd", "div"],
  table: ["caption", "colgroup", "thead", "tbody", "tfoot"],
  thead: ["tr"],
  tbody: ["tr"],
  tfoot: ["tr"],
  tr: ["td", "th"],
  select: ["option", "optgroup"],
  optgroup: ["option"]
});

function getContextTags(stack, catalog) {
  const parent = stack.at(-1)?.name?.toLowerCase() ?? "root";
  const inSVG = stack.some(node => node.name.toLowerCase() === "svg");
  if (Array.isArray(catalog) && catalog.length) {
    const namespace = inSVG ? "svg" : "html";
    const legacy = getContextTags(stack);
    const legacyNames = new Set(legacy.map(item => item.name.toLowerCase()));
    return catalog.filter(record => {
      if (record.namespace !== namespace || record.enabled === false) return false;
      const name = record.tagName.toLowerCase();
      const parents = Array.isArray(record.parentTags) ? record.parentTags : [];
      const parentAllowed = !parents.length || parents.includes(parent) || legacyNames.has(name);
      if (!parentAllowed) return false;
      if (record.contexts?.length) {
        const context = inSVG ? "svg" : parent === "html" ? "root" : parent;
        if (!record.contexts.includes(context) && !legacyNames.has(name)) return false;
      }
      if (parent === "p" && !PHRASING_TAGS.has(name) && !legacyNames.has(name)) return false;
      if (CONTEXT_TAGS[parent] && !parents.length && !CONTEXT_TAGS[parent].includes(name) && !legacyNames.has(name)) return false;
      return true;
    }).map(record => ({
      name: record.tagName,
      rank: Number.isFinite(record.rank) ? record.rank : (record.order ?? 9999),
      description: record.description,
      void: record.isVoid === true
    })).concat(legacy.filter(item => !catalog.some(record =>
      record.namespace === namespace && record.tagName.toLowerCase() === item.name.toLowerCase()
    )));
  }
  if (inSVG) return SVG_TAGS;
  if (parent === "head") return HEAD_TAGS;
  if (CONTEXT_TAGS[parent]) {
    return CONTEXT_TAGS[parent].map((name, index) => {
      const item = HTML_TAG_CATALOG.find(candidate => candidate.name === name) ?? {
        name, description: "Context-specific HTML element"
      };
      return { ...item, rank: index + 1 };
    });
  }
  if (parent === "p") {
    return HTML_TAG_CATALOG.filter(item => PHRASING_TAGS.has(item.name));
  }
  if (parent === "root") {
    return HTML_TAG_CATALOG.filter(item => item.contexts?.includes("root"));
  }
  return HTML_TAG_CATALOG.filter(item => !item.contexts || item.contexts.includes("body"));
}

function scanHTMLStack(source) {
  const stack = [];
  let index = 0;
  let rawTextElement = null;

  while (index < source.length) {
    if (rawTextElement) {
      const closing = new RegExp("</\\s*" + rawTextElement + "\\s*>", "i");
      closing.lastIndex = index;
      const match = closing.exec(source);
      if (!match) break;
      index = match.index;
      rawTextElement = null;
    }

    if (source.startsWith("<!--", index)) {
      const commentEnd = source.indexOf("-->", index + 4);
      if (commentEnd < 0) break;
      index = commentEnd + 3;
      continue;
    }

    if (source[index] !== "<") {
      index++;
      continue;
    }

    const tagMatch = source.slice(index).match(/^<\s*(\/?)\s*([A-Za-z][A-Za-z0-9:-]*)/);
    if (!tagMatch) {
      index++;
      continue;
    }

    const closingTag = tagMatch[1] === "/";
    const tagName = tagMatch[2];
    let end = index + tagMatch[0].length;
    let quote = null;
    for (; end < source.length; end++) {
      const character = source[end];
      if (quote) {
        if (character === quote) quote = null;
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === ">") {
        break;
      }
    }
    if (end >= source.length) break;

    const selfClosing = !closingTag && source.slice(index, end).trimEnd().endsWith("/");
    if (closingTag) {
      for (let position = stack.length - 1; position >= 0; position--) {
        if (stack[position].name.toLowerCase() === tagName.toLowerCase()) {
          stack.splice(position);
          break;
        }
      }
    } else if (!selfClosing && !isVoidElement(tagName)) {
      stack.push({ name: tagName });
      if (["script", "style"].includes(tagName.toLowerCase())) {
        rawTextElement = tagName;
      }
    }
    index = end + 1;
  }

  return stack;
}

function isSuppressed(parsed, stack, cursor, closing) {
  const token = parsed.tokens.find(item =>
    item.start < cursor && cursor <= item.end &&
    (item.type === "comment" || item.type === "attribute-value")
  );
  if (token) return true;
  if (!closing && ["script", "style"].includes(stack.at(-1)?.name?.toLowerCase())) {
    return true;
  }
  return false;
}

function makeOptions(items, query, from, to, limit) {
  const normalized = query.toLowerCase();
  return items
    .filter(item => item.name.toLowerCase().startsWith(normalized))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map(item => Object.freeze({
      label: item.name,
      kind: "open",
      isVoid: item.void ?? isVoidElement(item.name),
      description: item.description,
      from,
      to
    }));
}

/**
 * Return HTML tag completions for a document offset.
 * The completion engine is independent from the editor DOM and UI.
 */
export function getHTMLTagSuggestions(source, cursor, options = {}) {
  if (typeof source !== "string") throw new TypeError("HTML completion source must be a string.");
  if (!Number.isInteger(cursor) || cursor < 0 || cursor > source.length) {
    throw new RangeError("HTML completion cursor is outside the source.");
  }

  const chain = options.chain === true;
  const limit = Math.max(1, Math.min(10, Number.isInteger(options.limit) ? options.limit : 10));
  const prefix = source.slice(0, cursor);

  if (chain) {
    const stack = scanHTMLStack(prefix);
    const parentName = stack.at(-1)?.name?.toLowerCase() ?? "root";
    const candidates = getContextTags(stack, options.catalog);
    const optionsList = makeOptions(candidates, "", cursor, cursor, Math.max(1, limit - 1))
      .map(item => Object.freeze({ ...item, kind: "child", from: cursor, to: cursor }));
    const openName = stack.at(-1)?.name;
    if (openName) {
      const closeExpression = new RegExp("</\\s*" + openName + "\\s*>", "i");
      const closeMatch = closeExpression.exec(source.slice(cursor));
      if (closeMatch) {
        optionsList.push(Object.freeze({
          label: "</" + openName + ">",
          kind: "jump-close",
          description: "Move to the matching closing tag",
          closeTo: cursor + closeMatch.index + closeMatch[0].length
        }));
      }
    }
    return {
      from: cursor, to: cursor, query: "", mode: "chain",
      context: parentName, options: optionsList.slice(0, limit)
    };
  }

  const closingMatch = prefix.match(/<\/([A-Za-z][A-Za-z0-9:-]*)?$/);
  const openingMatch = closingMatch ? null : prefix.match(/<([A-Za-z][A-Za-z0-9:-]*)?$/);
  const match = closingMatch ?? openingMatch;
  if (!match) return null;

  const query = match[1] ?? "";
  const from = cursor - query.length;
  const closing = Boolean(closingMatch);
  const tagStart = cursor - match[0].length;
  const contextSource = source.slice(0, tagStart);
  const stack = scanHTMLStack(contextSource);
  const parsedPrefix = parseHTML(prefix);
  if (isSuppressed(parsedPrefix, stack, cursor, closing)) return null;

  if (closing) {
    const names = [...stack].reverse().map(node => node.name);
    const uniqueNames = [...new Set(names.map(name => name.toLowerCase()))]
      .map(lower => names.find(name => name.toLowerCase() === lower));
    const optionsList = uniqueNames
      .filter(name => name.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, limit)
      .map(name => Object.freeze({
        label: name, kind: "close", isVoid: false, description: "Closing tag",
        from, to: cursor
      }));
    return optionsList.length
      ? { from, to: cursor, query, mode: "close", context: stack.at(-1)?.name ?? "root", options: optionsList }
      : null;
  }

  const contextTags = getContextTags(stack, options.catalog);
  const present = new Set(contextSource.match(/<([A-Za-z][\w:-]*)/g)?.map(value =>
    value.slice(1).toLowerCase()) ?? []);
  const candidates = contextTags.filter(item => {
    if (item.contexts?.includes("root") && present.has(item.name)) return false;
    if (item.name === "html" && present.has("html")) return false;
    if (item.name === "head" && present.has("head")) return false;
    if (item.name === "body" && present.has("body")) return false;
    return true;
  });
  const optionsList = makeOptions(candidates, query, from, cursor, limit);
  return optionsList.length
    ? { from, to: cursor, query, mode: "open", context: stack.at(-1)?.name ?? "root", options: optionsList }
    : null;
}
export default getHTMLTagSuggestions;

export function getHTMLCompletionCatalog() {
  const groups = [
    ["ساختار سند", new Set(["html","head","body","title","base","meta","link","style","script","noscript"])],
    ["متن و محتوا", new Set(["div","span","p","h1","h2","strong","em","i","br","hr"])],
    ["بخش‌بندی و ناوبری", new Set(["header","footer","main","section","article","nav"])],
    ["فهرست‌ها", new Set(["ul","ol","li","menu","dl","dt","dd"])],
    ["فرم‌ها", new Set(["form","input","label","textarea","select","option","optgroup"])],
    ["جدول‌ها", new Set(["table","caption","colgroup","thead","tbody","tfoot","tr","th","td"])],
    ["پیوند و رسانه", new Set(["a","img"])],
    ["گرافیک SVG", new Set(SVG_TAGS.map(item => item.name))]
  ];
  const items = [...HTML_TAG_CATALOG, ...SVG_TAGS,
    ...Object.values(CONTEXT_TAGS).flat().map(name => ({name,description:"Context-specific HTML element"}))];
  const unique = new Map();
  for (const item of items) {
    const category = groups.find(([, names]) => names.has(item.name))?.[0] ?? "سایر عناصر";
    unique.set(item.name, {category,label:item.name,description:item.description ?? "HTML element"});
  }
  return [...unique.values()];
}
