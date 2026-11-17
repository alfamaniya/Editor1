/**
 * Tokenizer
 * Runs a registered language tokenizer and validates its UTF-16 token ranges.
 *
 * Normalized token shape: { type, start, end, value }
 * start is inclusive, end is exclusive, both zero-based UTF-16 offsets.
 */
export class Tokenizer {
  tokenize(language, sourceText, options = {}) {
    if (!language || typeof language.tokenize !== "function") {
      throw new TypeError("Tokenizer requires a language with a tokenize() function.");
    }
    if (typeof sourceText !== "string") {
      throw new TypeError("Tokenizer source must be a string.");
    }

    const text = sourceText.replace(/\r\n?/g, "\n");
    const rawTokens = language.tokenize(text, {
      ...options,
      languageId: language.id,
      sourceText: text
    });

    if (!Array.isArray(rawTokens)) {
      throw new TypeError("Language tokenize() must return an array of tokens.");
    }

    let previousStart = -1;
    const tokens = rawTokens.map((token, index) => {
      if (!token || typeof token !== "object") {
        throw new TypeError(`Token at index ${index} must be an object.`);
      }
      const { type, start, end } = token;
      if (typeof type !== "string" || !type.trim()) {
        throw new TypeError(`Token at index ${index} requires a non-empty type.`);
      }
      if (!Number.isInteger(start) || !Number.isInteger(end) ||
          start < 0 || end < start || end > text.length) {
        throw new RangeError(`Token at index ${index} has an invalid range.`);
      }
      if (start < previousStart) {
        throw new RangeError("Tokens must be ordered by ascending start offset.");
      }
      if (token.value !== undefined && typeof token.value !== "string") {
        throw new TypeError(`Token value at index ${index} must be a string.`);
      }

      previousStart = start;
      return Object.freeze({
        ...token,
        type,
        start,
        end,
        value: token.value ?? text.slice(start, end)
      });
    });

    return tokens;
  }
}

export default Tokenizer;
