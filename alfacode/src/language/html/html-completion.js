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
  .map(name => HTML_TAG_CATALOG.find(item => item.name === name));

const PHRASING_TAGS = new Set([
  "a", "span", "i", "strong", "em", "img", "script", "button", "input",
  "label", "textarea", "select", "option", "br"
]);

const CONTEXT_TAGS = Object.freeze({
  list: ["li"],
  dl: ["dt", "dd", "div"],
  table: ["caption", "colgroup", "thead", "tbody", "tfoot"],
  thead: ["tr"],
  tbody: ["tr"],
  tfoot: ["tr"],
  tr: ["td", "th"],
  select: ["option", "optgroup"],
  optgroup: ["option"]
});

function openElementPath(node, end) {
  if (!node || node.type !== "Element" || node.closeStart !== undefined || node.end !== end) {
    return [];
  }
  const children = node.children ?? [];
  for (let index = children.length - 1; index >= 0; index--) {
    const nested = openElementPath(children[index], end);
    if (nested.length) return [node, ...nested];
  }
  return [node];
}

function getOpenStack(parsed, end) {
  const children = parsed.root?.children ?? [];
  for (let index = children.length - 1; index >= 0; index--) {
    const path = openElementPath(children[index], end);
    if (path.length) return path;
  }
  return [];
}

function getContextTags(stack) {
  const parent = stack.at(-1)?.name?.toLowerCase() ?? "root";
  if (stack.some(node => node.name.toLowerCase() === "svg")) return SVG_TAGS;
  if (parent === "head") return HEAD_TAGS;
  if (CONTEXT_TAGS[parent]) {
    return CONTEXT_TAGS[parent]
      .map(name => HTML_TAG_CATALOG.find(item => item.name === name) ?? {
        name, rank: 50, description: "Context-specific HTML element"
      });
  }
  if (parent === "p") {
    return HTML_TAG_CATALOG.filter(item => PHRASING_TAGS.has(item.name));
  }
  if (parent === "root") {
    const hasHtml = stack.some(node => node.name.toLowerCase() === "html");
    return hasHtml
      ? HTML_TAG_CATALOG.filter(item => item.contexts?.includes("root"))
      : HTML_TAG_CATALOG;
  }
  return HTML_TAG_CATALOG.filter(item => !item.contexts || item.contexts.includes("body"));
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
  const parsed = parseHTML(prefix);
  const stack = getOpenStack(parsed, prefix.length);

  if (chain) {
    const parentName = stack.at(-1)?.name?.toLowerCase() ?? "root";
    const candidates = getContextTags(stack)
      .filter(item => !item.contexts || item.contexts.includes(parentName) ||
        (parentName !== "root" && item.contexts.includes("body")));
    const optionsList = makeOptions(candidates, "", cursor, cursor, Math.max(1, limit - 1))
      .map(item => Object.freeze({ ...item, kind: "child", from: cursor, to: cursor }));
    const openName = stack.at(-1)?.name;
    if (openName) {
      const closeExpression = new RegExp("</\\s*" + openName.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&") + "\\s*>", "i");
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

  const closingMatch = prefix.match(/<\\s*\\/\\s*([A-Za-z][A-Za-z0-9:-]*)?$/);
  const openingMatch = closingMatch ? null : prefix.match(/<\\s*([A-Za-z][A-Za-z0-9:-]*)?$/);
  const match = closingMatch ?? openingMatch;
  if (!match) return null;

  const query = match[1] ?? "";
  const from = cursor - query.length;
  const closing = Boolean(closingMatch);
  if (isSuppressed(parsed, stack, cursor, closing)) return null;

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

  const contextTags = getContextTags(stack);
  const present = new Set(prefix.match(/<([A-Za-z][\\w:-]*)/g)?.map(value =>
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
