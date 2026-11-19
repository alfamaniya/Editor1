/* واسطه مرکزی Editor1: مدیریت ارتباط Editor، Preview و تغییر اندازه پنل‌ها */
(() => {
  "use strict";

  const split = document.getElementById("split");
  const leftPane = document.getElementById("leftPane");
  const divider = document.getElementById("divider");
  const editorFrame = document.getElementById("editorFrame");
  const previewFrame = document.getElementById("previewFrame");

  if (!split || !leftPane || !divider || !editorFrame || !previewFrame) {
    console.error("Editor1 Bridge: required workspace elements are missing.");
    return;
  }

  const MIN_PANE = 100;
  const sources = { html: "", css: "", javascript: "" };
  let isDragging = false;
  let startX = 0;
  let startLeftWidth = 0;
  let containerWidth = 0;

  // دریافت کد از Editor و ارسال آن برای Preview
  function renderPreview() {
    if (!previewFrame.contentWindow) return;
    previewFrame.contentWindow.postMessage({
      type: "alfacode:render",
      sources: { ...sources }
    }, "*");
  }

  // ارسال دستورهای Header به Editor
  function postEditorCommand(action) {
    editorFrame.contentWindow?.postMessage({
      type: "alfacode:toolbar-command",
      action
    }, "*");
  }

  // فقط پیام‌های iframe شناخته‌شده پذیرفته می‌شوند
  function handleMessage(event) {
    if (event.source !== editorFrame.contentWindow || !event.data) return;
    const data = event.data;

    if (data.type === "alfacode:source-change" && data.sources &&
        ["html", "css", "javascript"].every(key => typeof data.sources[key] === "string")) {
      Object.assign(sources, data.sources);
      renderPreview();
    }
  }

  window.addEventListener("message", handleMessage);
  previewFrame.addEventListener("load", renderPreview);

  document.getElementById("clearAllTabs")?.addEventListener("click", () => postEditorCommand("clear-tabs"));
  document.getElementById("clearCurrentTab")?.addEventListener("click", () => postEditorCommand("clear-tab"));
  document.getElementById("resetProject")?.addEventListener("click", () => postEditorCommand("project-reset"));

  // کنترل تغییر اندازه پنل‌ها؛ ابعاد iframe با Flexbox/CSS هماهنگ می‌شود.
  const getX = event => event.touches ? event.touches[0].clientX : event.clientX;

  function startDrag(event) {
    isDragging = true;
    startX = getX(event);
    startLeftWidth = leftPane.getBoundingClientRect().width;
    containerWidth = split.getBoundingClientRect().width;
    divider.classList.add("dragging");
    document.body.classList.add("dragging");
    if (event.cancelable) event.preventDefault();
  }

  function moveDrag(event) {
    if (!isDragging) return;
    const deltaX = getX(event) - startX;
    const maxLeft = Math.max(MIN_PANE, containerWidth - MIN_PANE);
    const nextWidth = Math.max(MIN_PANE, Math.min(maxLeft, startLeftWidth + deltaX));
    leftPane.style.flex = `0 0 ${Math.min(100, (nextWidth / containerWidth) * 100)}%`;
    if (event.cancelable) event.preventDefault();
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    divider.classList.remove("dragging");
    document.body.classList.remove("dragging");
  }

  divider.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("mouseup", endDrag);
  divider.addEventListener("touchstart", startDrag, { passive: false });
  window.addEventListener("touchmove", moveDrag, { passive: false });
  window.addEventListener("touchend", endDrag);
  window.addEventListener("touchcancel", endDrag);
})();
