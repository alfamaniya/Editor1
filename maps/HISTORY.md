<!-- #HISTORY.md: تاریخچه تغییرات، تصمیم‌ها و گزارش‌های اجرایی پروژه Editor1 -->
# تاریخچه و گزارش تغییرات Editor1

این سند گزارش‌ها و تصمیم‌های ثبت‌شده را از README جدا می‌کند. موارد تاریخی را به‌عنوان وضعیت جاری تلقی نکنید؛ هر مورد نشان‌دهنده وضعیت آن زمان است و status جدید باید از کد و CI بررسی شود.

## آزمایش تشخیصی CSS ریشه — ۱۹ نوامبر ۲۰۲۶
- [x] نسخه قبلی `style.css` در `style-backup.css` ذخیره شد.
- [x] محتوای `style.css` خالی شد؛ فایل و مسیر آن باقی است.
- [ ] تست مرورگر در این وضعیت و ثبت اینکه ایراد عرض Gutter/فضای سفید Preview باقی می‌ماند یا نه.
- [ ] پس از نتیجه تست، تصمیم درباره بازگردانی CSS از نسخه پشتیبان یا اصلاح هدفمند.

## نکات و محدودیت‌های فعلی
- `utils/dom.js` و `utils/helpers.js` خالی هستند و placeholder محسوب می‌شوند.
- `alfacode/examples/` و `alfacode/tests/.gitkeep` فایل نگهدارنده خالی دارند؛ فایل‌های نمونه واقعی در این پوشه فعلاً وجود ندارند.
- مستندات، ادعاهای CI را از آزمون واقعی مرورگر/موبایل جدا نگه می‌دارند؛ آزمون دستی روی دستگاه باید جدا ثبت شود.
- برنامه و اولویت‌های کار فقط در `maps/ROADMAP.md` نگهداری می‌شود.


## توضیح‌گذاری فارسی ایندکس جدید — ۱۹ نوامبر ۲۰۲۶

- [x] افزودن توضیحات فارسی به ساختار HTML، بخش‌های CSS، پنل‌ها، نوارهای Header/Footer و منطق تغییر اندازه Divider در `index.html`.
- [x] کامنت‌ها برای توضیح وظیفه هر بخش و نکات مربوط به عناصر فعلاً نمایشی/غیرفعال اضافه شدند.
- [x] در این مرحله هیچ قابلیت، استایل، مقدار، اتصال یا منطق اجرایی تغییر داده نشده؛ فقط کامنت اضافه شده است.


## تبدیل آیتم‌های Header و Footer به Button — ۱۹ نوامبر ۲۰۲۶
- [x] تمام ۹ آیتم Header و ۶ آیتم Footer از `span.item` به `button type="button"` تغییر یافت.
- [x] بازنشانی استایل پیش‌فرض دکمه‌ها (border، فونت، رنگ و appearance) برای حفظ ظاهر فعلی اضافه شد.
- [ ] اکشن‌های دکمه‌ها هنوز به JavaScript متصل نشده‌اند؛ این تغییر فقط ساختار معنایی و قابلیت تعامل‌پذیری پایه را اصلاح می‌کند.


## Browser data cleanup
- `core/clear-editor-storage.js` implements the Header action that removes Editor1-associated browser data: LocalStorage and SessionStorage keys prefixed `editor1`, visible Editor1 cookies, IndexedDB databases named for Editor1, and CacheStorage entries with Editor1 in the name. The action asks for confirmation and reports the cleanup result.
- Cleanup is scoped by Editor1-related naming to avoid deleting unrelated website data. Browser restrictions may prevent JavaScript from deleting HttpOnly cookies or cookies set for other paths/domains.


## Editor workspace connection — 19 November 2026

- The root `index.html` now hosts the archived AlfaCode editor and preview as resizable iframe panels, and includes the HTML/CSS/JavaScript tabs from the existing editor implementation.
- `core/editor-bridge.js` mediates editor source-change messages and forwards the combined HTML, CSS, and JavaScript sources to the preview iframe. It also forwards the existing clear-tabs and project-reset commands.
- The existing AlfaCode engine source under `alfacode/src/` was not modified. The editor, preview, and supporting UI runtime files have been copied from `backup/core-old/` into active `core/` paths. The archived originals remain preserved. The Editor imports AlfaCode from the unchanged `alfacode/src/` paths.
- Root `style.css` now owns the shared workspace layout and common toolbar button appearance. Both iframe panels fill their parent containers so resizing the workspace changes the panel viewport without recreating the engine.
- Browser verification, mobile testing, and offline bundle audit/build are still pending. The clear-current-tab toolbar control is currently disabled because the reused legacy editor does not expose a current-tab-only command.


### Active Editor/Preview runtime files
- `core/editor/editor.html`, `core/editor/editor.css`, `core/editor/editor.js`: three-language editor UI, rendering/input controller and AlfaCode integration.
- `core/preview/preview.html`, `core/preview/preview.css`, `core/preview/preview.js`: isolated live preview frame.
- Supporting modules copied into `core/`: browser-storage UI module, completion catalog loader/components, and HTML/CSS/JavaScript suggestion menus.
- `core/editor-bridge.js`: receives editor source updates and sends them to Preview; also relays reset, clear-all, and clear-current-tab commands.
- The original runtime files are retained under `backup/core-old/`.


## Editor toolbar actions — 19 November 2026
- `reset project`: after confirmation, restores the original starter code in all three languages and switches to the HTML tab.
- `clear tab`: after confirmation, clears only the currently selected language tab.
- `clear all tabs`: after confirmation, clears HTML, CSS, and JavaScript while keeping the currently selected tab active.
- All three actions run through `core/editor-bridge.js` and the Editor's message handler. The active editor updates its storage schedule and emits a source-change message so Preview updates immediately. Suggestion menus are hidden after clearing/reset.
- AlfaCode engine files under `alfacode/src/` are unchanged.


## Code Catalog toolbar action — 19 November 2026
- Renamed the root toolbar placeholder from `json` to `Code Catalog` and assigned the stable `codeCatalog` ID.
- Restored the archived New Page action component files to active `core/new-page-action/` (HTML, CSS, JavaScript).
- Reconnected the native root toolbar button to open the active completion catalog in a new browser tab, matching the original New Page action.
- Preserved the catalog page and its HTML/CSS/JavaScript reference table, filters, search, sorting, and draft tools.
- Updated the offline build bootstrap so the root Code Catalog button opens the embedded catalog document; fixed the shell bridge manifest entry to `core/editor-bridge.js`.
- Browser/CI and offline build verification are not yet performed in this repository-edit session.


## Helper Keys (symbol keyboard)

- `core/extra-key-action/extra-key-action.js`: connects the footer symbol buttons to the AlfaCode editor using the `alfacode:extra-key-command` message. Buttons preserve the editor's insertion and cursor behavior by reusing the existing `applyExtraKey` handler.
- The footer provides quick access to parentheses, braces, brackets, angle signs, quotes, and common punctuation. The helper module is included in the offline build manifest.

- Offline builder: `scripts/build-offline.mjs` embeds the Helper Keys module into the standalone shell (rather than leaving an external script reference).


## Mobile Helper Keys — 19 November 2026

- Added a compact mobile symbol row that appears only while the editor is focused and the on-screen keyboard is detected.
- Mobile row includes `:`, `;`, `"`, `()`, `)`, `{}`, `}`, `<`, and `>` (paired insertion behavior is handled by the existing editor).
- Desktop footer helper keys are unchanged.
- Visibility and placement use the Visual Viewport API with a height-loss heuristic; browser/keyboard combinations may vary.
- [ ] Test on Android/iOS browsers, landscape mode, tab switching, keyboard hide/show, and offline build.


## Live Preview regression fix — 19 November 2026

- [x] Corrected literal escaped newline characters accidentally inserted into `core/editor-bridge.js`, which caused a JavaScript syntax error and stopped source-change relaying to Preview.
- [x] Corrected the malformed newline in the mobile Helper Keys pointerdown listener.
- [ ] Run syntax/build checks and test live preview in browser.


### Color property progress
- Initial Color inspector includes Background, Text and Border pickers with HEX entry, quick palette, opacity slider, and a two-stop Linear/Radial gradient builder.
- Per-control clear, expanded color formats, richer gradient-stop management, readback, and verification remain incomplete.
- Progress checklist: [`maps/VISUAL-PROPERTIES-ROADMAP.md`](maps/VISUAL-PROPERTIES-ROADMAP.md).

## Mobile workspace — 20 November 2026
- Mobile Editor/Preview tabs were added; switching tabs hides the other pane.
- Visual mode automatically switches to Preview and restores the previous mobile tab when exited.
- Safe-area padding and touch-sized editor/Visual controls were added for mobile layouts. Device verification is pending.

## Offline build toolbar action — 20 November 2026
- Added the **Build Offline File** toolbar action and included it in the offline manifest and Builder.
- In a bundled/offline or local iframe/srcdoc environment, the action snapshots the current standalone shell; in online mode it downloads the generated offline artifact.
- The download action, error feedback, and audit assertions are implemented. Actual browser/download verification remains pending.

## Visual Editor workspace update — single right-side panel
- Visual mode uses a full-screen workspace; the normal header/footer, Editor pane, and divider are hidden.
- One fixed right-side panel switches between **Elements** and **Settings**. Preview fills the remaining desktop space.
- On narrow screens, the panel becomes a bottom sheet with safe-area-aware sizing; touch controls are enlarged.
- Selecting an element from Preview switches the panel to Settings; closing Visual restores the regular workspace.
- Automated regression assertions cover layout and mode communication. Manual browser verification is pending.


## حذف دکمه ناخواسته Build Offline File — ۲۱ نوامبر ۲۰۲۶
- [x] حذف دکمه دانلود `Build Offline File` از رابط اصلی.
- [x] حذف اتصال اسکریپت اکشن دانلود از `index.html` و Offline Manifest.
- [x] حذف تزریق ماژول دانلود از Builder مستقل؛ روند ساخت `offline/AlfaCode-Offline.html` با CI حفظ می‌شود.
- [x] اصلاح تست workspace و audit تا نبود دکمه در خروجی آفلاین را تأیید کنند.
- [x] حذف فایل اکشن اضافی.
- [ ] تأیید CI: Build و Audit خروجی آفلاین.


## اصلاح بسته Offline Visual Editor — ۲۱ نوامبر ۲۰۲۶
- [x] اضافه شدن `core/visual-editor/property-controls.js` به manifest، پیش از `visual-editor.js` برای ثبت factory مشترک.
- [x] تعبیه CSS مخصوص Visual Editor در پوسته اصلی Offline تا پنل Portal شده در صفحه ریشه بدون stylesheet خارجی استایل بگیرد.
- [x] افزایش بررسی‌های Builder و Audit برای اطمینان از وجود کنترل‌های مشترک و CSS پنل Portal در خروجی.
- [ ] اجرای CI و تأیید فایل بازتولیدشده `offline/AlfaCode-Offline.html`؛ این اصلاح سورس تا زمان اجرای workflow تست‌شده محسوب نمی‌شود.


## Repository Tree — آماده‌سازی صفحه (۲۱ نوامبر ۲۰۲۶)
- [x] تغییر عنوان دکمه شماره ۲ در Header به `Repository Tree`.
- [x] ایجاد صفحه مستقل `repository-tree.html` به‌عنوان محل توسعه آینده.
- [ ] اتصال دکمه Header به صفحه و تعیین قابلیت‌های درخت مخزن؛ منتظر دستور بعدی.


## کامنت فارسی ابتدای فایل‌ها و درخت مخزن

- فایل‌های قابل کامنت‌گذاری با قالب استاندارد `#نام فایل: توضیح فارسی` در ابتدای فایل توصیف می‌شوند؛ علامت کامنت متناسب با زبان فایل است (JavaScript، CSS، HTML، Python و Markdown). در فایل‌های دارای shebang، کامنت توضیحی در خط دوم قرار می‌گیرد تا دستور اجرا حفظ شود.
- اسکریپت `scripts/complete-file-comments.py` به‌صورت خودکار کامنت‌های مفقود را اضافه می‌کند و فایل‌هایی را که از قبل دارای کامنت استاندارد هستند دست‌نخورده نگه می‌دارد. فایل‌های Workflow زیر `.github/workflows/` از تغییرات خودکار اکشن کنار گذاشته شده‌اند چون توکن آن مجوز Workflow ندارد؛ توضیح فارسی این فایل‌ها مستقیماً ثبت شده است.
- فرمت‌های JSON و فایل‌های placeholder مانند `.gitkeep` مستثنا هستند؛ JSON استاندارد کامنت ندارد و افزودن کامنت باعث نامعتبر شدن داده می‌شود.
- Workflow در `.github/workflows/repository-tree-update.yml` ابتدا کامنت‌ها را تکمیل، سپس درخت HTML ثابت را بازسازی و همه تغییرات حاصل را commit می‌کند.
- در صفحه Repository Tree نام فایل در خط اول و توضیح فارسی در خط بعد نمایش داده می‌شود.
