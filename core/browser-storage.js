/* 
 * Editor1 Browser Storage
 * موتور یکپارچه ذخیره‌سازی مرورگر برای Editor1.
 * این فایل به‌صورت اسکریپت معمولی (بدون module) بارگذاری می‌شود و API آن را
 * در window.Editor1Storage قرار می‌دهد تا اجرای آنلاین و آفلاین ساده بماند.
 */
(function (global) {
  "use strict";

  const PREFIX = "editor1";
  const LOCAL_PREFIX = PREFIX + ":";
  const DB_NAME = "Editor1BrowserStorage";
  const DB_VERSION = 1;
  const STORE_NAME = "records";
  const DEFAULT_SAVE_DELAY = 300;

  // بررسی وجود APIهای ذخیره‌سازی در مرورگر فعلی
  function capabilities() {
    return {
      localStorage: typeof global.localStorage !== "undefined",
      indexedDB: typeof global.indexedDB !== "undefined",
      cookies: typeof global.document !== "undefined" && typeof global.document.cookie === "string",
      storageEstimate: !!(global.navigator && global.navigator.storage && global.navigator.storage.estimate)
    };
  }

  // ایجاد خطای واضح برای محیط‌هایی که Storage در آن‌ها در دسترس نیست
  function requireLocalStorage() {
    try {
      if (!global.localStorage) throw new Error("LocalStorage is not available.");
      return global.localStorage;
    } catch (error) {
      throw new Error("LocalStorage is unavailable or blocked: " + error.message);
    }
  }

  // -------------------- LocalStorage --------------------
  const local = {
    // مقدار ذخیره‌شده را خوانده و JSON را باز می‌کند؛ در صورت نبود کلید fallback برمی‌گرداند.
    get(key, fallback) {
      const storageKey = LOCAL_PREFIX + String(key);
      try {
        const raw = requireLocalStorage().getItem(storageKey);
        return raw === null ? (fallback === undefined ? null : fallback) : JSON.parse(raw);
      } catch (error) {
        if (error instanceof SyntaxError) throw new Error("Stored JSON is invalid for key '" + key + "'.");
        throw error;
      }
    },
    // هر نوع داده JSON-پذیر را ذخیره می‌کند.
    set(key, value) {
      const storageKey = LOCAL_PREFIX + String(key);
      const serialized = JSON.stringify(value);
      if (serialized === undefined) throw new TypeError("Value cannot be serialized as JSON.");
      requireLocalStorage().setItem(storageKey, serialized);
      return true;
    },
    // حذف یک کلید متعلق به Editor1
    remove(key) {
      requireLocalStorage().removeItem(LOCAL_PREFIX + String(key));
      return true;
    },
    // حذف فقط کلیدهای متعلق به Editor1؛ داده سایت‌های دیگر را دست‌کاری نمی‌کند.
    clear() {
      const storage = requireLocalStorage();
      const keys = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(LOCAL_PREFIX)) keys.push(key);
      }
      keys.forEach(key => storage.removeItem(key));
      return keys.length;
    },
    keys() {
      const storage = requireLocalStorage();
      const result = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(LOCAL_PREFIX)) result.push(key.slice(LOCAL_PREFIX.length));
      }
      return result;
    }
  };

  // -------------------- IndexedDB --------------------
  let dbPromise = null;
  function openDatabase() {
    if (!global.indexedDB) return Promise.reject(new Error("IndexedDB is not supported."));
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = global.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = function () {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB."));
      request.onblocked = () => reject(new Error("IndexedDB upgrade is blocked by another open tab."));
    }).catch(error => {
      dbPromise = null;
      throw error;
    });
    return dbPromise;
  }

  function idbRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB request failed."));
    });
  }

  const indexed = {
    // ذخیره رکورد با شناسه؛ namespace پیش‌فرض Editor1 است.
    async put(id, value, namespace) {
      const db = await openDatabase();
      const record = { id: (namespace || PREFIX) + ":" + String(id), namespace: namespace || PREFIX, value, updatedAt: new Date().toISOString() };
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(record);
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error("IndexedDB write failed."));
        tx.onabort = () => reject(tx.error || new Error("IndexedDB write aborted."));
      });
      return record;
    },
    async get(id, namespace) {
      const db = await openDatabase();
      const key = (namespace || PREFIX) + ":" + String(id);
      const record = await idbRequest(db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key));
      return record ? record.value : null;
    },
    async remove(id, namespace) {
      const db = await openDatabase();
      const key = (namespace || PREFIX) + ":" + String(id);
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(key);
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error("IndexedDB delete failed."));
        tx.onabort = () => reject(tx.error || new Error("IndexedDB delete aborted."));
      });
      return true;
    },
    async getAll(namespace) {
      const db = await openDatabase();
      const records = await idbRequest(db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll());
      return records.filter(record => record.namespace === (namespace || PREFIX)).map(record => ({ id: record.id.split(":").slice(1).join(":"), value: record.value, updatedAt: record.updatedAt }));
    },
    async clear(namespace) {
      const db = await openDatabase();
      const target = namespace || PREFIX;
      const records = await idbRequest(db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll());
      const ids = records.filter(record => record.namespace === target).map(record => record.id);
      if (!ids.length) return 0;
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      ids.forEach(id => store.delete(id));
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error("IndexedDB clear failed."));
        tx.onabort = () => reject(tx.error || new Error("IndexedDB clear aborted."));
      });
      return ids.length;
    }
  };

  // -------------------- Cookies --------------------
  const cookies = {
    // خواندن مقدار کوکی بر اساس نام
    get(name) {
      if (!global.document) return null;
      const prefix = encodeURIComponent(String(name)) + "=";
      const item = global.document.cookie.split(";").map(part => part.trim()).find(part => part.startsWith(prefix));
      if (!item) return null;
      try { return decodeURIComponent(item.slice(prefix.length)); } catch (_) { return item.slice(prefix.length); }
    },
    // ثبت کوکی با تنظیمات اختیاری؛ کوکی‌ها فقط برای داده کوچک مناسب‌اند.
    set(name, value, options) {
      if (!global.document) throw new Error("Cookies are not available.");
      const opts = options || {};
      let cookie = encodeURIComponent(String(name)) + "=" + encodeURIComponent(String(value));
      if (opts.maxAge !== undefined) cookie += "; Max-Age=" + Math.floor(Number(opts.maxAge));
      if (opts.expires) cookie += "; Expires=" + new Date(opts.expires).toUTCString();
      cookie += "; Path=" + (opts.path || "/") + "; SameSite=" + (opts.sameSite || "Lax");
      if (opts.secure) cookie += "; Secure";
      global.document.cookie = cookie;
      return true;
    },
    // حذف کوکی در Path مشخص (مسیرهای دیگر یا HttpOnly قابل حذف از JS نیستند)
    remove(name, path) {
      this.set(name, "", { maxAge: 0, path: path || "/" });
      return true;
    },
    // حذف کوکی‌های قابل مشاهده JavaScript در Path فعلی/ریشه
    clearVisible(path) {
      if (!global.document) return 0;
      const names = global.document.cookie.split(";").map(part => part.trim().split("=")[0]).filter(Boolean);
      const unique = Array.from(new Set(names));
      unique.forEach(name => this.remove(decodeURIComponent(name), path || "/"));
      return unique.length;
    }
  };

  // -------------------- Project helpers --------------------
  const projects = {
    save(id, project) { return indexed.put("project:" + id, project, PREFIX); },
    load(id) { return indexed.get("project:" + id, PREFIX); },
    remove(id) { return indexed.remove("project:" + id, PREFIX); },
    list() { return indexed.getAll(PREFIX).then(items => items.filter(item => item.id.startsWith("project:")).map(item => ({ id: item.id.slice(8), value: item.value, updatedAt: item.updatedAt }))); }
  };

  // -------------------- Auto-save scheduler --------------------
  function createAutoSave(callback, delay) {
    if (typeof callback !== "function") throw new TypeError("Auto-save callback must be a function.");
    let timer = null;
    let latestArgs = [];
    return {
      schedule() {
        latestArgs = Array.prototype.slice.call(arguments);
        if (timer !== null) global.clearTimeout(timer);
        timer = global.setTimeout(() => {
          timer = null;
          callback.apply(null, latestArgs);
        }, delay === undefined ? DEFAULT_SAVE_DELAY : Math.max(0, Number(delay) || 0));
      },
      flush() {
        if (timer === null) return false;
        global.clearTimeout(timer);
        timer = null;
        callback.apply(null, latestArgs);
        return true;
      },
      cancel() {
        if (timer === null) return false;
        global.clearTimeout(timer);
        timer = null;
        return true;
      },
      get pending() { return timer !== null; }
    };
  }

  // -------------------- Storage quota estimate --------------------
  async function estimate() {
    if (!global.navigator || !global.navigator.storage || !global.navigator.storage.estimate) {
      return { supported: false, usage: null, quota: null };
    }
    const data = await global.navigator.storage.estimate();
    return { supported: true, usage: data.usage || 0, quota: data.quota || 0, usagePercent: data.quota ? (data.usage || 0) / data.quota * 100 : null };
  }

  // حذف داده‌های اختصاصی Editor1 از LocalStorage و IndexedDB؛ پاک‌سازی کوکی اختیاری.
  async function clearAll(options) {
    const opts = options || {};
    const localCount = local.clear();
    const indexedCount = await indexed.clear(PREFIX);
    const cookieCount = opts.cookies ? cookies.clearVisible(opts.cookiePath || "/") : 0;
    return { localStorage: localCount, indexedDB: indexedCount, cookies: cookieCount };
  }

  // API عمومی و واحد؛ همه قابلیت‌های ذخیره‌سازی از همین شیء در دسترس‌اند.
  const api = {
    version: "1.0.0",
    prefix: PREFIX,
    capabilities,
    local,
    indexed,
    cookies,
    projects,
    createAutoSave,
    estimate,
    clearAll,
    openDatabase
  };

  global.Editor1Storage = api;
})(window);
