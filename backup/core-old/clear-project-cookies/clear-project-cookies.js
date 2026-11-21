// #clear-project-cookies.js: فایل clear project cookies مربوط به بخش clear project cookies پروژه
class ClearProjectCookiesAction extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  async connectedCallback() {
    if (this.shadowRoot.childElementCount) return;
    const embedded = window.__ALFACODE_ACTION_ASSETS__?.["clear-project-cookies"];
    let markup;
    let css;
    if (embedded) {
      ({ html: markup, css } = embedded);
    } else {
      const scriptUrl = document.querySelector('script[type="module"][src*="clear-project-cookies.js"]')?.src || window.location.href;
      const base = new URL("./", scriptUrl);
      [markup, css] = await Promise.all([
        fetch(new URL("clear-project-cookies.html", base)).then(r => { if (!r.ok) throw new Error("Unable to load browser-data markup."); return r.text(); }),
        fetch(new URL("clear-project-cookies.css", base)).then(r => { if (!r.ok) throw new Error("Unable to load browser-data styles."); return r.text(); })
      ]);
    }
    const style = document.createElement("style"); style.textContent = css;
    const template = document.createElement("template"); template.innerHTML = markup;
    this.shadowRoot.append(style, template.content.cloneNode(true));
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      if (!window.confirm("Clear cookies and saved AlfaCode project data for this website only? Other websites will not be affected. The editor will reload with the starter example.")) return;
      document.dispatchEvent(new CustomEvent("alfacode:header-action", { detail: { action: "clear-project-cookies" } }));
    });
  }
}
if (!customElements.get("clear-project-cookies-action")) customElements.define("clear-project-cookies-action", ClearProjectCookiesAction);