/**
 * ClipboardHandler
 * Handles copy, cut, and paste through standard clipboard events.
 * It does not access the system clipboard directly or require network access.
 */
export class ClipboardHandler {
  constructor(editor) {
    if (!editor || typeof editor.transact !== "function") {
      throw new TypeError("ClipboardHandler requires an Editor instance.");
    }
    this.editor = editor;
  }

  handleCopy(event) {
    const selection = this.editor.selection;
    if (selection.isEmpty || !event?.clipboardData) return false;

    event.clipboardData.setData(
      "text/plain",
      this.editor.text.slice(selection.from, selection.to)
    );
    event.preventDefault();
    return true;
  }

  handleCut(event) {
    const selection = this.editor.selection;
    if (selection.isEmpty || !event?.clipboardData) return false;

    event.clipboardData.setData(
      "text/plain",
      this.editor.text.slice(selection.from, selection.to)
    );
    event.preventDefault();

    this.editor.transact((transaction) =>
      transaction.delete(selection.from, selection.to)
    );
    this.editor.moveTo(selection.from);
    return true;
  }

  handlePaste(event) {
    if (!event?.clipboardData) return false;

    const text = event.clipboardData.getData("text/plain");
    event.preventDefault();
    if (typeof text !== "string" || text.length === 0) return true;

    const selection = this.editor.selection;
    this.editor.transact((transaction) =>
      transaction.replace(selection.from, selection.to, text)
    );
    this.editor.moveTo(selection.from + text.replace(/\r\n?/g, "\n").length);
    return true;
  }
}

export default ClipboardHandler;
