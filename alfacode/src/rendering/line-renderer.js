// #line-renderer.js: فایل line renderer مربوط به بخش rendering پروژه
/**
 * LineRenderer
 * Builds safe DOM nodes for document lines without interpreting source as HTML.
 */
export class LineRenderer {
  constructor(options = {}) {
    this.lineClass = options.lineClass ?? "alfacode-line";
    this.contentClass = options.contentClass ?? "alfacode-line-content";
    this.selectionClass = options.selectionClass ?? "alfacode-selection";
  }

  renderLine(documentModel, lineNumber, selection, ownerDocument) {
    if (!documentModel || typeof documentModel.getLine !== "function") {
      throw new TypeError("LineRenderer requires a Document-like model.");
    }
    if (!ownerDocument || typeof ownerDocument.createElement !== "function") {
      throw new TypeError("LineRenderer requires an ownerDocument.");
    }

    const lineStart = documentModel.getLineStart(lineNumber);
    const lineEnd = documentModel.getLineEnd(lineNumber);
    const text = documentModel.getLine(lineNumber);
    const line = ownerDocument.createElement("div");
    const content = ownerDocument.createElement("span");

    line.className = this.lineClass;
    line.dataset.line = String(lineNumber);
    line.style.whiteSpace = "pre";
    line.style.minHeight = "1.4em";

    content.className = this.contentClass;
    content.style.whiteSpace = "pre";

    const selectedFrom = selection && !selection.isEmpty
      ? Math.max(lineStart, selection.from)
      : lineEnd;
    const selectedTo = selection && !selection.isEmpty
      ? Math.min(lineEnd, selection.to)
      : lineEnd;

    const localFrom = Math.max(0, selectedFrom - lineStart);
    const localTo = Math.max(localFrom, selectedTo - lineStart);

    if (localFrom > 0) {
      content.appendChild(ownerDocument.createTextNode(text.slice(0, localFrom)));
    }

    if (localTo > localFrom) {
      const selected = ownerDocument.createElement("span");
      selected.className = this.selectionClass;
      selected.textContent = text.slice(localFrom, localTo);
      selected.style.backgroundColor = "Highlight";
      selected.style.color = "HighlightText";
      content.appendChild(selected);
    }

    if (localTo < text.length) {
      content.appendChild(ownerDocument.createTextNode(text.slice(localTo)));
    }

    if (content.childNodes.length === 0) {
      content.appendChild(ownerDocument.createTextNode(""));
    }

    line.appendChild(content);
    return { element: line, content, lineStart, lineEnd };
  }
}

export default LineRenderer;
