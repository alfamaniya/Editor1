// #html-parser.js: فایل html parser مربوط به بخش html پروژه
import { isVoidElement, isRawTextElement } from "./html-rules.js";

function normalizeSource(value) {
  if (typeof value !== "string") throw new TypeError("HTML source must be a string.");
  return value.replace(/\r\n?/g, "\n");
}
function makeToken(type, start, end, source) {
  return { type, start, end, value: source.slice(start, end) };
}
const isSpace = c => c === " " || c === "\t" || c === "\n" || c === "\f";

/** Ordered HTML tokens with inclusive start, exclusive end, UTF-16 offsets. */
export function tokenizeHTML(input) {
  const source = normalizeSource(input), tokens = [];
  const add = (type, start, end) => { if (end > start) tokens.push(makeToken(type, start, end, source)); };
  let i = 0;
  while (i < source.length) {
    const start = i;
    if (source.startsWith("<!--", i)) {
      const close = source.indexOf("-->", i + 4); i = close < 0 ? source.length : close + 3;
      add("comment", start, i); continue;
    }
    if (/^<!doctype\b/i.test(source.slice(i))) {
      const close = source.indexOf(">", i + 2); i = close < 0 ? source.length : close + 1;
      add("doctype", start, i); continue;
    }
    if (source.startsWith("</", i)) {
      add("tag-close-open", i, i + 2); i += 2;
      while (i < source.length && isSpace(source[i])) i++;
      const ns = i; while (i < source.length && !isSpace(source[i]) && source[i] !== ">") i++;
      add("tag-name", ns, i);
      while (i < source.length && source[i] !== ">") {
        const ws = i; while (i < source.length && isSpace(source[i])) i++; add("whitespace", ws, i);
        if (source[i] === ">") break;
        const bad = i; while (i < source.length && !isSpace(source[i]) && source[i] !== ">") i++;
        add("invalid", bad, i);
      }
      if (source[i] === ">") { add("tag-close", i, ++i); }
      continue;
    }
    if (source[i] === "<" && /[A-Za-z]/.test(source[i + 1] || "")) {
      add("tag-open", i, i + 1); i++;
      const ns = i; while (i < source.length && !isSpace(source[i]) && source[i] !== ">" && source[i] !== "/") i++;
      add("tag-name", ns, i);
      while (i < source.length) {
        const ws = i; while (i < source.length && isSpace(source[i])) i++; add("whitespace", ws, i);
        if (source[i] === ">") { add("tag-close", i, ++i); break; }
        if (source[i] === "/" && source[i + 1] === ">") { add("self-close", i, i + 2); i += 2; break; }
        if (i >= source.length) break;
        const as = i;
        while (i < source.length && !isSpace(source[i]) && source[i] !== "=" && source[i] !== ">" && !(source[i] === "/" && source[i + 1] === ">")) i++;
        if (i === as) { add("invalid", i, ++i); continue; }
        add("attribute-name", as, i);
        const ws2 = i; while (i < source.length && isSpace(source[i])) i++; add("whitespace", ws2, i);
        if (source[i] !== "=") continue;
        add("equals", i, ++i);
        const ws3 = i; while (i < source.length && isSpace(source[i])) i++; add("whitespace", ws3, i);
        if (source[i] === '"' || source[i] === "'") {
          const valueStart = i, quote = source[i++]; while (i < source.length && source[i] !== quote) i++;
          if (i < source.length) i++; add("attribute-value", valueStart, i);
        } else {
          const vs = i; while (i < source.length && !isSpace(source[i]) && source[i] !== ">" && !(source[i] === "/" && source[i + 1] === ">")) i++;
          add("attribute-value", vs, i);
        }
      }
      continue;
    }
    if (source[i] === "<") { add("text", i, ++i); continue; }
    while (i < source.length && source[i] !== "<") i++;
    add("text", start, i);
  }
  return tokens;
}

function attributesFrom(group) {
  const result = [];
  for (let i = 0; i < group.length; i++) {
    if (group[i].type !== "attribute-name") continue;
    const name = group[i]; let value = null, end = name.end;
    let j = i + 1;
    while (group[j]?.type === "whitespace") j++;
    if (group[j]?.type === "equals") {
      j++; while (group[j]?.type === "whitespace") j++;
      if (group[j]?.type === "attribute-value") { value = group[j].value; end = group[j].end; i = j; }
      else i = j - 1;
    }
    result.push({ type: "Attribute", name: name.value, value, start: name.start, end });
  }
  return result;
}

export class HTMLParser {
  parse(input, context = {}) {
    const source = normalizeSource(input), tokens = tokenizeHTML(source);
    const root = { type: "Document", children: [], start: 0, end: source.length };
    const stack = [root], errors = [];
    let i = 0;
    const append = node => stack[stack.length - 1].children.push(node);
    while (i < tokens.length) {
      const t = tokens[i];
      if (t.type === "comment" || t.type === "doctype" || t.type === "text") {
        append({ type: t.type === "comment" ? "Comment" : t.type === "doctype" ? "Doctype" : "Text", value: t.value, start: t.start, end: t.end }); i++; continue;
      }
      if (t.type !== "tag-open" && t.type !== "tag-close-open") {
        append({ type: "Text", value: t.value, start: t.start, end: t.end }); i++; continue;
      }
      const closing = t.type === "tag-close-open", group = [t]; i++;
      while (i < tokens.length && tokens[i].type !== "tag-close" && tokens[i].type !== "self-close") group.push(tokens[i++]);
      if (i < tokens.length) group.push(tokens[i++]);
      const nameToken = group.find(x => x.type === "tag-name"), name = nameToken?.value || "";
      const end = group[group.length - 1]?.end ?? t.end;
      if (!name) {
        errors.push({ code: "MISSING_TAG_NAME", message: "Tag name is missing.", start: t.start, end });
        append({ type: "InvalidTag", name: "", start: t.start, end }); continue;
      }
      if (closing) {
        let found = -1;
        for (let s = stack.length - 1; s > 0; s--) if (stack[s].name.toLowerCase() === name.toLowerCase()) { found = s; break; }
        if (found < 0) errors.push({ code: "UNMATCHED_CLOSING_TAG", message: `No open element matches </${name}>.`, start: t.start, end });
        else {
          while (stack.length - 1 > found) {
            const unclosed = stack.pop(); unclosed.end = t.start;
            errors.push({ code: "UNCLOSED_TAG", message: `Element <${unclosed.name}> was implicitly closed before </${name}>.`, start: unclosed.start, end: t.start });
          }
          const element = stack.pop(); element.closeStart = t.start; element.end = end;
        }
        continue;
      }
      const selfClosing = group.some(x => x.type === "self-close");
      const element = { type: "Element", name, attributes: attributesFrom(group), children: [], selfClosing, start: t.start, openEnd: end, end };
      append(element);
      if (!selfClosing && !isVoidElement(name)) {
        stack.push(element);
        if (isRawTextElement(name)) {
          const re = new RegExp("</\\s*" + name + "\\s*>", "ig"); re.lastIndex = end;
          const match = re.exec(source), rawEnd = match ? match.index : source.length;
          if (rawEnd > end) element.children.push({ type: "Text", value: source.slice(end, rawEnd), start: end, end: rawEnd, raw: true });
          if (match) {
            while (i < tokens.length && tokens[i].start < match.index) tokens.splice(i, 1);
            const close = tokenizeHTML(source.slice(match.index, match.index + match[0].length));
            tokens.splice(i, 0, ...close.map(x => ({ ...x, start: x.start + match.index, end: x.end + match.index })));
          } else {
            tokens.splice(i);
            errors.push({ code: "UNCLOSED_RAW_TEXT_ELEMENT", message: `Element <${name}> has no closing tag.`, start: t.start, end: source.length });
          }
        }
      }
    }
    while (stack.length > 1) {
      const element = stack.pop(); element.end = source.length;
      errors.push({ code: "UNCLOSED_TAG", message: `Element <${element.name}> is not closed.`, start: element.start, end: source.length });
    }
    return { type: "HTMLDocument", root, tokens, errors, sourceLength: source.length, context };
  }
}
export function parseHTML(source, context) { return new HTMLParser().parse(source, context); }
export default HTMLParser;
