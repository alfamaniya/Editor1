/**
 * KeyboardHandler
 * Translates keyboard commands into operations on the AlfaCode Editor facade.
 * The host input element and its rendering are managed by InputController.
 */
export class KeyboardHandler {
  constructor(editor, options = {}) {
    if (!editor || typeof editor.transact !== "function") {
      throw new TypeError("KeyboardHandler requires an Editor instance.");
    }

    const tabSize = options.tabSize ?? 2;
    if (!Number.isInteger(tabSize) || tabSize < 1 || tabSize > 16) {
      throw new RangeError("tabSize must be an integer between 1 and 16.");
    }

    this.editor = editor;
    this.tabText = options.useSpaces === false ? "\t" : " ".repeat(tabSize);
  }

  handleKeyDown(event) {
    if (!event || typeof event.key !== "string") return false;

    const key = event.key;
    const command = event.ctrlKey || event.metaKey;
    const selection = this.editor.selection;

    if (command && !event.altKey) {
      const lowerKey = key.toLowerCase();
      if (lowerKey === "a") {
        this.editor.selectAll();
        event.preventDefault();
        return true;
      }
      if (lowerKey === "z") {
        if (event.shiftKey) this.editor.redo();
        else this.editor.undo();
        event.preventDefault();
        return true;
      }
      if (lowerKey === "y" && !event.metaKey) {
        this.editor.redo();
        event.preventDefault();
        return true;
      }
      // Copy, cut and paste are handled by native clipboard events.
      return false;
    }

    if (event.altKey || event.ctrlKey || event.metaKey) return false;

    switch (key) {
      case "ArrowLeft":
        this._moveHorizontal(-1, event.shiftKey);
        break;
      case "ArrowRight":
        this._moveHorizontal(1, event.shiftKey);
        break;
      case "ArrowUp":
        this._moveVertical(-1, event.shiftKey);
        break;
      case "ArrowDown":
        this._moveVertical(1, event.shiftKey);
        break;
      case "Home":
        this._moveToLineBoundary("start", event.shiftKey);
        break;
      case "End":
        this._moveToLineBoundary("end", event.shiftKey);
        break;
      case "Backspace":
        this._delete(-1);
        break;
      case "Delete":
        this._delete(1);
        break;
      case "Enter":
        this._replaceSelection("\n");
        break;
      case "Tab":
        this._replaceSelection(this.tabText);
        break;
      case "Escape":
        if (!selection.isEmpty) this.editor.moveTo(selection.head);
        else return false;
        break;
      default:
        if (key.length === 1 && !event.isComposing) this._replaceSelection(key);
        else return false;
    }

    event.preventDefault();
    return true;
  }

  _replaceSelection(text) {
    const { from, to } = this.editor.selection;
    this.editor.transact((transaction) => transaction.replace(from, to, text));
    this.editor.moveTo(from + text.length);
  }

  _delete(direction) {
    const selection = this.editor.selection;
    if (!selection.isEmpty) {
      this._replaceSelection("");
      return;
    }

    const offset = selection.head;
    const text = this.editor.text;
    const target = direction < 0
      ? this._previousCodePointOffset(text, offset)
      : this._nextCodePointOffset(text, offset);
    if (target === offset) return;

    const from = Math.min(offset, target);
    const to = Math.max(offset, target);
    this.editor.transact((transaction) => transaction.delete(from, to));
    this.editor.moveTo(from);
  }

  _moveHorizontal(direction, extend) {
    const selection = this.editor.selection;
    let target;
    if (!extend && !selection.isEmpty) {
      target = direction < 0 ? selection.from : selection.to;
    } else {
      const text = this.editor.text;
      target = direction < 0
        ? this._previousCodePointOffset(text, selection.head)
        : this._nextCodePointOffset(text, selection.head);
    }
    this._setCursor(target, extend, selection.anchor);
  }

  _moveVertical(direction, extend) {
    const document = this.editor.document;
    const selection = this.editor.selection;
    const position = document.getPositionAt(selection.head);
    const targetLine = position.line + direction;
    if (targetLine < 1 || targetLine > document.getLineCount()) return;

    const target = document.getOffsetAt(targetLine, position.column);
    this._setCursor(target, extend, selection.anchor);
  }

  _moveToLineBoundary(boundary, extend) {
    const document = this.editor.document;
    const selection = this.editor.selection;
    const position = document.getPositionAt(selection.head);
    const target = boundary === "start"
      ? document.getLineStart(position.line)
      : document.getLineEnd(position.line);
    this._setCursor(target, extend, selection.anchor);
  }

  _setCursor(offset, extend, anchor) {
    if (extend) this.editor.setSelection({ anchor, head: offset });
    else this.editor.moveTo(offset);
  }

  _previousCodePointOffset(text, offset) {
    if (offset <= 0) return 0;
    const previous = text.charCodeAt(offset - 1);
    if (previous >= 0xDC00 && previous <= 0xDFFF && offset >= 2) {
      const lead = text.charCodeAt(offset - 2);
      if (lead >= 0xD800 && lead <= 0xDBFF) return offset - 2;
    }
    return offset - 1;
  }

  _nextCodePointOffset(text, offset) {
    if (offset >= text.length) return text.length;
    const current = text.charCodeAt(offset);
    if (current >= 0xD800 && current <= 0xDBFF && offset + 1 < text.length) {
      const trail = text.charCodeAt(offset + 1);
      if (trail >= 0xDC00 && trail <= 0xDFFF) return offset + 2;
    }
    return offset + 1;
  }
}

export default KeyboardHandler;
