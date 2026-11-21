<!-- #ENGINES.md: شناسنامه موتورهای اصلی و runtimeهای Editor1 -->
# موتورهای Editor1

## معیار
«موتور» زیرسیستم دارای منطق/runtime مستقل است. UIهای کوچک و اکشن‌ها در [Modules](MODULES.md) ثبت می‌شوند. این دسته‌بندی اولیه است و باید با بررسی dependencies تثبیت شود.

## موتورهای شناسایی‌شده
### AlfaCode Editor Engine
- منبع: `alfacode/src/`.
- مسئولیت: document/state/history/selection/transaction، input، tokenizer و parser/language adapters، completion و rendering.
- زبان‌ها: HTML، CSS، JavaScript.
- وضعیت: در Editor UI استفاده می‌شود؛ شرح [ALFACODE.md].
### Live Preview Runtime
- منبع: `core/preview/preview.js` و `preview.html`.
- مسئولیت: اعمال sourceها و رندر Preview.
- وضعیت: runtime فعال؛ قرارداد پیام باید از سورس استخراج شود.
### Visual Editor Runtime
- منبع: `core/visual-editor/`.
- مسئولیت: انتخاب عناصر، Inspector، تغییر CSS و draft/apply/cancel/reset.
- وضعیت: فعال اما در حال تکمیل؛ برخی controls/readback/tests و بررسی دستی باقی است.
### Browser Storage Engine
- منبع: `core/browser-storage.js`.
- قابلیت‌های اعلام‌شده: LocalStorage، IndexedDB، cookies قابل دسترس JS، پروژه‌ها، autosave، تخمین ظرفیت و پاک‌سازی.
- وضعیت: مستقل؛ اتصال/تأیید مرورگر هنوز باید پیگیری شود.
### Offline Builder / Audit
- منبع: `scripts/build-offline.mjs`، `scripts/audit-offline-output.mjs` و manifest.
- مسئولیت: ساخت HTML مستقل و ممیزی خروجی.
- وضعیت: workflow برای اجرا وجود دارد؛ آخرین نتیجه باید از CI بررسی شود.

## تکمیل
Public API، dependencies، ورودی/خروجی و تست‌های هر engine از سورس استخراج شوند. component صرفاً با نام folder موتور فرض نشود.
