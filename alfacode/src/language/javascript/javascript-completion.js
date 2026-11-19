const KEYWORDS = [
  "async","await","break","case","catch","class","const","continue","debugger","default","delete",
  "do","else","export","extends","false","finally","for","from","function","if","import","in",
  "instanceof","let","new","null","of","return","static","super","switch","this","throw","true",
  "try","typeof","var","void","while","yield"
];
const GLOBALS = [
  "Array","Boolean","Date","Error","JSON","Map","Math","Number","Object","Promise","RegExp",
  "Set","String","Symbol","URL","console","document","fetch","localStorage","navigator",
  "parseInt","parseFloat","setInterval","setTimeout","window"
];
const METHODS = {
  console:["assert","clear","count","debug","error","info","log","table","time","timeEnd","warn"],
  document:["addEventListener","createElement","getElementById","querySelector","querySelectorAll"],
  window:["addEventListener","alert","confirm","fetch","requestAnimationFrame","setTimeout"],
  Array:["from","isArray","of"],
  Math:["abs","ceil","floor","max","min","random","round","sqrt"],
  JSON:["parse","stringify"],
  Promise:["all","allSettled","race","reject","resolve"]
};
const SNIPPETS = {
  "addEventListener":"addEventListener","for":"for","function":"function","if":"if","try":"try",
  "console":"console","document":"document","setTimeout":"setTimeout"
};
function isInsideLiteralOrComment(source,cursor) {
  const prefix=source.slice(0,cursor);
  const lineComment=prefix.lastIndexOf("//");
  const lineBreak=prefix.lastIndexOf("\n");
  if(lineComment>lineBreak)return true;
  const blockStart=prefix.lastIndexOf("/*"),blockEnd=prefix.lastIndexOf("*/");
  if(blockStart>blockEnd)return true;
  let quote=null,escaped=false;
  for(const char of prefix){
    if(escaped){escaped=false;continue;}
    if(char==="\\"){escaped=true;continue;}
    if(quote){if(char===quote)quote=null;continue;}
    if(char==="'"||char==='"'||char==="`")quote=char;
  }
  return Boolean(quote);
}
const INSTANCE_OWNER_BY_TYPE = Object.freeze({
  Array: "Array.prototype", BigInt: "BigInt.prototype", Boolean: "Boolean.prototype",
  Date: "Date.prototype", Error: "Error.prototype", Function: "Function.prototype",
  Map: "Map.prototype", Number: "Number.prototype", Object: "Object.prototype",
  Promise: "Promise.prototype", RegExp: "RegExp.prototype", Set: "Set.prototype",
  String: "String.prototype", Symbol: "Symbol.prototype", WeakMap: "WeakMap.prototype",
  WeakSet: "WeakSet.prototype", URL: "URL.prototype", AbortController: "AbortController.prototype",
  AbortSignal: "AbortSignal.prototype", Node: "Node.prototype", Element: "Element.prototype",
  HTMLElement: "HTMLElement.prototype", Document: "Document.prototype",
  EventTarget: "EventTarget.prototype", HTMLInputElement: "HTMLInputElement.prototype",
  HTMLTextAreaElement: "HTMLTextAreaElement.prototype", HTMLSelectElement: "HTMLSelectElement.prototype",
  HTMLButtonElement: "HTMLButtonElement.prototype"
});

function inferMemberOwner(source, expression) {
  if (GLOBALS.includes(expression) || ["console", "document", "window"].includes(expression)) return expression;
  const escaped = expression.replace(/[.*+?^\${}()|[\]\\]/g, "\\export function getJavaScriptCompletionSuggestions");
  const declaration = new RegExp(
    "(?:\\b(?:const|let|var)\\s+" + escaped + "\\s*=|\\b" + escaped + "\\s*=)\\s*([^;\\n]+)", "g"
  );
  let initializer = null;
  for (const match of source.matchAll(declaration)) initializer = match[1].trim();
  if (!initializer) return null;
  const constructor = initializer.match(/^new\\s+([A-Za-z_$][\\w$]*)\\s*\\(/);
  if (constructor) return INSTANCE_OWNER_BY_TYPE[constructor[1]] ?? constructor[1] + ".prototype";
  if (/^(?:\\[\\s*\\]|Array\\s*\\()/i.test(initializer)) return "Array.prototype";
  if (/^(?:["'\\x60]|String\\s*\\()/i.test(initializer)) return "String.prototype";
  if (/^(?:-?\\d+(?:\\.\\d+)?|Number\\s*\\()/i.test(initializer)) return "Number.prototype";
  if (/^(?:true|false|Boolean\\s*\\()/i.test(initializer)) return "Boolean.prototype";
  if (/^(?:\\{\\s*\\}|Object\\s*\\()/i.test(initializer)) return "Object.prototype";
  if (/^\\/(?:[^/]|\\\\.)+\\/[dgimsuvy]*$/.test(initializer)) return "RegExp.prototype";
  if (/^document\\.querySelector(?:All)?\\s*\\(/.test(initializer)) return "Element.prototype";
  if (/^document\\.createElement\\s*\\(/.test(initializer)) return "HTMLElement.prototype";
  return null;
}

export function getJavaScriptCompletionSuggestions(source,cursor,options={}) {
  if(typeof source!=="string")throw new TypeError("JavaScript completion source must be a string.");
  if(!Number.isInteger(cursor)||cursor<0||cursor>source.length)throw new RangeError("JavaScript completion cursor is outside the source.");
  if(isInsideLiteralOrComment(source,cursor))return null;
  const prefix=source.slice(0,cursor);
  const member=prefix.match(/([A-Za-z_$][\w$]*)\.([A-Za-z_$]*)$/);
  let query="",from=cursor,candidates=[];
  if(member){
    query=member[2];from=cursor-query.length;
    const inferredOwner = inferMemberOwner(prefix.slice(0, member.index), member[1]);
    const owner = inferredOwner ?? member[1];
    candidates = Array.isArray(options.catalog) && options.catalog.length
      ? options.catalog.filter(record => record.enabled !== false && record.type === "member" &&
          record.owner === owner).map(record => ({...record,label:record.insertText ?? record.label}))
      : (METHODS[owner] ?? []).map(label => ({label,description:owner+" method"}));
  }else{
    const match=prefix.match(/([A-Za-z_$][\w$]*)$/);
    if(!match)return null;
    query=match[1];from=cursor-query.length;
    candidates=Array.isArray(options.catalog) && options.catalog.length
      ? options.catalog.filter(record => record.enabled !== false && ["identifier","literal"].includes(record.type))
          .map(record => ({...record,label:record.insertText ?? record.label}))
      : [...KEYWORDS,...GLOBALS].map(label=>({label,description:KEYWORDS.includes(label)?"JavaScript keyword":"Global or built-in"}));
  }
  const normalized=query.toLowerCase();
  const limit=Math.max(1,Math.min(10,options.limit??10));
  const suggestions=candidates.filter(item=>item.label.toLowerCase().startsWith(normalized))
    .slice(0,limit).map(item=>Object.freeze({...item,kind:member?"method":(item.type === "literal" ? "literal" : "identifier"),from,to:cursor,insertText:item.label}));
  return suggestions.length?{language:"javascript",mode:member?"member":"identifier",query,from,to:cursor,options:suggestions}:null;
}
export default getJavaScriptCompletionSuggestions;

export function getJavaScriptCompletionCatalog() {
  const items = [];
  for (const label of KEYWORDS) items.push({category:"کلمات کلیدی",label,description:"JavaScript keyword"});
  for (const label of GLOBALS) items.push({category:"اشیاء و توابع سراسری",label,description:"Global or built-in"});
  for (const [owner, members] of Object.entries(METHODS)) {
    for (const label of members) items.push({category:"متدهای " + owner,label:owner + "." + label,description:owner + " method"});
  }
  for (const [label, snippet] of Object.entries(SNIPPETS)) {
    items.push({category:"الگوهای تکمیل",label,description:"Completion snippet"});
  }
  const unique = new Map();
  for (const item of items) unique.set(item.category + "\\0" + item.label, item);
  return [...unique.values()];
}
