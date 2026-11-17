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

const initialSource = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AlfaCode Preview</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; }
    h1 { color: #315ea8; }
  </style>
</head>
<body>
  <h1>Hello from AlfaCode</h1>
  <p>Edit this code to update the live preview.</p>
</body>
</html>`;

const host = document.getElementById("editor-host");
const languageSelect = document.getElementById("language-select");
const status = document.getElementById("editor-status");

const editor = new Editor({ text: initialSource });
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
    language: activeLanguage.id,
    source: editor.text
  }, "*");
}

function renderEditor() {
  if (rendering) return;
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
  } catch (error) {
    status.textContent = "Render error: " + error.message;
    console.error(error);
  } finally {
    rendering = false;
  }
  publishSource();
  status.textContent = activeLanguage.id.toUpperCase() + " · " + editor.document.getLineCount() + " lines";
}

function syncSelectionFromDOM() {
  if (rendering || compositionStart !== null) return;
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode || !viewElement.contains(selection.anchorNode)) return;
  try {
    const range = document.createRange();
    range.selectNodeContents(viewElement);
    range.setEnd(selection.anchorNode, selection.anchorOffset);
    const head = range.toString().length;
    const anchorRange = document.createRange();
    anchorRange.selectNodeContents(viewElement);
    anchorRange.setEnd(selection.focusNode, selection.focusOffset);
    const anchor = anchorRange.toString().length;
    editor.setSelection({ anchor, head });
    renderEditor();
  } catch {
    // Ignore transient browser selections while the rendered DOM is changing.
  }
}

viewElement.addEventListener("keydown", event => {
  if (!event.isComposing) queueMicrotask(renderEditor);
});
viewElement.addEventListener("beforeinput", event => {
  if (!event.isComposing) queueMicrotask(renderEditor);
});
viewElement.addEventListener("keyup", syncSelectionFromDOM);
viewElement.addEventListener("pointerup", () => queueMicrotask(syncSelectionFromDOM));
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

languageSelect.addEventListener("change", () => {
  activeLanguage = languages.setActive(languageSelect.value);
  renderEditor();
});
document.addEventListener("selectionchange", syncSelectionFromDOM);

renderEditor();
view.focus();
