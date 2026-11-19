const frame = document.getElementById("preview-frame");
let visualMode = false;
let selectedSelector = "";
let committedRules = {};
let draftRules = {};
let currentCategory = "";
const inspector = document.createElement("aside");
inspector.id = "visual-inspector";
inspector.hidden = true;
inspector.innerHTML = `
  <div class="visual-inspector-head"><strong id="visual-panel-title">Visual Settings</strong><button type="button" data-visual-close aria-label="Close">×</button></div>
  <div class="visual-category-grid" data-visual-categories>
    <button data-category="color">Color</button><button data-category="border">Border</button>
    <button data-category="size">Size</button><button data-category="shadow">Shadow</button>
    <button data-category="spacing">Spacing</button><button data-category="typography">Typography</button>
  </div>
  <section class="visual-editor-controls" data-visual-controls hidden></section>
  <div class="visual-actions" data-visual-actions hidden><button type="button" data-visual-back>Back</button><button type="button" data-visual-apply>Apply</button></div>
`;
document.body.appendChild(inspector);

function insertBeforeClosingTag(source, tagName, content) {
  const closingTag = new RegExp("</" + tagName + "\\s*>", "i");
  if (closingTag.test(source)) return source.replace(closingTag, () => content + "</" + tagName + ">");
  return source + content;
}
function helperScript() {
  return `<script>
  (() => {
    let picking = false, hovered = null;
    const unique = (value, attr) => [...document.querySelectorAll(attr)].length === 1;
    function cssPath(el) {
      if (el.id) return "#" + CSS.escape(el.id);
      const parts = [];
      while (el && el.nodeType === 1 && el !== document.body) {
        let part = el.tagName.toLowerCase();
        if (el.classList.length) part += "." + [...el.classList].filter(c => !c.startsWith("editor1-visual")).slice(0,2).map(CSS.escape).join(".");
        const parent = el.parentElement;
        if (parent) {
          const siblings = [...parent.children].filter(s => s.tagName === el.tagName);
          if (siblings.length > 1) part += ":nth-of-type(" + (siblings.indexOf(el) + 1) + ")";
        }
        parts.unshift(part); el = parent;
      }
      return "body > " + parts.join(" > ");
    }
    document.addEventListener("mouseover", e => {
      if (!picking) return;
      const el = e.target;
      if (!(el instanceof Element) || el.closest("#visual-inspector")) return;
      if (hovered && hovered !== el) hovered.classList.remove("editor1-visual-hover");
      hovered = el; el.classList.add("editor1-visual-hover");
    }, true);
    document.addEventListener("click", e => {
      if (!picking) return;
      const el = e.target;
      if (!(el instanceof Element) || el.closest("#visual-inspector")) return;
      e.preventDefault(); e.stopPropagation();
      picking = false;
      if (hovered) hovered.classList.remove("editor1-visual-hover");
      hovered = null;
      parent.postMessage({type:"alfacode:visual-selected", selector:cssPath(el), tag:el.tagName.toLowerCase()}, "*");
    }, true);
    window.addEventListener("message", e => {
      if (e.data?.type === "alfacode:visual-preview-css") {
        let style = document.getElementById("editor1-visual-preview-styles");
        if (!style) { style = document.createElement("style"); style.id = "editor1-visual-preview-styles"; document.head.appendChild(style); }
        style.textContent = e.data.css || "";
        return;
      }
      if (e.data?.type === "alfacode:visual-pick") {
        picking = !!e.data.enabled;
        document.body.classList.toggle("editor1-visual-picking", picking);
        if (!picking && hovered) { hovered.classList.remove("editor1-visual-hover"); hovered=null; }
      }
    });
  })();
  <\/script>`;
}
function buildPreviewDocument(sources) {
  let html = sources.html || "<!doctype html><html><head></head><body></body></html>";
  const css = sources.css.replace(/<\/style/gi, "<\\/style");
  if (css) {
    const styleTag = "<style>" + css + "</style>";
    if (/<\/head\s*>/i.test(html)) html = html.replace(/<\/head\s*>/i, styleTag + "</head>");
    else html = styleTag + html;
  }
  html = insertBeforeClosingTag(html, "body", helperScript());
  if (sources.javascript) {
    const safeSource = JSON.stringify(sources.javascript).replace(/</g, "\\u003c");
    const scriptTag = "<script>try { const source = " + safeSource + "; (new Function(source))(); } catch (error) { console.error(error); }</script>";
    html = insertBeforeClosingTag(html, "body", scriptTag);
  }
  return html;
}
function renderCommittedRules() {
  const css = Object.entries(committedRules).map(([selector, declarations]) => selector + " {\n" + declarations + "\n}").join("\n\n");
  window.parent.postMessage({type:"alfacode:visual-css-update", css}, "*");
}
function sendPickMode(enabled) { frame.contentWindow?.postMessage({type:"alfacode:visual-pick", enabled}, "*"); }
function showCategories() {
  inspector.querySelector("[data-visual-categories]").hidden = false;
  inspector.querySelector("[data-visual-controls]").hidden = true;
  inspector.querySelector("[data-visual-actions]").hidden = true;
  inspector.querySelector("#visual-panel-title").textContent = "Element Settings";
}
function openCategory(category) {
  currentCategory = category;
  draftRules = {...(committedRules[selectedSelector] || {})};
  const controls = inspector.querySelector("[data-visual-controls]");
  controls.innerHTML = "";
  inspector.querySelector("[data-visual-categories]").hidden = true;
  controls.hidden = false;
  inspector.querySelector("[data-visual-actions]").hidden = false;
  inspector.querySelector("#visual-panel-title").textContent = category[0].toUpperCase()+category.slice(1);
  const rows = {
    color:[["Background","background-color","color"],["Text color","color","color"]],
    border:[["Border color","border-color","color"],["Border width","border-width","number"],["Border radius","border-radius","number"]],
    size:[["Width","width","number"],["Height","height","number"]],
    shadow:[["Shadow","box-shadow","text"]],
    spacing:[["Padding","padding","number"],["Margin","margin","number"]],
    typography:[["Font size","font-size","number"],["Font weight","font-weight","number"]]
  }[category] || [];
  rows.forEach(([label,property,type])=>{
    const row=document.createElement("label"); row.className="visual-control-row";
    row.innerHTML="<span>"+label+"</span>";
    const input=document.createElement("input"); input.type=type==="color"?"color":"text";
    input.dataset-property=property; input.placeholder=property;
    const existing=draftRules[property] || "";
    if(type==="color" && /^#[0-9a-f]{6}$/i.test(existing)) input.value=existing;
    else input.value=existing;
    input.addEventListener("input",()=>{
      draftRules[property]=input.value;
      applyDraft();
    });
    row.appendChild(input); controls.appendChild(row);
  });
}
function applyDraft(){
  if(!selectedSelector || !frame.contentWindow) return;
  const declarations=Object.entries(draftRules).filter(([,value])=>String(value).trim()).map(([property,value])=>property+": "+value+( ["width","height","border-width","border-radius","padding","margin","font-size"].includes(property) && /^\\d+(\\.\\d+)?$/.test(String(value)) ? "px" : "")+";");
  const all={...committedRules,[selectedSelector]:declarations.join("\n")};
  frame.contentWindow.postMessage({type:"alfacode:visual-preview-css", css:Object.entries(all).map(([selector,decl])=>selector+" {"+decl+"}").join("\n")}, "*");
}
inspector.addEventListener("click",event=>{
  const target=event.target.closest("button"); if(!target) return;
  if(target.matches("[data-visual-close]")) {inspector.hidden=true;visualMode=false;sendPickMode(false);return;}
  if(target.dataset.category) openCategory(target.dataset.category);
  if(target.matches("[data-visual-back]")) { draftRules={...(committedRules[selectedSelector]||{})}; applyDraft(); showCategories(); }
  if(target.matches("[data-visual-apply]")) {committedRules[selectedSelector]={...draftRules};renderCommittedRules();showCategories();}
});
window.addEventListener("message",event=>{
  if(event.source!==window.parent || !event.data) return;
  if(event.data.type==="alfacode:visual-toggle") {
    visualMode=!visualMode;
    if(!visualMode){ inspector.hidden=true; sendPickMode(false); return; }
    inspector.hidden=false;
    inspector.querySelector("#visual-panel-title").textContent="Select an element";
    inspector.querySelector("[data-visual-categories]").hidden=true;
    inspector.querySelector("[data-visual-controls]").hidden=true;
    inspector.querySelector("[data-visual-actions]").hidden=true;
    sendPickMode(true);
  }
});
frame.addEventListener("load",()=>{if(visualMode)sendPickMode(true);});
window.addEventListener("message",event=>{
  if(event.source!==frame.contentWindow || !event.data) return;
  if(event.data.type==="alfacode:visual-selected") {
    selectedSelector=event.data.selector;
    visualMode=false; inspector.hidden=false; sendPickMode(false); showCategories();
  }
});
window.addEventListener("message",event=>{
  if(event.source!==window.parent || !event.data || event.data.type!=="alfacode:render") return;
  const sources=event.data.sources;
  if(!sources || !["html","css","javascript"].every(key=>typeof sources[key]==="string"))return;
  frame.srcdoc=buildPreviewDocument(sources);
});
