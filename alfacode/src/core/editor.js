// #editor.js: مدیریت رفتار و رویدادهای ویرایشگر
import Document from "./document.js";
import EditorState from "./editor-state.js";
import Selection from "./selection.js";
import Transaction from "./transaction.js";
import History from "./history.js";

/**
 * Editor
 * Public facade that coordinates the document, state, selection,
 * transactions, and history without depending on the DOM or UI.
 */
export class Editor {
  constructor(options = {}) {
    const {
      document = options.text ?? new Document(),
      selection = { anchor: 0, head: 0 },
      historyMaxDepth = 100
    } = options;

    this._state = new EditorState({ document, selection });
    this._selection = new Selection(
      this._state.selection,
      this._state.document.getLength()
    );
    this._history = new History({ maxDepth: historyMaxDepth });
  }

  get document() {
    return this._state.document;
  }

  get state() {
    return this._state;
  }

  get text() {
    return this.document.getText();
  }

  get selection() {
    return this._selection.getSnapshot();
  }

  get history() {
    return this._history.getSnapshot();
  }

  get canUndo() {
    return this._history.canUndo;
  }

  get canRedo() {
    return this._history.canRedo;
  }

  setSelection(selection) {
    const result = this._selection.set(
      selection,
      this.document.getLength()
    );
    const stateResult = this._state.setSelection({
      anchor: result.selection.anchor,
      head: result.selection.head
    });

    return {
      ...result,
      stateVersion: stateResult.version
    };
  }

  moveTo(offset) {
    return this.setSelection({ anchor: offset, head: offset });
  }

  extendTo(offset) {
    return this.setSelection({
      anchor: this._selection.anchor,
      head: offset
    });
  }

  selectAll() {
    return this.setSelection({
      anchor: 0,
      head: this.document.getLength()
    });
  }

  applyTransaction(transaction) {
    const result = this._history.execute(transaction, this.document);
    this._synchronizeSelection();

    return {
      ...result,
      selection: this.selection,
      history: this.history
    };
  }

  transact(buildTransaction) {
    if (typeof buildTransaction !== "function") {
      throw new TypeError("transact requires a transaction builder function.");
    }

    const transaction = new Transaction();
    const returned = buildTransaction(transaction);
    const candidate = returned === undefined ? transaction : returned;

    if (!(candidate instanceof Transaction)) {
      throw new TypeError("Transaction builder must return a Transaction or undefined.");
    }

    return this.applyTransaction(candidate);
  }

  undo() {
    const result = this._history.undo(this.document);
    this._synchronizeSelection();

    return {
      ...result,
      selection: this.selection,
      history: this.history
    };
  }

  redo() {
    const result = this._history.redo(this.document);
    this._synchronizeSelection();

    return {
      ...result,
      selection: this.selection,
      history: this.history
    };
  }

  setDocument(documentOrText) {
    const result = this._state.setDocument(documentOrText);
    if (result.changed) {
      this._selection = new Selection(
        { anchor: 0, head: 0 },
        this.document.getLength()
      );
      this._history.clear();
    }

    return {
      ...result,
      selection: this.selection,
      history: this.history
    };
  }

  clearHistory() {
    return this._history.clear();
  }

  getSnapshot() {
    return {
      text: this.text,
      documentVersion: this.document.version,
      stateVersion: this._state.version,
      selection: this.selection,
      history: this.history
    };
  }

  _synchronizeSelection() {
    const length = this.document.getLength();
    const anchor = Math.min(this._selection.anchor, length);
    const head = Math.min(this._selection.head, length);

    this._selection.set({ anchor, head }, length);
    this._state.setSelection({ anchor, head });
  }
}

export default Editor;
