class WorkspaceDivider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.dragging = false;
    this.ratio = 0.5;
    this.resizeObserver = null;
    this.lastWorkspaceWidth = 0;
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
    if (workspace) {
      this.applyRatio(workspace);
      if (typeof ResizeObserver !== "undefined") {
        this.resizeObserver = new ResizeObserver(entries => {
          const entry = entries[entries.length - 1];
          const width = entry?.contentRect?.width ?? workspace.clientWidth;
          if (Math.abs(width - this.lastWorkspaceWidth) < 1) return;
          this.applyRatio(workspace);
        });
        this.resizeObserver.observe(workspace);
      }
    }

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
    this.addEventListener("keydown", event => this.handleKeydown(event));
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.dragging = false;
  }

  getWorkspace() {
    return this.closest(".workspace");
  }

  getUsableWidth(workspace) {
    return Math.max(0, workspace.clientWidth - 6);
  }

  getMinimumWidth(usableWidth) {
    return Math.min(180, usableWidth / 2);
  }

  clampRatio(ratio, usableWidth) {
    if (usableWidth <= 0) return 0.5;
    const minimumRatio = this.getMinimumWidth(usableWidth) / usableWidth;
    return Math.max(minimumRatio, Math.min(1 - minimumRatio, ratio));
  }

  applyRatio(workspace) {
    const usableWidth = this.getUsableWidth(workspace);
    this.ratio = this.clampRatio(this.ratio, usableWidth);
    const leftWidth = usableWidth * this.ratio;
    this.lastWorkspaceWidth = workspace.clientWidth;
    this.applyWidths(workspace, leftWidth, usableWidth - leftWidth);
  }

  updateFromPointer(clientX) {
    const workspace = this.getWorkspace();
    if (!workspace) return;
    const bounds = workspace.getBoundingClientRect();
    const usableWidth = this.getUsableWidth(workspace);
    if (usableWidth <= 0) return;
    const localX = clientX - bounds.left;
    const minimum = this.getMinimumWidth(usableWidth);
    const leftWidth = Math.max(minimum, Math.min(usableWidth - minimum, localX - 3));
    this.ratio = leftWidth / usableWidth;
    this.applyWidths(workspace, leftWidth, usableWidth - leftWidth);
    this.lastWorkspaceWidth = workspace.clientWidth;
  }

  applyWidths(workspace, leftWidth, rightWidth) {
    workspace.style.gridTemplateColumns = `${leftWidth}px 6px ${rightWidth}px`;
    const usableWidth = leftWidth + rightWidth;
    const minimumPercent = usableWidth > 0 ? Math.ceil(Math.min(leftWidth, rightWidth) / usableWidth * 100) : 50;
    const percent = usableWidth > 0 ? Math.round(leftWidth / usableWidth * 100) : 50;
    this.setAttribute("aria-valuemin", String(minimumPercent));
    this.setAttribute("aria-valuemax", String(100 - minimumPercent));
    this.setAttribute("aria-valuenow", String(percent));
  }

  handleKeydown(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const workspace = this.getWorkspace();
    if (!workspace) return;
    event.preventDefault();
    const usableWidth = this.getUsableWidth(workspace);
    if (usableWidth <= 0) return;
    const minimum = this.getMinimumWidth(usableWidth);
    const currentLeft = usableWidth * this.ratio;
    const delta = event.key === "ArrowRight" ? 20 : -20;
    const nextLeft = Math.max(minimum, Math.min(usableWidth - minimum, currentLeft + delta));
    this.ratio = nextLeft / usableWidth;
    this.applyWidths(workspace, nextLeft, usableWidth - nextLeft);
    this.lastWorkspaceWidth = workspace.clientWidth;
  }
}

if (!customElements.get("workspace-divider")) {
  customElements.define("workspace-divider", WorkspaceDivider);
}
