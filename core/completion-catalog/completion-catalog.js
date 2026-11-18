import { getHTMLCompletionCatalog } from "../../alfacode/src/language/html/html-completion.js";
import { getCSSCompletionCatalog } from "../../alfacode/src/language/css/css-completion.js";
import { getJavaScriptCompletionCatalog } from "../../alfacode/src/language/javascript/javascript-completion.js";

const catalog = [
  ...getHTMLCompletionCatalog().map(item => ({language:"HTML",...item})),
  ...getCSSCompletionCatalog().map(item => ({language:"CSS",...item})),
  ...getJavaScriptCompletionCatalog().map(item => ({language:"JavaScript",...item}))
];
const rows = document.querySelector("#rows");
const count = document.querySelector("#count");
const updated = document.querySelector("#updated");
const search = document.querySelector("#search");
let activeLanguage = "all";

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const filtered = catalog.filter(item => {
    const languageMatch = activeLanguage === "all" || item.language.toLowerCase() === activeLanguage;
    const text = [item.category,item.label,item.description,item.language].join(" ").toLocaleLowerCase();
    return languageMatch && text.includes(query);
  });
  count.textContent = String(filtered.length);
  rows.replaceChildren();
  if (!filtered.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4; td.className = "empty"; td.textContent = "موردی پیدا نشد.";
    tr.append(td); rows.append(tr); return;
  }
  for (const item of filtered) {
    const tr = document.createElement("tr");
    for (const [value,className] of [[item.language,"language"],[item.category,""],[item.label,"token"],[item.description || "—",""]]) {
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
updated.textContent = "منبع: موتورهای تکمیل خودکار";
render();
