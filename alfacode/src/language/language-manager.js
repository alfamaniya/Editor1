/**
 * LanguageManager
 * Registers language definitions and resolves them by id, alias, or extension.
 *
 * Language definition contract:
 * {
 *   id: string,
 *   aliases?: string[],
 *   extensions?: string[],
 *   tokenize(text, context): Token[],
 *   parser?: { parse(text, context): unknown }
 * }
 */
export class LanguageManager {
  constructor() {
    this._languages = new Map();
    this._aliases = new Map();
    this._extensions = new Map();
    this._activeLanguageId = null;
  }

  register(language) {
    this._validateLanguage(language);
    const id = this._normalize(language.id);
    if (this._languages.has(id)) {
      throw new Error(`Language "${language.id}" is already registered.`);
    }

    const aliases = this._normalizeList(language.aliases);
    const extensions = this._normalizeExtensions(language.extensions);
    const identifiers = [id, ...aliases];

    for (const identifier of identifiers) {
      const existing = this._aliases.get(identifier);
      if (existing && existing !== id) {
        throw new Error(`Language identifier "${identifier}" is already in use.`);
      }
    }
    for (const extension of extensions) {
      const existing = this._extensions.get(extension);
      if (existing && existing !== id) {
        throw new Error(`File extension "${extension}" is already registered.`);
      }
    }

    this._languages.set(id, language);
    for (const identifier of identifiers) this._aliases.set(identifier, id);
    for (const extension of extensions) this._extensions.set(extension, id);

    return language;
  }

  unregister(identifier) {
    const language = this.get(identifier);
    if (!language) return false;
    const id = this._normalize(language.id);
    this._languages.delete(id);

    for (const [alias, target] of this._aliases) {
      if (target === id) this._aliases.delete(alias);
    }
    for (const [extension, target] of this._extensions) {
      if (target === id) this._extensions.delete(extension);
    }
    if (this._activeLanguageId === id) this._activeLanguageId = null;
    return true;
  }

  get(identifier) {
    if (typeof identifier !== "string" || !identifier.trim()) return null;
    const normalized = this._normalize(identifier);
    const id = this._aliases.get(normalized) ?? this._extensions.get(this._normalizeExtension(normalized));
    return id ? this._languages.get(id) ?? null : null;
  }

  has(identifier) {
    return this.get(identifier) !== null;
  }

  detectFromFilename(filename) {
    if (typeof filename !== "string" || !filename.trim()) return null;
    const basename = filename.split(/[\\/]/).pop();
    const dot = basename.lastIndexOf(".");
    if (dot < 0 || dot === basename.length - 1) return null;
    return this.get(basename.slice(dot + 1));
  }

  setActive(identifier) {
    const language = this.get(identifier);
    if (!language) {
      throw new Error(`Unknown language "${identifier}".`);
    }
    this._activeLanguageId = this._normalize(language.id);
    return language;
  }

  get activeLanguage() {
    return this._activeLanguageId
      ? this._languages.get(this._activeLanguageId) ?? null
      : null;
  }

  get activeLanguageId() {
    return this._activeLanguageId;
  }

  list() {
    return Array.from(this._languages.values());
  }

  clear() {
    this._languages.clear();
    this._aliases.clear();
    this._extensions.clear();
    this._activeLanguageId = null;
  }

  _validateLanguage(language) {
    if (!language || typeof language !== "object") {
      throw new TypeError("Language definition must be an object.");
    }
    if (typeof language.id !== "string" || !language.id.trim()) {
      throw new TypeError("Language definition requires a non-empty id.");
    }
    if (typeof language.tokenize !== "function") {
      throw new TypeError("Language definition requires a tokenize(text, context) function.");
    }
    if (language.parser !== undefined &&
      (!language.parser || typeof language.parser.parse !== "function")) {
      throw new TypeError("Language parser must provide a parse(text, context) function.");
    }
  }

  _normalize(value) {
    return value.trim().toLowerCase();
  }

  _normalizeList(values = []) {
    if (!Array.isArray(values)) throw new TypeError("Language aliases must be an array.");
    return values.map(value => {
      if (typeof value !== "string" || !value.trim()) {
        throw new TypeError("Language aliases must be non-empty strings.");
      }
      return this._normalize(value);
    });
  }

  _normalizeExtension(value) {
    return value.replace(/^\\./, "").toLowerCase();
  }

  _normalizeExtensions(values = []) {
    if (!Array.isArray(values)) throw new TypeError("Language extensions must be an array.");
    return values.map(value => {
      if (typeof value !== "string" || !value.trim()) {
        throw new TypeError("Language extensions must be non-empty strings.");
      }
      return this._normalizeExtension(value.trim());
    });
  }
}

export default LanguageManager;
