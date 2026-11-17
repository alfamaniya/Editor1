const frame = document.getElementById("preview-frame");
const status = document.getElementById("preview-status");

function createPreview(language, source) {
  if (language === "css") {
    return `<!doctype html><html><head><meta charset="utf-8"><style>${source}</style></head><body><h1>CSS Preview</h1><p>This sample content is styled by your CSS.</p><button>Preview button</button></body></html>`;
  }
  if (language === "javascript") {
    return `<!doctype html><html><head><meta charset="utf-8"></head><body><h1>JavaScript Preview</h1><pre id="output">Running…</pre><script>try { const result = (() => { ${source}\n })(); if (result !== undefined) document.getElementById("output").textContent = String(result); else document.getElementById("output").textContent = "JavaScript executed successfully."; } catch (error) { document.getElementById("output").textContent = error.name + ": " + error.message; }</script></body></html>`;
  }
  return source;
}

window.addEventListener("message", (event) => {
  if (event.source !== window.parent || !event.data || event.data.type !== "alfacode:render") return;
  const { language, source } = event.data;
  if (!["html", "css", "javascript"].includes(language) || typeof source !== "string") return;
  frame.srcdoc = createPreview(language, source);
  status.textContent = language.toUpperCase() + " rendered";
});
