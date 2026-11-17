import test from "node:test";
import assert from "node:assert/strict";

import Document from "../src/core/document.js";
import Editor from "../src/core/editor.js";
import Transaction from "../src/core/transaction.js";
import Selection from "../src/core/selection.js";
import History from "../src/core/history.js";

import KeyboardHandler from "../src/input/keyboard-handler.js";
import InputController from "../src/input/input-controller.js";

import LanguageManager from "../src/language/language-manager.js";
import Tokenizer from "../src/language/tokenizer.js";
import ParserManager from "../src/language/parser-manager.js";
import htmlLanguage from "../src/language/html/html-language.js";
import cssLanguage from "../src/language/css/css-language.js";
import javascriptLanguage from "../src/language/javascript/javascript-language.js";

import BracketMatcher from "../src/features/bracket-matching/bracket-matcher.js";
import ThemeManager from "../src/themes/theme-manager.js";

function fakeEventTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(callback);
    },
    removeEventListener(type, callback) {
      listeners.get(type)?.delete(callback);
    },
    dispatch(type, event) {
      for (const callback of listeners.get(type) ?? []) callback(event);
    },
    listenerCount() {
      return [...listeners.values()].reduce((count, set) => count + set.size, 0);
    }
  };
}

function fakeElement() {
  const classes = new Set();
  const attributes = new Map();
  return {
    classList: {
      add(value) { classes.add(value); },
      remove(value) { classes.delete(value); },
      contains(value) { return classes.has(value); }
    },
    setAttribute(name, value) { attributes.set(name, value); },
    removeAttribute(name) { attributes.delete(name); },
    getAttribute(name) { return attributes.get(name) ?? null; }
  };
}

function keyboardEvent(key, options = {}) {
  let prevented = false;
  return {
    key,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    isComposing: false,
    ...options,
    preventDefault() { prevented = true; },
    get defaultPrevented() { return prevented; }
  };
}

test("Document normalizes line endings and maps offsets", () => {
  const document = new Document("one\r\ntwo\rthree");
  assert.equal(document.text, "one\ntwo\nthree");
  assert.equal(document.getLineCount(), 3);
  assert.deepEqual(document.getPositionAt(5), { line: 2, column: 2 });
  assert.equal(document.getOffsetAt(3, 3), 10);
  assert.throws(() => document.getLine(4), RangeError);
});

test("Document preserves UTF-16 offset semantics", () => {
  const document = new Document("A😀B");
  assert.equal(document.length, 4);
  assert.deepEqual(document.getPositionAt(3), { line: 1, column: 4 });
});

test("Selection supports forward, backward and validated ranges", () => {
  const selection = new Selection({ anchor: 5, head: 2 }, 8);
  assert.equal(selection.from, 2);
  assert.equal(selection.to, 5);
  assert.equal(selection.direction, "backward");
  selection.selectAll(8);
  assert.equal(selection.to, 8);
  assert.throws(() => selection.moveTo(9), RangeError);
});

test("Transaction applies ordered steps atomically", () => {
  const document = new Document("abcd");
  const transaction = new Transaction()
    .insert(1, "X")
    .replace(2, 4, "YZ");
  const result = transaction.apply(document);
  assert.equal(result.text, "aXYZd");
  assert.equal(result.changes.length, 2);
  assert.equal(transaction.isApplied, true);
  assert.throws(() => transaction.apply(document), /only be applied once/);
});

test("Transaction does not mutate document after an invalid later step", () => {
  const document = new Document("abc");
  const transaction = new Transaction().insert(1, "X").delete(0, 99);
  assert.throws(() => transaction.apply(document), RangeError);
  assert.equal(document.text, "abc");
  assert.equal(document.version, 0);
});

test("History undo, redo and redo-branch invalidation", () => {
  const document = new Document("a");
  const history = new History();
  history.execute(new Transaction().insert(1, "b"), document);
  assert.equal(document.text, "ab");
  history.undo(document);
  assert.equal(document.text, "a");
  history.redo(document);
  assert.equal(document.text, "ab");
  history.undo(document);
  history.execute(new Transaction().insert(1, "c"), document);
  assert.equal(document.text, "ac");
  assert.equal(history.canRedo, false);
});

test("History refuses to overwrite changes made outside its control", () => {
  const document = new Document("a");
  const history = new History();
  history.execute(new Transaction().insert(1, "b"), document);
  document.insert(0, "external");
  assert.throws(() => history.undo(document), /outside this history/);
});

test("Editor coordinates transactions, selection and document replacement", () => {
  const editor = new Editor({ text: "hello" });
  editor.setSelection({ anchor: 1, head: 4 });
  editor.transact(transaction => transaction.replace(1, 4, "i"));
  assert.equal(editor.text, "hio");
  assert.equal(editor.selection.head, 3);
  assert.equal(editor.canUndo, true);
  editor.undo();
  assert.equal(editor.text, "hello");
  editor.setDocument("new");
  assert.deepEqual(editor.selection, {
    anchor: 0, head: 0, from: 0, to: 0,
    isEmpty: true, isBackward: false, direction: "none", documentLength: 3
  });
  assert.equal(editor.canUndo, false);
});

test("KeyboardHandler inserts text, navigates and deletes full Unicode code points", () => {
  const editor = new Editor({ text: "A😀B" });
  const keyboard = new KeyboardHandler(editor);
  editor.moveTo(3);
  const backspace = keyboardEvent("Backspace");
  assert.equal(keyboard.handleKeyDown(backspace), true);
  assert.equal(editor.text, "AB");
  assert.equal(editor.selection.head, 1);
  const insert = keyboardEvent("x");
  keyboard.handleKeyDown(insert);
  assert.equal(editor.text, "AxB");
  assert.equal(insert.defaultPrevented, true);
});

test("KeyboardHandler deletes the complete selected range with Backspace and Delete", () => {
  for (const key of ["Backspace", "Delete"]) {
    const editor = new Editor({ text: "hello world" });
    const keyboard = new KeyboardHandler(editor);
    editor.setSelection({ anchor: 1, head: 4 });
    assert.equal(keyboard.handleKeyDown(keyboardEvent(key)), true);
    assert.equal(editor.text, "ho world");
    assert.equal(editor.selection.head, 1);
  }

  const editor = new Editor({ text: "hello world" });
  const keyboard = new KeyboardHandler(editor);
  editor.setSelection({ anchor: 1, head: 4 });
  const beforeInput = { inputType: "deleteContentBackward", isComposing: false, preventDefault() { this.defaultPrevented = true; } };
  assert.equal(keyboard.handleBeforeInput(beforeInput), true);
  assert.equal(editor.text, "ho world");
  assert.equal(beforeInput.defaultPrevented, true);
});

test("KeyboardHandler ignores composing input and supports beforeinput", () => {
  const editor = new Editor({ text: "" });
  const keyboard = new KeyboardHandler(editor);
  assert.equal(keyboard.handleKeyDown(keyboardEvent("あ", { isComposing: true })), false);
  const event = {
    inputType: "insertText",
    data: "سلام",
    isComposing: false,
    preventDefault() { this.defaultPrevented = true; }
  };
  assert.equal(keyboard.handleBeforeInput(event), true);
  assert.equal(editor.text, "سلام");
  assert.equal(event.defaultPrevented, true);
});

test("InputController attaches once, replaces targets and detaches listeners", () => {
  const editor = new Editor({ text: "" });
  const first = fakeEventTarget();
  const second = fakeEventTarget();
  const controller = new InputController(editor, { target: first });
  assert.equal(first.listenerCount(), 5);
  controller.attach(first);
  assert.equal(first.listenerCount(), 5);
  controller.attach(second);
  assert.equal(first.listenerCount(), 0);
  assert.equal(second.listenerCount(), 5);
  second.dispatch("keydown", keyboardEvent("z"));
  assert.equal(editor.text, "z");
  controller.destroy();
  assert.equal(second.listenerCount(), 0);
  assert.equal(controller.isAttached, false);
});

test("LanguageManager resolves ids, aliases and file extensions", () => {
  const manager = new LanguageManager();
  manager.register(htmlLanguage);
  manager.register(cssLanguage);
  manager.register(javascriptLanguage);
  assert.equal(manager.get("HTM").id, "html");
  assert.equal(manager.get(".css").id, "css");
  assert.equal(manager.detectFromFilename("src/app.min.js").id, "javascript");
  assert.throws(() => manager.register(htmlLanguage), /already registered/);
  assert.equal(manager.unregister("xhtml"), true);
  assert.equal(manager.get("html"), null);
});

test("Tokenizer validates and freezes normalized tokens", () => {
  const tokenizer = new Tokenizer();
  const language = {
    id: "sample",
    tokenize() { return [{ type: "word", start: 0, end: 3 }]; }
  };
  const [token] = tokenizer.tokenize(language, "abc");
  assert.equal(token.value, "abc");
  assert.equal(Object.isFrozen(token), true);
  assert.throws(() => tokenizer.tokenize({
    id: "bad",
    tokenize() { return [{ type: "x", start: 2, end: 1 }]; }
  }, "abc"), RangeError);
});

test("ParserManager normalizes source and forwards language context", () => {
  const manager = new ParserManager();
  manager.register("demo", {
    parse(text, context) { return { text, languageId: context.languageId }; }
  });
  assert.deepEqual(manager.parse("DEMO", "a\r\nb"), {
    text: "a\nb", languageId: "demo"
  });
  assert.throws(() => manager.parse("missing", ""), /No parser is registered/);
});

test("HTML, CSS and JavaScript language modules tokenize and parse representative code", () => {
  const samples = [
    [htmlLanguage, "<main class=\"x\">Hi</main>", "HTMLDocument"],
    [cssLanguage, ".box { color: red; }", "Stylesheet"],
    [javascriptLanguage, "const answer = 42;", "Program"]
  ];
  for (const [language, source, expectedType] of samples) {
    const tokens = language.tokenize(source);
    const parsed = language.parser.parse(source);
    assert.ok(tokens.length > 0, language.id + " should produce tokens");
    assert.equal(parsed.type, expectedType);
    assert.equal(parsed.sourceLength, source.length);
    assert.ok(Array.isArray(parsed.errors));
  }
});

test("BracketMatcher handles nesting and ignores brackets inside comments and strings", () => {
  const matcher = new BracketMatcher();
  const source = 'call(")", /* ] */ [value])';
  const stringStart = source.indexOf('"');
  const stringEnd = source.indexOf('"', stringStart + 1) + 1;
  const commentStart = source.indexOf("/*");
  const commentEnd = source.indexOf("*/", commentStart) + 2;
  const tokens = [
    { type: "string", start: stringStart, end: stringEnd },
    { type: "comment", start: commentStart, end: commentEnd }
  ];
  const matches = matcher.findAll(source, tokens);
  assert.equal(matches.length, 2);
  assert.deepEqual(matcher.findMatch(source, 4, tokens), {
    from: 4, to: source.length - 1, open: 4, close: source.length - 1,
    opening: "(", closing: ")"
  });
  assert.equal(matcher.findMatch("([)]", 1), null);
});

test("ThemeManager switches themes on an explicit root and protects active theme", () => {
  const root = fakeElement();
  const manager = new ThemeManager({ rootElement: root });
  assert.equal(manager.activeThemeId, "dark");
  assert.equal(root.classList.contains("alfacode-theme-dark"), true);
  manager.setTheme("light");
  assert.equal(root.classList.contains("alfacode-theme-dark"), false);
  assert.equal(root.classList.contains("alfacode-theme-light"), true);
  assert.equal(root.getAttribute("data-alfacode-theme"), "light");
  assert.throws(() => manager.unregister("light"), /active theme/);
  manager.clear();
  assert.equal(root.getAttribute("data-alfacode-theme"), null);
  assert.equal(manager.activeThemeId, null);
});

test("ThemeManager validates custom themes and rejects unknown ids", () => {
  const manager = new ThemeManager();
  manager.register({ id: "contrast", label: "High contrast" });
  assert.equal(manager.get("contrast").className, "alfacode-theme-contrast");
  assert.throws(() => manager.setTheme("unknown"), RangeError);
  assert.throws(() => manager.register({ id: "bad id" }), TypeError);
});
