import { loadCompletionCatalogs } from "./catalog-loader.js";

const rows = document.querySelector("#rows");
const count = document.querySelector("#count");
const updated = document.querySelector("#updated");
const search = document.querySelector("#search");
let catalogs = {};
let activeLanguage = "all";

function flattenCatalogs() {
  return Object.entries(catalogs).flatMap(([language, catalog]) =>
    catalog.records.map(record => ({ ...record, language: language.toUpperCase() }))
  );
}

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const all = flattenCatalogs();
  const filtered = all.filter(item => {
    const languageMatch = activeLanguage === "all" || item.language.toLowerCase() === activeLanguage;
    const text = [item.category, item.label, item.description, item.language, item.type].join(" ").toLocaleLowerCase();
    return languageMatch && text.includes(query);
  });
  count.textContent = String(filtered.length);
  rows.replaceChildren();
  if (!filtered.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4; td.className = "empty";
    const errors = Object.entries(catalogs).filter(([, data]) => data.error).map(([lang, data]) => lang.toUpperCase() + ": " + data.error);
    td.textContent = errors.length ? "بارگذاری ناموفق: " + errors.join(" | ") : "موردی پیدا نشد.";
    tr.append(td); rows.append(tr); return;
  }
  for (const item of filtered) {
    const tr = document.createElement("tr");
    for (const [value, className] of [[item.language,"language"],[item.category || item.type || "—",""],[item.label,"token"],[item.description || item.insertText || item.tagName || "—",""]]) {
      const td = document.createElement("td");
      td.textContent = value; if (className) td.className = className;
      tr.append(td);
    }
    rows.append(tr);
  }
}
document.querySelector(".language-tabs").addEventListener("click", event => {
  const button = event.target.closest("button[data-language]");
  if (!button) return;
  activeLanguage = button.dataset.language;
  document.querySelectorAll("[data-language]").forEach(item => item.setAttribute("aria-selected",String(item === button)));
  render();
});
search.addEventListener("input",render);

catalogs = await loadCompletionCatalogs();
const total = Object.values(catalogs).reduce((sum, item) => sum + item.records.length, 0);
const failed = Object.entries(catalogs).filter(([, item]) => item.error).map(([language]) => language.toUpperCase());
updated.textContent = failed.length ? "خطا در: " + failed.join(", ") : "دریافت مستقیم از JSON · " + total + " رکورد";
render();
