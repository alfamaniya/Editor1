class WorkspaceDivider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.dragging = false;
    this.ratio = 0.5;
  }

  async connectedCallback() {
    if (this.shadowRoot.childElementCount) return;
    const base = new URL("./", import.meta.url);
    const response = await fetch(new URL("workspace-divider.html", base));
    if (!response.ok) throw new Error("Unable to load workspace divider markup.");
    const template = document.createElement("template");
    template.innerHTML = await response.text();
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = new URL("workspace-divider.css", base).href;
    this.shadowRoot.append(stylesheet, template.content.cloneNode(true));

    this.setAttribute("role", "separator");
    this.setAttribute("aria-label", "Resize editor and preview panels");
    this.setAttribute("aria-orientation", "vertical");
    this.tabIndex = 0;

    const workspace = this.getWorkspace();
    if (workspace) this.applyRatio(workspace);

    this.addEventListener("pointerdown", event => {
      if (event.button !== undefined && event.button !== 0) return;
      this.dragging = true;
      this.setPointerCapture(event.pointerId);
      this.updateFromPointer(event.clientX);
      event.preventDefault();
    });
    this.addEventListener("pointermove", event => {
      if (this.dragging) this.updateFromPointer(event.clientX);
    });
    this.addEventListener("pointerup", () => { this.dragging = false; });
    this.addEventListener("pointercancel", () => { this.dragging = false; });
    this.addEventListener("lostpointercapture", () => { this.dragging = false; });
    this.addEventListener("keydown", event => this.handleKeydown(event));

    // Fractional grid tracks resize with the workspace automatically.
    this.handleWindowResize = () => {
      const currentWorkspace = this.getWorkspace();
      if (currentWorkspace) this.applyRatio(currentWorkspace);
    };
    window.addEventListener("resize", this.handleWindowResize, { passive: true });
  }

  disconnectedCallback() {
    if (this.handleWindowResize) {
      window.removeEventListener("resize", this.handleWindowResize);
      this.handleWindowResize = null;
    }
    this.dragging = false;
  }

  getWorkspace() {
    return this.closest(".workspace");
  }

  getUsableWidth(workspace) {
    return Math.max(0, workspace.getBoundingClientRect().width - 6);
  }

  getMinimumRatio(usableWidth) {
    if (usableWidth <= 0) return 0.5;
    return Math.min(180, usableWidth / 2) / usableWidth;
  }

  clampRatio(ratio, usableWidth) {
    const minimumRatio = this.getMinimumRatio(usableWidth);
    return Math.max(minimumRatio, Math.min(1 - minimumRatio, ratio));
  }

  applyRatio(workspace) {
    const usableWidth = this.getUsableWidth(workspace);
    this.ratio = this.clampRatio(this.ratio, usableWidth);
    workspace.style.gridTemplateColumns =
      `minmax(0, ${this.ratio}fr) 6px minmax(0, ${1 - this.ratio}fr)`;
    this.updateAria(usableWidth);
  }

  updateAria(usableWidth) {
    const minimumRatio = this.getMinimumRatio(usableWidth);
    this.setAttribute("aria-valuemin", String(Math.round(minimumRatio * 100)));
    this.setAttribute("aria-valuemax", String(Math.round((1 - minimumRatio) * 100)));
    this.setAttribute("aria-valuenow", String(Math.round(this.ratio * 100)));
  }

  updateFromPointer(clientX) {
    const workspace = this.getWorkspace();
    if (!workspace) return;
    const bounds = workspace.getBoundingClientRect();
    const usableWidth = this.getUsableWidth(workspace);
    if (usableWidth <= 0) return;
    const leftWidth = clientX - bounds.left - 3;
    this.ratio = this.clampRatio(leftWidth / usableWidth, usableWidth);
    this.applyRatio(workspace);
  }

  handleKeydown(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const workspace = this.getWorkspace();
    if (!workspace) return;
    event.preventDefault();
    const usableWidth = this.getUsableWidth(workspace);
    if (usableWidth <= 0) return;
    const delta = (event.key === "ArrowRight" ? 20 : -20) / usableWidth;
    this.ratio = this.clampRatio(this.ratio + delta, usableWidth);
    this.applyRatio(workspace);
  }
}

if (!customElements.get("workspace-divider")) {
  customElements.define("workspace-divider", WorkspaceDivider);
}
