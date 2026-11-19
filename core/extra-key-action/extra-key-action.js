/* Helper Keys component: sends selected symbols to the active AlfaCode editor. */
(() => {
  "use strict";

  const editorFrame = document.getElementById("editorFrame");
  const helperKeyButtons = document.querySelectorAll("[data-extra-key]");

  if (!editorFrame || helperKeyButtons.length === 0) return;

  helperKeyButtons.forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.extraKey;
      if (!key) return;

      editorFrame.contentWindow?.postMessage({
        type: "alfacode:extra-key-command",
        key
      }, "*");
    });
  });
})();
