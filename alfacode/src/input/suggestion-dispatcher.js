/**
 * Routes a selected completion to the handler owned by the active language.
 * HTML needs tag-aware insertion; CSS and JavaScript insert plain language text.
 */
export function applySuggestionForLanguage(languageId, option, handlers = {}) {
  if (!option) return false;
  const handler = languageId === "html" ? handlers.html : handlers.language;
  if (typeof handler !== "function") return false;
  handler(option);
  return true;
}
