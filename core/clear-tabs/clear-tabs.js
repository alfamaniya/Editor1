class ClearTabsAction extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  async connectedCallback() {
    if (this.shadowRoot.childElementCount) return;
    const embedded = window.__ALFACODE_ACTION_ASSETS__?.["clear-tabs"];
    let markup;
    let css;
    if (embedded) {
      ({ html: markup, css } = embedded);
    } else {
      const scriptUrl = document.querySelector('script[type="module"][src*="clear-tabs.js"]')?.src || window.location.href;
      const base = new URL("./", scriptUrl);
      [markup, css] = await Promise.all([
        fetch(new URL("clear-tabs.html", base)).then(r => { if (!r.ok) throw new Error("Unable to load clear-tabs markup."); return r.text(); }),
        fetch(new URL("clear-tabs.css", base)).then(r => { if (!r.ok) throw new Error("Unable to load clear-tabs styles."); return r.text(); })
      ]);
    }
    const style = document.createElement("style"); style.textContent = css;
    const template = document.createElement("template"); template.innerHTML = markup;
    this.shadowRoot.append(style, template.content.cloneNode(true));
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      if (!window.confirm("Clear the contents of all HTML, CSS, and JavaScript tabs? This cannot be undone.")) return;
      document.dispatchEvent(new CustomEvent("alfacode:header-action", { detail: { action: "clear-tabs" } }));
    });
  }
}
if (!customElements.get("clear-tabs-action")) customElements.define("clear-tabs-action", ClearTabsAction);