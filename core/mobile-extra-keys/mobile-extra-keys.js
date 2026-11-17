// Top-level mobile coding keys. All document changes are delegated to AlfaCode Editor.
const LANGUAGE_KEYS = {
  html: ["<", ">", "/", "=", "\"", "'", "!", "-", "&", ";", "(", ")"],
  css: ["{", "}", ";", ":", "#", ".", "(", ")", "%", "!", "-", "/"],
  javascript: ["{", "}", "(", ")", "[", "]", ";", "=", "=>", "!", "'", "\""]
};

export class MobileExtraKeys extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.activeLanguage = "html";
    this.editorFocused = false;
    this.baselineHeight = Math.max(window.innerHeight, window.visualViewport?.height || 0);
    this.onViewportChange = () => this.updateVisibility();
    this.onEditorState = event => {
      const state = event.detail || {};
      this.setEditorState(state.focused, state.language);
    };
  }

  async connectedCallback() {
    if (this.shadowRoot.childElementCount) return;
    const moduleUrl = document.querySelector('script[type="module"][src*="mobile-extra-keys.js"]')?.src || document.baseURI;
    const base = new URL("./", moduleUrl);
    let assets = window.__ALFACODE_EXTRA_KEYS_ASSETS__;
    if (!assets) {
      const [markupResponse, cssResponse] = await Promise.all([
        fetch(new URL("mobile-extra-keys.html", base)),
        fetch(new URL("mobile-extra-keys.css", base))
      ]);
      if (!markupResponse.ok || !cssResponse.ok) {
        throw new Error("Unable to load mobile extra keys.");
      }
      assets = { html: await markupResponse.text(), css: await cssResponse.text() };
    }
    const style = document.createElement("style");
    style.textContent = assets.css;
    const template = document.createElement("template");
    template.innerHTML = assets.html;
    this.shadowRoot.append(style, template.content.cloneNode(true));
    this.shadowRoot.addEventListener("pointerdown", event => {
      if (event.target.closest("button[data-key]")) event.preventDefault();
    });
    this.shadowRoot.addEventListener("click", event => {
      const button = event.target.closest("button[data-key]");
      if (!button) return;
      this.dispatchEvent(new CustomEvent("alfacode:extra-key", {
        bubbles: true,
        composed: true,
        detail: { key: button.dataset.key }
      }));
    });
    this.renderLanguageKeys();
    this.addEventListener("alfacode:editor-state", this.onEditorState);
    window.visualViewport?.addEventListener("resize", this.onViewportChange);
    window.addEventListener("resize", this.onViewportChange);
    this.updateVisibility();
  }

  disconnectedCallback() {
    this.removeEventListener("alfacode:editor-state", this.onEditorState);
    window.visualViewport?.removeEventListener("resize", this.onViewportChange);
    window.removeEventListener("resize", this.onViewportChange);
  }

  setEditorState(focused, language = this.activeLanguage) {
    this.editorFocused = focused === true;
    if (LANGUAGE_KEYS[language]) {
      this.activeLanguage = language;
      this.renderLanguageKeys();
    }
    if (!this.editorFocused) {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      if (viewportHeight >= window.innerHeight - 100) {
        this.baselineHeight = Math.max(window.innerHeight, viewportHeight);
      }
    }
    this.updateVisibility();
  }

  renderLanguageKeys() {
    const row = this.shadowRoot.querySelector(".key-row--language");
    if (!row) return;
    row.replaceChildren(...LANGUAGE_KEYS[this.activeLanguage].map(key => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.key = key;
      button.textContent = key;
      button.setAttribute("aria-label", key);
      return button;
    }));
  }

  updateVisibility() {
    const mobile = window.matchMedia("(max-width: 700px)").matches ||
      window.matchMedia("(pointer: coarse) and (max-height: 1000px)").matches;
    const viewport = window.visualViewport;
    const visibleHeight = Math.min(window.innerHeight, viewport?.height ?? window.innerHeight);
    const keyboardOpen = this.baselineHeight - visibleHeight > 100;
    const viewportBottom = viewport
      ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
      : 0;
    this.style.setProperty("--extra-keys-viewport-bottom", viewportBottom + "px");
    this.dataset.visible = String(mobile && this.editorFocused && keyboardOpen);
    if (!this.editorFocused && !keyboardOpen) {
      this.baselineHeight = Math.max(this.baselineHeight, window.innerHeight, viewport?.height || 0);
    }
  }
}

if (!customElements.get("mobile-extra-keys")) {
  customElements.define("mobile-extra-keys", MobileExtraKeys);
}