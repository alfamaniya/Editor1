/* Preview renderer only. Visual selection and properties are handled by visual-editor.js. */
(() => {
  "use strict";
  const frame=document.getElementById("preview-frame");
  function insertBeforeBody(html,script){const close=new RegExp("</body\\s*>","i");return close.test(html)?html.replace(close,script+"</body>"):html+script;}
  function render(sources){
    let html=sources.html||"<!doctype html><html><head></head><body></body></html>";
    const css=(sources.css||"").replace(new RegExp("</style","gi"),"<"+String.fromCharCode(92)+"/style");
    if(css){const tag="<style>"+css+"</style>",head=new RegExp("</head\\s*>","i");html=head.test(html)?html.replace(head,tag+"</head>"):tag+html;}
    html=insertBeforeBody(html,window.Editor1VisualEditor?.pickerScript?.()||"");
    if(sources.javascript){const safe=JSON.stringify(sources.javascript).replace(/</g,String.fromCharCode(92)+"u003c");html=insertBeforeBody(html,"<script>try{const src="+safe+";(new Function(src))()}catch(e){console.error(e)}</script>");}
    frame.srcdoc=html;
  }
  window.addEventListener("message",e=>{if(e.source!==window.parent||e.data?.type!=="alfacode:render")return;const s=e.data.sources;if(s&&["html","css","javascript"].every(k=>typeof s[k]==="string"))render(s);});
  frame.addEventListener("load",()=>window.Editor1VisualEditor?.refreshPreviewStyles());
})();