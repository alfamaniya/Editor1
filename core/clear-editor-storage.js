/* Editor1 data cleanup action.
 * Remove storage data associated with Editor1 only.
 */
(function () {
  "use strict";
  const button = document.querySelector(".main-header .scroll-area .item");
  if (!button) return;

  const EDITOR_PREFIX = "editor1";
  const EDITOR_DB_NAME = "Editor1BrowserStorage";

  function removeEditorCookies() {
    const names = document.cookie.split(";").map(part => part.trim().split("=")[0]).filter(Boolean);
    let count = 0;
    names.forEach(encodedName => {
      let name = encodedName;
      try { name = decodeURIComponent(encodedName); } catch (_) {}
      if (!name.toLowerCase().startsWith(EDITOR_PREFIX)) return;
      document.cookie = encodedName + "=; Max-Age=0; Path=/; SameSite=Lax";
      count++;
    });
    return count;
  }

  async function clearEditorData() {
    let localCount = 0, sessionCount = 0, cookieCount = 0, dbCount = 0, cacheCount = 0;
    [localStorage, sessionStorage].forEach(storage => {
      const keys = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.toLowerCase().startsWith(EDITOR_PREFIX)) keys.push(key);
      }
      keys.forEach(key => storage.removeItem(key));
      if (storage === localStorage) localCount = keys.length;
      else sessionCount = keys.length;
    });

    cookieCount = removeEditorCookies();

    // Remove IndexedDB databases whose names identify them as Editor1 data.
    if (window.indexedDB && typeof indexedDB.databases === "function") {
      const databases = await indexedDB.databases();
      const targets = databases.filter(db => db.name && db.name.toLowerCase().includes(EDITOR_PREFIX));
      await Promise.all(targets.map(db => new Promise(resolve => {
        const request = indexedDB.deleteDatabase(db.name);
        request.onsuccess = request.onerror = request.onblocked = () => resolve();
      })));
      dbCount = targets.length;
    } else if (window.indexedDB) {
      // Fallback for browsers without databases(): delete the known Editor1 database.
      await new Promise(resolve => {
        const request = indexedDB.deleteDatabase(EDITOR_DB_NAME);
        request.onsuccess = request.onerror = request.onblocked = () => resolve();
      });
      dbCount = 1;
    }

    // Remove CacheStorage entries whose names include Editor1.
    if ("caches" in window) {
      const names = await caches.keys();
      const targets = names.filter(name => name.toLowerCase().includes(EDITOR_PREFIX));
      await Promise.all(targets.map(name => caches.delete(name)));
      cacheCount = targets.length;
    }
    return { localCount, sessionCount, cookieCount, dbCount, cacheCount };
  }

  button.textContent = "clear editor data";
  button.title = "Remove saved Editor1 data from this browser";
  button.setAttribute("aria-label", "Clear saved Editor1 browser data");

  button.addEventListener("click", async () => {
    if (!window.confirm("This will remove saved Editor1 data from this browser, including local/session storage, cookies, databases, and caches. Continue?")) return;
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = "clearing...";
    try {
      const result = await clearEditorData();
      button.textContent = "data cleared";
      window.alert("Editor1 browser data cleanup finished.\nLocal storage keys: " + result.localCount + "\nSession storage keys: " + result.sessionCount + "\nEditor cookies: " + result.cookieCount + "\nEditor databases: " + result.dbCount + "\nEditor caches: " + result.cacheCount);
    } catch (error) {
      console.error("Editor1 cleanup failed:", error);
      button.textContent = "cleanup failed";
      window.alert("Some Editor1 data could not be removed. See the browser console for details.");
    } finally {
      button.disabled = false;
      window.setTimeout(() => { button.textContent = originalText; }, 2500);
    }
  });
})();
