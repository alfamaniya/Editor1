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

const initialSources = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AlfaCode Starter</title>
</head>
<body>
  <main class="demo-card">
    <p class="eyebrow">ALFACODE STARTER</p>
    <h1>Welcome to AlfaCode</h1>
    <p class="description">Your HTML, CSS, and JavaScript work together in this live preview.</p>
    <button id="demo-button" type="button">Click me</button>
    <p id="demo-message" class="message" aria-live="polite">Your interaction will appear here.</p>
  </main>
</body>
</html>`,
  css: `:root {
  font-family: Arial, sans-serif;
  color: #1f2937;
  background: #eef2f7;
}

* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  padding: 24px;
}

.demo-card {
  width: min(100%, 520px);
  padding: 36px;
  border: 1px solid #dbe3ee;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(31, 41, 55, 0.10);
}

.eyebrow {
  margin: 0 0 12px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

h1 {
  margin: 0 0 12px;
  font-size: clamp(26px, 6vw, 36px);
}

.description {
  color: #64748b;
  line-height: 1.6;
}

button {
  margin-top: 12px;
  padding: 11px 18px;
  border: 0;
  border-radius: 9px;
  background: #2563eb;
  color: #ffffff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}

button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

.message {
  min-height: 24px;
  margin: 20px 0 0;
  color: #475569;
}`,
  javascript: `const button = document.querySelector("#demo-button");
const message = document.querySelector("#demo-message");

let clickCount = 0;

button.addEventListener("click", () => {
  clickCount += 1;
  message.textContent = "Great! You clicked the button " + clickCount + " time" + (clickCount === 1 ? "" : "s") + ".";
});`
};

const host = document.getElementById("editor-host");
const tabs = [...document.querySelectorAll(".editor-tab")];
const sources = { ...initialSources };
const status = document.getElementById("editor-status");

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

const input = new InputController(editor, { target: viewElement });
const themes = new ThemeManager({ defaultTheme: "dark" });
themes.apply(host);

function publishSource() {
  window.parent.postMessage({
    type: "alfacode:source-change",
    sources: { ...sources, [activeLanguage.id]: editor.text }
  }, "*");
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
  publishSource();
  status.textContent = activeLanguage.id.toUpperCase() + " · " + editor.document.getLineCount() + " lines";
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
viewElement.addEventListener("beforeinput", event => {
  if (!event.isComposing && compositionStart === null) syncSelectionFromDOM(false);
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
    const nextLanguage = tab.dataset.language;
    if (!nextLanguage || nextLanguage === activeLanguage.id) return;
    sources[activeLanguage.id] = editor.text;
    activeLanguage = languages.setActive(nextLanguage);
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
view.focus();
