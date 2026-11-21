// #history.js: فایل history مربوط به بخش core پروژه
import Document from "./document.js";
import Transaction from "./transaction.js";

/**
 * History
 * Stores document snapshots for undo and redo operations.
 *
 * History is deliberately independent from editor UI and input handling.
 * Each successful transaction is one history entry.
 */
export class History {
  constructor(options = {}) {
    const maxDepth = options.maxDepth ?? 100;
    if (!Number.isInteger(maxDepth) || maxDepth < 1) {
      throw new RangeError("History maxDepth must be a positive integer.");
    }

    this._maxDepth = maxDepth;
    this._undoStack = [];
    this._redoStack = [];
  }

  get maxDepth() {
    return this._maxDepth;
  }

  get undoDepth() {
    return this._undoStack.length;
  }

  get redoDepth() {
    return this._redoStack.length;
  }

  get canUndo() {
    return this._undoStack.length > 0;
  }

  get canRedo() {
    return this._redoStack.length > 0;
  }

  execute(transaction, document) {
    this._validateDocument(document);
    if (!(transaction instanceof Transaction)) {
      throw new TypeError("History.execute requires a Transaction instance.");
    }

    const beforeText = document.getText();
    const result = transaction.apply(document);
    const afterText = document.getText();

    if (result.changed) {
      this._undoStack.push({ beforeText, afterText });
      if (this._undoStack.length > this._maxDepth) {
        this._undoStack.shift();
      }
      this._redoStack = [];
    }

    return {
      ...result,
      recorded: result.changed,
      canUndo: this.canUndo,
      canRedo: this.canRedo
    };
  }

  undo(document) {
    this._validateDocument(document);
    if (!this.canUndo) {
      return this._emptyResult(document, "undo");
    }

    const entry = this._undoStack[this._undoStack.length - 1];
    if (document.getText() !== entry.afterText) {
      throw new Error("Document changed outside this history; undo was cancelled.");
    }

    const change = document.setText(entry.beforeText);
    this._undoStack.pop();
    this._redoStack.push(entry);

    return {
      action: "undo",
      changed: change.changed,
      text: document.getText(),
      version: document.version,
      canUndo: this.canUndo,
      canRedo: this.canRedo
    };
  }

  redo(document) {
    this._validateDocument(document);
    if (!this.canRedo) {
      return this._emptyResult(document, "redo");
    }

    const entry = this._redoStack[this._redoStack.length - 1];
    if (document.getText() !== entry.beforeText) {
      throw new Error("Document changed outside this history; redo was cancelled.");
    }

    const change = document.setText(entry.afterText);
    this._redoStack.pop();
    this._undoStack.push(entry);

    return {
      action: "redo",
      changed: change.changed,
      text: document.getText(),
      version: document.version,
      canUndo: this.canUndo,
      canRedo: this.canRedo
    };
  }

  clear() {
    this._undoStack = [];
    this._redoStack = [];
    return this.getSnapshot();
  }

  getSnapshot() {
    return {
      maxDepth: this._maxDepth,
      undoDepth: this.undoDepth,
      redoDepth: this.redoDepth,
      canUndo: this.canUndo,
      canRedo: this.canRedo
    };
  }

  _validateDocument(document) {
    if (!(document instanceof Document)) {
      throw new TypeError("History operation requires a Document instance.");
    }
  }

  _emptyResult(document, action) {
    return {
      action,
      changed: false,
      text: document.getText(),
      version: document.version,
      canUndo: this.canUndo,
      canRedo: this.canRedo
    };
  }
}

export default History;
