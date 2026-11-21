// #repository-tree-action.js: اتصال دکمه Repository Tree به صفحه مستقل درخت مخزن
"use strict";

document.getElementById("repositoryTree")?.addEventListener("click", () => {
  window.open(new URL("repository-tree/index.html", document.baseURI).href, "_blank", "noopener");
});
