// Stable HTML completion inputs for shadow comparisons.
// This file contains fixtures only; it does not execute either completion engine.
const atEnd = (id, context, source, extra = {}) => ({
  id,
  context,
  source,
  cursor: source.length,
  ...extra
});

export const htmlCompletionFixtures = [
  atEnd("root-empty", "root", "<"),
  atEnd("root-html-present", "root", "<html><"),
  atEnd("root-head-body", "root", "<html><head></head><body><"),
  atEnd("body-empty", "body", "<body><"),
  atEnd("body-prefix", "body", "<body><di"),
  atEnd("head-empty", "head", "<html><head><"),
  atEnd("head-prefix-meta", "head", "<html><head><me"),
  atEnd("p-phrasing", "p", "<body><p><"),
  atEnd("list-ul", "list", "<ul><"),
  atEnd("list-ol", "list", "<ol><"),
  atEnd("list-menu", "list", "<menu><"),
  atEnd("definition-list", "dl", "<dl><"),
  atEnd("table-root", "table", "<table><"),
  atEnd("table-section-row", "table-row", "<table><tbody><tr><"),
  atEnd("table-head-row", "table-row", "<table><thead><tr><"),
  atEnd("select", "select", "<select><"),
  atEnd("select-optgroup", "select", "<select><optgroup><"),
  atEnd("svg-root", "svg", "<svg><"),
  atEnd("svg-child", "svg", "<svg><g><"),
  atEnd("closing-nested", "close", "<main><section><div></"),
  atEnd("chain-existing-close", "chain", "<div></div>", { cursor: 5 }),
  atEnd("void-tag", "body", "<body><im"),
  atEnd("duplicate-structural-tag", "body", "<body><div><div><"),
  atEnd("inside-comment", "suppressed", "<!-- <di"),
  atEnd("inside-attribute", "suppressed", '<div title="<di'),
  atEnd("script-raw-text", "suppressed", "<script>const sample = '<di"),
  atEnd("style-raw-text", "suppressed", "<style>.box { content: '<di'),
  atEnd("incomplete-open-tag", "body", "<body><div"),
  atEnd("cursor-at-start", "root", "<body>", { cursor: 0 }),
  atEnd("cursor-before-prefix-end", "body", "<body><div>", { cursor: 8 }),
  atEnd("empty-prefix", "body", "<body><"),
  atEnd("multichar-prefix", "body", "<body><sec")
];

export default htmlCompletionFixtures;
