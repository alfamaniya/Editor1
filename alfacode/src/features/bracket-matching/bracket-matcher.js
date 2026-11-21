// #bracket-matcher.js: فایل bracket matcher مربوط به بخش bracket matching پروژه
/**
 * BracketMatcher
 * Finds matching (), [] and {} pairs in source text.
 *
 * Offsets are zero-based UTF-16 code units; match end positions are inclusive
 * character indices because each supported bracket is one UTF-16 code unit.
 */

const OPEN_TO_CLOSE = Object.freeze({
  "(": ")",
  "[": "]",
  "{": "}"
});

const CLOSE_TO_OPEN = Object.freeze({
  ")": "(",
  "]": "[",
  "}": "{"
});

const IGNORED_TOKEN_TYPES = new Set([
  "string",
  "attribute-value",
  "comment",
  "line-comment",
  "block-comment",
  "invalid-comment",
  "regex",
  "template",
  "text",
  "doctype"
]);

function normalizeSource(value) {
  if (typeof value !== "string") {
    throw new TypeError("Bracket matcher source must be a string.");
  }
  return value.replace(/\r\n?/g, "\n");
}

function validateTokens(tokens, sourceLength) {
  if (!Array.isArray(tokens)) {
    throw new TypeError("Bracket matcher tokens must be an array.");
  }

  let previousEnd = 0;
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token || typeof token !== "object" ||
        typeof token.type !== "string" ||
        !Number.isInteger(token.start) ||
        !Number.isInteger(token.end) ||
        token.start < 0 ||
        token.end < token.start ||
        token.end > sourceLength ||
        token.start < previousEnd) {
      throw new RangeError(`Token at index ${index} has an invalid or overlapping range.`);
    }
    previousEnd = token.end;
  }
}

function isIgnoredType(type) {
  if (IGNORED_TOKEN_TYPES.has(type)) return true;
  return type.includes("comment") ||
    type.includes("string") ||
    type.includes("template") ||
    type.includes("regex");
}

function buildPairMap(source, tokens) {
  validateTokens(tokens, source.length);

  const pairs = new Map();
  const stack = [];
  let tokenIndex = 0;

  for (let index = 0; index < source.length; index += 1) {
    while (tokenIndex < tokens.length && tokens[tokenIndex].end <= index) {
      tokenIndex += 1;
    }

    const token = tokens[tokenIndex];
    if (token &&
        token.start <= index &&
        index < token.end &&
        isIgnoredType(token.type)) {
      index = token.end - 1;
      continue;
    }

    const character = source[index];
    if (Object.prototype.hasOwnProperty.call(OPEN_TO_CLOSE, character)) {
      stack.push({ character, index });
      continue;
    }

    if (!Object.prototype.hasOwnProperty.call(CLOSE_TO_OPEN, character)) {
      continue;
    }

    const opening = stack[stack.length - 1];
    if (opening && OPEN_TO_CLOSE[opening.character] === character) {
      stack.pop();
      pairs.set(opening.index, index);
      pairs.set(index, opening.index);
    } else if (opening) {
      // A mismatched closer makes the pending nesting structurally invalid.
      // Clear pending openings so crossing pairs such as "([)]" are not
      // reported as valid matches.
      stack.length = 0;
    }
  }

  return pairs;
}

function createMatch(source, firstIndex, secondIndex) {
  const openingIndex = OPEN_TO_CLOSE[source[firstIndex]] ? firstIndex : secondIndex;
  const closingIndex = openingIndex === firstIndex ? secondIndex : firstIndex;

  return Object.freeze({
    from: Math.min(firstIndex, secondIndex),
    to: Math.max(firstIndex, secondIndex),
    open: openingIndex,
    close: closingIndex,
    opening: source[openingIndex],
    closing: source[closingIndex]
  });
}

export class BracketMatcher {
  isBracket(character) {
    return typeof character === "string" &&
      (Object.prototype.hasOwnProperty.call(OPEN_TO_CLOSE, character) ||
       Object.prototype.hasOwnProperty.call(CLOSE_TO_OPEN, character));
  }

  findAll(sourceText, tokens = []) {
    const source = normalizeSource(sourceText);
    const pairs = buildPairMap(source, tokens);
    const matches = [];

    for (let index = 0; index < source.length; index += 1) {
      const otherIndex = pairs.get(index);
      if (otherIndex !== undefined && index < otherIndex) {
        matches.push(createMatch(source, index, otherIndex));
      }
    }

    return matches;
  }

  /**
   * Finds the pair adjacent to a cursor offset.
   * A bracket at the cursor is preferred; otherwise the preceding character
   * is checked. Returns null when no valid pair is found.
   */
  findMatch(sourceText, cursorOffset, tokens = []) {
    const source = normalizeSource(sourceText);
    if (!Number.isInteger(cursorOffset) ||
        cursorOffset < 0 ||
        cursorOffset > source.length) {
      throw new RangeError("Cursor offset is outside the source text.");
    }

    const pairs = buildPairMap(source, tokens);
    const candidates = [cursorOffset, cursorOffset - 1];

    for (const index of candidates) {
      if (index < 0 || index >= source.length || !this.isBracket(source[index])) {
        continue;
      }

      const otherIndex = pairs.get(index);
      if (otherIndex !== undefined) {
        return createMatch(source, index, otherIndex);
      }
    }

    return null;
  }
}

export { OPEN_TO_CLOSE, CLOSE_TO_OPEN };
export default BracketMatcher;
