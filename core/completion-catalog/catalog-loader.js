const CATALOG_URLS = {
  html: new URL("../../alfacode/data/completions.html.json", import.meta.url),
  css: new URL("../../alfacode/data/completions.css.json", import.meta.url),
  javascript: new URL("../../alfacode/data/completions.javascript.json", import.meta.url)
};

export async function loadCompletionCatalogs({ fetcher = fetch } = {}) {
  const entries = await Promise.all(Object.entries(CATALOG_URLS).map(async ([language, url]) => {
    try {
      const response = await fetcher(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (!payload || !Array.isArray(payload.records)) throw new Error("Invalid catalog schema");
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
