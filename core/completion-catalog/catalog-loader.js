const CATALOG_PATHS = {
  html: "../../alfacode/data/completions.html.json",
  css: "../../alfacode/data/completions.css.json",
  javascript: "../../alfacode/data/completions.javascript.json"
};

export async function loadCompletionCatalogs({ fetcher = fetch, baseUrl = globalThis.document?.baseURI ?? "http://localhost/" } = {}) {
  const embedded = globalThis.__ALFACODE_COMPLETION_CATALOGS__;
  const entries = await Promise.all(Object.entries(CATALOG_PATHS).map(async ([language, path]) => {
    try {
      let payload = embedded?.[language];
      if (!payload) {
        const response = await fetcher(new URL(path, baseUrl), { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        payload = await response.json();
      }
      if (!payload || payload.schemaVersion !== 1 || !Array.isArray(payload.records)) {
        throw new Error("Invalid catalog schema");
      }
      const active = payload.records.filter(record =>
        record && record.enabled !== false && typeof record.label === "string"
      );
      return [language, {
        records: active.map(record => ({ ...record, language })),
        sourceCount: payload.records.length,
        catalogVersion: payload.catalogVersion ?? null,
        error: null
      }];
    } catch (error) {
      return [language, { records: [], sourceCount: null, catalogVersion: null, error: error?.message ?? String(error) }];
    }
  }));
  return Object.fromEntries(entries);
}
