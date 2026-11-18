class NewPageAction extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  async connectedCallback() {
    if (this.shadowRoot.childElementCount) return;
    const base = new URL("./", import.meta.url);
    const [markup] = await Promise.all([
      fetch(new URL("new-page-action.html", base)).then(response => {
        if (!response.ok) throw new Error("Unable to load new page action markup.");
        return response.text();
      })
    ]);
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = new URL("new-page-action.css", base).href;
    const template = document.createElement("template");
    template.innerHTML = markup;
    this.shadowRoot.append(stylesheet, template.content.cloneNode(true));
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      window.open("about:blank", "_blank", "noopener");
    });
  }
}
if (!customElements.get("new-page-action")) customElements.define("new-page-action", NewPageAction);
