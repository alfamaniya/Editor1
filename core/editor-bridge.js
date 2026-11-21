// #editor-bridge.js: فایل editor bridge مربوط به بخش core پروژه
/* واسطه مرکزی Editor1: مدیریت ارتباط Editor، Preview و تغییر اندازه پنل‌ها */
(() => {
  "use strict";

  const split = document.getElementById("split");
  const leftPane = document.getElementById("leftPane");
  const divider = document.getElementById("divider");
  const editorFrame = document.getElementById("editorFrame");
  const previewFrame = document.getElementById("previewFrame");
  const mobileWorkspaceTabs = document.querySelectorAll("[data-workspace]");

  if (!split || !leftPane || !divider || !editorFrame || !previewFrame) {
    console.error("Editor1 Bridge: required workspace elements are missing.");
    return;
  }

  let mobileWorkspace = "editor";
  let workspaceBeforeVisual = "editor";
  function setMobileWorkspace(view) {
    if (view !== "editor" && view !== "preview") return;
    mobileWorkspace = view;
    document.body.classList.toggle("mobile-workspace-editor", view === "editor");
    document.body.classList.toggle("mobile-workspace-preview", view === "preview");
    mobileWorkspaceTabs.forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.workspace === view));
    });
    window.dispatchEvent(new Event("resize"));
  }
  mobileWorkspaceTabs.forEach(button => {
    button.addEventListener("click", () => setMobileWorkspace(button.dataset.workspace));
  });
  setMobileWorkspace(mobileWorkspace);

  const MIN_PANE = 100;
  const sources = { html: "", css: "", javascript: "" };
  let isDragging = false;
  let startX = 0;
  let startLeftWidth = 0;
  let containerWidth = 0;
  // Move Visual controls into the root page to keep them visible outside the Preview iframe bounds.
  let visualShellPlaceholder = null;
  let rootVisualStylesheet = null;
  function portalVisualShell(active) {
    const childDoc = previewFrame.contentDocument;
    const shell = childDoc?.getElementById("visual-editor-shell");
    if (active) {
      if (!shell || visualShellPlaceholder) return;
      visualShellPlaceholder = childDoc.createComment("Visual panel original position");
      shell.parentNode.insertBefore(visualShellPlaceholder, shell);
      if (!rootVisualStylesheet) {
        rootVisualStylesheet = document.createElement("link");
        rootVisualStylesheet.rel = "stylesheet";
        rootVisualStylesheet.href = new URL("core/visual-editor/visual-editor.css", document.baseURI).href;
        rootVisualStylesheet.dataset.visualEditorRootStyles = "true";
        document.head.appendChild(rootVisualStylesheet);
      }
      shell.classList.add("root-portal");
      document.body.appendChild(shell);
    } else if (visualShellPlaceholder && shell) {
      shell.classList.remove("root-portal");
      visualShellPlaceholder.parentNode.insertBefore(shell, visualShellPlaceholder);
      visualShellPlaceholder.remove();
      visualShellPlaceholder = null;
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
      if (data.active) {
        workspaceBeforeVisual = mobileWorkspace;
        setMobileWorkspace("preview");
      } else {
        setMobileWorkspace(workspaceBeforeVisual);
      }
      portalVisualShell(data.active);
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
