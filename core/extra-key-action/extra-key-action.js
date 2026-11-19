/* Helper Keys: desktop footer remains unchanged; mobile row follows editor focus and keyboard viewport. */
(() => {
  "use strict";
  const editorFrame = document.getElementById("editorFrame");
  const buttons = document.querySelectorAll("[data-extra-key]");
  const mobileBar = document.getElementById("mobileHelperKeys");
  if (!editorFrame || buttons.length === 0) return;

  let editorFocused = false;
  let keyboardVisible = false;
  const isMobileWidth = () => window.matchMedia("(max-width: 700px)").matches;
  const viewport = window.visualViewport;

  function updateMobileBar() {
    const show = isMobileWidth() && editorFocused && keyboardVisible;
    mobileBar?.classList.toggle("is-visible", show);
    mobileBar?.setAttribute("aria-hidden", String(!show));
    if (show && viewport) mobileBar.style.bottom = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) + "px";
    else mobileBar?.style.removeProperty("bottom");
  }

  function detectKeyboard() {
    if (!isMobileWidth() || !viewport) { keyboardVisible = false; updateMobileBar(); return; }
    // Heuristic: a substantial visual viewport height loss usually indicates the native keyboard.
    keyboardVisible = window.innerHeight - viewport.height > 130;
    updateMobileBar();
  }
  viewport?.addEventListener("resize", detectKeyboard);
  viewport?.addEventListener("scroll", detectKeyboard);
  window.addEventListener("resize", detectKeyboard);

  window.addEventListener("message", event => {
    if (event.source !== editorFrame.contentWindow || !event.data) return;
    if (event.data.type === "alfacode:editor-state") {
      editorFocused = Boolean(event.data.focused);
      updateMobileBar();
    }
  });
  mobileBar?.querySelectorAll("button").forEach(button => {\n    button.addEventListener("pointerdown", event => event.preventDefault());\n  });\n  buttons.forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.extraKey;
    if (!key) return;
    editorFrame.contentWindow?.postMessage({ type: "alfacode:extra-key-command", key }, "*");
  }));
  detectKeyboard();
})();