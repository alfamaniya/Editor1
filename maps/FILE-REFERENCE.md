<!-- #FILE-REFERENCE.md: مرجع جامع فایل‌ها، مسیرها و نقش اجزای Editor1 -->
## شرح فایل‌ها (فهرست کامل)

### فایل‌های ریشه
- `index.html`: پوسته صفحه؛ قرار دادن Header، پنل Editor، پنل Preview، Divider و اتصال اسکریپت‌های اجزا.
- `backup/style.css`: CSS ریشه ساختار قبلی، اکنون نگهداری‌شده در پوشه پشتیبان.
- `backup/style-backup.css`: نسخه قدیمی‌تر CSS ریشه.
- `backup/script.js`: هماهنگ‌کننده قبلی Editor/Preview و فرمان‌های Header؛ فعلاً از ریشه جدا و غیرفعال نگهداری می‌شود.
- `README.md`: راهنمای اصلی، درخت مخزن و توضیح فایل‌ها/روش اجرا/ساخت آفلاین/آزمون.
- `maps/ROADMAP.md`: تنها سند برنامه‌ریزی؛ کارهای انجام‌شده، باقی‌مانده‌ها و معیارهای پذیرش.

### موتور ذخیره‌سازی مرورگر (`core/browser-storage.js`)
- `core/browser-storage.js`: موتور یکپارچه ذخیره‌سازی مرورگر؛ API عمومی `window.Editor1Storage`، مدیریت LocalStorage، IndexedDB، کوکی‌های قابل دسترس JavaScript، ذخیره/بازیابی/فهرست پروژه‌ها، زمان‌بندی Auto-save، برآورد ظرفیت و پاک‌سازی داده‌های Editor1.
- فایل موتور به صورت مستقل پیاده‌سازی شده است؛ هنوز به `index.html` یا Editor متصل نشده و یکپارچه‌سازی/آزمون واقعی مرورگر در مرحله بعد است.

### اجزای رابط آرشیوشده `backup/core-old/`
هر جزء HTML/CSS/JS جدا دارد؛ HTML ساختار، CSS ظاهر و JS رفتار را پیاده می‌کند.
- `browser-storage/browser-storage.html`: نقطه تعریف Web Component ذخیره مرورگر.
- `browser-storage/browser-storage.css`: استایل جزء ذخیره‌سازی؛ فایل بسیار کوچک فعلی.
- `browser-storage/browser-storage.js`: ذخیره، بازیابی، زمان‌بندی ذخیره و اعلان وضعیت داده‌های پروژه در مرورگر.
- `clear-project-cookies/clear-project-cookies.html`: markup دکمه پاک‌سازی داده/کوکی‌های پروژه.
- `clear-project-cookies/clear-project-cookies.css`: ظاهر دکمه پاک‌سازی داده پروژه.
- `clear-project-cookies/clear-project-cookies.js`: رفتار و ارسال فرمان پاک‌سازی داده پروژه به Editor.
- `clear-tabs/clear-tabs.html`: markup دکمه پاک کردن تب‌ها.
- `clear-tabs/clear-tabs.css`: فعلاً خالی؛ استایل دکمه Clear tabs به CSS ریشه منتقل شده.
- `clear-tabs/clear-tabs-style-backup.css`: نسخه پشتیبان استایل Clear tabs پیش از انتقال به ریشه.
- `clear-tabs/clear-tabs.js`: رفتار دکمه و ارسال فرمان پاک‌کردن تب‌ها.
- `completion-catalog/catalog-loader.js`: بارگذاری کاتالوگ‌های پیشنهاد؛ پشتیبانی از منابع آنلاین و داده تعبیه‌شده آفلاین.
- `completion-catalog/catalog-manager.js`: مدیریت/اعتبارسنجی/کار با رکوردهای کاتالوگ و ابزار پیش‌نویس.
- `completion-catalog/completion-catalog.html`: ساختار پنل مدیریت کاتالوگ.
- `completion-catalog/completion-catalog.css`: ظاهر پنل کاتالوگ.
- `completion-catalog/completion-catalog.js`: منطق پنل، ورود و ویرایش داده، جستجو، اعتبارسنجی، پیش‌نویس و خروجی.
- `css-suggestions/css-suggestions.html`: قالب عنصر پیشنهادهای CSS.
- `css-suggestions/css-suggestions.css`: استایل پیشنهادهای CSS (در حال حاضر حداقلی).
- `css-suggestions/css-suggestions.js`: رابط/راه‌انداز پیشنهادهای CSS و اتصال به runtime.
- `editor/editor.html`: سند iframe ادیتور، تب‌های زبان، میزبان کد، Gutter و Footer.
- `editor/editor.css`: استایل Editor، تب‌ها، Gutter شماره خطوط، سطح کد، اسکرول و Footer؛ محل قواعد عرض/Overflow داخلی Editor.
- `editor/editor.js`: اتصال موتور AlfaCode به UI؛ نمونه‌های اولیه، تب زبان، رندر، انتخاب/Cursor، هایلایت، bracket matching، پیشنهادها، ذخیره‌سازی و پیام‌رسانی.
- `header/header.html`: ساختار برند و محل slot دکمه‌های هدر.
- `header/header.css`: فعلاً خالی؛ CSS Header در فایل ریشه متمرکز شده است.
- `header/header-style-backup.css`: نسخه پشتیبان CSS Header پیش از انتقال.
- `header/header.js`: تعریف Web Component هدر و رویدادهای اکشن.
- `javascript-suggestions/javascript-suggestions.html`: قالب عنصر پیشنهادهای JavaScript.
- `javascript-suggestions/javascript-suggestions.css`: استایل حداقلی پیشنهادهای JavaScript.
- `javascript-suggestions/javascript-suggestions.js`: رابط/راه‌انداز پیشنهادهای JavaScript.
- `tag-suggestions/tag-suggestions.html`: قالب UI پیشنهادهای HTML و پنل popup.
- `tag-suggestions/tag-suggestions.css`: ظاهر popup پیشنهادهای HTML.
- `tag-suggestions/tag-suggestions.js`: منطق نمایش، انتخاب و اتصال popup پیشنهاد HTML.
- `new-page-action/new-page-action.html`: markup دکمه New Page.
- `new-page-action/new-page-action.css`: ظاهر دکمه New Page.
- `new-page-action/new-page-action.js`: رفتار ساخت/درخواست صفحه یا پروژه تازه.
- `preview/preview.html`: سند Preview و iframe نمایش خروجی.
- `preview/preview.css`: قواعد اندازه Preview و iframe خروجی.
- `preview/preview.js`: دریافت پیام‌های render و اعمال HTML/CSS/JavaScript در Preview.
- `preview/preview.html`: ترتیب بارگذاری Preview، پکیج آیکون محلی و ابزارهای Visual Editor.
- `project-reset/project-reset.html`: markup دکمه Reset پروژه.
- `project-reset/project-reset.css`: ظاهر دکمه Reset.
- `project-reset/project-reset.js`: رفتار reset و ارسال فرمان به Editor.
- `workspace-divider/workspace-divider.html`: markup تقسیم‌کننده قابل کشیدن.
- `workspace-divider/workspace-divider.css`: عرض، ظاهر، cursor و handle تقسیم‌کننده.
- `workspace-divider/workspace-divider.js`: drag/keyboard interaction و تغییر نسبت عرض Editor و Preview.

### پکیج آیکون داخلی `core/icons/`
- `core/icons/icon-pack.js`: مجموعه یکپارچه SVGهای محلی، رندر inline با `svg(name)`، تزریق به عناصر `data-icon` با `mount(root)`، تولید Sprite و ساخت reference با `symbolUse(name)`؛ برای استفاده آفلاین.

### موتور AlfaCode `alfacode/src/`
#### Core
- `core-old/document.js`: مدل متن چندخطی و عملیات/موقعیت‌های متنی.
- `core-old/editor-state.js`: state و موقعیت انتخاب Editor.
- `core-old/editor.js`: API مرکزی Editor و هماهنگی document، selection، transaction و history.
- `core-old/history.js`: تاریخچه تغییرات Undo/Redo.
- `core-old/selection.js`: نگهداری و محاسبه بازه انتخاب و Cursor.
- `core-old/transaction.js`: عملیات تغییر متن به‌صورت تراکنش.
#### Features
- `features/bracket-matching/bracket-matcher.js`: تشخیص جفت براکت/پرانتز و match فعال.
- `features/line-numbers/line-numbers.js`: تولید DOM شماره خطوط و مشخص کردن خط فعال.
- `features/syntax-highlighting/highlighter.js`: تبدیل Tokenها به نمایش syntax رنگی.
#### Input
- `input/clipboard-handler.js`: عملیات clipboard و متن paste/copy.
- `input/input-controller.js`: کنترل ورودی کاربر و تبدیل رخدادهای ورودی به عملیات Editor.
- `input/keyboard-handler.js`: مدیریت کلیدها و رفتارهای ویرایش/حرکت/انتخاب.
- `input/suggestion-dispatcher.js`: توزیع/اتصال مسیر درخواست پیشنهادها.
#### Language
- `language/tokenizer.js`: tokenization عمومی و ابزارهای مشترک زبان.
- `language/language-manager.js`: ثبت زبان‌ها و انتخاب زبان فعال.
- `language/parser-manager.js`: مدیریت parserهای زبان.
- `language/html/html-language.js`: adapter تعریف زبان HTML.
- `language/html/html-parser.js`: parsing و تشخیص Context در HTML.
- `language/html/html-rules.js`: قواعد HTML و محدودیت/metadata تگ‌ها.
- `language/html/html-completion.js`: تولید پیشنهادهای HTML از catalog و context.
- `language/css/css-language.js`: adapter تعریف زبان CSS.
- `language/css/css-parser.js`: parsing و تحلیل Context در CSS.
- `language/css/css-rules.js`: قواعد CSS و داده/metadata ساختاری.
- `language/css/css-completion.js`: تولید پیشنهادهای CSS در context مناسب.
- `language/javascript/javascript-language.js`: adapter تعریف زبان JavaScript.
- `language/javascript/javascript-parser.js`: parsing/تحلیل context JavaScript و inferenceهای پشتیبانی‌شده.
- `language/javascript/javascript-rules.js`: قواعد و metadata زبان JavaScript.
- `language/javascript/javascript-completion.js`: تولید پیشنهادهای JavaScript.
#### Rendering
- `rendering/editor-view.js`: ساخت و مدیریت نمای DOM و خطوط Editor.
- `rendering/line-renderer.js`: رندر محتوای یک خط و ساختار آن.
- `rendering/cursor-renderer.js`: رندر Cursor/نشانگر انتخاب.
#### Themes and utilities
- `themes/dark.css`: متغیرها و رنگ‌های Theme تیره.
- `themes/light.css`: متغیرها و رنگ‌های Theme روشن.
- `themes/theme-manager.js`: انتخاب و اعمال Theme روی Editor.
- `utils/dom.js`: جایگاه ابزارهای کمکی DOM؛ فایل خالی/placeholder فعلی.
- `utils/helpers.js`: جایگاه helperهای عمومی؛ فایل خالی/placeholder فعلی.

### داده‌های پیشنهاد `alfacode/data/`
- `completions.html.json`: مجموعه رکوردهای پیشنهاد HTML (نام، context، متن درج و metadata).
- `completions.css.json`: مجموعه پیشنهادهای CSS شامل selector، property، value، at-rule، function و unit.
- `completions.javascript.json`: مجموعه پیشنهادهای JavaScript شامل identifier و memberهای دسته‌بندی‌شده.
- `alfacode/examples/.gitkeep`: نگه داشتن پوشه examples در Git؛ پوشه فعلاً نمونه فایل مستقل ندارد.

### آزمون‌ها `alfacode/tests/`
- `alfacode.test.mjs`: آزمون‌های پایه هسته، سند، Editor، ورودی و ویژگی‌های موتور.
- `catalog-manager.test.mjs`: آزمون منطق مدیریت و اعتبارسنجی کاتالوگ.
- `completion-runtime.test.mjs`: آزمون رفتار runtime پیشنهادها و inference.
- `completions-data.test.mjs`: آزمون ساختار، شناسه‌ها و یکپارچگی داده‌های completion.
- `html-completion-fixtures.mjs`: Fixtureهای ثابت برای Context/پیشنهاد HTML.
- `html-completion-shadow.test.mjs`: مقایسه Shadow/Legacy پیشنهاد HTML با Fixtureها.
- `workspace-layout.test.mjs`: Regression checks برای قواعد Layout، containment و موارد responsive حذف‌شده.
- `alfacode/tests/.gitkeep`: فایل نگهدارنده پوشه تست (در صورت نیاز؛ کنار تست‌های موجود).

### ساخت، آفلاین و ارسال ایمیل `scripts/`
- `offline-manifest.json`: فهرست اجزای فعال، منابع و روابط dependency که Builder برای بسته آفلاین می‌خواند.
- `build-offline.mjs`: خواندن manifest، جمع‌آوری HTML/CSS/JS و importها، bundle و ساخت HTML مستقل؛ اعتبارسنجی مسیرهای محلی.
- `audit-offline-output.mjs`: بررسی ساختار فایل مستقل، وجود Editor/Preview/کاتالوگ‌ها و نبود منابع خارجی.
- `send-offline-email.py`: تقسیم فایل آفلاین به بخش‌های باینری پیوست و ارسال از طریق Gmail با مشخصات/هش‌ها.
- `test_send_offline_email.py`: آزمون بسته‌بندی، محدودیت اندازه، شماره‌گذاری، hash و بازسازی پیوست‌ها.
- `offline/AlfaCode-Offline.html`: خروجی تولیدشده Builder؛ فایل توزیع است و نباید دستی ویرایش شود.

### GitHub Actions `.github/workflows/`
- `alfacode-tests.yml`: اجرای بررسی syntax و تست‌های Node برای موتور، کاتالوگ و integration.
- `build-offline.yml`: build و audit نسخه آفلاین؛ commit/push خروجی تولیدشده در صورت تغییر.
- `send-offline-email.yml`: اجرای تست بسته‌بندی و ارسال فایل آفلاین از طریق secrets ایمیل، به درخواست دستی.

### اجرا و ساخت
- توسعه: `python -m http.server 8000` از ریشه؛ سپس `http://localhost:8000`.
- ساخت Offline: `node scripts/build-offline.mjs` (نیاز به esbuild؛ workflow نسخه 0.25.12 را نصب می‌کند).
- Audit: `node scripts/audit-offline-output.mjs`.
- تست AlfaCode: فرمان Node test که در workflow `alfacode-tests.yml` تعریف شده است.
- فایل Offline خروجی یک HTML مستقل است؛ بعد از تغییر منابع، Builder باید دوباره اجرا شود.
