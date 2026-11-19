(() => {
  "use strict";
  const preview=document.getElementById("preview-frame"); if(!preview)return;
  const specs={
    color:[["Background","background-color","color","backgroundColor"],["Text color","color","color","color"],["Opacity","opacity","range","opacity"]],
    border:[["Color","border-color","color","borderColor"],["Width","border-width","text","borderWidth"],["Style","border-style","select","borderStyle"],["Radius","border-radius","text","borderRadius"]],
    size:[["Width","width","text","width"],["Height","height","text","height"],["Min width","min-width","text"],["Max width","max-width","text"],["Min height","min-height","text"],["Max height","max-height","text"]],
    shadow:[["Box shadow","box-shadow","text","boxShadow"]],
    spacing:[["Padding","padding","text","padding"],["Margin","margin","text","margin"],["Gap","gap","text","gap"]],
    typography:[["Font size","font-size","text","fontSize"],["Font weight","font-weight","select","fontWeight"],["Line height","line-height","text","lineHeight"],["Letter spacing","letter-spacing","text","letterSpacing"]]
  };
  const state={picking:false,selector:"",tag:"",computed:{},committed:{},draft:{}};
  const panel=document.createElement("aside"); panel.id="visual-inspector"; panel.hidden=true;
  panel.innerHTML=`<div class="visual-inspector-head"><strong data-title>Visual Settings</strong><button type="button" data-close aria-label="Close Visual Editor">×</button></div>
  <div class="visual-category-grid" data-categories><button data-cat="color">Color</button><button data-cat="border">Border</button><button data-cat="size">Size</button><button data-cat="shadow">Shadow</button><button data-cat="spacing">Spacing</button><button data-cat="typography">Typography</button></div>
  <section data-controls hidden></section><div class="visual-actions" data-actions hidden><button data-back>Back</button><button data-apply>Apply</button></div>`;
  document.body.appendChild(panel);
  const title=panel.querySelector("[data-title]"),grid=panel.querySelector("[data-categories]"),controls=panel.querySelector("[data-controls]"),actions=panel.querySelector("[data-actions]");
  function hex(value){const m=String(value).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);return m?"#"+m.slice(1,4).map(x=>Number(x).toString(16).padStart(2,"0")).join(""):"#ffffff";}
  function cssFor(map){return Object.entries(map).map(([sel,props])=>{const lines=Object.entries(props).filter(([,v])=>v!==""&&v!=null).map(([k,v])=>k+": "+v+";");return lines.length?sel+" {\n  "+lines.join("\n  ")+"\n}":""}).filter(Boolean).join("\n\n");}
  function previewCSS(map){preview.contentWindow?.postMessage({type:"alfacode:visual-preview-css",css:cssFor(map)},"*");}
  function refreshPreviewStyles(){previewCSS(state.committed);}
  function picker(on){preview.contentWindow?.postMessage({type:"alfacode:visual-pick",enabled:on},"*");}
  function draftPreview(){previewCSS({...state.committed,[state.selector]:{...(state.committed[state.selector]||{}),...state.draft}});}
  function showCategories(){grid.hidden=false;controls.hidden=true;actions.hidden=true;title.textContent=state.selector?"Element Settings · "+state.tag:"Select an element";}
  function valueFor(prop,type,computed){if(Object.prototype.hasOwnProperty.call(state.draft,prop))return state.draft[prop];const val=state.computed[computed]||"";return type==="color"?hex(val):val;}
  function makeControl(row){
    const [label,prop,type,computed]=row;const wrap=document.createElement("label");wrap.className="visual-control-row";const caption=document.createElement("span");caption.textContent=label;let input;
    if(type==="select"){input=document.createElement("select");const choices=prop==="border-style"?["none","solid","dashed","dotted","double"]:["normal","100","200","300","400","500","600","700","800","900"];choices.forEach(v=>{const o=document.createElement("option");o.value=v;o.textContent=v;input.appendChild(o);});}
    else {input=document.createElement("input");input.type=type;if(type==="range"){input.min=0;input.max=1;input.step=.05;}}
    input.value=valueFor(prop,type,computed);wrap.append(caption,input);
    if(type==="range"){const output=document.createElement("output");output.textContent=input.value;wrap.appendChild(output);input.addEventListener("input",()=>output.textContent=input.value);}
    const change=()=>{state.draft[prop]=input.value;draftPreview();};input.addEventListener("input",change);input.addEventListener("change",change);return wrap;
  }
  function openCategory(cat){state.draft={...(state.committed[state.selector]||{})};controls.replaceChildren();specs[cat].forEach(row=>controls.appendChild(makeControl(row)));grid.hidden=true;controls.hidden=false;actions.hidden=false;title.textContent=cat[0].toUpperCase()+cat.slice(1);}
  function sendCSS(){window.parent.postMessage({type:"alfacode:visual-css-update",css:cssFor(state.committed)},"*");}
  panel.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.matches("[data-close]")){state.picking=false;state.draft={...(state.committed[state.selector]||{})};previewCSS(state.committed);panel.hidden=true;picker(false);return;}if(b.dataset.cat)openCategory(b.dataset.cat);if(b.matches("[data-back]")){state.draft={...(state.committed[state.selector]||{})};draftPreview();showCategories();}if(b.matches("[data-apply]")){state.committed[state.selector]={...(state.committed[state.selector]||{}),...state.draft};sendCSS();showCategories();}});
  window.addEventListener("message",e=>{if(e.source!==window.parent||!e.data)return;if(e.data.type==="alfacode:visual-toggle"){state.picking=!state.picking;panel.hidden=!state.picking;if(!state.picking){state.draft={...(state.committed[state.selector]||{})};previewCSS(state.committed);picker(false);return;}title.textContent="Select an element";grid.hidden=true;controls.hidden=true;actions.hidden=true;picker(true);}});
  window.addEventListener("message",e=>{if(e.source!==preview.contentWindow||e.data?.type!=="alfacode:visual-selected")return;state.selector=e.data.selector||"";state.tag=e.data.tag||"";state.computed=e.data.computed||{};state.picking=false;panel.hidden=false;picker(false);showCategories();});
  function pickerScript(){return \`<script>
    (() => {
      let picking=false,hovered=null;
      const marker=document.createElement("style");
      marker.textContent=".editor1-visual-hover{outline:2px solid #7967ed!important;outline-offset:2px!important;cursor:crosshair!important}";
      document.head.appendChild(marker);
      function selector(el){if(el.id)return "#"+CSS.escape(el.id);const parts=[];while(el&&el.nodeType===1&&el!==document.body){let part=el.tagName.toLowerCase();const classes=[...el.classList].filter(c=>!c.startsWith("editor1-visual")).slice(0,2);if(classes.length)part+=classes.map(c=>"."+CSS.escape(c)).join("");const parent=el.parentElement;if(parent){const siblings=[...parent.children].filter(s=>s.tagName===el.tagName);if(siblings.length>1)part+=":nth-of-type("+(siblings.indexOf(el)+1)+")";}parts.unshift(part);el=parent;}return "body > "+parts.join(" > ");}
      function clear(){if(hovered)hovered.classList.remove("editor1-visual-hover");hovered=null;}
      document.addEventListener("mouseover",e=>{if(!picking||!(e.target instanceof Element)||e.target.closest("#visual-inspector"))return;if(hovered!==e.target)clear();hovered=e.target;hovered.classList.add("editor1-visual-hover");},true);
      document.addEventListener("click",e=>{if(!picking||!(e.target instanceof Element)||e.target.closest("#visual-inspector"))return;const el=e.target;e.preventDefault();e.stopPropagation();picking=false;clear();const s=getComputedStyle(el),computed={};["backgroundColor","color","opacity","borderColor","borderWidth","borderRadius","borderStyle","width","height","boxShadow","padding","margin","fontSize","fontWeight","lineHeight","letterSpacing","gap"].forEach(k=>computed[k]=s[k]);parent.postMessage({type:"alfacode:visual-selected",selector:selector(el),tag:el.tagName.toLowerCase(),computed},"*");},true);
      window.addEventListener("message",e=>{if(e.data?.type==="alfacode:visual-preview-css"){let st=document.getElementById("editor1-visual-preview-styles");if(!st){st=document.createElement("style");st.id="editor1-visual-preview-styles";document.head.appendChild(st);}st.textContent=e.data.css||"";}if(e.data?.type==="alfacode:visual-pick"){picking=!!e.data.enabled;document.body.style.cursor=picking?"crosshair":"";if(!picking)clear();}});
    })();
        ` + "</" + "script>";}
  function loadGeneratedCSS(cssText){
    const start="/* Editor1 Visual Styles - Start */",end="/* Editor1 Visual Styles - End */";
    const block=String(cssText||"").split(start)[1]?.split(end)[0]||"";
    const parsed={};
    const rule=/([^{}]+)\\{([^{}]*)\\}/g;let match;
    while((match=rule.exec(block))){const selector=match[1].trim(),props={};match[2].split(";").forEach(decl=>{const colon=decl.indexOf(":");if(colon>0){const key=decl.slice(0,colon).trim(),value=decl.slice(colon+1).trim();if(key&&value)props[key]=value;}});if(selector&&Object.keys(props).length)parsed[selector]=props;}
    state.committed=parsed;
  }
  preview.addEventListener("load",refreshPreviewStyles);
  window.Editor1VisualEditor={refreshPreviewStyles,pickerScript,loadGeneratedCSS};
})();