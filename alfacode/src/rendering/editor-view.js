// #editor-view.js: فایل editor view مربوط به بخش rendering پروژه
import LineRenderer from "./line-renderer.js";
import CursorRenderer from "./cursor-renderer.js";

/**
 * EditorView
 * Mounts and renders the current plain-text document into a host DOM element.
 * It does not own editor state, input events, language parsing, or syntax colors.
 */
export class EditorView {
  constructor(editor, options = {}) {
    if (
      !editor ||
      !editor.document ||
      typeof editor.document.getLineCount !== "function" ||
      typeof editor.getSnapshot !== "function"
    ) {
      throw new TypeError("EditorView requires an AlfaCode Editor instance.");
    }

    this.editor = editor;
    this.options = options;
    this.lineRenderer = options.lineRenderer ?? new LineRenderer(options);
    this.cursorRenderer = options.cursorRenderer ?? new CursorRenderer(options);
    this.container = null;
    this.element = null;
  }

  mount(container) {
    if (
      !container ||
      typeof container.appendChild !== "function" ||
      !container.ownerDocument
    ) {
      throw new TypeError("EditorView mount target must be a DOM element.");
    }

    if (this.element?.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.container = container;
    const domDocument = container.ownerDocument;
    this.element = domDocument.createElement("div");
    this.element.className = this.options.className ?? "alfacode-editor-view";
    this.element.setAttribute("role", "textbox");
    this.element.setAttribute("aria-label", this.options.ariaLabel ?? "Code editor");
    this.element.setAttribute("aria-multiline", "true");
    this.element.setAttribute("spellcheck", "false");
    this.element.setAttribute("autocapitalize", "off");
    this.element.setAttribute("autocomplete", "off");
    this.element.setAttribute("autocorrect", "off");
    this.element.tabIndex = 0;

    this.element.style.position = "relative";
    this.element.style.whiteSpace = "pre";
    this.element.style.fontFamily = "monospace";
    this.element.style.fontSize = "14px";
    this.element.style.minHeight = "100%";
    this.element.style.outline = "none";

    container.appendChild(this.element);
    this.render();
    return this.element;
  }

  render() {
    if (!this.element) {
      throw new Error("EditorView must be mounted before it can render.");
    }

    const domDocument = this.element.ownerDocument;
    const fragment = domDocument.createDocumentFragment();
    const documentModel = this.editor.document;
    const selection = this.editor.selection;
    const lineCount = documentModel.getLineCount();
    const cursorPosition = selection.isEmpty
      ? documentModel.getPositionAt(selection.head)
      : null;

    for (let lineNumber = 1; lineNumber <= lineCount; lineNumber += 1) {
      const rendered = this.lineRenderer.renderLine(
        documentModel,
        lineNumber,
        selection,
        domDocument
      );

      if (cursorPosition && cursorPosition.line === lineNumber) {
        this.cursorRenderer.render(
          rendered.content,
          cursorPosition.column - 1
        );
      }

      fragment.appendChild(rendered.element);
    }

    this.element.replaceChildren(fragment);
    this.element.setAttribute("data-line-count", String(lineCount));
    this.element.setAttribute(
      "data-document-version",
      String(documentModel.version)
    );

    return this.element;
  }

  focus() {
    if (!this.element) {
      throw new Error("EditorView must be mounted before it can receive focus.");
    }
    this.element.focus();
    return this;
  }

  destroy() {
    if (this.element?.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.container = null;
  }
}

export default EditorView;
