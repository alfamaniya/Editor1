import KeyboardHandler from "./keyboard-handler.js";
import ClipboardHandler from "./clipboard-handler.js";

/**
 * InputController
 * Connects a host input element to the editor's keyboard and clipboard logic.
 * The element's visual presentation and text rendering belong to other modules.
 */
export class InputController {
  constructor(editor, options = {}) {
    if (!editor || typeof editor.transact !== "function") {
      throw new TypeError("InputController requires an Editor instance.");
    }

    this.editor = editor;
    this.keyboard = new KeyboardHandler(editor, options.keyboard);
    this.clipboard = new ClipboardHandler(editor);
    this.target = null;

    this._onKeyDown = (event) => this.keyboard.handleKeyDown(event);
    this._onBeforeInput = (event) => this.keyboard.handleBeforeInput(event);
    this._onCopy = (event) => this.clipboard.handleCopy(event);
    this._onCut = (event) => this.clipboard.handleCut(event);
    this._onPaste = (event) => this.clipboard.handlePaste(event);

    if (options.target) this.attach(options.target);
  }

  get isAttached() {
    return this.target !== null;
  }

  attach(target) {
    if (
      !target ||
      typeof target.addEventListener !== "function" ||
      typeof target.removeEventListener !== "function"
    ) {
      throw new TypeError("InputController target must support DOM event listeners.");
    }

    if (this.target === target) return this;
    if (this.target) this.detach();

    this.target = target;
    this.target.addEventListener("keydown", this._onKeyDown);
    this.target.addEventListener("beforeinput", this._onBeforeInput);
    this.target.addEventListener("copy", this._onCopy);
    this.target.addEventListener("cut", this._onCut);
    this.target.addEventListener("paste", this._onPaste);
    return this;
  }

  detach() {
    if (!this.target) return this;

    this.target.removeEventListener("keydown", this._onKeyDown);
    this.target.removeEventListener("beforeinput", this._onBeforeInput);
    this.target.removeEventListener("copy", this._onCopy);
    this.target.removeEventListener("cut", this._onCut);
    this.target.removeEventListener("paste", this._onPaste);
    this.target = null;
    return this;
  }

  destroy() {
    this.detach();
  }
}

export default InputController;
