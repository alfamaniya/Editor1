// #repository-tree.js: دریافت فهرست کامل فایل‌ها از GitHub API و تولید خودکار درخت پوشه‌ها
"use strict";

(() => {
  const OWNER = "alfamaniya";
  const REPO = "Editor1";
  const BRANCH = "main";
  const API_URL = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;

  const treeRoot = document.getElementById("treeRoot");
  const statusEl = document.getElementById("treeStatus");
  const countsEl = document.getElementById("treeCounts");
  const refreshBtn = document.getElementById("refreshTree");
  const expandBtn = document.getElementById("expandAll");
  const collapseBtn = document.getElementById("collapseAll");

  function createNode() { return { folders: new Map(), files: [] }; }

  function buildTree(entries) {
    const root = createNode();
    for (const entry of entries) {
      if (!entry || typeof entry.path !== "string") continue;
      const segments = entry.path.split("/").filter(Boolean);
      if (!segments.length) continue;
      let current = root;
      for (const segment of segments.slice(0, -1)) {
        if (!current.folders.has(segment)) current.folders.set(segment, createNode());
        current = current.folders.get(segment);
      }
      const name = segments[segments.length - 1];
      if (entry.type === "tree") {
        if (!current.folders.has(name)) current.folders.set(name, createNode());
      } else if (entry.type === "blob") {
        current.files.push({ name, path: entry.path });
      }
    }
    return root;
  }

  const sortNames = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

  function makeFolderElement(name, node, path, rootFolder = false) {
    const li = document.createElement("li");
    const details = document.createElement("details");
    details.open = rootFolder;
    const summary = document.createElement("summary");
    summary.className = "node-row";
    const twisty = document.createElement("span");
    twisty.className = "twisty";
    twisty.setAttribute("aria-hidden", "true");
    twisty.textContent = rootFolder ? "▾" : "▸";
    const folderIcon = document.createElement("span");
    folderIcon.className = "folder-icon";
    folderIcon.textContent = "📁";
    const label = document.createElement("span");
    label.className = "folder-name";
    label.textContent = name;
    summary.append(twisty, folderIcon, label);
    details.addEventListener("toggle", () => { twisty.textContent = details.open ? "▾" : "▸"; });
    const children = document.createElement("ul");
    for (const folderName of [...node.folders.keys()].sort(sortNames)) {
      children.append(makeFolderElement(folderName, node.folders.get(folderName), path ? `${path}/${folderName}` : folderName));
    }
    for (const file of [...node.files].sort((a, b) => sortNames(a.name, b.name))) children.append(makeFileElement(file));
    details.append(summary, children);
    li.append(details);
    return li;
  }

  function makeFileElement(file) {
    const li = document.createElement("li");
    const row = document.createElement("div");
    row.className = "node-row file-row";
    const spacer = document.createElement("span");
    spacer.className = "twisty";
    const icon = document.createElement("span");
    icon.className = "file-icon";
    icon.textContent = "📄";
    const link = document.createElement("a");
    link.className = "file-name file-link";
    link.textContent = file.name;
    link.href = `https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/${file.path.split("/").map(encodeURIComponent).join("/")}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = file.path;
    row.append(spacer, icon, link);
    li.append(row);
    return li;
  }

  function renderTree(entries) {
    const tree = buildTree(entries);
    const list = document.createElement("ul");
    list.append(makeFolderElement(`${REPO}/`, tree, "", true));
    treeRoot.replaceChildren(list);
    const folderCount = entries.filter(entry => entry.type === "tree").length;
    const fileCount = entries.filter(entry => entry.type === "blob").length;
    countsEl.textContent = `${folderCount} folders · ${fileCount} files`;
  }

  function setAllExpanded(expanded) {
    treeRoot.querySelectorAll("details").forEach(item => { item.open = expanded; });
  }

  async function loadTree() {
    refreshBtn.disabled = true;
    statusEl.textContent = "Loading repository tree…";
    treeRoot.innerHTML = '<p class="loading">Fetching file and folder list from GitHub…</p>';
    countsEl.textContent = "";
    try {
      const response = await fetch(API_URL, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
      if (!response.ok) {
        if (response.status === 403 || response.status === 429) throw new Error("GitHub API rate limit reached. Wait a little, then refresh.");
        throw new Error(`GitHub API request failed (${response.status}).`);
      }
      const data = await response.json();
      if (!Array.isArray(data.tree)) throw new Error("GitHub returned an unexpected tree response.");
      renderTree(data.tree);
      statusEl.textContent = data.truncated ? "Warning: GitHub returned a truncated tree." : `Loaded from branch ${BRANCH} · Refresh to sync latest changes`;
    } catch (error) {
      statusEl.textContent = "Unable to load repository tree.";
      treeRoot.replaceChildren();
      const message = document.createElement("div");
      message.className = "error";
      message.textContent = error.message || "Unexpected error occurred.";
      const retry = document.createElement("button");
      retry.type = "button";
      retry.textContent = "Try again";
      retry.addEventListener("click", loadTree);
      message.append(" ", retry);
      treeRoot.append(message);
    } finally {
      refreshBtn.disabled = false;
    }
  }

  refreshBtn.addEventListener("click", loadTree);
  expandBtn.addEventListener("click", () => setAllExpanded(true));
  collapseBtn.addEventListener("click", () => setAllExpanded(false));
  loadTree();
})();