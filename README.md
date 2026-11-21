# Editor1

**UI language and direction:** English only; left-to-right (`LTR`) throughout. No Persian text is permitted in user-visible interface labels, messages, tooltips, or accessibility text. Source-code comments may be Persian.

**Core folder policy:** Legacy components are archived under `backup/core-old/`. The active `core/` contains JavaScript files, including the unified browser-storage engine `core/browser-storage.js`.



ویرایشگر مستقل HTML، CSS و JavaScript با پیش‌نمایش زنده و امکان ساخت فایل تک‌صفحه‌ای آفلاین.

**قانون CSS/JS:** هر صفحه یا بخش اصلی می‌تواند یک CSS مخصوص ظاهر خود داشته باشد؛ عناصر مشابه از استایل مشترک استفاده کنند. قابلیت‌ها و اکشن‌های دارای منطق در JavaScript جدا نگهداری شوند. [سند معماری](maps/CSS-ARCHITECTURE.md)

## اکشن ساخت فایل آفلاین

- دکمه `Build Offline File` در نوار ابزار پروژه موجود است.
- در نسخه آفلاین، اکشن خود سند Standalone را دانلود می‌کند.
- در نسخه آنلاین، اکشن ابتدا نسخه آماده‌شده `offline/AlfaCode-Offline.html` را دانلود می‌کند.
- ساخت و ممیزی محلی با `npm.cmd run offline` انجام می‌شود.
- خروجی به صورت `AlfaCode-Offline.html` و بدون منابع خارجی دانلود می‌شود.

**اصلاح اندازه Gutter:** ستون شماره خطوط در Editor روی عرض ۴۲px قفل شده؛ محتوای کد جداگانه در ظرف اسکرول افقی رشد می‌کند.

## Visual Editor redesign (builder-inspired)

### Stage 1 — shared Inspector controls (implemented, verification pending)
- Added `core/visual-editor/property-controls.js` as the shared control factory and draft-state helper.
- Inspector uses the shared factory when available, with a fallback renderer.
- Draft lifecycle actions: Cancel, Apply, and Reset Category; reset is scoped to the active category.
- Category-specific readback, validation, specialized controls, and browser verification remain incomplete.

### Inspector properties and controls plan
- Detailed checklist for every Visual Editor property category and the settings nested within each category: [`maps/VISUAL-PROPERTIES-ROADMAP.md`](maps/VISUAL-PROPERTIES-ROADMAP.md).
- Includes color formats/palette/gradients, independent border sides and corners, sizing/units, layered shadows, box model, typography, Flex/Grid, positioning, filters/effects, transforms, transitions/animations, element-specific options, responsive breakpoints, presets, and CSS integrity safeguards.
- This is a registered plan; controls are not yet implemented just because they are listed.


- Visual mode uses a full-screen workspace with one fixed right-side panel for Elements/Settings; Preview occupies the remaining area. CI regression assertions exist, while manual browser verification is still pending.
- The Inspector now displays the selected element's tag and selector, and offers a dedicated **Select Element** action to re-enter preview selection.
- The dark UI uses a restrained orange accent and compact panel/control styling.
- The left-side element tiles and search field are currently non-functional placeholders; element insertion and search are future roadmap work.
- Detailed completion plan: [`maps/VISUAL-EDITOR-ROADMAP.md`](maps/VISUAL-EDITOR-ROADMAP.md). Browser/manual and offline verification remain pending.
- The Visual Editor tooltip regression test now loads the module source and imports Node's test/assert APIs correctly; CI verification is pending.
- Hover identity tooltip implemented in `core/visual-editor/visual-editor.js`: moving over a Preview element in Visual mode shows its ID and class beside the pointer (tag fallback), clamped to the Preview and with pointer events disabled. CI/manual browser verification is pending; details: `maps/VISUAL-EDITOR-ROADMAP.md`.


## Visual Editor

- Dedicated logic module: `core/visual-editor/visual-editor.js`; its panel styles are in `core/visual-editor/visual-editor.css`. Preview rendering is kept in `core/preview/preview.js`.

- دکمه **Visual Settings** در Header، انتخاب عنصر را در Preview فعال می‌کند.
- پس از انتخاب عنصر، پنل تنظیمات شامل دسته‌های Color، Background، Border، Outline، Size، Shadow، Spacing، Typography، Layout، Flexbox، Grid، Position، Effects، Transform، Transition، Animation، Content، Scroll، SVG، Responsive و Custom CSS است.
- فیلدهای CSS هم پیشنهادهای رایج دارند و هم مقدار دلخواه CSS را می‌پذیرند؛ دسته Custom CSS برای افزودن و ویرایش هر پراپرتی استاندارد یا custom property در دسترس است.
- مقادیر CSS پیش از اعمال اعتبارسنجی می‌شوند؛ تغییرات معتبر زنده در Preview دیده می‌شوند و با Apply ذخیره می‌شوند.
- در صفحه‌نمایش‌های موبایل، Editor و Preview با تب‌های لمسی جابه‌جا می‌شوند؛ حالت Visual Editor به پنل پایین صفحه با safe area و کنترل‌های مناسب لمس تبدیل می‌شود.
- کنترل‌ها تغییرات را به CSS Editor ارسال می‌کنند؛ Apply آن‌ها را تأیید و Back به دسته‌ها برمی‌گرداند.
- CSS تولیدی تنظیمات بصری با Selector موجود ادغام می‌شود؛ پراپرتی‌های قبلی همان Rule حفظ و فقط مقدار پراپرتی‌های تغییرکرده جایگزین می‌شود. برای Selectorهایی که Rule ندارند، بلوک نشانه‌گذاری‌شده اضافه می‌شود.
- انتخاب خود `body` به Selector مستقل `body` تبدیل می‌شود؛ Selector ناقص `body >` تولید نمی‌شود.
- در بارگذاری Preview، بلوک CSS تولیدشده دوباره به state ابزار بصری خوانده می‌شود تا Apply بعدی تنظیمات قبلی را از بین نبرد.
- انتخاب selectorهای پیچیده و آزمون آفلاین همچنان نیاز به بررسی دارند.

### Visual Editor completion plan

- Detailed implementation plan: [`maps/VISUAL-EDITOR-ROADMAP.md`](maps/VISUAL-EDITOR-ROADMAP.md).
- Implementation is underway: shared controls, Draft/Apply/Cancel/Reset Category lifecycle, initial Color controls, single-panel workspace, and responsive mobile workspace have been added.
- Remaining work includes completing all property categories, category readback and validation, CSS integrity edge cases, tests, and browser/offline verification.

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
│   ├── core-old/ (legacy components archive)
│   ├── style.css (CSS ریشه ساختار قبلی)
│   ├── style-backup.css (نسخه پشتیبان قدیمی CSS)
│   └── script.js (هماهنگ‌کننده قبلی Editor/Preview)
├── style.css (استایل عمومی Buttonهای Header و Footer؛ فعلاً فقط ظاهر کلی)\n├── README.md
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
├── core/ (active JavaScript files)
│   └── browser-storage.js (unified LocalStorage, IndexedDB, cookies, projects, auto-save and quota helpers)
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
