import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIR = path.join(ROOT, "offline");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "AlfaCode-Offline.html");

async function read(relativePath) {
  return fs.readFile(path.join(ROOT, relativePath), "utf8");
}

function escapeScript(source) {
  return source.replace(/<\/script/gi, "<\\/script");
}

function injectBeforeBodyEnd(html, fragment) {
  if (/<\/body\s*>/i.test(html)) {
    return html.replace(/<\/body\s*>/i, fragment + "</body>");
  }
  return html + fragment;
}

function inlineEditorDocument(template, styles, bundle, tagSuggestionsTemplate) {
  let html = template;
  html = html.replace(/\s*<link\b[^>]*href=["'][^"']+["'][^>]*>/gi, "");
  html = html.replace(/\s*<script\b[^>]*src=["'][^"']*editor\.js["'][^>]*>\s*<\/script>/i, "");
  html = html.replace("</head>", "<style>\n" + styles + "\n</style>\n</head>");
  const templateBootstrap = "<script>window.__ALFACODE_TAG_SUGGESTIONS_TEMPLATE__ = " + JSON.stringify(tagSuggestionsTemplate) + ";</script>";
  html = injectBeforeBodyEnd(html, templateBootstrap + "<script>\n" + escapeScript(bundle) + "\n</script>");
  return html;
}

function inlinePreviewDocument(template, stylesheet, script) {
  let html = template;
  html = html.replace(/\s*<link\b[^>]*href=["'][^"']*preview\.css["'][^>]*>/i, "");
  html = html.replace(/\s*<script\b[^>]*src=["'][^"']*preview\.js["'][^>]*>\s*<\/script>/i, "");
  html = html.replace("</head>", "<style>\n" + stylesheet + "\n</style>\n</head>");
  html = injectBeforeBodyEnd(html, "<script>\n" + escapeScript(script) + "\n</script>");
  return html;
}

function makeHeaderComponent(markup, stylesheet) {
  return `
class OfflineAppHeader extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = "<style>" + ${JSON.stringify(stylesheet)} + "</style>" + ${JSON.stringify(markup)};
  }
}
customElements.define("app-header", OfflineAppHeader);
`;
}

function makeDividerComponent(markup, stylesheet) {
  return `
class OfflineWorkspaceDivider extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = "<style>" + ${JSON.stringify(stylesheet)} + "</style>" + ${JSON.stringify(markup)};
    this.setAttribute("role", "separator");
    this.setAttribute("aria-label", "Resize editor and preview panels");
    this.setAttribute("aria-orientation", "vertical");
    this.setAttribute("aria-valuemin", "20");
    this.setAttribute("aria-valuemax", "80");
    this.setAttribute("aria-valuenow", "50");
    this.tabIndex = 0;
    this.dragging = false;
    this.addEventListener("pointerdown", event => {
      if (event.button !== undefined && event.button !== 0) return;
      this.dragging = true;
      this.setPointerCapture(event.pointerId);
      this.resizeAt(event.clientX);
      event.preventDefault();
    });
    this.addEventListener("pointermove", event => {
      if (this.dragging) this.resizeAt(event.clientX);
    });
    this.addEventListener("pointerup", () => { this.dragging = false; });
    this.addEventListener("pointercancel", () => { this.dragging = false; });
    this.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const workspace = this.closest(".workspace");
      if (!workspace) return;
      const usable = Math.max(workspace.clientWidth, workspace.scrollWidth) - 6;
      const minimum = Math.min(220, usable / 2);
      const current = Number(this.getAttribute("aria-valuenow")) || 50;
      const next = Math.max(minimum, Math.min(usable - minimum,
        usable * current / 100 + (event.key === "ArrowRight" ? 20 : -20)));
      this.apply(workspace, next, usable - next);
    });
    const workspace = this.closest(".workspace");
    if (workspace) {
      const usable = Math.max(0, Math.max(workspace.clientWidth, workspace.scrollWidth) - 6);
      this.apply(workspace, usable / 2, usable / 2);
    }
  }
  resizeAt(clientX) {
    const workspace = this.closest(".workspace");
    if (!workspace) return;
    const bounds = workspace.getBoundingClientRect();
    const usable = Math.max(workspace.clientWidth, workspace.scrollWidth) - 6;
    const minimum = Math.min(220, usable / 2);
    const left = Math.max(minimum, Math.min(usable - minimum, clientX - bounds.left + workspace.scrollLeft));
    this.apply(workspace, left, usable - left);
  }
  apply(workspace, left, right) {
    workspace.style.gridTemplateColumns = left + "px 6px " + right + "px";
    const total = left + right;
    const minPercent = total ? Math.ceil(Math.min(left, right) / total * 100) : 20;
    this.setAttribute("aria-valuemin", String(minPercent));
    this.setAttribute("aria-valuemax", String(100 - minPercent));
    this.setAttribute("aria-valuenow", String(total ? Math.round(left / total * 100) : 50));
  }
}
customElements.define("workspace-divider", OfflineWorkspaceDivider);
`;
}
function makeMobileWorkspaceComponent(markup, stylesheet) {
  return `
class OfflineMobileWorkspace extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = "<style>" + ${JSON.stringify(stylesheet)} + "</style>" + ${JSON.stringify(markup)};
    root.addEventListener("click", event => {
      const button = event.target.closest("button[data-view]");
      if (button) this.setView(button.dataset.view);
    });
    this.setView(document.body.dataset.mobileView || "editor");
    this.syncViewportHeight();
    window.visualViewport?.addEventListener("resize", () => this.syncViewportHeight());
    window.addEventListener("resize", () => this.syncViewportHeight());
  }
  setView(view) {
    if (view !== "editor" && view !== "preview") return;
    document.body.dataset.mobileView = view;
    for (const button of this.shadowRoot.querySelectorAll("button[data-view]")) {
      const active = button.dataset.view === view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    }
  }
  syncViewportHeight() {
    const viewport = window.visualViewport;
    if (viewport && Math.abs(viewport.scale - 1) < 0.01) {
      document.documentElement.style.setProperty("--app-height", viewport.height + "px");
    } else if (!viewport) {
      document.documentElement.style.removeProperty("--app-height");
    }
  }
}
customElements.define("mobile-workspace-switcher", OfflineMobileWorkspace);
`;
}

async function main() {
  const inputPaths = [
    "index.html", "style.css", "script.js",
    "core/header/header.html", "core/header/header.css", "core/header/header.js",
    "core/clear-tabs/clear-tabs.html", "core/clear-tabs/clear-tabs.css", "core/clear-tabs/clear-tabs.js",
    "core/project-reset/project-reset.html", "core/project-reset/project-reset.css", "core/project-reset/project-reset.js",
    "core/clear-project-cookies/clear-project-cookies.html", "core/clear-project-cookies/clear-project-cookies.css", "core/clear-project-cookies/clear-project-cookies.js",
    "core/mobile-workspace/mobile-workspace.html", "core/mobile-workspace/mobile-workspace.css", "core/mobile-workspace/mobile-workspace.js",
    "core/workspace-divider/workspace-divider.html",
    "core/workspace-divider/workspace-divider.css",
    "core/workspace-divider/workspace-divider.js",
    "core/editor/editor.html", "core/editor/editor.css", "core/editor/editor.js",
    "core/tag-suggestions/tag-suggestions.html", "core/tag-suggestions/tag-suggestions.css", "core/tag-suggestions/tag-suggestions.js",
    "core/preview/preview.html", "core/preview/preview.css", "core/preview/preview.js",
    "alfacode/src"
  ];

  const [
    indexTemplate, rootCss, coordinator,
    headerMarkup, headerCss, headerModule,
    clearTabsMarkup, clearTabsCss, clearTabsModule,
    projectResetMarkup, projectResetCss, projectResetModule,
    clearBrowserDataMarkup, clearBrowserDataCss, clearBrowserDataModule,
    mobileMarkup, mobileCss, mobileModule,
    dividerMarkup, dividerCss, dividerModule,
    editorTemplate, editorCss, previewTemplate, previewCss, previewScript
  ] = await Promise.all([
    read("index.html"), read("style.css"), read("script.js"),
    read("core/header/header.html"), read("core/header/header.css"), read("core/header/header.js"),
    read("core/clear-tabs/clear-tabs.html"), read("core/clear-tabs/clear-tabs.css"), read("core/clear-tabs/clear-tabs.js"),
    read("core/project-reset/project-reset.html"), read("core/project-reset/project-reset.css"), read("core/project-reset/project-reset.js"),
    read("core/clear-project-cookies/clear-project-cookies.html"), read("core/clear-project-cookies/clear-project-cookies.css"), read("core/clear-project-cookies/clear-project-cookies.js"),
    read("core/mobile-workspace/mobile-workspace.html"), read("core/mobile-workspace/mobile-workspace.css"), read("core/mobile-workspace/mobile-workspace.js"),
    read("core/workspace-divider/workspace-divider.html"),
    read("core/workspace-divider/workspace-divider.css"),
    read("core/workspace-divider/workspace-divider.js"),
    read("core/editor/editor.html"), read("core/editor/editor.css"),
    read("core/preview/preview.html"), read("core/preview/preview.css"), read("core/preview/preview.js")
  ]);

  // Ensure source component modules remain part of the audited build inputs.
  if (!headerModule.includes("customElements.define") ||
      !clearTabsModule.includes("customElements.define") ||
      !projectResetModule.includes("customElements.define") ||
      !clearBrowserDataModule.includes("customElements.define") ||
      !dividerModule.includes("customElements.define") ||
      !mobileModule.includes("customElements.define")) {
    throw new Error("A required UI component module is missing its custom-element registration.");
  }

  const bundleResult = await build({
    absWorkingDir: ROOT,
    entryPoints: [path.join(ROOT, "core/editor/editor.js")],
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    target: ["es2020"],
    legalComments: "none"
  });
  const editorBundle = bundleResult.outputFiles[0].text;

  const tagSuggestionsTemplate = await read("core/tag-suggestions/tag-suggestions.html");
  const tagSuggestionsCss = await read("core/tag-suggestions/tag-suggestions.css");
  const editorDocument = inlineEditorDocument(
    editorTemplate,
    [editorCss, tagSuggestionsCss, await read("alfacode/src/themes/dark.css"), await read("alfacode/src/themes/light.css")].join("\n"),
    editorBundle,
    tagSuggestionsTemplate
  );
  const previewDocument = inlinePreviewDocument(previewTemplate, previewCss, previewScript);

  let shell = indexTemplate;
  shell = shell.replace(/\s*<link\b[^>]*href="[^"]*style\.css"[^>]*>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*header\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*workspace-divider\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*mobile-workspace\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*clear-tabs\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*project-reset\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*clear-project-cookies\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*src=["'][^"']*script\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace("</head>", "<style>\n" + rootCss + "\n</style>\n</head>");

  const bootstrap = `
(() => {
  ${makeHeaderComponent(headerMarkup, headerCss)}
  window.__ALFACODE_ACTION_ASSETS__ = {
    "clear-tabs": { html: ${JSON.stringify(clearTabsMarkup)}, css: ${JSON.stringify(clearTabsCss)} },
    "project-reset": { html: ${JSON.stringify(projectResetMarkup)}, css: ${JSON.stringify(projectResetCss)} },
    "clear-project-cookies": { html: ${JSON.stringify(clearBrowserDataMarkup)}, css: ${JSON.stringify(clearBrowserDataCss)} }
  };
  ${clearTabsModule}
  ${projectResetModule}
  ${clearBrowserDataModule}
  ${makeDividerComponent(dividerMarkup, dividerCss)}
  ${makeMobileWorkspaceComponent(mobileMarkup, mobileCss)}
  const editorFrame = document.querySelector(".editor-panel .section-frame");
  const previewFrame = document.querySelector(".preview-panel .section-frame");
  editorFrame.srcdoc = ${JSON.stringify(editorDocument)};
  previewFrame.srcdoc = ${JSON.stringify(previewDocument)};
  ${coordinator}
})();
`;
  shell = injectBeforeBodyEnd(shell, "<script>\n" + escapeScript(bootstrap) + "\n</script>");

  if (!/<!doctype html>/i.test(shell) || !shell.includes("editorFrame.srcdoc") ||
      !shell.includes("previewFrame.srcdoc") || /<script\b[^>]*\bsrc\s*=|<link\b[^>]*\bhref\s*=/i.test(shell)) {
    throw new Error("Offline output validation failed: missing embedded documents or external asset references.");
  }
  if (/https?:\/\//i.test(shell)) {
    throw new Error("Offline output validation failed: a network URL remains in the generated HTML.");
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, shell, "utf8");

  const inputBytes = await Promise.all(inputPaths.map(async item => {
    const full = path.join(ROOT, item);
    try {
      const stat = await fs.stat(full);
      if (stat.isFile()) return stat.size;
      if (!stat.isDirectory()) return 0;
      const files = [];
      async function walk(dir) {
        for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
          const next = path.join(dir, entry.name);
          if (entry.isDirectory()) await walk(next);
          else if (entry.isFile()) files.push((await fs.stat(next)).size);
        }
      }
      await walk(full);
      return files.reduce((sum, size) => sum + size, 0);
    } catch {
      return 0;
    }
  }));
  const sourceFileCounts = await Promise.all(inputPaths.map(async item => {
    const full = path.join(ROOT, item);
    try {
      const stat = await fs.stat(full);
      if (stat.isFile()) return 1;
      if (!stat.isDirectory()) return 0;
      let count = 0;
      async function countFiles(dir) {
        for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
          const next = path.join(dir, entry.name);
          if (entry.isDirectory()) await countFiles(next);
          else if (entry.isFile()) count += 1;
        }
      }
      await countFiles(full);
      return count;
    } catch {
      return 0;
    }
  }));
  const sourceFileCount = sourceFileCounts.reduce((sum, count) => sum + count, 0);
  const sourceBytes = inputBytes.reduce((sum, size) => sum + size, 0);
  const outputBytes = Buffer.byteLength(shell, "utf8");
  const report = [
    "## AlfaCode offline build",
    "",
    "- Output: `offline/AlfaCode-Offline.html`",
    "- Runtime source files audited: " + sourceFileCount,
    "- Source bytes (including source tree): " + sourceBytes.toLocaleString("en-US"),
    "- Generated HTML bytes: " + outputBytes.toLocaleString("en-US"),
    "- Generated HTML KiB: " + (outputBytes / 1024).toFixed(2),
    "- External runtime assets: 0",
    "- Build validation: passed",
    ""
  ].join("\n");
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) {
    await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, report, "utf8");
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
