/**
 * LineNumbers
 * Creates an accessible line-number gutter for an AlfaCode document.
 * Visual dimensions and colors are intentionally owned by theme CSS.
 */

export class LineNumbers {
  constructor(options = {}) {
    this.gutterClass = options.gutterClass ?? "alfacode-line-numbers";
    this.lineNumberClass = options.lineNumberClass ?? "alfacode-line-number";
    this.activeLineClass = options.activeLineClass ?? "alfacode-line-number-active";
    this.ariaLabel = options.ariaLabel ?? "Line numbers";
  }

  render(documentModel, ownerDocument, activeLine = null) {
    if (!documentModel || typeof documentModel.getLineCount !== "function") {
      throw new TypeError("LineNumbers requires a Document-like model.");
    }
    if (!ownerDocument ||
        typeof ownerDocument.createElement !== "function") {
      throw new TypeError("LineNumbers requires an ownerDocument.");
    }

    const lineCount = documentModel.getLineCount();
    if (activeLine !== null &&
        (!Number.isInteger(activeLine) || activeLine < 1 || activeLine > lineCount)) {
      throw new RangeError("Active line must be a valid 1-based document line number.");
    }

    const gutter = ownerDocument.createElement("div");
    gutter.className = this.gutterClass;
    gutter.setAttribute("role", "presentation");
    gutter.setAttribute("aria-label", this.ariaLabel);
    gutter.setAttribute("data-line-count", String(lineCount));

    for (let lineNumber = 1; lineNumber <= lineCount; lineNumber += 1) {
      const number = ownerDocument.createElement("span");
      number.className = this.lineNumberClass;
      number.textContent = String(lineNumber);
      number.setAttribute("data-line-number", String(lineNumber));
      number.setAttribute("aria-hidden", "true");

      if (lineNumber === activeLine) {
        number.classList.add(this.activeLineClass);
        number.setAttribute("data-active", "true");
      }

      gutter.appendChild(number);
    }

    return gutter;
  }

  renderInto(container, documentModel, activeLine = null) {
    if (!container ||
        !container.ownerDocument ||
        typeof container.appendChild !== "function" ||
        typeof container.removeChild !== "function") {
      throw new TypeError("LineNumbers render target must be a DOM element.");
    }

    // Build and validate the gutter before changing existing content.
    const gutter = this.render(documentModel, container.ownerDocument, activeLine);
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(gutter);
    return gutter;
  }
}

export default LineNumbers;
