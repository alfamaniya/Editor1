/* Preview renderer only. Visual selection and properties are handled by visual-editor.js. */
(() => {
  "use strict";
  const frame=document.getElementById("preview-frame");
  function insertBeforeBody(html,script){const re=/<\\/body\\s*>/i;return re.test(html)?html.replace(re,script+"</body>"):html+script;}
  function render(sources){
    let html=sources.html||"<!doctype html><html><head></head><body></body></html>";
    const css=(sources.css||"").replace(/<\\/style/gi,"<\\\\/style");
    if(css){const tag="<style>"+css+"</style>";html=/<\\/head\\s*>/i.test(html)?html.replace(/<\\/head\\s*>/i,tag+"</head>"):tag+html;}
    const picker=window.Editor1VisualEditor?.pickerScript?.()||"";
    html=insertBeforeBody(html,picker);
    if(sources.javascript){const safe=JSON.stringify(sources.javascript).replace(/</g,"\\\\u003c");html=insertBeforeBody(html,"<script>try{const src="+safe+";(new Function(src))()}catch(e){console.error(e)}</script>");}
    frame.srcdoc=html;
  }
  window.addEventListener("message",e=>{if(e.source!==window.parent||e.data?.type!=="alfacode:render")return;const s=e.data.sources;if(s&&["html","css","javascript"].every(k=>typeof s[k]==="string"))render(s);});
  frame.addEventListener("load",()=>window.Editor1VisualEditor?.refreshPreviewStyles());
})();