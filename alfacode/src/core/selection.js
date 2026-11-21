// #selection.js: فایل selection مربوط به بخش core پروژه
/**
 * Selection
 * Manages a text selection independently from the editor UI.
 *
 * Offsets are zero-based JavaScript string offsets (UTF-16 code units).
 * The anchor is the fixed end of a selection; the head is the moving end.
 */
export class Selection {
  constructor(selection = { anchor: 0, head: 0 }, documentLength = 0) {
    this._documentLength = Selection._validateLength(documentLength);
    this._range = this._normalize(selection, this._documentLength);
  }

  static _validateLength(length) {
    if (!Number.isInteger(length) || length < 0) {
      throw new RangeError("Document length must be a non-negative integer.");
    }
    return length;
  }

  _normalize(selection, documentLength) {
    if (
      selection === null ||
      typeof selection !== "object" ||
      !Number.isInteger(selection.anchor) ||
      !Number.isInteger(selection.head)
    ) {
      throw new TypeError("Selection must contain integer anchor and head offsets.");
    }

    if (
      selection.anchor < 0 ||
      selection.head < 0 ||
      selection.anchor > documentLength ||
      selection.head > documentLength
    ) {
      throw new RangeError("Selection is outside the document.");
    }

    return { anchor: selection.anchor, head: selection.head };
  }

  get anchor() { return this._range.anchor; }
  get head() { return this._range.head; }
  get from() { return Math.min(this.anchor, this.head); }
  get to() { return Math.max(this.anchor, this.head); }
  get isEmpty() { return this.anchor === this.head; }
  get isBackward() { return this.head < this.anchor; }
  get direction() {
    if (this.isEmpty) return "none";
    return this.isBackward ? "backward" : "forward";
  }
  get documentLength() { return this._documentLength; }

  set(selection, documentLength = this._documentLength) {
    const nextLength = Selection._validateLength(documentLength);
    const nextRange = this._normalize(selection, nextLength);
    const changed =
      nextRange.anchor !== this.anchor ||
      nextRange.head !== this.head ||
      nextLength !== this._documentLength;

    this._range = nextRange;
    this._documentLength = nextLength;
    return { selection: this.getSnapshot(), changed };
  }

  collapse(to = "head", documentLength = this._documentLength) {
    if (!["anchor", "head", "start", "end"].includes(to)) {
      throw new TypeError('Collapse target must be "anchor", "head", "start", or "end".');
    }
    const offset =
      to === "anchor" ? this.anchor :
      to === "start" ? this.from :
      to === "end" ? this.to : this.head;
    return this.set({ anchor: offset, head: offset }, documentLength);
  }

  extendTo(offset, documentLength = this._documentLength) {
    return this.set({ anchor: this.anchor, head: offset }, documentLength);
  }

  moveTo(offset, documentLength = this._documentLength) {
    return this.set({ anchor: offset, head: offset }, documentLength);
  }

  selectAll(documentLength = this._documentLength) {
    const length = Selection._validateLength(documentLength);
    return this.set({ anchor: 0, head: length }, length);
  }

  clear(documentLength = this._documentLength) {
    return this.moveTo(0, documentLength);
  }

  getSnapshot() {
    return {
      anchor: this.anchor,
      head: this.head,
      from: this.from,
      to: this.to,
      isEmpty: this.isEmpty,
      isBackward: this.isBackward,
      direction: this.direction,
      documentLength: this._documentLength
    };
  }
}

export default Selection;
