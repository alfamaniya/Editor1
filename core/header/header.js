class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    if (this.shadowRoot.childElementCount) return;
    const base = new URL("./", import.meta.url);
    const [markup] = await Promise.all([
      fetch(new URL("header.html", base)).then(response => {
        if (!response.ok) throw new Error("Unable to load header markup.");
        return response.text();
      })
    ]);
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = new URL("header.css", base).href;
    this.shadowRoot.append(stylesheet);
    const template = document.createElement("template");
    template.innerHTML = markup;
    this.shadowRoot.append(template.content.cloneNode(true));
  }
}

if (!customElements.get("app-header")) {
  customElements.define("app-header", AppHeader);
}
