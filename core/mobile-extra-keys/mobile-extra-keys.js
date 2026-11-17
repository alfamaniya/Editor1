// Mobile-only coding keys. The editor owns all document mutations.
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
    this.onViewportChange = () => this.updateVisibility();
    this.onFocusChange = () => this.updateVisibility();
    this.onFocusOut = () => queueMicrotask(() => {
      if (!document.activeElement?.isContentEditable) this.focusViewportHeight = null;
      this.updateVisibility();
    });
    this.focusViewportHeight = null;
    this.lastUnobstructedHeight = window.innerHeight;
  }

  async connectedCallback() {
    if (this.shadowRoot.childElementCount) return;
    const base = new URL("./", import.meta.url);
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
    this.updateVisibility();
    window.visualViewport?.addEventListener("resize", this.onViewportChange);
    window.addEventListener("resize", this.onViewportChange);
    document.addEventListener("focusin", this.onFocusChange);
    document.addEventListener("focusout", this.onFocusOut);
  }

  disconnectedCallback() {
    window.visualViewport?.removeEventListener("resize", this.onViewportChange);
    window.removeEventListener("resize", this.onViewportChange);
    document.removeEventListener("focusin", this.onFocusChange);
    document.removeEventListener("focusout", this.onFocusOut);
  }

  setLanguage(language) {
    if (!LANGUAGE_KEYS[language] || language === this.activeLanguage) return;
    this.activeLanguage = language;
    this.renderLanguageKeys();
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
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    const focused = document.activeElement?.isContentEditable === true;
    const viewport = window.visualViewport;
    if (focused && this.focusViewportHeight === null) {
      this.focusViewportHeight = this.lastUnobstructedHeight || window.innerHeight;
    }
    if (!focused) {
      this.focusViewportHeight = null;
      if (!viewport || viewport.height >= window.innerHeight - 100) {
        this.lastUnobstructedHeight = window.innerHeight;
      }
    }
    const keyboardOpen = Boolean(
      viewport && viewport.scale <= 1.01 && this.focusViewportHeight !== null &&
      this.focusViewportHeight - viewport.height > 110
    );
    const viewportBottom = viewport
      ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
      : 0;
    this.style.setProperty("--extra-keys-viewport-bottom", viewportBottom + "px");
    this.dataset.visible = String(mobile && focused && keyboardOpen);
  }
}

if (!customElements.get("mobile-extra-keys")) {
  customElements.define("mobile-extra-keys", MobileExtraKeys);
}