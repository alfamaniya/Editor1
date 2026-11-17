/**
 * CursorRenderer
 * Inserts a visual caret at a UTF-16 offset inside a rendered line.
 */
export class CursorRenderer {
  constructor(options = {}) {
    this.cursorClass = options.cursorClass ?? "alfacode-cursor";
  }

  render(contentElement, offset) {
    if (!contentElement || !contentElement.ownerDocument) {
      throw new TypeError("CursorRenderer requires a rendered line content element.");
    }
    if (!Number.isInteger(offset) || offset < 0) {
      throw new RangeError("Cursor offset must be a non-negative integer.");
    }

    const domDocument = contentElement.ownerDocument;
    const walker = domDocument.createTreeWalker(
      contentElement,
      domDocument.defaultView?.NodeFilter?.SHOW_TEXT ?? 4
    );
    let remaining = offset;
    let current = walker.nextNode();
    let target = null;
    let targetOffset = 0;
    let last = null;

    while (current) {
      last = current;
      if (remaining <= current.data.length) {
        target = current;
        targetOffset = remaining;
        break;
      }
      remaining -= current.data.length;
      current = walker.nextNode();
    }

    if (!target) {
      target = last;
      targetOffset = target ? target.data.length : 0;
    }

    if (!target) {
      target = domDocument.createTextNode("");
      contentElement.appendChild(target);
    }

    const cursor = domDocument.createElement("span");
    cursor.className = this.cursorClass;
    cursor.setAttribute("aria-hidden", "true");
    cursor.style.display = "inline-block";
    cursor.style.width = "0";
    cursor.style.height = "1em";
    cursor.style.verticalAlign = "text-bottom";
    cursor.style.borderLeft = "1px solid currentColor";
    cursor.style.marginLeft = "-1px";
    cursor.style.pointerEvents = "none";

    const range = domDocument.createRange();
    range.setStart(target, targetOffset);
    range.collapse(true);
    range.insertNode(cursor);

    return cursor;
  }
}

export default CursorRenderer;
