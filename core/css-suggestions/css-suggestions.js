import { createTagSuggestions } from "../tag-suggestions/tag-suggestions.js";
export function createCSSSuggestions(options={}) {
  return createTagSuggestions({...options,heading:"CSS suggestions",templateMarkup:globalThis.__ALFACODE_CSS_SUGGESTIONS_TEMPLATE__});
}
export default createCSSSuggestions;
