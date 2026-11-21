// #clear-tabs.js: فایل clear tabs مربوط به بخش clear tabs پروژه
class ClearTabsAction extends HTMLElement {
  async connectedCallback() {
    if (this.querySelector("button")) return;
    const embedded = window.__ALFACODE_ACTION_ASSETS__?.["clear-tabs"];
    let markup;
    if (embedded) {
      markup = embedded.html;
    } else {
      const scriptUrl = document.querySelector('script[type="module"][src*="clear-tabs.js"]')?.src || window.location.href;
      const base = new URL("./", scriptUrl);
      markup = await fetch(new URL("clear-tabs.html", base)).then(r => {
        if (!r.ok) throw new Error("Unable to load clear-tabs markup.");
        return r.text();
      });
    }
    const template = document.createElement("template");
    template.innerHTML = markup;
    this.append(template.content.cloneNode(true));
    this.querySelector("button")?.addEventListener("click", () => {
      if (!window.confirm("Clear the contents of all HTML, CSS, and JavaScript tabs? This cannot be undone.")) return;
      document.dispatchEvent(new CustomEvent("alfacode:header-action", { detail: { action: "clear-tabs" } }));
    });
  }
}
if (!customElements.get("clear-tabs-action")) customElements.define("clear-tabs-action", ClearTabsAction);
