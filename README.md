# Editor1

**UI language and direction:** English only; left-to-right (`LTR`) throughout. No Persian text is permitted in user-visible interface labels, messages, tooltips, or accessibility text. Source-code comments may be Persian.

**Core folder policy:** The previous component directory is preserved in `core-old/`. The new `core/` is reserved for JavaScript files for page UI elements and currently contains only `.gitkeep.



ویرایشگر مستقل HTML، CSS و JavaScript با پیش‌نمایش زنده و امکان ساخت فایل تک‌صفحه‌ای آفلاین.

**قانون CSS/JS:** هر صفحه یا بخش اصلی می‌تواند یک CSS مخصوص ظاهر خود داشته باشد؛ عناصر مشابه از استایل مشترک استفاده کنند. قابلیت‌ها و اکشن‌های دارای منطق در JavaScript جدا نگهداری شوند. [سند معماری](maps/CSS-ARCHITECTURE.md)

**اصلاح اندازه Gutter:** ستون شماره خطوط در Editor روی عرض ۴۲px قفل شده؛ محتوای کد جداگانه در ظرف اسکرول افقی رشد می‌کند.

## درخت مخزن

```text
Editor1/
├── .github/workflows/
│   ├── alfacode-tests.yml
│   ├── build-offline.yml
│   └── send-offline-email.yml
├── index.html (Layout؛ استایل کلی Buttonها از style.css دریافت می‌شود)
├── backup/index-original-disabled.html (نسخه پشتیبان ایندکس قدیمی) (نسخه قبلی ورودی اصلی؛ نگهداری‌شده و غیرفعال)
├── backup/
│   ├── style.css (CSS ریشه ساختار قبلی)
│   ├── style-backup.css (نسخه پشتیبان قدیمی CSS)
│   └── script.js (هماهنگ‌کننده قبلی Editor/Preview)
├── style.css (استایل عمومی Buttonهای Header و Footer؛ فعلاً فقط ظاهر کلی)\n├── README.md
├── core-old/ (legacy components archive)
│   ├── browser-storage/ ...
│   ├── clear-project-cookies/ ...
│   ├── clear-tabs/ ...
│   ├── completion-catalog/ ...
│   ├── css-suggestions/ ...
│   ├── editor/ ...
│   ├── header/ ...
│   ├── javascript-suggestions/ ...
│   ├── new-page-action/ ...
│   ├── preview/ ...
│   ├── project-reset/ ...
│   ├── tag-suggestions/ ...
│   └── workspace-divider/ ...
├── core/ (new JavaScript-only workspace; currently `.gitkeep`)
│   └── .gitkeep
 (html, css, js)
│   ├── clear-project-cookies/ (html, css, js)
│   ├── clear-tabs/ (html, css خالی، js، clear-tabs-style-backup.css)
│   ├── completion-catalog/
│   │   ├── catalog-loader.js
│   │   ├── catalog-manager.js
│   │   └── completion-catalog/ (html, css, js)
│   ├── css-suggestions/ (html, css, js)
│   ├── editor/ (editor.html, editor.css, editor.js)
│   ├── header/ (header.html, header.css, header.js)
│   ├── javascript-suggestions/ (html, css, js)
│   ├── new-page-action/ (html, css, js)
│   ├── preview/ (html, css, js)
│   ├── project-reset/ (html, css, js)
│   ├── tag-suggestions/ (html, css, js)
│   └── workspace-divider/ (html, css, js)
├── alfacode/
│   ├── README.md
│   ├── data/
│   │   ├── completions.html.json
│   │   ├── completions.css.json
│   │   └── completions.javascript.json
│   ├── examples/.gitkeep
│   ├── src/
│   │   ├── core-old/ (document.js, editor-state.js, editor.js, history.js, selection.js, transaction.js)
│   │   ├── features/
│   │   │   ├── bracket-matching/bracket-matcher.js
│   │   │   ├── line-numbers/line-numbers.js
│   │   │   └── syntax-highlighting/highlighter.js
│   │   ├── input/ (clipboard-handler.js, input-controller.js, keyboard-handler.js, suggestion-dispatcher.js)
│   │   ├── language/
│   │   │   ├── tokenizer.js, language-manager.js, parser-manager.js
│   │   │   ├── css/ (css-completion.js, css-language.js, css-parser.js, css-rules.js)
│
│   │   │   ├── html/ (html-completion.js, html-language.js, html-parser.js, html-rules.js)
│
│   │   │   └── javascript/ (javascript-completion.js, javascript-language.js, javascript-parser.js, javascript-rules.js)
│
│   │   ├── rendering/ (cursor-renderer.js, editor-view.js, line-renderer.js)
│   │   ├── themes/ (dark.css, light.css, theme-manager.js)
│   │   └── utils/ (dom.js, helpers.js)
│   ├── tests/
│   │   ├── .gitkeep
│   │   ├── alfacode.test.mjs
│   │   ├── catalog-manager.test.mjs
│   │   ├── completion-runtime.test.mjs
│   │   ├── completions-data.test.mjs
│   │   ├── html-completion-fixtures.mjs
│   │   ├── html-completion-shadow.test.mjs
│   │   └── workspace-layout.test.mjs
├── maps/
│   ├── CSS-ARCHITECTURE.md (قانون رسمی CSS مرکزی و استایل مشترک)
│   └── ROADMAP.md
├── scripts/
│   ├── offline-manifest.json
│   ├── build-offline.mjs
│   ├── audit-offline-output.mjs
│   ├── send-offline-email.py
│   └── test_send_offline_email.py
└── offline/AlfaCode-Offline.html (فایل خروجی تولیدی)
```

## شرح فایل‌ها (فهرست کامل)

### فایل‌های ریشه
- `index.html`: پوسته صفحه؛ قرار دادن Header، پنل Editor، پنل Preview، Divider و اتصال اسکریپت‌های اجزا.
- `backup/style.css`: CSS ریشه ساختار قبلی، اکنون نگهداری‌شده در پوشه پشتیبان.
- `backup/style-backup.css`: نسخه قدیمی‌تر CSS ریشه.
- `backup/script.js`: هماهنگ‌کننده قبلی Editor/Preview و فرمان‌های Header؛ فعلاً از ریشه جدا و غیرفعال نگهداری می‌شود.
- `README.md`: راهنمای اصلی، درخت مخزن و توضیح فایل‌ها/روش اجرا/ساخت آفلاین/آزمون.
- `maps/ROADMAP.md`: تنها سند برنامه‌ریزی؛ کارهای انجام‌شده، باقی‌مانده‌ها و معیارهای پذیرش.

### اجزای رابط `core-old/`
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
- `project-reset/project-reset.html`: markup دکمه Reset پروژه.
- `project-reset/project-reset.css`: ظاهر دکمه Reset.
- `project-reset/project-reset.js`: رفتار reset و ارسال فرمان به Editor.
- `workspace-divider/workspace-divider.html`: markup تقسیم‌کننده قابل کشیدن.
- `workspace-divider/workspace-divider.css`: عرض، ظاهر، cursor و handle تقسیم‌کننده.
- `workspace-divider/workspace-divider.js`: drag/keyboard interaction و تغییر نسبت عرض Editor و Preview.

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
