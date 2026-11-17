const frame = document.getElementById("preview-frame");

function insertBeforeClosingTag(source, tagName, content) {
  const closingTag = new RegExp(`</${tagName}\\s*>`, "i");
  if (closingTag.test(source)) return source.replace(closingTag, `${content}</${tagName}>`);
  return source + content;
}

function buildPreviewDocument(sources) {
  let html = sources.html || "<!doctype html><html><head></head><body></body></html>";
  const css = sources.css.replace(/<\\/style/gi, "<\\\\/style");
  if (css) {
    const styleTag = `<style>${css}</style>`;
    if (/<\\/head\\s*>/i.test(html)) {
      html = html.replace(/<\\/head\\s*>/i, `${styleTag}</head>`);
    } else {
      html = styleTag + html;
    }
  }

  if (sources.javascript) {
    const safeSource = JSON.stringify(sources.javascript).replace(/</g, "\\\\u003c");
    const scriptTag = `<script>try { const source = ${safeSource}; (new Function(source))(); } catch (error) { console.error(error); }</script>`;
    html = insertBeforeClosingTag(html, "body", scriptTag);
  }
  return html;
}

window.addEventListener("message", event => {
  if (event.source !== window.parent || !event.data || event.data.type !== "alfacode:render") return;
  const sources = event.data.sources;
  if (!sources || !["html", "css", "javascript"].every(key => typeof sources[key] === "string")) return;
  frame.srcdoc = buildPreviewDocument(sources);
});
