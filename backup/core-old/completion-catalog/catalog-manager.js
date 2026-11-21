// #catalog-manager.js: فایل catalog manager مربوط به بخش completion catalog پروژه
const LANGUAGE_TYPES = {
  html: ["tag"], css: ["property", "selector", "value", "at-rule", "function", "unit"],
  javascript: ["identifier", "member", "snippet", "literal"]
};
const REQUIRED_COMMON = ["id", "language", "type", "category", "label", "description"];

export function parseCatalogImport(source, language) {
  const text = String(source ?? "").trim();
  if (!text) throw new Error("داده‌ای برای ورود وجود ندارد.");
  if (text.startsWith("{") || text.startsWith("[")) {
    const parsed = JSON.parse(text);
    const records = Array.isArray(parsed) ? parsed : parsed.records;
    if (!Array.isArray(records)) throw new Error("JSON باید آرایه رکوردها یا شیء دارای records باشد.");
    return records.map(record => ({ ...record, language }));
  }
  const delimiter = text.includes("\t") ? "\t" : ",";
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  const parseLine = line => {
    const cells = []; let value = "", quoted = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && quoted && line[i + 1] === '"') { value += '"'; i++; }
      else if (char === '"' && !quoted && value.length === 0) quoted = true;
      else if (char === '"' && quoted) quoted = false;
      else if (char === delimiter && !quoted) { cells.push(value); value = ""; }
      else value += char;
    }
    if (quoted) throw new Error("ساختار نقل‌قول در CSV/TSV ناقص است.");
    cells.push(value); return cells;
  };
  const headers = parseLine(lines.shift()).map(value => value.trim());
  if (!headers.includes("label")) throw new Error("ستون label در سرستون‌ها الزامی است.");
  return lines.map((line, index) => {
    const cells = parseLine(line), record = { language };
    headers.forEach((header, column) => {
      if (!header) return;
      const raw = cells[column] ?? "";
      if (raw === "true") record[header] = true;
      else if (raw === "false") record[header] = false;
      else if (["order", "rank", "catalogVersion"].includes(header) && raw !== "" && Number.isFinite(Number(raw))) record[header] = Number(raw);
      else if ((raw.startsWith("[") && raw.endsWith("]")) || (raw.startsWith("{") && raw.endsWith("}"))) {
        try { record[header] = JSON.parse(raw); } catch { record[header] = raw; }
      } else record[header] = raw;
    });
    if (!record.id) record.id = language + ":draft:" + (index + 1) + ":" + String(record.label || "item").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
    return record;
  });
}

export function validateCatalogDraft(language, records) {
  const errors = [], add = (index, field, message) => errors.push({ index, field, message });
  if (!LANGUAGE_TYPES[language]) return [{ index: -1, field: "language", message: "زبان پشتیبانی نمی‌شود." }];
  if (!Array.isArray(records)) return [{ index: -1, field: "records", message: "رکوردها باید آرایه باشند." }];
  const ids = new Set(), semantics = new Set();
  records.forEach((record, index) => {
    if (!record || typeof record !== "object" || Array.isArray(record)) { add(index, "$", "هر رکورد باید یک شیء باشد."); return; }
    for (const field of REQUIRED_COMMON) if (typeof record[field] !== "string" || !record[field].trim()) add(index, field, "این فیلد الزامی است.");
    if (record.language !== language) add(index, "language", "زبان رکورد با کاتالوگ انتخاب‌شده یکسان نیست.");
    if (!LANGUAGE_TYPES[language].includes(record.type)) add(index, "type", "نوع رکورد برای این زبان معتبر نیست.");
    if (!Number.isInteger(record.order) || record.order < 1) add(index, "order", "ترتیب باید عدد صحیح مثبت باشد.");
    if (typeof record.enabled !== "boolean") add(index, "enabled", "enabled باید true یا false باشد.");
    if (record.id) { if (ids.has(record.id)) add(index, "id", "شناسه تکراری است."); ids.add(record.id); }
    if (language === "html" && record.type === "tag") {
      for (const field of ["tagName", "operation", "namespace"]) if (typeof record[field] !== "string" || !record[field].trim()) add(index, field, "این فیلد برای تگ HTML الزامی است.");
      if (typeof record.isVoid !== "boolean") add(index, "isVoid", "isVoid باید boolean باشد.");
      for (const field of ["contexts", "parentTags"]) if (!Array.isArray(record[field]) || !record[field].every(item => typeof item === "string")) add(index, field, "این فیلد باید آرایه رشته‌ای باشد.");
      if (record.operation !== "open") add(index, "operation", "operation باید open باشد.");
      if (!["html", "svg"].includes(record.namespace)) add(index, "namespace", "namespace باید html یا svg باشد.");
    }
    if (language !== "html") {
      if (record.mode !== record.type) add(index, "mode", "mode باید با type یکسان باشد.");
      if (typeof record.insertText !== "string" || !record.insertText.trim()) add(index, "insertText", "متن درج الزامی است.");
    }
    if (language === "css" && record.type === "value" && typeof record.propertyName !== "string") add(index, "propertyName", "نام property برای value الزامی است.");
    if (language === "javascript" && record.type === "member") {
      if (typeof record.owner !== "string" || !record.owner.trim()) add(index, "owner", "مالک member الزامی است.");
      if (!["static-method", "instance-method", "static-property", "instance-property", "host-method"].includes(record.memberKind)) add(index, "memberKind", "طبقه‌بندی member معتبر نیست.");
    }
    if (language === "javascript" && record.type === "snippet" && record.enabled !== false) add(index, "enabled", "Snippetها تا زمان بازبینی باید غیرفعال باشند.");
    const semantic = language === "html" ? [record.type, record.namespace, record.tagName].join(":")
      : language === "css" && record.type === "value" ? [record.type, record.propertyName, record.label].join(":")
      : language === "javascript" && record.type === "member" ? [record.type, record.owner, record.label].join(":")
      : [record.type, record.label].join(":");
    if (semantics.has(semantic)) add(index, "label", "رکورد از نظر معنایی تکراری است.");
    semantics.add(semantic);
  });
  if (language === "html") {
    const names = new Set(records.filter(record => record?.type === "tag" && typeof record.tagName === "string").map(record => record.tagName.toLowerCase()));
    records.forEach((record, index) => (record?.parentTags ?? []).forEach(parent => {
      if (typeof parent === "string" && !names.has(parent.toLowerCase())) add(index, "parentTags", "والد تعریف‌نشده: " + parent);
    }));
  }
  if (language === "css") {
    const properties = new Set(records.filter(record => record?.type === "property").map(record => record.label));
    records.forEach((record, index) => {
      if (record?.type === "value" && record.propertyName !== "*" && !properties.has(record.propertyName)) add(index, "propertyName", "ویژگی CSS مرجع پیدا نشد: " + record.propertyName);
    });
  }
  if (language === "javascript") {
    records.forEach((record, index) => {
      if (record?.type === "literal" && !["boolean", "null"].includes(record.literalKind)) add(index, "literalKind", "literalKind باید boolean یا null باشد.");
      if (record?.type === "identifier" && record.category === "کلمات کلیدی" &&
          !["reserved", "strict-reserved", "contextual-reserved", "contextual", "future-reserved"].includes(record.keywordKind)) {
        add(index, "keywordKind", "طبقه‌بندی کلمه کلیدی معتبر نیست.");
      }
    });
  }
  return errors;
}

export function createBlankRecord(language, order = 1) {
  const base = { id: language + ":draft:" + order, language, category: "پیش‌نویس", label: "", description: "", order, enabled: true };
  if (language === "html") return { ...base, type: "tag", tagName: "", operation: "open", isVoid: false, contexts: [], parentTags: [], namespace: "html" };
  if (language === "css") return { ...base, type: "property", mode: "property", insertText: "" };
  if (language === "javascript") return { ...base, type: "identifier", mode: "identifier", insertText: "" };
  throw new Error("زبان پشتیبانی نمی‌شود.");
}

export function serializeCatalog(language, catalogVersion, records) {
  return JSON.stringify({ schemaVersion: 1, catalogVersion, records }, null, 2) + "\n";
}
