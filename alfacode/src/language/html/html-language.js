import { HTMLParser, tokenizeHTML } from "./html-parser.js";
const parser = new HTMLParser();
export const htmlLanguage = Object.freeze({
  id: "html",
  aliases: ["htm", "xhtml"],
  extensions: [".html", ".htm", ".xhtml"],
  tokenize(text) { return tokenizeHTML(text); },
  parser
});
export { parser as htmlParser };
export default htmlLanguage;
