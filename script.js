// Main application coordinator.
// Section-specific code remains inside its own directory.
(() => {
  const editorFrame = document.querySelector(".editor-panel .section-frame");
  const previewFrame = document.querySelector(".preview-panel .section-frame");
  let previewReady = false;
  let latestPreview = null;

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

    latestPreview = {
      type: "alfacode:render",
      language: data.language,
      source: data.source
    };
    sendPreview();
  });
})();
