import { loadCompletionCatalogs } from "./catalog-loader.js";
import { createBlankRecord, parseCatalogImport, validateCatalogDraft, serializeCatalog } from "./catalog-manager.js";


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

loadCompletionCatalogs().then(loadedCatalogs => {
catalogs = loadedCatalogs;
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
});


const manager = {
  language: document.querySelector("#draft-language"),
  bulk: document.querySelector("#bulk-import"),
  status: document.querySelector("#manager-status"),
  list: document.querySelector("#draft-records"),
  editor: document.querySelector("#record-json"),
  errors: document.querySelector("#manager-errors"),
  records: [],
  selected: -1,
  version: 1
};
const draftStorageKey = "alfacode.catalog.drafts.v1";
function managerMessage(message, isError = false) {
  manager.status.textContent = message;
  manager.status.dataset.state = isError ? "error" : "ok";
}
function renderDraftRecords() {
  manager.list.replaceChildren();
  manager.records.forEach((record, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "draft-record" + (manager.selected === index ? " selected" : "");
    button.textContent = (index + 1) + ". " + (record.label || "(بدون عنوان)") + " · " + (record.id || "بدون شناسه");
    button.addEventListener("click", () => {
      manager.selected = index;
      manager.editor.value = JSON.stringify(record, null, 2);
      renderDraftRecords();
    });
    manager.list.append(button);
  });
}
function validateDraftNow() {
  const errors = validateCatalogDraft(manager.language.value, manager.records);
  manager.errors.replaceChildren();
  for (const error of errors) {
    const item = document.createElement("li");
    item.textContent = (error.index >= 0 ? "رکورد " + (error.index + 1) + " · " : "") + error.field + ": " + error.message;
    manager.errors.append(item);
  }
  managerMessage(errors.length ? errors.length + " خطا پیدا شد؛ انتشار مجاز نیست." : "اعتبارسنجی پیش‌نویس موفق بود.", errors.length > 0);
  return errors.length === 0;
}
function downloadDraft() {
  if (!validateDraftNow()) return;
  const catalog = serializeCatalog(manager.language.value, manager.version, manager.records);
  const blob = new Blob([catalog], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "completions." + manager.language.value + ".json";
  anchor.click();
  URL.revokeObjectURL(url);
}
function loadDraftLanguage() {
  const language = manager.language.value;
  manager.records = (catalogs[language]?.records ?? []).map(record => ({ ...record }));
  manager.version = catalogs[language]?.catalogVersion ?? 1;
  manager.selected = -1;
  manager.editor.value = "";
  renderDraftRecords();
  manager.errors.replaceChildren();
  managerMessage("پیش‌نویس " + language.toUpperCase() + " بارگذاری شد؛ فایل اصلی دست‌نخورده است.");
}
document.querySelector("#draft-language")?.addEventListener("change", loadDraftLanguage);
document.querySelector("#import-draft")?.addEventListener("click", () => {
  try {
    const imported = parseCatalogImport(manager.bulk.value, manager.language.value);
    manager.records = manager.records.concat(imported);
    manager.selected = -1;
    renderDraftRecords();
    validateDraftNow();
    managerMessage(imported.length + " رکورد به پیش‌نویس اضافه شد. فایل اصلی تغییر نکرده است.");
  } catch (error) { managerMessage(error.message, true); }
});
document.querySelector("#add-draft")?.addEventListener("click", () => {
  manager.records.push(createBlankRecord(manager.language.value, manager.records.length + 1));
  manager.selected = manager.records.length - 1;
  manager.editor.value = JSON.stringify(manager.records[manager.selected], null, 2);
  renderDraftRecords();
});
document.querySelector("#validate-draft")?.addEventListener("click", validateDraftNow);
document.querySelector("#export-draft")?.addEventListener("click", downloadDraft);
document.querySelector("#save-record")?.addEventListener("click", () => {
  try {
    if (manager.selected < 0) throw new Error("ابتدا یک رکورد از فهرست انتخاب کنید.");
    const record = JSON.parse(manager.editor.value);
    manager.records[manager.selected] = record;
    renderDraftRecords();
    validateDraftNow();
  } catch (error) { managerMessage("ویرایش ذخیره نشد: " + error.message, true); }
});
document.querySelector("#delete-record")?.addEventListener("click", () => {
  if (manager.selected < 0) { managerMessage("ابتدا یک رکورد انتخاب کنید.", true); return; }
  manager.records.splice(manager.selected, 1);
  manager.selected = -1;
  manager.editor.value = "";
  renderDraftRecords();
  validateDraftNow();
});
document.querySelector("#save-draft")?.addEventListener("click", () => {
  try {
    const stored = JSON.parse(localStorage.getItem(draftStorageKey) || "{}");
    stored[manager.language.value] = { version: manager.version, records: manager.records };
    localStorage.setItem(draftStorageKey, JSON.stringify(stored));
    managerMessage("پیش‌نویس فقط در همین مرورگر ذخیره شد؛ هنوز منتشر نشده است.");
  } catch (error) { managerMessage("ذخیره محلی ناموفق بود: " + error.message, true); }
});
document.querySelector("#discard-draft")?.addEventListener("click", loadDraftLanguage);
loadCompletionCatalogs().then(loadedCatalogs => {
  catalogs = loadedCatalogs;
  loadDraftLanguage();
});
