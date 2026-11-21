// #suggestion-dispatcher.js: فایل suggestion dispatcher مربوط به بخش input پروژه
/**
 * Routes a completion through the menu that owns the selected option.
 * HTML uses tag-aware insertion; CSS and JavaScript insert plain text.
 */
export function applySuggestionForMenu(menu, option, menus = {}, handlers = {}) {
  if (!option) return false;
  let handler = null;
  if (menu && menu === menus.html) handler = handlers.html;
  else if (menu && (menu === menus.css || menu === menus.javascript)) handler = handlers.language;
  if (typeof handler !== "function") return false;
  handler(option);
  return true;
}
