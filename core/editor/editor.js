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

const initialSources = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="A starter page to explore HTML elements and AlfaCode editor suggestions.">
  <title>HTML Element Showcase</title>
</head>
<body>
  <header class="site-header">
    <h1>HTML Element Showcase</h1>
    <p>Explore common HTML tags, semantic layout, forms, tables and media.</p>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="#text-elements">Text</a></li>
        <li><a href="#lists">Lists</a></li>
        <li><a href="#table">Table</a></li>
        <li><a href="#form-demo">Form</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section id="text-elements">
      <h2>Text and semantic elements</h2>
      <article>
        <h3>Formatting examples</h3>
        <p>Use <strong>strong importance</strong>, <em>emphasis</em>, <mark>highlight</mark>, <small>small print</small>, <abbr title="HyperText Markup Language">HTML</abbr>, and <code>inline code</code>.</p>
        <blockquote>
          <p>Semantic markup makes structure easier to understand.</p>
        </blockquote>
        <p>Keyboard shortcut: <kbd>Ctrl</kbd> + <kbd>S</kbd>. Sample output: <samp>Saved</samp>.</p>
        <pre><code>&lt;article&gt;Meaningful content&lt;/article&gt;</code></pre>
        <hr>
        <p>Subscript H<sub>2</sub>O and superscript x<sup>2</sup>.</p>
      </article>
    </section>
    <section id="lists">
      <h2>Lists and definitions</h2>
      <ul><li>Unordered item</li><li>Another item<ul><li>Nested item</li></ul></li></ul>
      <ol><li>First step</li><li>Second step</li></ol>
      <dl><dt>HTML</dt><dd>Markup language for web documents.</dd><dt>CSS</dt><dd>Style and layout language.</dd></dl>
    </section>
    <section id="table">
      <h2>Table sample</h2>
      <table>
        <caption>Example feature comparison</caption>
        <thead><tr><th scope="col">Feature</th><th scope="col">Status</th><th scope="col">Level</th></tr></thead>
        <tbody><tr><td>Editor</td><td>Ready to explore</td><td>Basic</td></tr><tr><td>Preview</td><td>Interactive</td><td>Live</td></tr></tbody>
        <tfoot><tr><td colspan="2">Two example rows</td><td>—</td></tr></tfoot>
      </table>
    </section>
    <section id="form-demo">
      <h2>Form controls</h2>
      <form id="sample-form">
        <fieldset><legend>Contact details</legend>
          <label for="visitor-name">Name</label><input id="visitor-name" name="name" type="text" placeholder="Your name" required>
          <label for="visitor-email">Email</label><input id="visitor-email" name="email" type="email" placeholder="name@example.com">
          <label for="visitor-topic">Topic</label><select id="visitor-topic" name="topic"><option>HTML</option><option>CSS</option><option>JavaScript</option></select>
          <label for="visitor-note">Message</label><textarea id="visitor-note" name="message" rows="3"></textarea>
          <label><input name="updates" type="checkbox"> Send me updates</label>
          <button type="submit">Submit example</button><button type="reset">Reset form</button>
        </fieldset>
      </form>
      <p id="form-result" role="status">Form status appears here.</p>
    </section>
    <section id="other-elements">
      <h2>Other useful elements</h2>
      <details><summary>Expand details</summary><p>Content inside a disclosure widget.</p></details>
      <p>Progress: <progress value="65" max="100">65%</progress></p>
      <p>Meter: <meter value="0.7">70%</meter></p>
      <p>Published <time datetime="2026-11-19">November 19, 2026</time>.</p>
      <figure><svg width="320" height="120" viewBox="0 0 320 120" role="img" aria-labelledby="sample-svg-title"><title id="sample-svg-title">SVG sample graphic</title><rect width="320" height="120" rx="12" fill="#e9eef8"></rect><text x="160" y="64" text-anchor="middle" font-family="Arial" font-size="22" fill="#2563eb">SVG Sample</text></svg><figcaption>Inline SVG graphic and caption example (works offline).</figcaption></figure>
      <address>Contact: <a href="mailto:hello@example.com">hello@example.com</a></address>
    </section>
  </main>
  <footer class="site-footer"><p>&copy; AlfaCode HTML sample</p><a href="#top">Back to top</a></footer>
</body>
</html>`,
  css: `/* Selectors: tag, class, id, attribute, combinations and pseudo states */
:root {
  font-family: system-ui, sans-serif;
  color: #243047;
  background: #f2f5fb;
  --accent: #2563eb;
  --surface: #ffffff;
  --radius: 14px;
}
* { box-sizing: border-box; }
body { margin: 0; line-height: 1.6; }
.site-header, main, .site-footer {
  width: min(100% - 2rem, 900px);
  margin: 1.5rem auto;
}
.site-header, .site-footer, section, article {
  padding: 1.25rem;
  background: var(--surface);
  border-radius: var(--radius);
}
.site-header > h1 { color: var(--accent); }
nav ul { display: flex; flex-wrap: wrap; gap: .75rem; padding: 0; list-style: none; }
a { color: var(--accent); text-decoration-thickness: 2px; }
a:hover, a:focus-visible { color: #1748a0; }
a[href^="#"] { scroll-behavior: smooth; }
section { margin-block: 1rem; border: 1px solid #dce3ef; }
section h2::before { content: "✦ "; color: var(--accent); }
p, li { max-width: 72ch; }
article p:first-child { font-size: 1.05rem; }
mark { padding: .15rem .35rem; border-radius: 4px; }
code, kbd, samp { padding: .15rem .4rem; border-radius: 5px; background: #e9eef8; }
pre { overflow-x: auto; padding: 1rem; border-radius: 10px; background: #e9eef8; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: .6rem; border: 1px solid #ccd5e4; text-align: left; }
thead { background: #e9eef8; }
tbody tr:nth-child(even) { background: #f7f9fd; }
form { display: grid; gap: .75rem; }
fieldset { display: grid; gap: .65rem; border: 1px solid #cbd5e1; border-radius: 10px; }
input, select, textarea, button { font: inherit; padding: .6rem; border: 1px solid #b8c5d8; border-radius: 8px; }
button { cursor: pointer; background: var(--accent); color: white; }
button[type="reset"] { background: #64748b; }
button:hover { filter: brightness(.95); }
:focus-visible { outline: 3px solid #93c5fd; outline-offset: 2px; }
details { padding: .75rem; border: 1px solid #dce3ef; border-radius: 8px; }
progress, meter { width: 100%; }
img { max-width: 100%; height: auto; border-radius: 8px; }
.site-footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; }
@media (min-width: 700px) {
  main { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; align-items: start; }
  #text-elements, #table, #form-demo { grid-column: span 2; }
}
@media (prefers-reduced-motion: reduce) {
  * { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; }
}
`,
  javascript: `// 1) Variables, arrays, objects, destructuring and template strings
const sampleItems = ["HTML", "CSS", "JavaScript"];
const profile = { name: "AlfaCode learner", level: "beginner" };
const [firstTopic, secondTopic] = sampleItems;
const profileLabel = profile.name + " — " + profile.level;
console.log(profileLabel, firstTopic, secondTopic);

// 2) Function, arrow function, conditional, loop and map/filter
function describeTopic(topic) {
  if (!topic) return "No topic selected";
  return topic.toUpperCase();
}
const topicLabels = sampleItems.map(describeTopic);
const longerTopics = sampleItems.filter(topic => topic.length > 3);
for (const topic of topicLabels) console.log("Topic:", topic);

// 3) DOM selection and event handling (form validation/status)
const form = document.querySelector("#sample-form");
const result = document.querySelector("#form-result");
form?.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(form);
  const visitor = formData.get("name")?.toString().trim() || "Visitor";
  result.textContent = "Thanks, " + visitor + "! The sample form passed its required-field check.";
});
form?.addEventListener("reset", () => {
  if (result) result.textContent = "Form reset. Try submitting it again.";
});

// 4) Date/time, Intl formatter and timer
const now = new Date();
const clock = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
console.log("Current local time:", clock.format(now));
const timeoutId = setTimeout(() => console.log("Timer example: 1.5 seconds passed."), 1500);

// 5) Map, Set, try/catch and a Promise
const uniqueTopics = new Set(sampleItems);
const topicLengths = new Map([...uniqueTopics].map(topic => [topic, topic.length]));
console.log("Topic lengths:", [...topicLengths.entries()]);
async function showAsyncExample() {
  const message = await Promise.resolve("Async example complete");
  console.log(message);
}
showAsyncExample().catch(error => console.error(error));

// 6) Safe optional DOM interaction with a fallback
const missingElement = document.querySelector("#element-that-does-not-exist");
try {
  if (!missingElement) throw new Error("Demo element was not found.");
} catch (error) {
  console.warn("Handled example error:", error.message);
}
`
};

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

