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
export function getJavaScriptCompletionSuggestions(source,cursor,options={}) {
  if(typeof source!=="string")throw new TypeError("JavaScript completion source must be a string.");
  if(!Number.isInteger(cursor)||cursor<0||cursor>source.length)throw new RangeError("JavaScript completion cursor is outside the source.");
  if(isInsideLiteralOrComment(source,cursor))return null;
  const prefix=source.slice(0,cursor);
  const member=prefix.match(/([A-Za-z_$][\w$]*)\.([A-Za-z_$]*)$/);
  let query="",from=cursor,candidates=[];
  if(member){
    query=member[2];from=cursor-query.length;
    candidates=(METHODS[member[1]]??[]).map(label=>({label,description:member[1]+" method"}));
  }else{
    const match=prefix.match(/([A-Za-z_$][\w$]*)$/);
    if(!match)return null;
    query=match[1];from=cursor-query.length;
    candidates=[...KEYWORDS,...GLOBALS].map(label=>({label,description:KEYWORDS.includes(label)?"JavaScript keyword":"Global or built-in"}));
  }
  const normalized=query.toLowerCase();
  const limit=Math.max(1,Math.min(10,options.limit??10));
  const suggestions=candidates.filter(item=>item.label.toLowerCase().startsWith(normalized))
    .slice(0,limit).map(item=>Object.freeze({...item,kind:member?"method":"identifier",from,to:cursor,insertText:item.label}));
  return suggestions.length?{language:"javascript",mode:member?"member":"identifier",query,from,to:cursor,options:suggestions}:null;
}
export default getJavaScriptCompletionSuggestions;
