// #javascript-rules.js: فایل javascript rules مربوط به بخش javascript پروژه
/** Shared JavaScript lexical vocabulary and parser classification rules. */
export const JAVASCRIPT_KEYWORDS = new Set([
  "as","async","await","break","case","catch","class","const","continue","debugger",
  "default","delete","do","else","export","extends","finally","for","from","function",
  "get","if","import","in","instanceof","let","new","of","return","set","static",
  "super","switch","this","throw","try","typeof","var","void","while","with","yield"
]);

export const JAVASCRIPT_RESERVED_WORDS = new Set([
  "enum","implements","interface","package","private","protected","public"
]);

export const JAVASCRIPT_LITERAL_KEYWORDS = new Set(["true","false","null"]);
export const JAVASCRIPT_CONTEXTUAL_KEYWORDS = new Set([
  "accessor","assert","declare","exports","module"," satisfies","target","using"
].map(value => value.trim()));

export const JAVASCRIPT_BOOLEAN_NULL_LITERALS = new Set(["true","false","null"]);

export const JAVASCRIPT_OPERATORS = [
  ">>>=","**=","&&=","||=","??=","===","!==",">>>","<<=",">>=",
  "=>","==","!=","<=",">=","++","--","&&","||","??","?.",
  "+=","-=","*=","/=","%=","&=","|=","^=","**","<<",">>"
].sort((a,b) => b.length - a.length);

export const JAVASCRIPT_PUNCTUATORS = new Set([
  "{","}","(",")","[","]",".",";",",",":","?","~"
]);

export const JAVASCRIPT_REGEX_PREFIX_KEYWORDS = new Set([
  "return","throw","case","delete","void","typeof","instanceof","in",
  "of","yield","await","else","do"
]);

export function isJavaScriptKeyword(value) {
  return JAVASCRIPT_KEYWORDS.has(value) ||
    JAVASCRIPT_RESERVED_WORDS.has(value) ||
    JAVASCRIPT_LITERAL_KEYWORDS.has(value);
}
