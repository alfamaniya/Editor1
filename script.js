// Main application coordinator for editor-to-preview communication.
(() => {
  const editorFrame = document.querySelector(".editor-panel .section-frame");
  const previewFrame = document.querySelector(".preview-panel .section-frame");
  let previewReady = false;
  let latestPreview = null;

  function sendPreview() {
    if (!previewReady || !latestPreview || !previewFrame?.contentWindow) return;
    previewFrame.contentWindow.postMessage(latestPreview, "*");
  }

  previewFrame?.addEventListener("load", () => {
    previewReady = true;
    sendPreview();
  });

  window.addEventListener("message", event => {
    if (!editorFrame || event.source !== editorFrame.contentWindow) return;
    const data = event.data;
    if (!data || data.type !== "alfacode:source-change" || !data.sources) return;
    const { html, css, javascript } = data.sources;
    if (![html, css, javascript].every(value => typeof value === "string")) return;
    latestPreview = {
      type: "alfacode:render",
      sources: { html, css, javascript }
    };
    sendPreview();
  });
})();
