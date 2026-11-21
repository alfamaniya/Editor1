// #editor-state.js: فایل editor state مربوط به بخش core پروژه
import Document from "./document.js";

/**
 * EditorState
 * Holds the current document and the editor's text selection.
 *
 * Selection offsets use the same UTF-16 indexing as Document.
 * This module does not render UI, handle input, or apply transactions.
 */
export class EditorState {
  constructor(options = {}) {
    const {
      document = new Document(),
      selection = { anchor: 0, head: 0 }
    } = options;

    this._document = this._resolveDocument(document);
    this._selection = this._normalizeSelection(selection);
    this._version = 0;
  }

  get document() {
    return this._document;
  }

  get selection() {
    return { ...this._selection };
  }

  get version() {
    return this._version;
  }

  get text() {
    return this._document.getText();
  }

  get isEmpty() {
    return this._document.getLength() === 0;
  }

  setSelection(selection) {
    const nextSelection = this._normalizeSelection(selection);
    const changed =
      nextSelection.anchor !== this._selection.anchor ||
      nextSelection.head !== this._selection.head;

    if (changed) {
      this._selection = nextSelection;
      this._version += 1;
    }

    return {
      selection: this.selection,
      changed,
      version: this._version
    };
  }

  setDocument(document) {
    const nextDocument = this._resolveDocument(document);
    const changed = nextDocument !== this._document;

    if (changed) {
      this._document = nextDocument;
      this._selection = { anchor: 0, head: 0 };
      this._version += 1;
    }

    return {
      document: this._document,
      selection: this.selection,
      changed,
      version: this._version
    };
  }

  getSnapshot() {
    return {
      document: this._document,
      selection: this.selection,
      version: this._version,
      documentVersion: this._document.version
    };
  }

  _resolveDocument(value) {
    if (value instanceof Document) {
      return value;
    }

    if (typeof value === "string") {
      return new Document(value);
    }

    throw new TypeError(
      "EditorState document must be a Document instance or a string."
    );
  }

  _normalizeSelection(selection) {
    if (
      selection === null ||
      typeof selection !== "object" ||
      !Number.isInteger(selection.anchor) ||
      !Number.isInteger(selection.head)
    ) {
      throw new TypeError(
        "Selection must contain integer anchor and head offsets."
      );
    }

    const length = this._document.getLength();

    if (
      selection.anchor < 0 ||
      selection.anchor > length ||
      selection.head < 0 ||
      selection.head > length
    ) {
      throw new RangeError("Selection is outside the document.");
    }

    return {
      anchor: selection.anchor,
      head: selection.head
    };
  }
}

export default EditorState;
