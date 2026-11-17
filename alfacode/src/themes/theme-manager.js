/**
 * ThemeManager
 * Registers editor themes and applies their CSS hook classes to an explicit DOM root.
 * The manager does not access the global document or load stylesheets.
 */

const DEFAULT_THEMES = Object.freeze([
  Object.freeze({ id: "dark", label: "Dark", className: "alfacode-theme-dark" }),
  Object.freeze({ id: "light", label: "Light", className: "alfacode-theme-light" })
]);

function validateTheme(theme) {
  if (!theme || typeof theme !== "object" || Array.isArray(theme)) {
    throw new TypeError("A theme must be an object.");
  }
  if (typeof theme.id !== "string" || !/^[a-z][a-z0-9-]*$/.test(theme.id)) {
    throw new TypeError("Theme id must be a lowercase identifier.");
  }

  const label = theme.label ?? theme.id;
  const className = theme.className ?? `alfacode-theme-${theme.id}`;

  if (typeof label !== "string" || !label.trim()) {
    throw new TypeError("Theme label must be a non-empty string.");
  }
  if (typeof className !== "string" || !/^[A-Za-z_][A-Za-z0-9_-]*$/.test(className)) {
    throw new TypeError("Theme className must be a valid single CSS class name.");
  }

  return Object.freeze({
    id: theme.id,
    label: label.trim(),
    className
  });
}

function validateRootElement(rootElement) {
  if (!rootElement ||
      !rootElement.classList ||
      typeof rootElement.classList.add !== "function" ||
      typeof rootElement.classList.remove !== "function" ||
      typeof rootElement.setAttribute !== "function" ||
      typeof rootElement.removeAttribute !== "function") {
    throw new TypeError("Theme application requires a DOM element with classList and attribute methods.");
  }
}

export class ThemeManager {
  constructor(options = {}) {
    this.themes = new Map();
    this.activeThemeId = null;
    this.rootElement = null;

    for (const theme of DEFAULT_THEMES) {
      this.register(theme);
    }

    if (options.themes !== undefined) {
      if (!Array.isArray(options.themes)) {
        throw new TypeError("themes must be an array.");
      }
      for (const theme of options.themes) {
        this.register(theme);
      }
    }

    const defaultTheme = options.defaultTheme ?? "dark";
    const rootElement = options.rootElement ?? null;
    if (rootElement !== null) {
      validateRootElement(rootElement);
    }

    this.setTheme(defaultTheme, rootElement);
  }

  register(theme) {
    const normalized = validateTheme(theme);
    if (this.themes.has(normalized.id)) {
      throw new Error(`Theme "${normalized.id}" is already registered.`);
    }

    for (const registered of this.themes.values()) {
      if (registered.className === normalized.className) {
        throw new Error(`Theme class "${normalized.className}" is already in use.`);
      }
    }

    this.themes.set(normalized.id, normalized);
    return normalized;
  }

  unregister(identifier) {
    const theme = this.get(identifier);
    if (!theme) return false;
    if (theme.id === this.activeThemeId) {
      throw new Error("The active theme cannot be unregistered.");
    }
    this.themes.delete(theme.id);
    return true;
  }

  get(identifier) {
    if (typeof identifier !== "string") return null;
    return this.themes.get(identifier) ?? null;
  }

  has(identifier) {
    return this.get(identifier) !== null;
  }

  list() {
    return Array.from(this.themes.values());
  }

  get activeTheme() {
    return this.get(this.activeThemeId);
  }

  get activeThemeIdValue() {
    return this.activeThemeId;
  }

  setTheme(identifier, rootElement = this.rootElement) {
    const theme = this.get(identifier);
    if (!theme) {
      throw new RangeError(`Unknown theme "${identifier}".`);
    }
    if (rootElement !== null) {
      validateRootElement(rootElement);
    }

    if (this.rootElement && this.rootElement !== rootElement) {
      this._removeThemeClasses(this.rootElement);
    }

    if (rootElement) {
      this._applyTheme(theme, rootElement);
    }

    this.activeThemeId = theme.id;
    this.rootElement = rootElement;
    return theme;
  }

  apply(rootElement = this.rootElement) {
    const theme = this.activeTheme;
    if (!theme) {
      throw new Error("No active theme is selected.");
    }
    validateRootElement(rootElement);

    if (this.rootElement && this.rootElement !== rootElement) {
      this._removeThemeClasses(this.rootElement);
    }

    this._applyTheme(theme, rootElement);
    this.rootElement = rootElement;
    return rootElement;
  }

  clear(rootElement = this.rootElement) {
    if (rootElement !== null) {
      validateRootElement(rootElement);
      this._removeThemeClasses(rootElement);
    }
    this.activeThemeId = null;
    this.rootElement = null;
    return this;
  }

  _removeThemeClasses(rootElement) {
    for (const theme of this.themes.values()) {
      rootElement.classList.remove(theme.className);
    }
    rootElement.removeAttribute("data-alfacode-theme");
  }

  _applyTheme(theme, rootElement) {
    this._removeThemeClasses(rootElement);
    rootElement.classList.add(theme.className);
    rootElement.setAttribute("data-alfacode-theme", theme.id);
  }
}

export { DEFAULT_THEMES };
export default ThemeManager;
