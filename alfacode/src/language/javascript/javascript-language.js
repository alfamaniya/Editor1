// #javascript-language.js: فایل javascript language مربوط به بخش javascript پروژه
import { JavaScriptParser, tokenizeJavaScript } from "./javascript-parser.js";

const parser = new JavaScriptParser();

export const javascriptLanguage = Object.freeze({
  id: "javascript",
  aliases: ["js", "ecmascript", "mjs", "cjs"],
  extensions: [".js", ".mjs", ".cjs"],
  tokenize(text) {
    return tokenizeJavaScript(text);
  },
  parser
});

export { parser as javascriptParser };
export default javascriptLanguage;
