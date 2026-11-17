class WorkspaceDivider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.dragging = false;
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
    this.setAttribute("aria-valuemin", "20");
    this.setAttribute("aria-valuemax", "80");
    this.setAttribute("aria-valuenow", "50");
    this.tabIndex = 0;

    const workspace = this.getWorkspace();
    if (workspace) {
      const totalWidth = Math.max(workspace.clientWidth, workspace.scrollWidth);
      const usableWidth = Math.max(0, totalWidth - 6);
      this.applyWidths(workspace, usableWidth / 2, usableWidth / 2);
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

  getWorkspace() {
    return this.closest(".workspace");
  }

  updateFromPointer(clientX) {
    const workspace = this.getWorkspace();
    if (!workspace) return;
    const bounds = workspace.getBoundingClientRect();
    const totalWidth = Math.max(workspace.clientWidth, workspace.scrollWidth);
    const usableWidth = totalWidth - 6;
    const minimum = Math.min(220, usableWidth / 2);
    const localX = clientX - bounds.left + workspace.scrollLeft;
    const leftWidth = Math.max(minimum, Math.min(usableWidth - minimum, localX));
    this.applyWidths(workspace, leftWidth, usableWidth - leftWidth);
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
    const totalWidth = Math.max(workspace.clientWidth, workspace.scrollWidth);
    const usableWidth = totalWidth - 6;
    const minimum = Math.min(220, usableWidth / 2);
    const currentPercent = Number(this.getAttribute("aria-valuenow")) || 50;
    const currentLeft = usableWidth * currentPercent / 100;
    const delta = event.key === "ArrowRight" ? 20 : -20;
    const nextLeft = Math.max(minimum, Math.min(usableWidth - minimum, currentLeft + delta));
    this.applyWidths(workspace, nextLeft, usableWidth - nextLeft);
  }
}

if (!customElements.get("workspace-divider")) {
  customElements.define("workspace-divider", WorkspaceDivider);
}
