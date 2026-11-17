import { isDeclarationAtRule } from "./css-rules.js";

function normalizeSource(value) {
  if (typeof value !== "string") throw new TypeError("CSS source must be a string.");
  return value.replace(/\r\n?/g, "\n");
}
function isNameStart(char) {
  if (!char) return false;
  const code = char.codePointAt(0);
  return char === "_" || char === "-" || char === "\\" || code >= 0x80 ||
    (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}
function isNameChar(char) {
  if (!char) return false;
  const code = char.codePointAt(0);
  return isNameStart(char) || (code >= 48 && code <= 57);
}
function consumeName(source, index) {
  let i = index;
  while (i < source.length && isNameChar(source[i])) {
    if (source[i] === "\\" && i + 1 < source.length) {
      i++;
      if (/[0-9a-fA-F]/.test(source[i] || "")) {
        let count = 0;
        while (i < source.length && count < 6 && /[0-9a-fA-F]/.test(source[i])) { i++; count++; }
        if (/[\t\n\f\r ]/.test(source[i] || "")) i++;
      } else i++;
    } else i++;
  }
  return i;
}
const numberPattern = /^[+-]?(?:(?:\d*\.\d+)|(?:\d+\.?\d*))(?:[eE][+-]?\d+)?/;

/** Tokenize CSS and preserve source offsets using UTF-16 code units. */
export function tokenizeCSS(input) {
  const source = normalizeSource(input), tokens = [];
  const add = (type, start, end) => {
    if (end > start) tokens.push({ type, start, end, value: source.slice(start, end) });
  };
  let i = 0;
  while (i < source.length) {
    const start = i, char = source[i];
    if (source.startsWith("/*", i)) {
      const close = source.indexOf("*/", i + 2);
      i = close < 0 ? source.length : close + 2;
      add("comment", start, i); continue;
    }
    if (/[\t\n\f\r ]/.test(char)) {
      while (i < source.length && /[\t\n\f\r ]/.test(source[i])) i++;
      add("whitespace", start, i); continue;
    }
    if (char === '"' || char === "'") {
      const quote = char; i++;
      while (i < source.length) {
        if (source[i] === "\\") { i += Math.min(2, source.length - i); continue; }
        if (source[i++] === quote) break;
      }
      add("string", start, i); continue;
    }
    if (char === "@" && isNameStart(source[i + 1])) {
      i = consumeName(source, i + 1); add("at-keyword", start, i); continue;
    }
    if (char === "#" && isNameChar(source[i + 1])) {
      i = consumeName(source, i + 1); add("hash", start, i); continue;
    }
    const number = source.slice(i).match(numberPattern);
    if (number) {
      i += number[0].length;
      if (source[i] === "%") { i++; add("percentage", start, i); continue; }
      if (isNameStart(source[i])) { i = consumeName(source, i); add("dimension", start, i); continue; }
      add("number", start, i); continue;
    }
    if (isNameStart(char)) {
      i = consumeName(source, i); add("ident", start, i); continue;
    }
    const pair = source.slice(i, i + 2);
    if (["~=", "|=", "^=", "$=", "*=", "||", "!="].includes(pair)) {
      i += 2; add("operator", start, i); continue;
    }
    if ("{}[]():;,".includes(char)) { i++; add("punctuation", start, i); continue; }
    if (char === "!") { i++; add("important-marker", start, i); continue; }
    i++; add("delimiter", start, i);
  }
  return tokens;
}

const isTrivia = token => token?.type === "whitespace" || token?.type === "comment";
function trimTokenRange(tokens, start, end) {
  while (start < end && isTrivia(tokens[start])) start++;
  while (end > start && isTrivia(tokens[end - 1])) end--;
  return [start, end];
}
function rawRange(source, tokens, start, end) {
  const [from, to] = trimTokenRange(tokens, start, end);
  return from >= to ? "" : source.slice(tokens[from].start, tokens[to - 1].end);
}

export class CSSParser {
  parse(input, context = {}) {
    const source = normalizeSource(input), tokens = tokenizeCSS(source);
    const errors = [];
    let index = 0;

    const parseDeclaration = (startIndex, endIndex) => {
      const [start, end] = trimTokenRange(tokens, startIndex, endIndex);
      if (start >= end) return null;
      let paren = 0, bracket = 0, colon = -1;
      for (let p = start; p < end; p++) {
        const value = tokens[p].value;
        if (value === "(") paren++;
        else if (value === ")") paren = Math.max(0, paren - 1);
        else if (value === "[") bracket++;
        else if (value === "]") bracket = Math.max(0, bracket - 1);
        else if (value === ":" && paren === 0 && bracket === 0) { colon = p; break; }
      }
      const nodeStart = tokens[start].start, nodeEnd = tokens[end - 1].end;
      if (colon < 0) {
        errors.push({ code: "MISSING_DECLARATION_COLON", message: "CSS declaration is missing a colon.", start: nodeStart, end: nodeEnd });
        return { type: "InvalidDeclaration", raw: source.slice(nodeStart, nodeEnd), start: nodeStart, end: nodeEnd };
      }
      const property = rawRange(source, tokens, start, colon);
      let value = rawRange(source, tokens, colon + 1, end);
      if (!property) errors.push({ code: "MISSING_PROPERTY_NAME", message: "CSS declaration has no property name.", start: nodeStart, end: nodeEnd });
      const importantMatch = /!\s*important\s*$/i.exec(value);
      const important = Boolean(importantMatch);
      if (importantMatch) value = value.slice(0, importantMatch.index).trimEnd();
      return { type: "Declaration", property, value, important, start: nodeStart, end: nodeEnd };
    };

    const findBoundary = () => {
      let paren = 0, bracket = 0;
      for (let p = index; p < tokens.length; p++) {
        const t = tokens[p], value = t.value;
        if (t.type === "string" || t.type === "comment") continue;
        if (value === "(") paren++;
        else if (value === ")") paren = Math.max(0, paren - 1);
        else if (value === "[") bracket++;
        else if (value === "]") bracket = Math.max(0, bracket - 1);
        else if (paren === 0 && bracket === 0 &&
          (value === ";" || value === "{" || value === "}")) return { index: p, kind: value };
      }
      return { index: tokens.length, kind: "eof" };
    };

    const parseSequence = (mode, stopAtBrace = false) => {
      const children = [];
      while (index < tokens.length) {
        while (index < tokens.length && (isTrivia(tokens[index]) || tokens[index].value === ";")) index++;
        if (index >= tokens.length) break;
        if (tokens[index].value === "}") {
          if (stopAtBrace) { index++; return children; }
          const unexpected = tokens[index++];
          errors.push({ code: "UNEXPECTED_CLOSING_BRACE", message: "Unexpected closing brace in stylesheet.", start: unexpected.start, end: unexpected.end });
          continue;
        }

        const startIndex = index, boundary = findBoundary(), segmentEnd = boundary.index;
        const first = tokens.slice(startIndex, segmentEnd).find(token => !isTrivia(token));
        const startsAtRule = first?.type === "at-keyword";

        if (boundary.kind === "{") {
          const prelude = rawRange(source, tokens, startIndex, segmentEnd);
          const open = tokens[boundary.index];
          index = boundary.index + 1;
          if (!prelude) errors.push({ code: "EMPTY_RULE_PRELUDE", message: "CSS block has no rule prelude.", start: open.start, end: open.end });
          if (startsAtRule) {
            const name = first.value.slice(1).toLowerCase();
            const nested = parseSequence(isDeclarationAtRule(name) ? "declarations" : "rules", true);
            const closeEnd = index > 0 ? tokens[index - 1].end : source.length;
            children.push({
              type: "AtRule", name,
              prelude: prelude.slice(first.value.length).trim(),
              children: nested, hasBlock: true, start: first.start, end: closeEnd
            });
          } else {
            const nested = parseSequence("declarations", true);
            const closeEnd = index > 0 ? tokens[index - 1].end : source.length;
            children.push({
              type: "QualifiedRule", prelude, selector: prelude,
              children: nested, start: tokens[startIndex].start, end: closeEnd
            });
          }
          continue;
        }

        if (boundary.kind === ";") {
          index = boundary.index + 1;
          if (startsAtRule) {
            const name = first.value.slice(1).toLowerCase();
            children.push({
              type: "AtRule", name,
              prelude: rawRange(source, tokens, startIndex + 1, boundary.index),
              children: null, hasBlock: false,
              start: first.start, end: tokens[boundary.index].end
            });
          } else if (mode === "declarations") {
            const declaration = parseDeclaration(startIndex, boundary.index);
            if (declaration) children.push(declaration);
          } else if (first) {
            errors.push({ code: "UNEXPECTED_RULE_TERMINATOR", message: "A CSS rule ended with a semicolon before its block.", start: first.start, end: tokens[boundary.index].end });
          }
          continue;
        }

        if (boundary.kind === "}") {
          if (mode === "declarations") {
            const declaration = parseDeclaration(startIndex, segmentEnd);
            if (declaration) children.push(declaration);
          } else if (first) {
            errors.push({ code: "INCOMPLETE_RULE", message: "CSS rule has no opening block.", start: first.start, end: tokens[segmentEnd - 1].end });
          }
          index = boundary.index;
          continue;
        }

        if (boundary.kind === "eof") {
          if (mode === "declarations") {
            const declaration = parseDeclaration(startIndex, segmentEnd);
            if (declaration) children.push(declaration);
          } else if (startsAtRule) {
            const name = first.value.slice(1).toLowerCase();
            children.push({
              type: "AtRule", name,
              prelude: rawRange(source, tokens, startIndex + 1, segmentEnd),
              children: null, hasBlock: false,
              start: first.start, end: tokens[segmentEnd - 1].end
            });
          } else if (first) {
            errors.push({ code: "INCOMPLETE_RULE", message: "CSS rule has no block.", start: first.start, end: tokens[segmentEnd - 1].end });
          }
          index = tokens.length;
        }
      }
      if (stopAtBrace) {
        errors.push({ code: "UNCLOSED_BLOCK", message: "CSS block is missing its closing brace.", start: source.length, end: source.length });
      }
      return children;
    };

    const children = parseSequence("rules", false);
    return { type: "Stylesheet", children, tokens, errors, sourceLength: source.length, context };
  }
}

export function parseCSS(source, context) { return new CSSParser().parse(source, context); }
export default CSSParser;
