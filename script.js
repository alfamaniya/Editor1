// Main application coordinator for editor-to-preview communication and toolbar commands.
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

  const extraKeys = document.querySelector("mobile-extra-keys");

  extraKeys?.addEventListener("alfacode:extra-key", event => {
    const key = event.detail?.key;
    if (typeof key !== "string" || !key) return;
    editorFrame?.contentWindow?.postMessage({ type: "alfacode:extra-key-command", key }, "*");
  });

  document.addEventListener("alfacode:header-action", event => {
    const action = event.detail?.action;
    if (!["clear-tabs", "project-reset", "clear-project-cookies"].includes(action)) return;
    editorFrame?.contentWindow?.postMessage({ type: "alfacode:toolbar-command", action }, "*");
  });

  window.addEventListener("message", event => {
    if (event.origin !== window.location.origin) return;
    if (editorFrame && event.source === editorFrame.contentWindow) {
      const data = event.data;
      if (data?.type === "alfacode:editor-state") {
        extraKeys?.setEditorState(data.focused, data.language);
        return;
      }
      if (data?.type === "alfacode:project-data-cleared") {
        window.location.reload();
        return;
      }
      if (!data || data.type !== "alfacode:source-change" || !data.sources) return;
      const { html, css, javascript } = data.sources;
      if (![html, css, javascript].every(value => typeof value === "string")) return;
      latestPreview = { type: "alfacode:render", sources: { html, css, javascript } };
      sendPreview();
    }
  });
})();