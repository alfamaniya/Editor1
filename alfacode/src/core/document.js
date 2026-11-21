// #document.js: فایل document مربوط به بخش core پروژه
/**
 * Document
 * Stores and manages the plain-text content of an editor document.
 *
 * Offsets use JavaScript string indexing (UTF-16 code units).
 * Line numbers and columns are 1-based.
 * All line endings are normalized to LF (\n).
 */
export class Document {
  constructor(initialText = "") {
    this._text = Document.normalizeText(initialText);
    this._version = 0;
  }

  static normalizeText(value) {
    if (typeof value !== "string") {
      throw new TypeError("Document content must be a string.");
    }

    return value.replace(/\r\n?/g, "\n");
  }

  get text() {
    return this._text;
  }

  get length() {
    return this._text.length;
  }

  get version() {
    return this._version;
  }

  get lineCount() {
    let count = 1;

    for (let index = 0; index < this._text.length; index += 1) {
      if (this._text[index] === "\n") count += 1;
    }

    return count;
  }

  getText() {
    return this._text;
  }

  getLength() {
    return this.length;
  }

  getLineCount() {
    return this.lineCount;
  }

  getLine(lineNumber) {
    const start = this.getLineStart(lineNumber);
    const end = this.getLineEnd(lineNumber);
    return this._text.slice(start, end);
  }

  getLineStart(lineNumber) {
    this._validateLineNumber(lineNumber);

    if (lineNumber === 1) return 0;

    let currentLine = 1;

    for (let index = 0; index < this._text.length; index += 1) {
      if (this._text[index] === "\n") {
        currentLine += 1;
        if (currentLine === lineNumber) return index + 1;
      }
    }

    throw new RangeError("Line number is outside the document.");
  }

  getLineEnd(lineNumber) {
    const start = this.getLineStart(lineNumber);
    const newlineIndex = this._text.indexOf("\n", start);

    return newlineIndex === -1 ? this._text.length : newlineIndex;
  }

  getPositionAt(offset) {
    this._validateOffset(offset);

    let line = 1;
    let lineStart = 0;

    for (let index = 0; index < offset; index += 1) {
      if (this._text[index] === "\n") {
        line += 1;
        lineStart = index + 1;
      }
    }

    return {
      line,
      column: offset - lineStart + 1
    };
  }

  getOffsetAt(lineNumber, column) {
    this._validateLineNumber(lineNumber);

    if (!Number.isInteger(column) || column < 1) {
      throw new RangeError("Column must be a positive integer.");
    }

    const start = this.getLineStart(lineNumber);
    const end = this.getLineEnd(lineNumber);
    const maximumColumn = end - start + 1;

    return start + Math.min(column - 1, maximumColumn - 1);
  }

  insert(offset, value) {
    return this.replace(offset, offset, value);
  }

  delete(from, to) {
    return this.replace(from, to, "");
  }

  replace(from, to, value) {
    this._validateRange(from, to);

    const insertedText = Document.normalizeText(value);
    const deletedText = this._text.slice(from, to);
    const nextText =
      this._text.slice(0, from) + insertedText + this._text.slice(to);
    const changed = nextText !== this._text;

    if (changed) {
      this._text = nextText;
      this._version += 1;
    }

    return {
      from,
      to: from + insertedText.length,
      oldTo: to,
      insertedText,
      deletedText,
      changed,
      version: this._version
    };
  }

  setText(value) {
    return this.replace(0, this._text.length, value);
  }

  _validateOffset(offset) {
    if (!Number.isInteger(offset) || offset < 0 || offset > this._text.length) {
      throw new RangeError("Offset is outside the document.");
    }
  }

  _validateRange(from, to) {
    this._validateOffset(from);
    this._validateOffset(to);

    if (from > to) {
      throw new RangeError("Range start cannot be greater than range end.");
    }
  }

  _validateLineNumber(lineNumber) {
    if (
      !Number.isInteger(lineNumber) ||
      lineNumber < 1 ||
      lineNumber > this.lineCount
    ) {
      throw new RangeError("Line number is outside the document.");
    }
  }
}

export default Document;
