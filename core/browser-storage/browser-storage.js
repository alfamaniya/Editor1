// #browser-storage.js: فایل browser storage مربوط به بخش browser storage پروژه
const STORAGE_KEY = "alfacode.editor1.sources.v1";
const SAVE_DELAY = 250;

export default class BrowserStorage {
  constructor({ onStatus = () => {}, delay = SAVE_DELAY } = {}) {
    this.onStatus = onStatus;
    this.delay = delay;
    this.pendingTimer = null;
    this.pendingSources = null;
    this.disabled = false;
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
      // # مهاجرت: نمونه قدیمی HTML Showcase با پنل ویژوال پیش‌فرض جایگزین می‌شود؛ داده‌های شخصی دیگر حفظ می‌شوند.
      if (saved.sources.html.includes("<title>HTML Element Showcase</title>")) {
        return { sources: fallback, restored: false };
      }
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
    if (this.disabled) return false;
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

  clearProjectData() {
    this.disabled = true;
    if (this.pendingTimer !== null) {
      window.clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
    this.pendingSources = null;

    let removedCookies = 0;
    const cookieNames = document.cookie
      .split(";")
      .map(cookie => cookie.trim().split("=")[0])
      .filter(Boolean);
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const paths = ["/"];
    let currentPath = "";
    for (const part of pathParts) {
      currentPath += "/" + part;
      paths.push(currentPath, currentPath + "/");
    }
    for (const name of new Set(cookieNames)) {
      for (const path of new Set(paths)) {
        document.cookie = name + "=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=" + path + "; SameSite=Lax";
      }
      removedCookies += 1;
    }

    let removedStorage = false;
    try {
      removedStorage = window.localStorage.getItem(STORAGE_KEY) !== null;
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      this.onStatus("Browser data could not be fully cleared", "error");
      return { removedCookies, removedStorage, error: true };
    }
    this.onStatus("Project browser data cleared", "saved");
    return { removedCookies, removedStorage, error: false };
  }
}
