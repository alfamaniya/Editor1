class ProjectResetAction extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  async connectedCallback() {
    if (this.shadowRoot.childElementCount) return;
    const embedded = window.__ALFACODE_ACTION_ASSETS__?.["project-reset"];
    let markup;
    let css;
    if (embedded) {
      ({ html: markup, css } = embedded);
    } else {
      const scriptUrl = document.querySelector('script[type="module"][src*="project-reset.js"]')?.src || window.location.href;
      const base = new URL("./", scriptUrl);
      [markup, css] = await Promise.all([
        fetch(new URL("project-reset.html", base)).then(r => { if (!r.ok) throw new Error("Unable to load project-reset markup."); return r.text(); }),
        fetch(new URL("project-reset.css", base)).then(r => { if (!r.ok) throw new Error("Unable to load project-reset styles."); return r.text(); })
      ]);
    }
    const style = document.createElement("style"); style.textContent = css;
    const template = document.createElement("template"); template.innerHTML = markup;
    this.shadowRoot.append(style, template.content.cloneNode(true));
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      if (!window.confirm("Reset the entire project to the original AlfaCode starter example? Your current code will be replaced.")) return;
      document.dispatchEvent(new CustomEvent("alfacode:header-action", { detail: { action: "project-reset" } }));
    });
  }
}
if (!customElements.get("project-reset-action")) customElements.define("project-reset-action", ProjectResetAction);