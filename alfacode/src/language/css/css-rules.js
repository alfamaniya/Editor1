/** Shared CSS vocabulary used by the tokenizer and parser. */
export const CSS_AT_RULES = new Set([
  "charset", "container", "counter-style", "document", "font-face", "font-feature-values",
  "font-palette-values", "import", "keyframes", "layer", "media", "namespace", "page",
  "property", "scope", "starting-style", "supports", "viewport"
]);
export const CSS_DECLARATION_AT_RULES = new Set([
  "font-face", "page", "counter-style", "property", "font-palette-values"
]);
export const CSS_GLOBAL_KEYWORDS = new Set(["inherit", "initial", "revert", "revert-layer", "unset"]);
export const CSS_LENGTH_UNITS = new Set([
  "cap", "ch", "em", "ex", "ic", "lh", "rem", "rlh", "vb", "vh", "vi", "vw",
  "vmax", "vmin", "svb", "svh", "svi", "svw", "lvb", "lvh", "lvi", "lvw",
  "dvb", "dvh", "dvi", "dvw", "cm", "in", "mm", "pc", "pt", "px", "Q"
]);
export const CSS_ANGLE_UNITS = new Set(["deg", "grad", "rad", "turn"]);
export const CSS_TIME_UNITS = new Set(["ms", "s"]);
export const CSS_FREQUENCY_UNITS = new Set(["Hz", "kHz"]);
export const CSS_RESOLUTION_UNITS = new Set(["dpi", "dpcm", "dppx"]);
export function isKnownAtRule(name) { return CSS_AT_RULES.has(String(name).toLowerCase()); }
export function isDeclarationAtRule(name) { return CSS_DECLARATION_AT_RULES.has(String(name).toLowerCase()); }
