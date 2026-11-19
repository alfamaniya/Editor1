(() => {
  "use strict";
  const preview=document.getElementById("preview-frame"); if(!preview)return;
  const specs={
    color:[["Background","background-color","color","backgroundColor"],["Text color","color","color","color"],["Border color","border-color","color","borderColor"],["Opacity","opacity","range","opacity"],["Background image","background-image","text","backgroundImage"]],
    border:[["Color","border-color","color","borderColor"],["Width","border-width","text","borderWidth"],["Style","border-style","select","borderStyle"],["Radius","border-radius","text","borderRadius"]],
    size:[["Width","width","text","width"],["Height","height","text","height"],["Min width","min-width","text"],["Max width","max-width","text"],["Min height","min-height","text"],["Max height","max-height","text"]],
    shadow:[["Box shadow","box-shadow","text","boxShadow"]],
    spacing:[["Padding","padding","text","padding"],["Margin","margin","text","margin"],["Gap","gap","text","gap"]],
    typography:[["Font size","font-size","text","fontSize"],["Font weight","font-weight","select","fontWeight"],["Line height","line-height","text","lineHeight"],["Letter spacing","letter-spacing","text","letterSpacing"]]
  };
  const state={picking:false,visualMode:false,mode:"elements",selector:"",tag:"",computed:{},committed:{},draft:{}};
  const shared=window.Editor1PropertyControls;
  const drafts=shared?shared.createDraftState():null;
  const panel=document.createElement("aside"); panel.id="visual-editor-shell"; panel.hidden=true;
  panel.innerHTML=`<div class="visual-editor-topbar"><span class="visual-editor-brand"><i></i> VISUAL EDITOR</span><span class="visual-editor-selection-status" data-status>Choose an element on canvas</span><button type="button" data-close aria-label="Close Visual Editor">Exit Visual</button></div>
  <aside class="visual-editor-right-panel"><nav class="visual-editor-mode-tabs" aria-label="Visual editor modes"><button type="button" data-mode="elements" class="is-active">Elements</button><button type="button" data-mode="settings">Settings</button></nav>
  <section class="visual-editor-elements"><div class="visual-editor-sidehead"><strong>Elements</strong><span>Canvas</span></div><div class="visual-editor-search"><span>⌕</span><input type="search" placeholder="Search elements" disabled aria-label="Element search (not available yet)"></div><div class="visual-editor-group"><small>SELECT</small><button class="visual-editor-pick" data-pick><span class="visual-editor-icon">⌖</span><span><b>Select Element</b><small>Click an item in preview</small></span></button></div><div class="visual-editor-group"><small>RECENTLY USED</small><div class="visual-editor-tilegrid"><div class="visual-editor-tile"><span>▤</span>Text</div><div class="visual-editor-tile"><span>H</span>Heading</div><div class="visual-editor-tile"><span>☷</span>List</div><div class="visual-editor-tile"><span>▣</span>Section</div><div class="visual-editor-tile"><span>▱</span>Container</div><div class="visual-editor-tile"><span>▥</span>Grid</div></div></div><div class="visual-editor-group"><small>MEDIA</small><div class="visual-editor-tilegrid"><div class="visual-editor-tile"><span>▧</span>Image</div><div class="visual-editor-tile"><span>▷</span>Video</div></div></div><p class="visual-editor-note">Element insertion will be connected in a later stage.</section>
  <aside id="visual-inspector"><div class="visual-inspector-head"><div><small>INSPECTOR</small><strong data-title>Visual Settings</strong></div><button type="button" data-close aria-label="Exit Visual Editor">×</button></div>
  <div class="visual-editor-selected" data-selected><span>Selected element</span><b data-element-label>None</b><code data-selector-label>—</code></div>
  <div class="visual-category-grid" data-categories><button data-cat="color"><i>◉</i>Color</button><button data-cat="border"><i>▢</i>Border</button><button data-cat="size"><i>↔</i>Size</button><button data-cat="shadow"><i>◩</i>Shadow</button><button data-cat="spacing"><i>⇥</i>Spacing</button><button data-cat="typography"><i>Aa</i>Typography</button></div>
  <section data-controls hidden></section><div class="visual-actions" data-actions hidden><button data-back>Cancel</button><button data-reset>Reset Category</button><button data-apply>Apply</button></div></aside></aside>`;
  panel.className="visual-editor-shell";
  document.body.appendChild(panel);
  const modeTabs=panel.querySelector(".visual-editor-mode-tabs");
  function setMode(mode){state.mode=mode==="settings"&&state.selector?"settings":"elements";panel.dataset.mode=state.mode;modeTabs.querySelectorAll("[data-mode]").forEach(btn=>{btn.classList.toggle("is-active",btn.dataset.mode===state.mode);if(btn.dataset.mode==="settings")btn.disabled=!state.selector;});}
  function enterVisual(){state.visualMode=true;panel.hidden=false;setMode("elements");state.picking=true;picker(true);window.parent.postMessage({type:"alfacode:visual-mode-active",active:true},"*");}
  function exitVisual(){state.visualMode=false;state.picking=false;panel.hidden=true;state.draft={...(state.committed[state.selector]||{})};previewCSS(state.committed);picker(false);window.parent.postMessage({type:"alfacode:visual-mode-active",active:false},"*");}
  const title=panel.querySelector("[data-title]"),status=panel.querySelector("[data-status]"),selectedLabel=panel.querySelector("[data-element-label]"),selectorLabel=panel.querySelector("[data-selector-label]"),grid=panel.querySelector("[data-categories]"),controls=panel.querySelector("[data-controls]"),actions=panel.querySelector("[data-actions]");
  function hex(value){const m=String(value).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);return m?"#"+m.slice(1,4).map(x=>Number(x).toString(16).padStart(2,"0")).join(""):"#ffffff";}
  function cssFor(map){return Object.entries(map).map(([sel,props])=>{const lines=Object.entries(props).filter(([,v])=>v!==""&&v!=null).map(([k,v])=>k+": "+v+";");return lines.length?sel+" {\n  "+lines.join("\n  ")+"\n}":""}).filter(Boolean).join("\n\n");}
  function previewCSS(map){preview.contentWindow?.postMessage({type:"alfacode:visual-preview-css",css:cssFor(map)},"*");}
  function refreshPreviewStyles(){previewCSS(state.committed);}
  function picker(on){preview.contentWindow?.postMessage({type:"alfacode:visual-pick",enabled:on},"*");}
  function draftPreview(){previewCSS({...state.committed,[state.selector]:{...(state.committed[state.selector]||{}),...state.draft}});}
  function showCategories(){grid.hidden=false;controls.hidden=true;actions.hidden=true;if(selectedLabel)selectedLabel.textContent=state.tag||"None";if(selectorLabel)selectorLabel.textContent=state.selector||"—";if(status)status.textContent=state.selector?("Editing "+state.tag+" · "+state.selector):"Choose an element on canvas";title.textContent=state.selector?"Element Settings · "+state.tag:"Select an element";}
  function valueFor(prop,type,computed){if(Object.prototype.hasOwnProperty.call(state.draft,prop))return state.draft[prop];const val=state.computed[computed]||"";return type==="color"?hex(val):val;}
  function makeControl(row){
    const [label,prop,type,computed]=row;
    const val=valueFor(prop,type,computed);
    if(shared){
      const field=shared.createField({label,value:val,type,options:type==="select"?(prop==="border-style"?["none","solid","dashed","dotted","double"]:["normal","100","200","300","400","500","600","700","800","900"]):[],min:type==="range"?0:undefined,max:type==="range"?1:undefined,step:type==="range"?0.05:undefined,onChange:value=>{state.draft[prop]=value;if(drafts)drafts.set(prop,value);draftPreview();}});
      return field.element;
    }
    const wrap=document.createElement("label");wrap.className="visual-control-row";const caption=document.createElement("span");caption.textContent=label;let input;
    if(type==="select"){input=document.createElement("select");const choices=prop==="border-style"?["none","solid","dashed","dotted","double"]:["normal","100","200","300","400","500","600","700","800","900"];choices.forEach(v=>{const o=document.createElement("option");o.value=v;o.textContent=v;input.appendChild(o);});}
    else{input=document.createElement("input");input.type=type;if(type==="range"){input.min=0;input.max=1;input.step=.05;}}
    input.value=val;wrap.append(caption,input);
    if(type==="range"){const output=document.createElement("output");output.textContent=input.value;wrap.appendChild(output);input.addEventListener("input",()=>output.textContent=input.value);}
    const change=()=>{state.draft[prop]=input.value;if(drafts)drafts.set(prop,input.value);draftPreview();};input.addEventListener("input",change);input.addEventListener("change",change);return wrap;
  }
  function resetCategory(cat){
    const props=specs[cat].map(row=>row[1]);props.forEach(prop=>{state.draft[prop]="";if(drafts)drafts.set(prop,"");});
    controls.replaceChildren();if(cat==="color")renderColorControls();else specs[cat].forEach(row=>controls.appendChild(makeControl(row)));
    draftPreview();
  }
  function currentColor(prop,computedKey){const value=state.draft[prop]??state.committed[state.selector]?.[prop]??state.computed[computedKey]??"#ffffff";return hex(value);}
  function setColorProperty(prop,value){state.draft[prop]=value;if(drafts)drafts.set(prop,value);draftPreview();}
  function renderColorControls(){
    const section=document.createElement("div");section.className="visual-color-panel";
    const swatches=["#111827","#ffffff","#f97316","#7c3aed","#2563eb","#16a34a","#ef4444","#eab308","#ec4899","#06b6d4"];
    function addColorRow(label,prop,computedKey){
      const row=document.createElement("div");row.className="visual-color-row";
      const heading=document.createElement("span");heading.textContent=label;
      const picker=document.createElement("input");picker.type="color";picker.value=currentColor(prop,computedKey);picker.setAttribute("aria-label",label+" color picker");
      const text=document.createElement("input");text.type="text";text.value=picker.value;text.placeholder="#RRGGBB";text.setAttribute("aria-label",label+" hex value");
      const applyValue=value=>{if(/^#[0-9a-f]{6}$/i.test(value)){text.value=value.toLowerCase();picker.value=value;text.removeAttribute("aria-invalid");setColorProperty(prop,value);}else{text.setAttribute("aria-invalid","true");}};
      picker.addEventListener("input",()=>applyValue(picker.value));text.addEventListener("input",()=>applyValue(text.value.trim()));
      row.append(heading,picker,text);section.appendChild(row);
    }
    addColorRow("Background","background-color","backgroundColor");
    addColorRow("Text","color","color");
    addColorRow("Border","border-color","borderColor");
    const alphaRow=document.createElement("div");alphaRow.className="visual-color-row visual-alpha-row";
    const alphaLabel=document.createElement("span");alphaLabel.textContent="Opacity";
    const alpha=document.createElement("input");alpha.type="range";alpha.min="0";alpha.max="1";alpha.step="0.01";alpha.value=state.draft.opacity??state.committed[state.selector]?.opacity??state.computed.opacity??1;
    const alphaValue=document.createElement("output");alphaValue.textContent=Math.round(Number(alpha.value)*100)+"%";
    alpha.addEventListener("input",()=>{alphaValue.textContent=Math.round(Number(alpha.value)*100)+"%";setColorProperty("opacity",alpha.value);});
    alphaRow.append(alphaLabel,alpha,alphaValue);section.appendChild(alphaRow);
    const swatchTitle=document.createElement("small");swatchTitle.textContent="Quick palette";section.appendChild(swatchTitle);
    const palette=document.createElement("div");palette.className="visual-color-swatches";
    swatches.forEach(color=>{const b=document.createElement("button");b.type="button";b.title=color;b.style.background=color;b.setAttribute("aria-label","Set background "+color);b.addEventListener("click",()=>{const picker=section.querySelector('input[type="color"]');const hexInput=section.querySelector('input[type="text"]');picker.value=color;hexInput.value=color;setColorProperty("background-color",color);});palette.appendChild(b);});
    section.appendChild(palette);
    const gradientTitle=document.createElement("small");gradientTitle.textContent="Gradient background";section.appendChild(gradientTitle);
    const gradientRow=document.createElement("div");gradientRow.className="visual-gradient-row";
    const mode=document.createElement("select");["None","Linear","Radial"].forEach(v=>{const option=document.createElement("option");option.value=v.toLowerCase();option.textContent=v;mode.appendChild(option);});
    const angle=document.createElement("input");angle.type="number";angle.value="135";angle.min="0";angle.max="360";angle.setAttribute("aria-label","Gradient angle");
    const g1=document.createElement("input");g1.type="color";g1.value="#7c3aed";g1.setAttribute("aria-label","Gradient start color");
    const g2=document.createElement("input");g2.type="color";g2.value="#111827";g2.setAttribute("aria-label","Gradient end color");
    const updateGradient=()=>{let val="";if(mode.value==="linear")val="linear-gradient("+angle.value+"deg, "+g1.value+", "+g2.value+")";if(mode.value==="radial")val="radial-gradient(circle, "+g1.value+", "+g2.value+")";setColorProperty("background-image",val);};
    [mode,angle,g1,g2].forEach(el=>el.addEventListener("input",updateGradient));gradientRow.append(mode,angle,g1,g2);section.appendChild(gradientRow);
    controls.appendChild(section);
  }
  function openCategory(cat){state.draft={...(state.committed[state.selector]||{})};if(drafts)drafts.begin(state.draft);controls.replaceChildren();if(cat==="color")renderColorControls();else specs[cat].forEach(row=>controls.appendChild(makeControl(row)));grid.hidden=true;controls.hidden=false;actions.hidden=false;title.textContent=cat[0].toUpperCase()+cat.slice(1);}
  function sendCSS(){window.parent.postMessage({type:"alfacode:visual-css-update",css:cssFor(state.committed)},"*");}
  panel.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.matches("[data-mode]")){setMode(b.dataset.mode);if(state.mode==="elements"){grid.hidden=true;controls.hidden=true;actions.hidden=true;}return;}if(b.matches("[data-pick]")){state.picking=true;setMode("elements");title.textContent="Select an element";grid.hidden=true;controls.hidden=true;actions.hidden=true;if(status)status.textContent="Click an element in the preview";picker(true);return;}if(b.matches("[data-close]")){exitVisual();return;}if(b.dataset.cat){setMode("settings");openCategory(b.dataset.cat);}if(b.matches("[data-back]")){state.draft={...(state.committed[state.selector]||{})};if(drafts)state.draft=drafts.cancel();draftPreview();showCategories();}if(b.matches("[data-reset]")){const active=title.textContent.toLowerCase();const cat=Object.keys(specs).find(k=>k===active);if(cat)resetCategory(cat);}if(b.matches("[data-apply]")){state.committed[state.selector]={...(state.committed[state.selector]||{}),...(drafts?drafts.commit():state.draft)};sendCSS();showCategories();}});
  window.addEventListener("message",e=>{if(e.source!==window.parent||!e.data)return;if(e.data.type==="alfacode:visual-toggle"){if(state.visualMode)exitVisual();else enterVisual();}});
  window.addEventListener("message",e=>{if(e.source!==preview.contentWindow||e.data?.type!=="alfacode:visual-selected")return;state.selector=e.data.selector||"";state.tag=e.data.tag||"";state.computed=e.data.computed||{};state.picking=false;panel.hidden=false;setMode("settings");picker(false);showCategories();});
  function pickerScript(){return `<script>
    (() => {
      let picking=false,hovered=null,identityTip=null;
      const marker=document.createElement("style");
      marker.textContent=".editor1-visual-hover{outline:2px solid #7967ed!important;outline-offset:2px!important;cursor:crosshair!important}#editor1-visual-identity-tip{position:fixed;z-index:2147483647;display:none;max-width:280px;padding:5px 8px;border:1px solid #6d63cf;border-radius:6px;background:#171820;color:#f1f1f5;font:11px/1.35 ui-monospace,SFMono-Regular,Consolas,monospace;box-shadow:0 5px 16px #0006;pointer-events:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#editor1-visual-identity-tip[data-visible=true]{display:block}";
      document.head.appendChild(marker);
      identityTip=document.createElement("div");identityTip.id="editor1-visual-identity-tip";identityTip.setAttribute("aria-hidden","true");document.body.appendChild(identityTip);
      function hideIdentity(){if(identityTip){identityTip.style.display="none";identityTip.dataset.visible="false";identityTip.textContent="";identityTip.title="";}}
      function identityFor(el){const id=el.id?("#"+el.id):"",classes=[...el.classList].filter(c=>!c.startsWith("editor1-visual")).map(c=>"."+c).join(" ");return id&&classes?id+" "+classes:id||classes||el.tagName.toLowerCase();}
      function moveIdentity(e){if(!identityTip||!hovered||!picking)return;identityTip.textContent=identityFor(hovered);identityTip.title=identityTip.textContent;identityTip.style.display="block";identityTip.dataset.visible="true";const rect=identityTip.getBoundingClientRect(),pad=12;let x=e.clientX+14,y=e.clientY+16;if(x+rect.width>innerWidth-pad)x=e.clientX-rect.width-14;if(y+rect.height>innerHeight-pad)y=e.clientY-rect.height-14;x=Math.max(pad,Math.min(x,innerWidth-rect.width-pad));y=Math.max(pad,Math.min(y,innerHeight-rect.height-pad));identityTip.style.left=x+"px";identityTip.style.top=y+"px";}
      function selector(el){if(el===document.body)return "body";if(el.id)return "#"+CSS.escape(el.id);const parts=[];while(el&&el.nodeType===1&&el!==document.body){let part=el.tagName.toLowerCase();const classes=[...el.classList].filter(c=>!c.startsWith("editor1-visual")).slice(0,2);if(classes.length)part+=classes.map(c=>"."+CSS.escape(c)).join("");const parent=el.parentElement;if(parent){const siblings=[...parent.children].filter(s=>s.tagName===el.tagName);if(siblings.length>1)part+=":nth-of-type("+(siblings.indexOf(el)+1)+")";}parts.unshift(part);el=parent;}return parts.length?"body > "+parts.join(" > "):"body";}
      function clear(){if(hovered)hovered.classList.remove("editor1-visual-hover");hovered=null;hideIdentity();}
      document.addEventListener("mouseover",e=>{if(!picking||!(e.target instanceof Element)||e.target.closest("#visual-inspector"))return;if(hovered!==e.target)clear();hovered=e.target;hovered.classList.add("editor1-visual-hover");moveIdentity(e);},true);
      document.addEventListener("pointermove",e=>{if(picking&&hovered)moveIdentity(e);},true);
      document.addEventListener("pointerleave",e=>{if(e.target===document.documentElement||e.target===document.body)clear();},true);
      document.addEventListener("click",e=>{if(!picking||!(e.target instanceof Element)||e.target.closest("#visual-inspector"))return;const el=e.target;e.preventDefault();e.stopPropagation();picking=false;clear();const s=getComputedStyle(el),computed={};["backgroundColor","color","opacity","borderColor","borderWidth","borderRadius","borderStyle","width","height","boxShadow","padding","margin","fontSize","fontWeight","lineHeight","letterSpacing","gap","backgroundImage"].forEach(k=>computed[k]=s[k]);parent.postMessage({type:"alfacode:visual-selected",selector:selector(el),tag:el.tagName.toLowerCase(),computed},"*");},true);
      window.addEventListener("message",e=>{if(e.data?.type==="alfacode:visual-preview-css"){let st=document.getElementById("editor1-visual-preview-styles");if(!st){st=document.createElement("style");st.id="editor1-visual-preview-styles";document.head.appendChild(st);}st.textContent=e.data.css||"";}if(e.data?.type==="alfacode:visual-pick"){picking=!!e.data.enabled;document.body.style.cursor=picking?"crosshair":"";if(!picking)clear();else hideIdentity();}});
    })();
        ` + "</" + "script>";}
  function loadGeneratedCSS(cssText){
    const start="/* Editor1 Visual Styles - Start */",end="/* Editor1 Visual Styles - End */";
    const block=String(cssText||"").split(start)[1]?.split(end)[0]||"";
    const parsed={};
    const rule=/([^{}]+)\{([^{}]*)\}/g;let match;
    while((match=rule.exec(block))){const selector=match[1].trim(),props={};match[2].split(";").forEach(decl=>{const colon=decl.indexOf(":");if(colon>0){const key=decl.slice(0,colon).trim(),value=decl.slice(colon+1).trim();if(key&&value)props[key]=value;}});if(selector&&Object.keys(props).length)parsed[selector]=props;}
    state.committed=parsed;
  }
  preview.addEventListener("load",refreshPreviewStyles);
  window.Editor1VisualEditor={refreshPreviewStyles,pickerScript,loadGeneratedCSS};
})();