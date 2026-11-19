import { loadCompletionCatalogs } from "./catalog-loader.js";

const backLink = document.querySelector(".back-link");
backLink?.addEventListener("click", event => {
  event.preventDefault();
  window.close();
});

const rows = document.querySelector("#rows");
const head = document.querySelector("#columns");
const count = document.querySelector("#count");
const updated = document.querySelector("#updated");
const search = document.querySelector("#search");
const errorsBox = document.querySelector("#load-errors");
let catalogs = {};
let activeLanguage = "all";
let sortKey = "";
let sortDirection = 1;
let columns = [];

function flattenCatalogs() {
  return Object.entries(catalogs).flatMap(([language, catalog]) =>
    catalog.records.map(record => ({ ...record, language: language.toUpperCase() }))
  );
}

function getDisplayValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function rebuildColumns(records) {
  const preferred = ["language", "id", "type", "category", "label", "description"];
  const keys = new Set(records.flatMap(record => Object.keys(record)));
  columns = [
    ...preferred.filter(key => keys.has(key)),
    ...[...keys].filter(key => !preferred.includes(key)).sort()
  ];
  head.replaceChildren();
  const tr = document.createElement("tr");
  for (const key of columns) {
    const th = document.createElement("th");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sort-button";
    button.dataset.sort = key;
    button.textContent = key + (sortKey === key ? (sortDirection === 1 ? " ▲" : " ▼") : "");
    button.title = "مرتب‌سازی بر اساس " + key;
    th.append(button);
    tr.append(th);
  }
  head.append(tr);
}

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const all = flattenCatalogs();
  const filtered = all.filter(item => {
    const languageMatch = activeLanguage === "all" || item.language.toLowerCase() === activeLanguage;
    const searchable = columns.map(key => getDisplayValue(item[key])).join(" ").toLocaleLowerCase();
    return languageMatch && searchable.includes(query);
  });
  if (!columns.length) rebuildColumns(all);
  const sorted = sortKey ? [...filtered].sort((a, b) => {
    const av = getDisplayValue(a[sortKey]);
    const bv = getDisplayValue(b[sortKey]);
    return av.localeCompare(bv, undefined, { numeric: true, sensitivity: "base" }) * sortDirection;
  }) : filtered;
  count.textContent = String(sorted.length);
  rows.replaceChildren();
  if (!sorted.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = Math.max(columns.length, 1);
    td.className = "empty";
    td.textContent = "موردی پیدا نشد.";
    tr.append(td);
    rows.append(tr);
    return;
  }
  for (const item of sorted) {
    const tr = document.createElement("tr");
    for (const key of columns) {
      const td = document.createElement("td");
      const value = item[key];
      td.textContent = getDisplayValue(value);
      if (typeof value === "object" && value !== null) td.classList.add("json-cell");
      if (["id", "label", "insertText", "tagName"].includes(key)) td.classList.add("token");
      if (key === "enabled") td.classList.add(value === false ? "disabled-value" : "enabled-value");
      tr.append(td);
    }
    rows.append(tr);
  }
}

head.addEventListener("click", event => {
  const button = event.target.closest("button[data-sort]");
  if (!button) return;
  const key = button.dataset.sort;
  sortDirection = sortKey === key ? -sortDirection : 1;
  sortKey = key;
  render();
});
document.querySelector(".language-tabs").addEventListener("click", event => {
  const button = event.target.closest("button[data-language]");
  if (!button) return;
  activeLanguage = button.dataset.language;
  document.querySelectorAll(".language-tabs button[data-language]").forEach(item =>
    item.setAttribute("aria-selected", String(item === button))
  );
  render();
});
search.addEventListener("input", render);

catalogs = await loadCompletionCatalogs();
const allRecords = flattenCatalogs();
rebuildColumns(allRecords);
const total = Object.values(catalogs).reduce((sum, item) => sum + item.records.length, 0);
const languageCounts = ["HTML", "CSS", "JavaScript"].map(name => {
  const key = name.toLowerCase();
  return name + ": " + (catalogs[key]?.records.length ?? 0);
});
const failed = Object.entries(catalogs).filter(([, item]) => item.error);
updated.textContent = languageCounts.join(" · ") + " · مجموع فعال: " + total + " · " + columns.length + " فیلد";
if (errorsBox) {
  errorsBox.hidden = failed.length === 0;
  errorsBox.textContent = failed.length
    ? "خطا در دریافت برخی فایل‌ها: " + failed.map(([language, item]) => language.toUpperCase() + " (" + item.error + ")").join(" | ")
    : "";
}
render();
