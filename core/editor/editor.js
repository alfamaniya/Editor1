// #editor.js: مدیریت رفتار و رویدادهای ویرایشگر
import Editor from "../../alfacode/src/core/editor.js";
import EditorView from "../../alfacode/src/rendering/editor-view.js";
import LineRenderer from "../../alfacode/src/rendering/line-renderer.js";
import InputController from "../../alfacode/src/input/input-controller.js";
import LanguageManager from "../../alfacode/src/language/language-manager.js";
import htmlLanguage from "../../alfacode/src/language/html/html-language.js";
import cssLanguage from "../../alfacode/src/language/css/css-language.js";
import javascriptLanguage from "../../alfacode/src/language/javascript/javascript-language.js";
import SyntaxHighlighter from "../../alfacode/src/features/syntax-highlighting/highlighter.js";
import LineNumbers from "../../alfacode/src/features/line-numbers/line-numbers.js";
import BracketMatcher from "../../alfacode/src/features/bracket-matching/bracket-matcher.js";
import ThemeManager from "../../alfacode/src/themes/theme-manager.js";
import BrowserStorage from "../browser-storage/browser-storage.js";
import { getHTMLTagSuggestions, buildHTMLTagInsertion } from "../../alfacode/src/language/html/html-completion.js";
import { getCSSCompletionSuggestions } from "../../alfacode/src/language/css/css-completion.js";
import { getJavaScriptCompletionSuggestions } from "../../alfacode/src/language/javascript/javascript-completion.js";
import { createTagSuggestions } from "../tag-suggestions/tag-suggestions.js";
import { createCSSSuggestions } from "../css-suggestions/css-suggestions.js";
import { createJavaScriptSuggestions } from "../javascript-suggestions/javascript-suggestions.js";
import { applySuggestionForMenu } from "../../alfacode/src/input/suggestion-dispatcher.js";
import { loadCompletionCatalogs } from "../completion-catalog/catalog-loader.js";

let completionCatalogs = { html: { records: [] }, css: { records: [] }, javascript: { records: [] } };
loadCompletionCatalogs().then(catalogs => {
  completionCatalogs = catalogs;
  updateCompletionSuggestions();
});

const initialSources = {  html: "<!-- #visual-panel-demo: ساختار قابل ویرایش پنل تنظیمات ویژوال -->\n<div class=\"visual-panel-demo\">\n  <header class=\"visual-toolbar\"><strong>VISUAL EDITOR</strong><span id=\"selectionStatus\">Choose an element</span><button id=\"exitVisual\">Exit Visual</button></header>\n  <aside class=\"visual-panel\">\n    <nav class=\"mode-tabs\"><button class=\"active\" data-mode=\"elements\">Elements</button><button data-mode=\"settings\">Settings</button></nav>\n    <section id=\"elementsView\"><h3>Elements</h3><p class=\"muted\">Select an element on the canvas</p><button class=\"select-btn\" id=\"selectElement\">Select Element</button><div class=\"tiles\"><button>Text</button><button>Heading</button><button>List</button><button>Section</button><button>Container</button><button>Grid</button></div></section>\n    <section id=\"settingsView\"><h3>Inspector</h3><p class=\"muted\">Selected element: <b id=\"selected\">Demo element</b></p><div class=\"categories\"><button data-category=\"Color\">Color</button><button data-category=\"Background\">Background</button><button data-category=\"Border\">Border</button><button data-category=\"Outline\">Outline</button><button data-category=\"Size\">Size</button><button data-category=\"Shadow\">Shadow</button><button data-category=\"Spacing\">Spacing</button><button data-category=\"Typography\">Typography</button><button data-category=\"Layout\">Layout</button><button data-category=\"Flexbox\">Flexbox</button><button data-category=\"Grid\">Grid</button><button data-category=\"Position\">Position</button><button data-category=\"Effects\">Effects</button><button data-category=\"Transform\">Transform</button><button data-category=\"Transition\">Transition</button><button data-category=\"Animation\">Animation</button><button data-category=\"Content\">Content</button><button data-category=\"Scroll\">Scroll</button><button data-category=\"SVG\">SVG</button><button data-category=\"Responsive\">Responsive</button><button data-category=\"Custom CSS\">Custom CSS</button></div><div class=\"property-editor\"><label for=\"propertyValue\">Property value</label><input id=\"propertyValue\" placeholder=\"e.g. #ff6a22 or 16px\"><button id=\"applyValue\">Apply</button><button id=\"resetValue\">Reset</button><p id=\"propertyStatus\" class=\"muted\">Choose a category to start.</p></div></section>\n  </aside>\n  <main class=\"canvas\"><article class=\"preview-card\" id=\"demoElement\"><h2>Visual settings workspace</h2><p>Use this sample panel to edit the panel's structure and styles in the code editor.</p><button>Sample button</button></article></main>\n</div>",  css: "/* #visual-panel-demo.css: ظاهر نمونه پنل تنظیمات ویژوال برای تمرین و توسعه */\n*{box-sizing:border-box}\nbody{margin:0;background:#111722;color:#e7e8ec;font:13px/1.5 system-ui,sans-serif}\n.visual-panel-demo{min-height:100vh}\n.visual-toolbar{position:sticky;top:0;display:flex;align-items:center;gap:14px;padding:12px;border-bottom:1px solid #34363b;background:#1c1d20}\n.visual-toolbar strong{letter-spacing:.12em;font-size:11px}\n.visual-toolbar span{flex:1;color:#a5a8b0}\nbutton,input{font:inherit;color:inherit}\nbutton{cursor:pointer;border:1px solid #44464c;background:#292a2e;border-radius:6px;padding:7px 10px}\nbutton:hover,button.active{border-color:#ff6a22;color:#fff}\n.visual-panel-demo .visual-panel{position:fixed;right:0;top:49px;bottom:0;width:min(360px,44vw);padding:12px;background:#1d1e21;border-left:1px solid #373940;overflow:auto}\n.mode-tabs{display:flex;gap:6px;margin-bottom:12px}\n.mode-tabs button{flex:1}\n.visual-panel-demo h3{font-size:13px;margin:8px 0}\n.muted{color:#9b9da4;font-size:11px}\n.select-btn{width:100%;text-align:left;margin:8px 0}\n.tiles,.categories{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:10px}\n.tiles button{min-height:52px}\n.categories button{font-size:10px;min-height:40px}\n.property-editor{border-top:1px solid #34363b;margin-top:12px;padding-top:12px;display:grid;gap:8px}\n.property-editor input{width:100%;padding:8px;border:1px solid #44464c;border-radius:6px;background:#25262a}\n.canvas{padding:24px;margin-right:min(360px,44vw);min-height:calc(100vh - 49px)}\n.preview-card{padding:20px;border:1px solid #36383e;border-radius:12px;background:#25262a;transition:all .2s}\n.preview-card h2{margin-top:0}\n.preview-card button{background:#ff6a22;border-color:#ff6a22}\n#settingsView{display:none}\n.visual-panel-demo[data-mode=\"settings\"] #elementsView{display:none}\n.visual-panel-demo[data-mode=\"settings\"] #settingsView{display:block}\n@media(max-width:600px){.visual-panel-demo .visual-panel{width:100%;top:auto;height:52vh;bottom:0;border-left:0;border-top:1px solid #373940}.canvas{margin:0;padding:14px 14px 55vh}.visual-toolbar{gap:8px}}\n",  javascript: "// #visual-panel-demo.js: تعامل پایه تب‌ها و نمونه اعمال تنظیمات پنل\n(() => {\n  const root=document.querySelector(\".visual-panel-demo\");\n  const target=document.querySelector(\"#demoElement\");\n  const status=document.querySelector(\"#propertyStatus\");\n  let currentCategory=\"\";\n  document.querySelectorAll(\"[data-mode]\").forEach(btn=>btn.addEventListener(\"click\",()=>{\n    root.dataset.mode=btn.dataset.mode;\n    document.querySelectorAll(\"[data-mode]\").forEach(tab=>tab.classList.toggle(\"active\",tab===btn));\n  }));\n  document.querySelectorAll(\"[data-category]\").forEach(btn=>btn.addEventListener(\"click\",()=>{\n    currentCategory=btn.dataset.category;\n    status.textContent=currentCategory+\" selected — enter a CSS value below.\";\n  }));\n  document.querySelector(\"#applyValue\").addEventListener(\"click\",()=>{\n    const value=document.querySelector(\"#propertyValue\").value.trim();\n    if(!currentCategory||!value){status.textContent=\"Choose a category and enter a value.\";return;}\n    const propertyMap={Color:\"color\",Background:\"background\",Border:\"border\",Outline:\"outline\",Size:\"width\",Shadow:\"box-shadow\",Spacing:\"padding\",Typography:\"font\",Layout:\"display\",Flexbox:\"display\",Grid:\"display\",Position:\"position\",Effects:\"opacity\",Transform:\"transform\",Transition:\"transition\",Animation:\"animation\",Content:\"cursor\",Scroll:\"scroll-behavior\",SVG:\"fill\",Responsive:\"width\",\"Custom CSS\":\"color\"};\n    target.style[propertyMap[currentCategory]||\"color\"]=value;\n    status.textContent=value+\" applied to the sample card.\";\n  });\n  document.querySelector(\"#resetValue\").addEventListener(\"click\",()=>{\n    target.removeAttribute(\"style\");document.querySelector(\"#propertyValue\").value=\"\";status.textContent=\"Sample element styles reset.\";\n  });\n  document.querySelector(\"#selectElement\").addEventListener(\"click\",()=>{document.querySelector(\"#selected\").textContent=\"Demo element\";root.dataset.mode=\"settings\";});\n  document.querySelector(\"#exitVisual\").addEventListener(\"click\",()=>{root.dataset.mode=\"elements\";status.textContent=\"Visual panel demo reset to Elements view.\";});\n})();"
}

const host = document.getElementById("editor-host");
const tabs = [...document.querySelectorAll(".editor-tab")];
const status = document.getElementById("editor-status");
const storageStatus = document.getElementById("storage-status");
const browserStorage = new BrowserStorage({
  onStatus(message, state) {
    storageStatus.textContent = message;
    storageStatus.dataset.state = state;
  }
});
const restored = browserStorage.load(initialSources);
const sources = restored.sources;
storageStatus.textContent = restored.restored ? "Restored from browser" : "Browser storage ready";
storageStatus.dataset.state = restored.restored ? "saved" : "ready";

const editor = new Editor({ text: sources.html });
const languages = new LanguageManager();
languages.register(htmlLanguage);
languages.register(cssLanguage);
languages.register(javascriptLanguage);
languages.setActive("html");

const highlighter = new SyntaxHighlighter();
const lineNumbers = new LineNumbers();
const bracketMatcher = new BracketMatcher();
const baseLineRenderer = new LineRenderer();

const layout = document.createElement("div");
layout.className = "alfacode-editor-layout";
const gutterHost = document.createElement("div");
gutterHost.className = "alfacode-gutter-host";
const canvas = document.createElement("div");
canvas.className = "alfacode-editor-canvas";
layout.append(gutterHost, canvas);
host.appendChild(layout);

function decorateTextRange(container, from, to, className) {
  if (to <= from) return;
  const walker = container.ownerDocument.createTreeWalker(
    container,
    container.ownerDocument.defaultView.NodeFilter.SHOW_TEXT
  );
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);

  let absoluteOffset = 0;
  for (const textNode of nodes) {
    const length = textNode.data.length;
    const localFrom = Math.max(0, from - absoluteOffset);
    const localTo = Math.min(length, to - absoluteOffset);
    absoluteOffset += length;
    if (localTo <= localFrom) continue;

    let selectedNode = textNode;
    if (localFrom > 0) selectedNode = textNode.splitText(localFrom);
    if (localTo - localFrom < selectedNode.data.length) {
      selectedNode.splitText(localTo - localFrom);
    }
    const marker = container.ownerDocument.createElement("span");
    marker.className = className;
    selectedNode.parentNode.insertBefore(marker, selectedNode);
    marker.appendChild(selectedNode);
  }
}

let activeTokens = [];
let activeMatch = null;
let activeLanguage = languages.activeLanguage;
let rendering = false;
let compositionStart = null;

const lineRenderer = {
  renderLine(documentModel, lineNumber, selection, ownerDocument) {
    const rendered = baseLineRenderer.renderLine(
      documentModel,
      lineNumber,
      selection,
      ownerDocument
    );
    const lineStart = rendered.lineStart;
    const lineEnd = rendered.lineEnd;
    const lineText = documentModel.getLine(lineNumber);
    const lineTokens = activeTokens
      .filter(token => token.end > lineStart && token.start < lineEnd)
      .map(token => ({
        ...token,
        start: Math.max(0, token.start - lineStart),
        end: Math.min(lineText.length, token.end - lineStart)
      }))
      .filter(token => token.end > token.start);

    highlighter.renderInto(rendered.content, lineText, lineTokens);

    if (!selection.isEmpty) {
      decorateTextRange(
        rendered.content,
        Math.max(0, selection.from - lineStart),
        Math.min(lineText.length, selection.to - lineStart),
        "alfacode-selection"
      );
    }

    if (activeMatch) {
      for (const bracketOffset of [activeMatch.open, activeMatch.close]) {
        if (bracketOffset >= lineStart && bracketOffset < lineEnd) {
          decorateTextRange(
            rendered.content,
            bracketOffset - lineStart,
            bracketOffset - lineStart + 1,
            "alfacode-bracket-match"
          );
        }
      }
    }
    return rendered;
  }
};

const view = new EditorView(editor, { lineRenderer });
const viewElement = view.mount(canvas);
viewElement.contentEditable = "true";
viewElement.setAttribute("aria-label", "AlfaCode code editor");
viewElement.addEventListener("focus", () => publishEditorState(true));
viewElement.addEventListener("blur", () => publishEditorState(false));

const input = new InputController(editor, { target: viewElement });
let tagSuggestionMenu = null;
let cssSuggestionMenu = null;
let javascriptSuggestionMenu = null;
let chainSuggestionMode = false;
function currentSuggestionMenu() {
  return activeLanguage.id === "css" ? cssSuggestionMenu :
    activeLanguage.id === "javascript" ? javascriptSuggestionMenu : tagSuggestionMenu;
}
function hideSuggestionMenus() {
  tagSuggestionMenu?.hide();
  cssSuggestionMenu?.hide();
  javascriptSuggestionMenu?.hide();
}
createTagSuggestions({ ownerDocument: document, onSelect: applyTagSuggestion })
  .then(menu => { tagSuggestionMenu = menu; updateCompletionSuggestions(); });
createCSSSuggestions({ ownerDocument: document, onSelect: applyLanguageSuggestion })
  .then(menu => { cssSuggestionMenu = menu; updateCompletionSuggestions(); });
createJavaScriptSuggestions({ ownerDocument: document, onSelect: applyLanguageSuggestion })
  .then(menu => { javascriptSuggestionMenu = menu; updateCompletionSuggestions(); });
const themes = new ThemeManager({ defaultTheme: "dark" });
themes.apply(host);

function publishEditorState(focused = true) {
  window.parent.postMessage({
    type: "alfacode:editor-state",
    focused,
    language: activeLanguage.id
  }, "*");
}

function publishSource() {
  window.parent.postMessage({
    type: "alfacode:source-change",
    sources: { ...sources, [activeLanguage.id]: editor.text }
  }, "*");
}

function updateCompletionSuggestions() {
  const menu = currentSuggestionMenu();
  for (const candidate of [tagSuggestionMenu, cssSuggestionMenu, javascriptSuggestionMenu]) {
    if (candidate && candidate !== menu) candidate.hide();
  }
  if (!menu) return;
  if (!editor.selection.isEmpty) { menu.hide(); chainSuggestionMode = false; return; }
  let result = null;
  if (activeLanguage.id === "html") result = getHTMLTagSuggestions(editor.text, editor.selection.head, { chain: chainSuggestionMode, limit: 10, catalog: completionCatalogs.html?.records });
  else if (activeLanguage.id === "css") result = getCSSCompletionSuggestions(editor.text, editor.selection.head, { limit: 10, catalog: completionCatalogs.css?.records });
  else if (activeLanguage.id === "javascript") result = getJavaScriptCompletionSuggestions(editor.text, editor.selection.head, { limit: 10, catalog: completionCatalogs.javascript?.records });
  if (!result || !result.options.length) { menu.hide(); if (chainSuggestionMode) chainSuggestionMode = false; return; }
  const point = getDOMPointFromDocumentOffset(editor.selection.head);
  let anchor = null;
  if (point) {
    try {
      const range = document.createRange();
      range.setStart(point.node, point.offset);
      range.collapse(true);
      const rect = range.getBoundingClientRect();
      anchor = { left: rect.left, top: rect.top, bottom: rect.bottom };
    } catch { anchor = null; }
  }
  menu.show(result, anchor);
}

function applyLanguageSuggestion(option) {
  if (!option) return;
  const insertion = option.insertText ?? option.label;
  editor.transact(transaction => transaction.replace(option.from, option.to, insertion));
  editor.moveTo(option.from + insertion.length);
  renderEditor();
  view.focus();
}

function applyTagSuggestion(option) {
  if (!option || !tagSuggestionMenu) return;

  if (option.kind === "jump-close") {
    chainSuggestionMode = false;
    editor.moveTo(option.closeTo);
    renderEditor();
    view.focus();
    return;
  }

  const from = option.from;
  const to = option.to;
  const isClosing = option.kind === "close";
  const { insertion, cursorOffset } = buildHTMLTagInsertion(option);
  editor.transact(transaction => transaction.replace(from, to, insertion));
  editor.moveTo(from + cursorOffset);
  chainSuggestionMode = !isClosing && !option.isVoid;
  renderEditor();
  view.focus();
}

function renderEditor() {
  if (rendering) return;
  sources[activeLanguage.id] = editor.text;
  rendering = true;
  try {
    activeTokens = activeLanguage.tokenize(editor.text);
    activeMatch = bracketMatcher.findMatch(
      editor.text,
      editor.selection.head,
      activeTokens
    );
    const activeLine = editor.document.getPositionAt(editor.selection.head).line;
    gutterHost.replaceChildren(lineNumbers.render(editor.document, document, activeLine));
    view.render();
    restoreDOMSelection(editor.selection.anchor, editor.selection.head);
  } catch (error) {
    status.textContent = "Render error: " + error.message;
    console.error(error);
  } finally {
    rendering = false;
  }
  browserStorage.schedule(sources);
  publishSource();
  status.textContent = activeLanguage.id.toUpperCase() + " · " + editor.document.getLineCount() + " lines";
  updateCompletionSuggestions();
}

function getDocumentOffsetFromDOMPoint(node, offset) {
  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  const lineElement = element?.closest(".alfacode-line");
  if (!lineElement || !viewElement.contains(lineElement)) return null;

  const lineNumber = Number(lineElement.dataset.line);
  if (!Number.isInteger(lineNumber) || lineNumber < 1 ||
      lineNumber > editor.document.getLineCount()) return null;

  const range = document.createRange();
  range.selectNodeContents(lineElement);
  range.setEnd(node, offset);
  return editor.document.getLineStart(lineNumber) + range.toString().length;
}

function syncSelectionFromDOM(shouldRender = true) {
  if (rendering || compositionStart !== null) return false;
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode || !selection.focusNode ||
      !viewElement.contains(selection.anchorNode) || !viewElement.contains(selection.focusNode)) return false;
  try {
    const anchor = getDocumentOffsetFromDOMPoint(selection.anchorNode, selection.anchorOffset);
    const head = getDocumentOffsetFromDOMPoint(selection.focusNode, selection.focusOffset);
    if (anchor === null || head === null) return false;
    const previous = editor.selection;
    const changed = previous.anchor !== anchor || previous.head !== head;
    if (!changed) return false;
    editor.setSelection({ anchor, head });
    if (shouldRender) renderEditor();
    return true;
  } catch {
    // Ignore transient browser selections while the rendered DOM is changing.
    return false;
  }
}

// Rebuilds the browser selection from model offsets after a render replaces
// the line DOM. This keeps the native caret aligned with the model caret.
function getDOMPointFromDocumentOffset(offset) {
  const position = editor.document.getPositionAt(offset);
  const line = viewElement.querySelector(`.alfacode-line[data-line="${position.line}"]`);
  const content = line?.querySelector(".alfacode-line-content");
  if (!content) return null;

  let remaining = position.column - 1;
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  let node;
  let last = null;
  while ((node = walker.nextNode())) {
    last = node;
    if (remaining <= node.data.length) return { node, offset: remaining };
    remaining -= node.data.length;
  }
  if (last) return { node: last, offset: last.data.length };
  return { node: content, offset: 0 };
}

function restoreDOMSelection(anchor, head) {
  const browserSelection = window.getSelection();
  if (!browserSelection) return;
  const anchorPoint = getDOMPointFromDocumentOffset(anchor);
  const headPoint = getDOMPointFromDocumentOffset(head);
  if (!anchorPoint || !headPoint) return;

  try {
    if (typeof browserSelection.setBaseAndExtent === "function") {
      browserSelection.setBaseAndExtent(
        anchorPoint.node, anchorPoint.offset,
        headPoint.node, headPoint.offset
      );
    } else {
      const range = document.createRange();
      range.setStart(anchorPoint.node, anchorPoint.offset);
      range.setEnd(headPoint.node, headPoint.offset);
      browserSelection.removeAllRanges();
      browserSelection.addRange(range);
    }
  } catch {
    // A transient browser DOM state must not interrupt editor input.
  }
}

// Read the browser caret before InputController handles the same event.
// Capture phase is essential: keyboard edits must use the clicked DOM position,
// not a stale model selection (which otherwise defaults to offset zero).
viewElement.addEventListener("keydown", () => {
  if (compositionStart === null) syncSelectionFromDOM(false);
}, true);

viewElement.addEventListener("keydown", event => {
  const suggestionMenu = currentSuggestionMenu();
  if (suggestionMenu?.isOpen) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      event.stopImmediatePropagation();
      suggestionMenu.setActive(suggestionMenu.activeIndex + (event.key === "ArrowDown" ? 1 : -1));
      return;
    }
    if (event.key === "Enter" || event.key === "Tab") {
      const selected = suggestionMenu.selectedOption;
      if (selected) {
        event.preventDefault();
        event.stopImmediatePropagation();
        applySuggestionForMenu(suggestionMenu, selected, {
          html: tagSuggestionMenu,
          css: cssSuggestionMenu,
          javascript: javascriptSuggestionMenu
        }, {
          html: applyTagSuggestion,
          language: applyLanguageSuggestion
        });
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      suggestionMenu.hide();
      chainSuggestionMode = false;
      return;
    }
  }
  if (event.key.length === 1 || event.key === "Backspace" || event.key === "Delete") {
    chainSuggestionMode = false;
  }
}, true);
viewElement.addEventListener("beforeinput", event => {
  if (!event.isComposing && compositionStart === null) syncSelectionFromDOM(false);
}, true);
viewElement.addEventListener("beforeinput", event => {
  if (!event.isComposing) chainSuggestionMode = false;
}, true);
viewElement.addEventListener("keydown", event => {
  if (!event.isComposing) queueMicrotask(renderEditor);
});
viewElement.addEventListener("beforeinput", event => {
  if (!event.isComposing) queueMicrotask(renderEditor);
});
// Browser selection can change through touch handles without a reliable pointerup.
// Synchronize the model without rendering during selectionchange.
document.addEventListener("selectionchange", () => {
  // A click or touch selection moves the native caret. Update the model and
  // redraw the visual caret only when the model position actually changed.
  if (syncSelectionFromDOM(false)) renderEditor();
});
viewElement.addEventListener("keyup", () => {
  if (syncSelectionFromDOM(false)) renderEditor();
});
viewElement.addEventListener("pointerup", () => {
  queueMicrotask(() => {
    if (syncSelectionFromDOM(false)) renderEditor();
  });
});
viewElement.addEventListener("cut", () => queueMicrotask(renderEditor));
viewElement.addEventListener("paste", () => queueMicrotask(renderEditor));
viewElement.addEventListener("compositionstart", () => {
  compositionStart = { ...editor.selection };
});
viewElement.addEventListener("compositionend", event => {
  const start = compositionStart ?? editor.selection;
  compositionStart = null;
  const composedText = typeof event.data === "string" ? event.data : "";
  if (composedText) {
    editor.transact(transaction => transaction.replace(start.from, start.to, composedText));
    editor.moveTo(start.from + composedText.length);
  }
  queueMicrotask(renderEditor);
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    chainSuggestionMode = false;
    hideSuggestionMenus();
    const nextLanguage = tab.dataset.language;
    if (!nextLanguage || nextLanguage === activeLanguage.id) return;
    sources[activeLanguage.id] = editor.text;
    activeLanguage = languages.setActive(nextLanguage);
    publishEditorState(true);
    editor.setDocument(sources[nextLanguage]);
    tabs.forEach(item => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    renderEditor();
    view.focus();
  });
});

renderEditor();
function applyExtraKey(key) {
  if (typeof key !== "string" || !key) return;
  syncSelectionFromDOM(false);
  if (["Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Backspace"].includes(key)) {
    viewElement.dispatchEvent(new KeyboardEvent("keydown", {
      key, bubbles: true, cancelable: true
    }));
    queueMicrotask(renderEditor);
    view.focus();
    return;
  }
  const pairs = { "(": ")", "[": "]", "{": "}", "\"": "\"", "'": "'" };
  const selection = editor.selection;
  if (selection.isEmpty && Object.values(pairs).includes(key) && editor.text[selection.head] === key) {
    editor.moveTo(selection.head + key.length);
    renderEditor();
    view.focus();
    return;
  }
  const closing = pairs[key];
  const insertion = closing ? key + closing : key;
  editor.transact(transaction => transaction.replace(selection.from, selection.to, insertion));
  editor.moveTo(selection.from + key.length);
  renderEditor();
  view.focus();
}

window.addEventListener("pagehide", () => browserStorage.flush(sources));
view.focus();
publishEditorState(true);

window.addEventListener("message", event => {
  // The exact parent window is the trust boundary; file:// origins may be opaque.
  if (event.source !== window.parent) return;
  const command = event.data;
  if (!command) return;
  if (command.type === "alfacode:extra-key-command") {
    applyExtraKey(command.key);
    return;
  }
  if (command.type === "alfacode:visual-css-update" && typeof command.css === "string") {
    const startMarker = "/* Editor1 Visual Styles - Start */";
    const endMarker = "/* Editor1 Visual Styles - End */";
    const markerBlock = /\/\* Editor1 Visual Styles - Start \*\/([\s\S]*?)\/\* Editor1 Visual Styles - End \*\//;
    const baseCSS = (sources.css || "").replace(markerBlock, "").trimEnd();
    const parsedUpdates = [];

    function parseRuleBlocks(css) {
      const rules = [];
      let cursor = 0;
      while (cursor < css.length) {
        let open = -1;
        let quote = null;
        let comment = false;
        for (let index = cursor; index < css.length; index++) {
          const char = css[index];
          const next = css[index + 1];
          if (comment) { if (char === "*" && next === "/") { comment = false; index++; } continue; }
          if (quote) { if (char === "\\" && quote) { index++; } else if (char === quote) quote = null; continue; }
          if (char === "/" && next === "*") { comment = true; index++; continue; }
          if (char === "\"" || char === "'") { quote = char; continue; }
          if (char === "{") { open = index; break; }
        }
        if (open < 0) break;
        let depth = 1;
        quote = null;
        comment = false;
        let close = -1;
        for (let index = open + 1; index < css.length; index++) {
          const char = css[index];
          const next = css[index + 1];
          if (comment) { if (char === "*" && next === "/") { comment = false; index++; } continue; }
          if (quote) { if (char === "\\") index++; else if (char === quote) quote = null; continue; }
          if (char === "/" && next === "*") { comment = true; index++; continue; }
          if (char === "\"" || char === "'") { quote = char; continue; }
          if (char === "{") depth++;
          if (char === "}") { depth--; if (depth === 0) { close = index; break; } }
        }
        if (close < 0) break;
        const header = css.slice(cursor, open).trim();
        const body = css.slice(open + 1, close);
        rules.push({ header, body, start: cursor, open, close });
        cursor = close + 1;
      }
      return rules;
    }

    for (const match of baseCSS.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = match[1].trim();
      if (!selector || selector.includes("@") || selector.startsWith("/*") || selector.endsWith(">") || selector.endsWith("+") || selector.endsWith("~")) continue;
      if (/^(?:html|body|\.?)\b/.test(selector)) continue;
    }

    function parseDeclarations(body) {
      const declarations = new Map();
      body.split(";").map(item => item.trim()).filter(Boolean).forEach(item => {
        const colon = item.indexOf(":");
        if (colon > 0) declarations.set(item.slice(0, colon).trim(), item.slice(colon + 1).trim());
      });
      return declarations;
    }

    function parseUpdates(css) {
      const updates = [];
      for (const rule of parseRuleBlocks(css)) {
        if (!rule.header || rule.header.startsWith("@")) continue;
        const declarations = [...parseDeclarations(rule.body).entries()].map(([property, value]) => property + ": " + value);
        updates.push({ selector: rule.header, declarations });
      }
      return updates;
    }

    function mergeRuleBody(existingBody, updates) {
      const declarations = parseDeclarations(existingBody);
      updates.forEach(item => {
        const colon = item.indexOf(":");
        if (colon > 0) declarations.set(item.slice(0, colon).trim(), item.slice(colon + 1).trim());
      });
      return [...declarations].map(([property, value]) => "  " + property + ": " + value + ";").join("\n");
    }

    parsedUpdates.push(...parseUpdates(command.css));
    let mergedCSS = baseCSS;
    const unmatchedRules = [];
    const removals = Array.isArray(command.removals) ? command.removals.filter(prop => typeof prop === "string") : [];
    const targetSelector = typeof command.selector === "string" ? command.selector : null;
    for (const update of parsedUpdates) {
      const rules = parseRuleBlocks(mergedCSS);
      let merged = false;
      for (let index = rules.length - 1; index >= 0; index--) {
        const rule = rules[index];
        if (rule.header !== update.selector) continue;
        mergedCSS = mergedCSS.slice(0, rule.open + 1) + "\n" + mergeRuleBody(rule.body, update.declarations) + "\n" + mergedCSS.slice(rule.close);
        merged = true;
        break;
      }
      if (!merged) unmatchedRules.push(update.selector + " {\n" + update.declarations.map(item => "  " + item + ";").join("\n") + "\n}");
    }
    if (removals.length) {
      for (const rule of parseRuleBlocks(mergedCSS).reverse()) {
        if (targetSelector && rule.header !== targetSelector) continue;
        const declarations = parseDeclarations(rule.body);
        removals.forEach(property => declarations.delete(property));
        const body = [...declarations].map(([property, value]) => "  " + property + ": " + value + ";").join("\n");
        mergedCSS = mergedCSS.slice(0, rule.open + 1) + (body ? "\n" + body + "\n" : "") + mergedCSS.slice(rule.close);
      }
    }
    const extraBlock = unmatchedRules.join("\n\n");
    sources.css = mergedCSS + (extraBlock ? "\n\n" + startMarker + "\n" + extraBlock + "\n" + endMarker : "");
    if (activeLanguage.id === "css") editor.setDocument(sources.css);
    publishSource();
    renderEditor();
    view.focus();
    return;
  }
  if (command.type !== "alfacode:toolbar-command") return;

  if (command.action === "clear-tab") {
    sources[activeLanguage.id] = "";
    editor.setDocument("");
    chainSuggestionMode = false;
    hideSuggestionMenus();
    renderEditor();
    view.focus();
    return;
  }

  if (command.action === "clear-tabs") {
    for (const key of Object.keys(sources)) sources[key] = "";
    editor.setDocument(sources[activeLanguage.id]);
    chainSuggestionMode = false;
    hideSuggestionMenus();
    renderEditor();
    view.focus();
    return;
  }

  if (command.action === "project-reset") {
    for (const key of Object.keys(initialSources)) sources[key] = initialSources[key];
    activeLanguage = languages.setActive("html");
    publishEditorState(true);
    tabs.forEach(tab => {
      const selected = tab.dataset.language === "html";
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    editor.setDocument(sources.html);
    chainSuggestionMode = false;
    hideSuggestionMenus();
    renderEditor();
    view.focus();
    return;
  }

  if (command.action === "clear-project-cookies") {
    browserStorage.clearProjectData();
    window.parent.postMessage({ type: "alfacode:project-data-cleared" }, "*");
  }
});

