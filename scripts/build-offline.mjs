import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIR = path.join(ROOT, "offline");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "AlfaCode-Offline.html");

const READ_PATHS = new Set();

async function read(relativePath) {
  READ_PATHS.add(relativePath);
  return fs.readFile(path.join(ROOT, relativePath), "utf8");
}

function isLocalReference(value) {
  return Boolean(value) && !/^(?:[a-z]+:|\/\/|#)/i.test(value.trim());
}

function resolveRuntimeReference(fromFile, reference) {
  const clean = reference.trim().split(/[?#]/, 1)[0];
  if (!isLocalReference(clean) || !clean) return null;
  const relative = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), clean));
  const absolute = path.resolve(ROOT, relative);
  if (absolute !== ROOT && !absolute.startsWith(ROOT + path.sep)) {
    throw new Error(`Offline manifest path escapes repository root: ${fromFile} -> ${reference}`);
  }
  return relative.replaceAll(path.sep, "/");
}

async function assertRuntimeFile(relativePath) {
  const absolute = path.resolve(ROOT, relativePath);
  if (absolute !== ROOT && !absolute.startsWith(ROOT + path.sep)) {
    throw new Error(`Offline manifest path escapes repository root: ${relativePath}`);
  }
  const stat = await fs.stat(absolute).catch(() => null);
  if (!stat?.isFile()) throw new Error(`Offline manifest references a missing file: ${relativePath}`);
}

async function loadOfflineManifest() {
  const manifestPath = path.join(ROOT, "scripts/offline-manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.entries) || !manifest.entries.length) {
    throw new Error("Invalid offline manifest: expected schemaVersion 1 and a non-empty entries array.");
  }
  const byId = new Map();
  for (const entry of manifest.entries) {
    if (!entry || typeof entry.id !== "string" || !entry.id.trim() || byId.has(entry.id)) {
      throw new Error("Invalid offline manifest: every entry must have a unique non-empty id.");
    }
    if (typeof entry.active !== "boolean") throw new Error(`Invalid active flag in manifest entry: ${entry.id}`);
    for (const field of ["styles", "scripts", "runtimeFiles", "includes"]) {
      if (entry[field] !== undefined && (!Array.isArray(entry[field]) || entry[field].some(item => typeof item !== "string"))) {
        throw new Error(`Invalid ${field} list in manifest entry: ${entry.id}`);
      }
    }
    byId.set(entry.id, entry);
  }

  const visiting = new Set();
  const visited = new Set();
  function visit(id) {
    if (!byId.has(id)) throw new Error(`Unknown manifest dependency: ${id}`);
    if (visiting.has(id)) throw new Error(`Circular manifest dependency detected at: ${id}`);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of byId.get(id).includes || []) {
      if (!byId.get(dependency)?.active) throw new Error(`Manifest dependency is missing or inactive: ${id} -> ${dependency}`);
      visit(dependency);
    }
    visiting.delete(id);
    visited.add(id);
  }
  for (const entry of manifest.entries.filter(item => item.active)) visit(entry.id);
  return manifest;
}

async function discoverRuntimeFiles(manifest) {
  const files = new Set();
  const htmlQueue = [];
  const cssQueue = [];
  const scriptEntries = new Set();

  function add(relativePath) {
    if (!relativePath) return;
    files.add(relativePath);
    if (/\\.html?$/i.test(relativePath)) htmlQueue.push(relativePath);
    if (/\\.css$/i.test(relativePath)) cssQueue.push(relativePath);
  }

  for (const entry of manifest.entries.filter(item => item.active)) {
    if (entry.html) add(entry.html);
    for (const item of entry.styles || []) add(item);
    for (const item of entry.scripts || []) {
      add(item);
      if (/\\.m?js$/i.test(item)) scriptEntries.add(item);
    }
    for (const item of entry.runtimeFiles || []) add(item);
  }

  const visitedHtml = new Set();
  while (htmlQueue.length) {
    const current = htmlQueue.shift();
    if (visitedHtml.has(current)) continue;
    visitedHtml.add(current);
    await assertRuntimeFile(current);
    const source = await fs.readFile(path.join(ROOT, current), "utf8");
    const refs = [...source.matchAll(/\\b(?:src|href)\\s*=\\s*["']([^"']+)["']/gi)].map(match => match[1]);
    for (const reference of refs) {
      const resolved = resolveRuntimeReference(current, reference);
      if (!resolved) continue;
      await assertRuntimeFile(resolved);
      add(resolved);
      if (/\\.m?js(?:$|[?#])/i.test(reference)) scriptEntries.add(resolved);
    }
  }

  const visitedCss = new Set();
  while (cssQueue.length) {
    const current = cssQueue.shift();
    if (visitedCss.has(current)) continue;
    visitedCss.add(current);
    await assertRuntimeFile(current);
    const source = await fs.readFile(path.join(ROOT, current), "utf8");
    const refs = [];
    for (const match of source.matchAll(/@import\\s+(?:url\\(\\s*)?["']?([^"'\\s)]+)|url\\(\\s*["']?([^"'")]+)["']?\\s*\\)/gi)) {
      refs.push(match[1] || match[2]);
    }
    for (const reference of refs) {
      const resolved = resolveRuntimeReference(current, reference);
      if (!resolved) continue;
      await assertRuntimeFile(resolved);
      add(resolved);
    }
  }

  // Ask esbuild for the complete local import graph of every active JS entry.
  for (const entryPoint of scriptEntries) {
    const result = await build({
      absWorkingDir: ROOT,
      entryPoints: [path.join(ROOT, entryPoint)],
      bundle: true,
      write: false,
      metafile: true,
      format: "iife",
      platform: "browser",
      target: ["es2020"],
      legalComments: "none"
    });
    for (const input of Object.keys(result.metafile.inputs)) {
      const absolute = path.resolve(ROOT, input);
      if (absolute === ROOT || absolute.startsWith(ROOT + path.sep)) {
        const relative = path.relative(ROOT, absolute).split(path.sep).join("/");
        if (!relative.startsWith("node_modules/")) add(relative);
      }
    }
  }

  for (const relativePath of files) await assertRuntimeFile(relativePath);
  return [...files].sort();
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
  const manifest = await loadOfflineManifest();
  const inputPaths = await discoverRuntimeFiles(manifest);

  const [
    indexTemplate, rootCss, coordinator,
    headerMarkup, headerCss, headerModule,
    newPageMarkup, newPageCss, newPageModule,
    clearTabsMarkup, clearTabsCss, clearTabsModule,
    projectResetMarkup, projectResetCss, projectResetModule,
    clearBrowserDataMarkup, clearBrowserDataCss, clearBrowserDataModule,
    mobileMarkup, mobileCss, mobileModule,
    extraKeysMarkup, extraKeysCss, extraKeysModule,
    dividerMarkup, dividerCss, dividerModule,
    editorTemplate, editorCss, previewTemplate, previewCss, previewScript
  ] = await Promise.all([
    read("index.html"), read("style.css"), read("script.js"),
    read("core/header/header.html"), read("core/header/header.css"), read("core/header/header.js"),
    read("core/new-page-action/new-page-action.html"), read("core/new-page-action/new-page-action.css"), read("core/new-page-action/new-page-action.js"),
    read("core/clear-tabs/clear-tabs.html"), read("core/clear-tabs/clear-tabs.css"), read("core/clear-tabs/clear-tabs.js"),
    read("core/project-reset/project-reset.html"), read("core/project-reset/project-reset.css"), read("core/project-reset/project-reset.js"),
    read("core/clear-project-cookies/clear-project-cookies.html"), read("core/clear-project-cookies/clear-project-cookies.css"), read("core/clear-project-cookies/clear-project-cookies.js"),
    read("core/mobile-workspace/mobile-workspace.html"), read("core/mobile-workspace/mobile-workspace.css"), read("core/mobile-workspace/mobile-workspace.js"),
    read("core/mobile-extra-keys/mobile-extra-keys.html"), read("core/mobile-extra-keys/mobile-extra-keys.css"), read("core/mobile-extra-keys/mobile-extra-keys.js"),
    read("core/workspace-divider/workspace-divider.html"),
    read("core/workspace-divider/workspace-divider.css"),
    read("core/workspace-divider/workspace-divider.js"),
    read("core/editor/editor.html"), read("core/editor/editor.css"),
    read("core/preview/preview.html"), read("core/preview/preview.css"), read("core/preview/preview.js")
  ]);

  const undiscoveredReads = [...READ_PATHS].filter(item => !inputPaths.includes(item));
  if (undiscoveredReads.length) {
    throw new Error("Build script reads files not declared or discovered by offline manifest: " + undiscoveredReads.join(", "));
  }

  // Ensure source component modules remain part of the audited build inputs.
  if (!headerModule.includes("customElements.define") ||
      !newPageModule.includes("customElements.define") ||
      !clearTabsModule.includes("customElements.define") ||
      !projectResetModule.includes("customElements.define") ||
      !clearBrowserDataModule.includes("customElements.define") ||
      !extraKeysModule.includes("customElements.define") ||
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

  const extraKeysBundleResult = await build({
    absWorkingDir: ROOT,
    entryPoints: [path.join(ROOT, "core/mobile-extra-keys/mobile-extra-keys.js")],
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    target: ["es2020"],
    legalComments: "none"
  });
  const extraKeysBundle = extraKeysBundleResult.outputFiles[0].text;

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
  shell = shell.replace(/\s*<script\b[^>]*new-page-action[^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*workspace-divider\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*mobile-workspace\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*mobile-extra-keys\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*clear-tabs\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*project-reset\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*clear-project-cookies\.js["'][^>]*>\s*<\/script>/i, "");
  shell = shell.replace(/\s*<script\b[^>]*src=["'][^"']*script\.js["'][^>]*>\s*<\/script>/i, "");
  // The standalone document must not initiate relative iframe navigations.
  // Both child documents are supplied below through srcdoc.
  shell = shell.replace(/(<iframe\b[^>]*?)\s+src=(["'])[^"']*\2/gi, "$1");
  shell = shell.replace("</head>", "<style>\n" + rootCss + "\n</style>\n</head>");

  const bootstrap = `
(() => {
  ${makeHeaderComponent(headerMarkup, headerCss)}
  class OfflineNewPageAction extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = "<style>" + ${JSON.stringify(newPageCss)} + "</style>" + ${JSON.stringify(newPageMarkup)};
      root.querySelector("button").addEventListener("click", () => window.open("about:blank", "_blank", "noopener"));
    }
  }
  customElements.define("new-page-action", OfflineNewPageAction);
  window.__ALFACODE_EXTRA_KEYS_ASSETS__ = { html: ${JSON.stringify(extraKeysMarkup)}, css: ${JSON.stringify(extraKeysCss)} };
  ${extraKeysBundle}
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
  // Register message and load listeners before assigning fast-loading srcdoc documents.
  ${coordinator}
  editorFrame.srcdoc = ${JSON.stringify(editorDocument)};
  previewFrame.srcdoc = ${JSON.stringify(previewDocument)};
})();
`;
  shell = injectBeforeBodyEnd(shell, "<script>\n" + escapeScript(bootstrap) + "\n</script>");

  if (!/<!doctype html>/i.test(shell) || !shell.includes("editorFrame.srcdoc") ||
      !shell.includes("previewFrame.srcdoc") ||
      /<script\b[^>]*\bsrc\s*=|<link\b[^>]*\bhref\s*=|<iframe\b[^>]*\bsrc\s*=/i.test(shell)) {
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
