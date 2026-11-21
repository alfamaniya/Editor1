<!-- #STORAGE.md: مرجع ذخیره داده و پروژه‌های مرورگر Editor1 -->
# ذخیره‌سازی داده
## موتور مستقل
`core/browser-storage.js` موتور یکپارچه با API عمومی `window.Editor1Storage` است؛ قابلیت‌های اعلام‌شده شامل LocalStorage، IndexedDB، cookies قابل دسترس JavaScript، پروژه‌ها، autosave، تخمین ظرفیت و پاک‌سازی است.
## UI
- `core/browser-storage/`: HTML/CSS/JS رابط ابزار ذخیره‌سازی.
- نسخه قدیمی در `backup/core-old/browser-storage/`.
## پاک‌سازی
`core/clear-editor-storage.js` داده‌های مرتبط با Editor1 را پاک می‌کند؛ scope بر اساس نام Editor1 محدود می‌شود و محدودیت مرورگر برای HttpOnly cookies و scopeهای دیگر پابرجاست.
## وضعیت اتصال
README قبلی اتصال کامل موتور به Workspace و تأیید واقعی مرورگر را pending ثبت کرده بود؛ وضعیت باید پس از تست جدید به‌روز شود.
