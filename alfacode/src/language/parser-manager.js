/**
 * ParserManager
 * Registers and invokes parsers independently from tokenization and rendering.
 */
export class ParserManager {
  constructor() {
    this._parsers = new Map();
  }

  register(languageId, parser) {
    const id = this._normalizeId(languageId);
    if (!parser || typeof parser.parse !== "function") {
      throw new TypeError("Parser must provide a parse(text, context) function.");
    }
    if (this._parsers.has(id)) {
      throw new Error(`A parser for "${id}" is already registered.`);
    }
    this._parsers.set(id, parser);
    return parser;
  }

  unregister(languageId) {
    return this._parsers.delete(this._normalizeId(languageId));
  }

  get(languageId) {
    return this._parsers.get(this._normalizeId(languageId)) ?? null;
  }

  has(languageId) {
    return this._parsers.has(this._normalizeId(languageId));
  }

  parse(languageId, sourceText, options = {}) {
    if (typeof sourceText !== "string") {
      throw new TypeError("Parser source must be a string.");
    }
    const parser = this.get(languageId);
    if (!parser) {
      throw new Error(`No parser is registered for "${languageId}".`);
    }
    const text = sourceText.replace(/\r\n?/g, "\n");
    return parser.parse(text, {
      ...options,
      languageId: this._normalizeId(languageId),
      sourceText: text
    });
  }

  clear() {
    this._parsers.clear();
  }

  list() {
    return Array.from(this._parsers.keys());
  }

  _normalizeId(languageId) {
    if (typeof languageId !== "string" || !languageId.trim()) {
      throw new TypeError("Language id must be a non-empty string.");
    }
    return languageId.trim().toLowerCase();
  }
}

export default ParserManager;
