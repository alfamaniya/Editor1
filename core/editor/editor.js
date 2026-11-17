import Editor from "../../alfacode/src/core/editor.js";
import EditorView from "../../alfacode/src/rendering/editor-view.js";
import InputController from "../../alfacode/src/input/input-controller.js";
import LanguageManager from "../../alfacode/src/language/language-manager.js";
import htmlLanguage from "../../alfacode/src/language/html/html-language.js";
import cssLanguage from "../../alfacode/src/language/css/css-language.js";
import javascriptLanguage from "../../alfacode/src/language/javascript/javascript-language.js";
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
const view = new EditorView(editor);
const viewElement = view.mount(host);
viewElement.contentEditable = "true";
viewElement.setAttribute("aria-label", "AlfaCode code editor");

const input = new InputController(editor, { target: viewElement });
const languages = new LanguageManager();
languages.register(htmlLanguage);
languages.register(cssLanguage);
languages.register(javascriptLanguage);
const themes = new ThemeManager({ defaultTheme: "dark" });
themes.apply(viewElement);

let activeLanguage = "html";
let rendering = false;

function publishSource() {
  if (rendering) return;
  const source = editor.text;
  status.textContent = "Preview synced";
  window.parent.postMessage({
    type: "alfacode:source-change",
    language: activeLanguage,
    source
  }, "*");
}

function renderEditor() {
  rendering = true;
  view.render();
  rendering = false;
  publishSource();
}

viewElement.addEventListener("keydown", () => {
  queueMicrotask(renderEditor);
});
viewElement.addEventListener("beforeinput", () => {
  queueMicrotask(renderEditor);
});
languageSelect.addEventListener("change", () => {
  activeLanguage = languages.setActive(languageSelect.value).id;
  status.textContent = activeLanguage.toUpperCase() + " mode";
  publishSource();
});

languages.setActive(activeLanguage);
renderEditor();
status.textContent = "AlfaCode ready";
