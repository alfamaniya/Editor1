// #transaction.js: فایل transaction مربوط به بخش core پروژه
import Document from "./document.js";

/**
 * Transaction
 * Describes an ordered, atomic set of text changes for a Document.
 *
 * Each step's offsets are interpreted against the document produced by
 * the preceding steps in this transaction. Offsets use UTF-16 code units.
 */
export class Transaction {
  constructor() {
    this._steps = [];
    this._applied = false;
  }

  get steps() {
    return this._steps.map((step) => ({ ...step }));
  }

  get isEmpty() {
    return this._steps.length === 0;
  }

  get isApplied() {
    return this._applied;
  }

  insert(offset, text) {
    return this._addStep("insert", offset, offset, text);
  }

  delete(from, to) {
    return this._addStep("delete", from, to, "");
  }

  replace(from, to, text) {
    return this._addStep("replace", from, to, text);
  }

  _addStep(type, from, to, text) {
    if (this._applied) {
      throw new Error("An applied transaction cannot be modified.");
    }
    if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < from) {
      throw new RangeError("Transaction offsets must be valid non-negative integers.");
    }
    if (typeof text !== "string") {
      throw new TypeError("Transaction text must be a string.");
    }

    this._steps.push({
      type,
      from,
      to,
      text: Document.normalizeText(text)
    });
    return this;
  }

  apply(document) {
    if (!(document instanceof Document)) {
      throw new TypeError("Transaction.apply requires a Document instance.");
    }
    if (this._applied) {
      throw new Error("A transaction can only be applied once.");
    }

    // Validate and calculate every step before mutating the real document.
    let nextText = document.getText();
    const changes = [];

    for (const step of this._steps) {
      if (step.from > nextText.length || step.to > nextText.length) {
        throw new RangeError("Transaction range is outside the current document.");
      }

      const deletedText = nextText.slice(step.from, step.to);
      const updatedText =
        nextText.slice(0, step.from) + step.text + nextText.slice(step.to);

      changes.push({
        type: step.type,
        from: step.from,
        oldTo: step.to,
        to: step.from + step.text.length,
        insertedText: step.text,
        deletedText,
        changed: updatedText !== nextText
      });

      nextText = updatedText;
    }

    const initialVersion = document.version;
    const documentChange = document.setText(nextText);
    this._applied = true;

    return {
      changed: documentChange.changed,
      changes,
      document,
      previousVersion: initialVersion,
      version: document.version,
      text: document.getText()
    };
  }

  getSnapshot() {
    return {
      steps: this.steps,
      isEmpty: this.isEmpty,
      isApplied: this.isApplied
    };
  }
}

export default Transaction;
