const STORAGE_KEY = "alfacode.editor1.sources.v1";
const SAVE_DELAY = 250;

export default class BrowserStorage {
  constructor({ onStatus = () => {}, delay = SAVE_DELAY } = {}) {
    this.onStatus = onStatus;
    this.delay = delay;
    this.pendingTimer = null;
    this.pendingSources = null;
  }

  load(fallbackSources) {
    const fallback = { ...fallbackSources };
    try {
      const serialized = window.localStorage.getItem(STORAGE_KEY);
      if (!serialized) return { sources: fallback, restored: false };
      const saved = JSON.parse(serialized);
      const valid = saved &&
        saved.version === 1 &&
        ["html", "css", "javascript"].every(key => typeof saved.sources?.[key] === "string");
      if (!valid) return { sources: fallback, restored: false };
      return { sources: { ...fallback, ...saved.sources }, restored: true };
    } catch (error) {
      this.onStatus("Browser storage unavailable", "error");
      return { sources: fallback, restored: false };
    }
  }

  schedule(sources) {
    this.pendingSources = { ...sources };
    this.onStatus("Saving…", "saving");
    if (this.pendingTimer !== null) window.clearTimeout(this.pendingTimer);
    this.pendingTimer = window.setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  flush(sources = this.pendingSources) {
    if (this.pendingTimer !== null) {
      window.clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
    if (!sources) return false;
    try {
      const payload = {
        version: 1,
        savedAt: new Date().toISOString(),
        sources: {
          html: sources.html,
          css: sources.css,
          javascript: sources.javascript
        }
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      this.pendingSources = null;
      this.onStatus("Saved in browser", "saved");
      return true;
    } catch (error) {
      this.onStatus("Browser save failed", "error");
      return false;
    }
  }
}
