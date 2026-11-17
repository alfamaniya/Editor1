// Main application coordinator and resizable workspace layout.
(() => {
  const editorFrame = document.querySelector(".editor-panel .section-frame");
  const previewFrame = document.querySelector(".preview-panel .section-frame");
  const workspace = document.querySelector(".workspace");
  const divider = document.querySelector(".workspace-divider");
  let previewReady = false;
  let latestPreview = null;
  let dragging = false;

  function sendPreview() {
    if (!previewReady || !latestPreview || !previewFrame) return;
    previewFrame.contentWindow.postMessage(latestPreview, "*");
  }

  previewFrame?.addEventListener("load", () => {
    previewReady = true;
    sendPreview();
  });

  window.addEventListener("message", (event) => {
    if (!editorFrame || !previewFrame || event.source !== editorFrame.contentWindow) return;
    const data = event.data;
    if (!data || data.type !== "alfacode:source-change") return;
    if (!["html", "css", "javascript"].includes(data.language) || typeof data.source !== "string") return;
    latestPreview = { type: "alfacode:render", language: data.language, source: data.source };
    sendPreview();
  });

  function setDividerPosition(clientX) {
    const bounds = workspace.getBoundingClientRect();
    const totalWidth = Math.max(workspace.clientWidth, workspace.scrollWidth);
    const minimum = Math.min(220, totalWidth * 0.2);
    const usableWidth = totalWidth - 6;
    const localX = clientX - bounds.left + workspace.scrollLeft;
    const editorWidth = Math.max(minimum, Math.min(usableWidth - minimum, localX));
    const ratio = editorWidth / usableWidth;
    workspace.style.gridTemplateColumns = `minmax(${minimum}px, ${ratio}fr) 6px minmax(${minimum}px, ${1 - ratio}fr)`;
    divider.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  }

  divider?.addEventListener("pointerdown", event => {
    dragging = true;
    divider.setPointerCapture(event.pointerId);
    setDividerPosition(event.clientX);
    event.preventDefault();
  });
  divider?.addEventListener("pointermove", event => {
    if (dragging) setDividerPosition(event.clientX);
  });
  function stopDragging() { dragging = false; }
  divider?.addEventListener("pointerup", stopDragging);
  divider?.addEventListener("pointercancel", stopDragging);
  divider?.addEventListener("keydown", event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const bounds = workspace.getBoundingClientRect();
    const totalWidth = Math.max(workspace.clientWidth, workspace.scrollWidth);
    const current = Number(divider.getAttribute("aria-valuenow")) || 50;
    const next = Math.max(20, Math.min(80, current + (event.key === "ArrowRight" ? 2 : -2)));
    setDividerPosition(bounds.left - workspace.scrollLeft + (totalWidth - 6) * next / 100);
  });
})();
