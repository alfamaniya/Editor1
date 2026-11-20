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
  // Visual mode portals the Preview iframe to document.body to avoid clipping
  // by the split-pane ancestors (overflow:hidden/auto).
  let previewPlaceholder = null;
  let previewOriginalStyle = null;
  function portalPreview(active) {
    if (active) {
      if (previewPlaceholder) return;
      previewOriginalStyle = previewFrame.getAttribute("style");
      previewPlaceholder = document.createComment("Preview iframe original position");
      previewFrame.parentNode.insertBefore(previewPlaceholder, previewFrame);
      document.body.appendChild(previewFrame);
      Object.assign(previewFrame.style, {
        position: "fixed", inset: "0", width: "100vw", height: "100dvh",
        zIndex: "60", border: "0", margin: "0"
      });
    } else if (previewPlaceholder) {
      previewPlaceholder.parentNode.insertBefore(previewFrame, previewPlaceholder);
      previewPlaceholder.remove();
      previewPlaceholder = null;
      if (previewOriginalStyle === null) previewFrame.removeAttribute("style");
      else previewFrame.setAttribute("style", previewOriginalStyle);
      previewOriginalStyle = null;
    }
  }

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
    if (!event.data) return;
    const data = event.data;

    if (event.source === previewFrame.contentWindow && data.type === "alfacode:visual-mode-active" && typeof data.active === "boolean") {
      document.body.classList.toggle("visual-mode", data.active);
      portalPreview(data.active);
      document.getElementById("visualSettings")?.setAttribute("aria-pressed", String(data.active));
      return;
    }

    if (event.source === previewFrame.contentWindow &&
        data.type === "alfacode:visual-css-update" && typeof data.css === "string") {
      editorFrame.contentWindow?.postMessage({ type: "alfacode:visual-css-update", css: data.css }, "*");
      return;
    }
    if (event.source !== editorFrame.contentWindow) return;
    if (data.type === "alfacode:editor-state") return;

    if (data.type === "alfacode:visual-css-update" && typeof data.css === "string") {
      editorFrame.contentWindow?.postMessage({
        type: "alfacode:visual-css-update",
        css: data.css
      }, "*");
      return;
    }

    if (data.type === "alfacode:source-change" && data.sources &&
        ["html", "css", "javascript"].every(key => typeof data.sources[key] === "string")) {
      Object.assign(sources, data.sources);
      renderPreview();
    }
  }

  window.addEventListener("message", handleMessage);
  previewFrame.addEventListener("load", renderPreview);

  document.getElementById("visualSettings")?.addEventListener("click", () => {
    previewFrame.contentWindow?.postMessage({ type: "alfacode:visual-toggle" }, "*");
  });

  // Confirmation prompts prevent accidental loss of code.
  document.getElementById("clearAllTabs")?.addEventListener("click", () => {
    if (window.confirm("Clear all code from HTML, CSS, and JavaScript tabs?")) {
      postEditorCommand("clear-tabs");
    }
  });
  document.getElementById("clearCurrentTab")?.addEventListener("click", () => {
    if (window.confirm("Clear the code in the currently active tab?")) {
      postEditorCommand("clear-tab");
    }
  });
  document.getElementById("resetProject")?.addEventListener("click", () => {
    if (window.confirm("Reset the project to the original sample code? This replaces code in all three tabs.")) {
      postEditorCommand("project-reset");
    }
  });

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

