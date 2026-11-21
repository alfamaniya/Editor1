// #highlighter.js: فایل highlighter مربوط به بخش syntax highlighting پروژه
/**
 * SyntaxHighlighter
 * Converts a language token stream into safe, styled DOM nodes.
 *
 * It consumes { type, start, end, value } tokens from a language tokenizer.
 * Offsets are zero-based UTF-16 positions; end is exclusive.
 */

const DEFAULT_CLASS_PREFIX = "alfacode-token";

const TOKEN_CATEGORIES = Object.freeze({
  // HTML
  "tag-open": "punctuation",
  "tag-close-open": "punctuation",
  "tag-name": "tag",
  "tag-close": "punctuation",
  "self-close": "punctuation",
  "attribute-name": "attribute",
  "attribute-value": "string",
  equals: "operator",
  whitespace: "plain",
  text: "plain",
  comment: "comment",
  doctype: "meta",
  invalid: "invalid",

  // CSS
  string: "string",
  "at-keyword": "keyword",
  hash: "literal",
  ident: "identifier",
  number: "number",
  dimension: "number",
  percentage: "number",
  operator: "operator",
  punctuation: "punctuation",
  "important-marker": "keyword",
  delimiter: "operator",

  // JavaScript
  keyword: "keyword",
  "contextual-keyword": "keyword",
  "reserved-word": "keyword",
  identifier: "identifier",
  "private-identifier": "property",
  literal: "literal",
  bigint: "number",
  template: "string",
  regex: "string",
  punctuator: "punctuation",
  "line-comment": "comment",
  "block-comment": "comment",
  "invalid-comment": "invalid"
});

function normalizeSource(value) {
  if (typeof value !== "string") {
    throw new TypeError("Syntax highlighter source must be a string.");
  }
  return value.replace(/\r\n?/g, "\n");
}

function normalizeClassPart(value) {
  return value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "other";
}

function getTokenCategory(type) {
  if (Object.prototype.hasOwnProperty.call(TOKEN_CATEGORIES, type)) {
    return TOKEN_CATEGORIES[type];
  }
  if (type.startsWith("invalid")) return "invalid";
  return "other";
}

function validateOwnerDocument(ownerDocument) {
  if (!ownerDocument ||
      typeof ownerDocument.createDocumentFragment !== "function" ||
      typeof ownerDocument.createElement !== "function" ||
      typeof ownerDocument.createTextNode !== "function") {
    throw new TypeError("Syntax highlighter requires a DOM Document.");
  }
}

/**
 * Converts source text and an ordered token list into a safe DocumentFragment.
 * The source is always inserted as text nodes; innerHTML is never used.
 */
export class SyntaxHighlighter {
  constructor(options = {}) {
    const classPrefix = options.classPrefix ?? DEFAULT_CLASS_PREFIX;
    if (typeof classPrefix !== "string" || !/^[A-Za-z_][A-Za-z0-9_-]*$/.test(classPrefix)) {
      throw new TypeError("classPrefix must be a valid CSS class name.");
    }
    this.classPrefix = classPrefix;
  }

  render(sourceText, tokens, ownerDocument) {
    const source = normalizeSource(sourceText);
    if (!Array.isArray(tokens)) {
      throw new TypeError("Syntax highlighter tokens must be an array.");
    }
    validateOwnerDocument(ownerDocument);

    const fragment = ownerDocument.createDocumentFragment();
    let cursor = 0;

    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index];
      if (!token || typeof token !== "object") {
        throw new TypeError(`Token at index ${index} must be an object.`);
      }

      const { type, start, end } = token;
      if (typeof type !== "string" || !type.trim()) {
        throw new TypeError(`Token at index ${index} requires a non-empty type.`);
      }
      if (!Number.isInteger(start) || !Number.isInteger(end) ||
          start < 0 || end < start || end > source.length) {
        throw new RangeError(`Token at index ${index} has an invalid source range.`);
      }
      if (start < cursor) {
        throw new RangeError("Tokens must be ordered and must not overlap.");
      }

      if (start > cursor) {
        fragment.appendChild(ownerDocument.createTextNode(source.slice(cursor, start)));
        cursor = start;
      }

      if (end > start) {
        const span = ownerDocument.createElement("span");
        const category = getTokenCategory(type);
        const typeClass = normalizeClassPart(type);
        span.setAttribute(
          "class",
          `${this.classPrefix} ${this.classPrefix}--${category} ${this.classPrefix}--type-${typeClass}`
        );
        span.setAttribute("data-token-type", type);
        span.textContent = source.slice(start, end);
        fragment.appendChild(span);
        cursor = end;
      }
    }

    if (cursor < source.length) {
      fragment.appendChild(ownerDocument.createTextNode(source.slice(cursor)));
    }
    return fragment;
  }

  renderInto(container, sourceText, tokens) {
    if (!container || !container.ownerDocument ||
        typeof container.appendChild !== "function" ||
        typeof container.removeChild !== "function") {
      throw new TypeError("renderInto() requires a DOM container element.");
    }

    // Render first so invalid input never clears the existing container.
    const fragment = this.render(sourceText, tokens, container.ownerDocument);
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(fragment);
    return container;
  }
}

export function highlightTokens(sourceText, tokens, ownerDocument, options = {}) {
  return new SyntaxHighlighter(options).render(sourceText, tokens, ownerDocument);
}

export { TOKEN_CATEGORIES };
export default SyntaxHighlighter;
