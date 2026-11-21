// #html-rules.js: فایل html rules مربوط به بخش html پروژه
/** Shared HTML lexical and structural rules. */
export const VOID_ELEMENTS = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
export const RAW_TEXT_ELEMENTS = new Set(["script","style"]);
export const HTML_BOOLEAN_ATTRIBUTES = new Set(["allowfullscreen","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","hidden","inert","ismap","itemscope","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"]);
export function isVoidElement(name) { return VOID_ELEMENTS.has(String(name).toLowerCase()); }
export function isRawTextElement(name) { return RAW_TEXT_ELEMENTS.has(String(name).toLowerCase()); }
