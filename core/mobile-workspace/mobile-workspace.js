// Touch-first workspace navigation for narrow viewports.
class MobileWorkspace extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    if (this.shadowRoot.childElementCount) return;
    const base = new URL("./", import.meta.url);
    const response = await fetch(new URL("mobile-workspace.html", base));
    if (!response.ok) throw new Error("Unable to load mobile workspace controls.");
    const template = document.createElement("template");
    template.innerHTML = await response.text();
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = new URL("mobile-workspace.css", base).href;
    this.shadowRoot.append(stylesheet, template.content.cloneNode(true));

    this.shadowRoot.addEventListener("click", event => {
      const button = event.target.closest("button[data-view]");
      if (!button) return;
      this.setView(button.dataset.view);
    });

    this.setView(document.body.dataset.mobileView || "editor");
  }

  setView(view) {
    if (view !== "editor" && view !== "preview") return;
    document.body.dataset.mobileView = view;
    for (const button of this.shadowRoot.querySelectorAll("button[data-view]")) {
      const active = button.dataset.view === view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    }
  }
}
if (!customElements.get("mobile-workspace-switcher")) {
  customElements.define("mobile-workspace-switcher", MobileWorkspace);
}
