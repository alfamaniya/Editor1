<!-- #PAGES.md: مرجع صفحات و بخش‌های رابط کاربری Editor1 -->
# صفحات و بخش‌های UI

این سند کاتالوگ صفحات/سطوح UI است. ثبت component/iframe به معنی route مستقل بودن نیست.

## قالب ثبت صفحه
- **نام/عنوان UI:**
- **مسیر فایل:**
- **هدف:**
- **بخش‌ها و اجزا:**
- **دکمه‌ها و اکشن‌ها:**
- **CSS و JS مرتبط:**
- **ارتباط با صفحات/ماژول‌ها:**
- **وضعیت:** فعال / نیمه‌فعال / placeholder / آرشیو
- **تست و تأیید:**
- **کارهای باقی‌مانده:**

## سطوح شناسایی‌شده
### Workspace اصلی
- مسیر: `index.html`؛ Shell با Header/Footer، Editor، Preview و Divider.
- CSS: `style.css`؛ رفتار/bridge: `core/editor-bridge.js` و ماژول‌های `core/`.
- وضعیت: فعال؛ تأیید دستی مرورگر/موبایل برای برخی موارد pending است.
- **Editor starter source:** `core/editor/editor.js` seeds HTML/CSS/JavaScript with an editable Visual Settings panel scaffold (instead of the HTML Showcase demo); legacy demo seed is migrated while other saved sources are preserved.

### AlfaCode Editor
- مسیر: `core/editor/editor.html`؛ ویرایش HTML/CSS/JS با AlfaCode.
- CSS/JS: `core/editor/editor.css`، `core/editor/editor.js` و `alfacode/src/`.
### Live Preview
- مسیر: `core/preview/preview.html`؛ رندر live در iframe جدا.
- CSS/JS: `core/preview/preview.css`، `core/preview/preview.js`.
### Visual Editor
- منطق: `core/visual-editor/visual-editor.js` و `core/visual-editor/visual-editor.css`، با پنل portaled به صفحه میزبان.
- هدف: انتخاب عنصر و تغییر CSS؛ وضعیت تکمیل در نقشه‌های Visual.
### Repository Tree
- مسیر: `repository-tree/index.html`؛ اکشن: `core/repository-tree-action/repository-tree-action.js`.
- هدف: درخت فایل‌های مخزن؛ صفحه مستقل و workflow بازسازی خودکار.
### ابزارهای مستقل/قابل بازشدن
- Completion Catalog: `core/completion-catalog/completion-catalog.html`؛ کاتالوگ پیشنهادها.
- Browser Storage: `core/browser-storage/browser-storage.html`؛ رابط ذخیره‌سازی مرورگر.
- CSS/JavaScript/Tag Suggestions: اجزای پیشنهاد برای زبان/context.
- New Page Action: `core/new-page-action/new-page-action.html`؛ جزء ساخت صفحه.

## تکمیل ثبت
برای هر صفحه، actionها، dependencies و status از سورس واقعی بررسی شود. component یا iframe صرفاً به دلیل فایل HTML مستقل، route جدا محسوب نشود.
