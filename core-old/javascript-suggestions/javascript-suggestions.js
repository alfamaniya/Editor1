import { createTagSuggestions } from "../tag-suggestions/tag-suggestions.js";
export function createJavaScriptSuggestions(options={}) {
  return createTagSuggestions({...options,heading:"JavaScript suggestions",templateMarkup:globalThis.__ALFACODE_JAVASCRIPT_SUGGESTIONS_TEMPLATE__});
}
export default createJavaScriptSuggestions;
