// #css-language.js: فایل css language مربوط به بخش css پروژه
import { CSSParser, tokenizeCSS } from "./css-parser.js";

const parser = new CSSParser();

export const cssLanguage = Object.freeze({
  id: "css",
  aliases: ["stylesheet"],
  extensions: [".css"],
  tokenize(text) {
    return tokenizeCSS(text);
  },
  parser
});

export { parser as cssParser };
export default cssLanguage;
