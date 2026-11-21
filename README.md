<!-- #README.md: مستندات اصلی و راهنمای پروژه -->
# Editor1

**UI language and direction:** English only; left-to-right (`LTR`) throughout. No Persian text is permitted in user-visible interface labels, messages, tooltips, or accessibility text. Source-code comments may be Persian.

**Core folder policy:** Legacy components are archived under `backup/core-old/`. The active `core/` contains JavaScript files, including the unified browser-storage engine `core/browser-storage.js`.



ویرایشگر مستقل HTML، CSS و JavaScript با پیش‌نمایش زنده و امکان ساخت فایل تک‌صفحه‌ای آفلاین.

## راهنمای مستندات پروژه (Documentation Index)

این README صفحه ورودی مستندات است. جزئیات هر موضوع در سند تخصصی خودش نگهداری می‌شود تا راهنماها قابل پیدا کردن، به‌روزرسانی و توسعه باشند.

### 01 — قوانین و استانداردها
- [قوانین توسعه و نگهداری](maps/RULES.md): قواعد تغییر فایل، کامنت فارسی، نام‌گذاری، تست، مستندسازی و محدودیت‌ها.

### 02 — معماری کلی
- [معماری پروژه](maps/ARCHITECTURE.md): نمای کلی بخش‌ها، ارتباط میان اجزا و مسئولیت هر لایه.
- [معماری CSS](maps/CSS-ARCHITECTURE.md): روش مدیریت استایل‌ها و تقسیم‌بندی CSS.
- [جریان داده و رویدادها](maps/DATA-FLOW.md): مسیر انتقال تغییرات Editor، Preview و ابزارها.

### 03 — صفحات و رابط کاربری
- [راهنمای صفحات](maps/PAGES.md): فهرست صفحات، هدف، اجزا، اکشن‌ها و وضعیت هر صفحه.
- [راهنمای Visual Editor](maps/VISUAL-EDITOR.md): انتخاب عنصر، Inspector، کنترل‌ها و رفتارهای بصری.

### 04 — موتور‌ها و ماژول‌ها
- [موتورها](maps/ENGINES.md): موتورهای موجود و وضعیت پیاده‌سازی آن‌ها (بر اساس فایل‌های واقعی).
- [ماژول‌ها](maps/MODULES.md): مسئولیت اجزا و ماژول‌های مستقل.
- [AlfaCode](maps/ALFACODE.md): معماری Editor، زبان‌ها، Parser/Tokenizer، پیشنهادها و رندر.

### 05 — ذخیره‌سازی و نسخه آفلاین
- [ذخیره‌سازی](maps/STORAGE.md): داده‌های مرورگر، پروژه‌ها و وضعیت اتصال به Editor.
- [نسخه Offline](maps/OFFLINE.md): manifest، Builder، Audit و خروجی مستقل.

### 06 — تست و کیفیت
- [راهنمای تست](maps/TESTING.md): آزمون‌های خودکار، CI، Audit و تأیید دستی مرورگر.

### 07 — برنامه‌ها و تغییرات
- [نقشه راه اصلی](maps/ROADMAP.md)
- [نقشه راه Visual Editor](maps/VISUAL-EDITOR-ROADMAP.md)
- [نقشه تکمیل Properties](maps/VISUAL-PROPERTIES-ROADMAP.md)
- [تاریخچه تغییرات](maps/HISTORY.md)
- [مرجع فایل‌ها](maps/FILE-REFERENCE.md)

> **اصل مستندسازی:** README فقط معرفی، نمای کلی، فهرست اسناد و درخت مخزن را نگه می‌دارد؛ توضیحات تخصصی در سند موضوعی مربوط نوشته می‌شود. در صورت تغییر پروژه، سند مرتبط و README به‌روزرسانی شوند.

**قانون CSS/JS:** هر صفحه یا بخش اصلی می‌تواند یک CSS مخصوص ظاهر خود داشته باشد؛ عناصر مشابه از استایل مشترک استفاده کنند. قابلیت‌ها و اکشن‌های دارای منطق در JavaScript جدا نگهداری شوند. [سند معماری](maps/CSS-ARCHITECTURE.md)

## نمای کلی سریع

- Workspace، Editor، Preview و Visual Editor: [صفحات](maps/PAGES.md) و [معماری](maps/ARCHITECTURE.md).
- AlfaCode: [مرجع موتور](maps/ALFACODE.md).
- پکیج آیکون SVG آفلاین: `core/icons/icon-pack.js`؛ همه آیکون‌های Visual Editor از یک فایل محلی.
- Storage و Offline: [ذخیره‌سازی](maps/STORAGE.md) و [نسخه آفلاین](maps/OFFLINE.md).
- تست و CI: [راهنمای تست](maps/TESTING.md).
- شرح فایل‌ها و مسیرها: [FILE-REFERENCE.md](maps/FILE-REFERENCE.md).
- تاریخچه تغییرات: [HISTORY.md](maps/HISTORY.md).
- برنامه‌ها: [ROADMAP.md](maps/ROADMAP.md) و نقشه‌های تخصصی.

## Live Repository Tree

- GitHub Actions workflow `.github/workflows/repository-tree-update.yml` regenerates the hardcoded HTML tree inside `repository-tree/index.html` after every push to `main`.
- Generator script `scripts/update-repository-tree.py` reads tracked Git paths, builds the nested tree, extracts the description from each file's first-line comment (when it matches the agreed `#filename: description` format), and displays that description before the filename in the generated tree.
- The page renders static HTML without calling GitHub API at runtime; file entries link to GitHub source. Refresh reloads the page; Expand all and Collapse all control folders.
- Empty directories are not tracked by Git and therefore do not appear.

## درخت مخزن و وضعیت تکمیل کامنت‌ها

**قانون پیگیری کامنت‌ها:** تیک `[x]` فقط زمانی ثبت می‌شود که من (ChatGPT) محتوای فایل را بررسی کرده و کامنت فارسی خط اول را کامل/اصلاح کرده باشم. وجود کامنت قبلی یا کامنت خودکار به‌تنهایی تیک نمی‌گیرد. در پایان هر درخواست اجرایی شما، پس از انجام کار اصلی، یک فایل بدون تیک را انتخاب می‌کنم و کامنت آن را تکمیل می‌کنم؛ سپس تیک همان فایل را ثبت و این درخت را به‌روز می‌کنم. فایل‌های JSON و مواردی که syntax کامنت معتبر ندارند با علامت `[-]` از این پیگیری مستثنا هستند.

```text
Editor1/
├── .github/
│   └── workflows/
│       ├── [ ] alfacode-tests.yml
│       ├── [ ] build-offline.yml
│       ├── [ ] repository-tree-update.yml
│       └── [x] send-offline-email.yml
├── alfacode/
│   ├── data/
│   │   ├── [-] completions.css.json
│   │   ├── [-] completions.html.json
│   │   └── [-] completions.javascript.json
│   ├── examples/
│   │   └── [-] .gitkeep
│   ├── src/
│   │   ├── core/
│   │   │   ├── [ ] document.js
│   │   │   ├── [ ] editor-state.js
│   │   │   ├── [ ] editor.js
│   │   │   ├── [ ] history.js
│   │   │   ├── [ ] selection.js
│   │   │   └── [ ] transaction.js
│   │   ├── features/
│   │   │   ├── bracket-matching/
│   │   │   │   └── [ ] bracket-matcher.js
│   │   │   ├── line-numbers/
│   │   │   │   └── [ ] line-numbers.js
│   │   │   └── syntax-highlighting/
│   │   │       └── [ ] highlighter.js
│   │   ├── input/
│   │   │   ├── [ ] clipboard-handler.js
│   │   │   ├── [ ] input-controller.js
│   │   │   ├── [ ] keyboard-handler.js
│   │   │   └── [ ] suggestion-dispatcher.js
│   │   ├── language/
│   │   │   ├── css/
│   │   │   │   ├── [ ] css-completion.js
│   │   │   │   ├── [ ] css-language.js
│   │   │   │   ├── [ ] css-parser.js
│   │   │   │   └── [ ] css-rules.js
│   │   │   ├── html/
│   │   │   │   ├── [ ] html-completion.js
│   │   │   │   ├── [ ] html-language.js
│   │   │   │   ├── [ ] html-parser.js
│   │   │   │   └── [ ] html-rules.js
│   │   │   ├── javascript/
│   │   │   │   ├── [ ] javascript-completion.js
│   │   │   │   ├── [ ] javascript-language.js
│   │   │   │   ├── [ ] javascript-parser.js
│   │   │   │   └── [ ] javascript-rules.js
│   │   │   ├── [ ] language-manager.js
│   │   │   ├── [ ] parser-manager.js
│   │   │   └── [ ] tokenizer.js
│   │   ├── rendering/
│   │   │   ├── [ ] cursor-renderer.js
│   │   │   ├── [ ] editor-view.js
│   │   │   └── [ ] line-renderer.js
│   │   ├── themes/
│   │   │   ├── [ ] dark.css
│   │   │   ├── [ ] light.css
│   │   │   └── [ ] theme-manager.js
│   │   └── utils/
│   │       ├── [ ] dom.js
│   │       └── [ ] helpers.js
│   ├── tests/
│   │   ├── [-] .gitkeep
│   │   ├── [ ] alfacode.test.mjs
│   │   ├── [ ] catalog-manager.test.mjs
│   │   ├── [ ] completion-runtime.test.mjs
│   │   ├── [ ] completions-data.test.mjs
│   │   ├── [ ] html-completion-fixtures.mjs
│   │   ├── [ ] html-completion-shadow.test.mjs
│   │   ├── [ ] visual-editor.test.mjs
│   │   └── [x] workspace-layout.test.mjs
│   └── [ ] README.md
├── backup/
│   ├── core-old/
│   │   ├── browser-storage/
│   │   │   ├── [ ] browser-storage.css
│   │   │   ├── [ ] browser-storage.html
│   │   │   └── [ ] browser-storage.js
│   │   ├── clear-project-cookies/
│   │   │   ├── [ ] clear-project-cookies.css
│   │   │   ├── [ ] clear-project-cookies.html
│   │   │   └── [ ] clear-project-cookies.js
│   │   ├── clear-tabs/
│   │   │   ├── [ ] clear-tabs-style-backup.css
│   │   │   ├── [ ] clear-tabs.css
│   │   │   ├── [ ] clear-tabs.html
│   │   │   └── [ ] clear-tabs.js
│   │   ├── completion-catalog/
│   │   │   ├── [ ] catalog-loader.js
│   │   │   ├── [ ] catalog-manager.js
│   │   │   ├── [ ] completion-catalog.css
│   │   │   ├── [ ] completion-catalog.html
│   │   │   └── [ ] completion-catalog.js
│   │   ├── css-suggestions/
│   │   │   ├── [ ] css-suggestions.css
│   │   │   ├── [ ] css-suggestions.html
│   │   │   └── [ ] css-suggestions.js
│   │   ├── editor/
│   │   │   ├── [ ] editor.css
│   │   │   ├── [ ] editor.html
│   │   │   └── [ ] editor.js
│   │   ├── header/
│   │   │   ├── [ ] header-style-backup.css
│   │   │   ├── [ ] header.css
│   │   │   ├── [ ] header.html
│   │   │   └── [ ] header.js
│   │   ├── javascript-suggestions/
│   │   │   ├── [ ] javascript-suggestions.css
│   │   │   ├── [ ] javascript-suggestions.html
│   │   │   └── [ ] javascript-suggestions.js
│   │   ├── new-page-action/
│   │   │   ├── [ ] new-page-action.css
│   │   │   ├── [ ] new-page-action.html
│   │   │   └── [ ] new-page-action.js
│   │   ├── preview/
│   │   │   ├── [ ] preview.css
│   │   │   ├── [ ] preview.html
│   │   │   └── [ ] preview.js
│   │   ├── project-reset/
│   │   │   ├── [ ] project-reset.css
│   │   │   ├── [ ] project-reset.html
│   │   │   └── [ ] project-reset.js
│   │   ├── tag-suggestions/
│   │   │   ├── [ ] tag-suggestions.css
│   │   │   ├── [ ] tag-suggestions.html
│   │   │   └── [ ] tag-suggestions.js
│   │   ├── workspace-divider/
│   │   │   ├── [ ] workspace-divider.css
│   │   │   ├── [ ] workspace-divider.html
│   │   │   └── [ ] workspace-divider.js
│   │   └── [-] .gitkeep
│   ├── [ ] index-original-disabled.html
│   ├── [ ] script.js
│   ├── [ ] style-backup.css
│   └── [ ] style.css
├── core/
│   ├── icons/
│   │   └── [x] icon-pack.js
│   ├── browser-storage/
│   │   ├── [ ] browser-storage.css
│   │   ├── [ ] browser-storage.html
│   │   └── [ ] browser-storage.js
│   ├── completion-catalog/
│   │   ├── [ ] catalog-loader.js
│   │   ├── [ ] catalog-manager.js
│   │   ├── [ ] completion-catalog.css
│   │   ├── [ ] completion-catalog.html
│   │   └── [ ] completion-catalog.js
│   ├── css-suggestions/
│   │   ├── [ ] css-suggestions.css
│   │   ├── [ ] css-suggestions.html
│   │   └── [ ] css-suggestions.js
│   ├── editor/
│   │   ├── [ ] editor.css
│   │   ├── [ ] editor.html
│   │   └── [ ] editor.js
│   ├── extra-key-action/
│   │   └── [ ] extra-key-action.js
│   ├── javascript-suggestions/
│   │   ├── [ ] javascript-suggestions.css
│   │   ├── [ ] javascript-suggestions.html
│   │   └── [ ] javascript-suggestions.js
│   ├── new-page-action/
│   │   ├── [ ] new-page-action.css
│   │   ├── [ ] new-page-action.html
│   │   └── [ ] new-page-action.js
│   ├── preview/
│   │   ├── [ ] preview.css
│   │   ├── [ ] preview.html
│   │   └── [ ] preview.js
│   ├── repository-tree-action/
│   │   └── [ ] repository-tree-action.js
│   ├── tag-suggestions/
│   │   ├── [ ] tag-suggestions.css
│   │   ├── [ ] tag-suggestions.html
│   │   └── [ ] tag-suggestions.js
│   ├── visual-editor/
│   │   ├── [ ] property-controls.js
│   │   ├── [ ] visual-editor.css
│   │   └── [x] visual-editor.js
│   ├── [-] .gitkeep
│   ├── [ ] browser-storage.js
│   ├── [ ] clear-editor-storage.js
│   └── [ ] editor-bridge.js
├── maps/
│   ├── [ ] ALFACODE.md
│   ├── [ ] ARCHITECTURE.md
│   ├── [ ] CSS-ARCHITECTURE.md
│   ├── [ ] DATA-FLOW.md
│   ├── [ ] ENGINES.md
│   ├── [ ] FILE-REFERENCE.md
│   ├── [ ] HISTORY.md
│   ├── [ ] MODULES.md
│   ├── [ ] OFFLINE.md
│   ├── [ ] PAGES.md
│   ├── [ ] ROADMAP.md
│   ├── [ ] RULES.md
│   ├── [ ] STORAGE.md
│   ├── [ ] TESTING.md
│   ├── [ ] VISUAL-EDITOR-ROADMAP.md
│   ├── [ ] VISUAL-EDITOR.md
│   └── [ ] VISUAL-PROPERTIES-ROADMAP.md
├── offline/
│   └── [ ] AlfaCode-Offline.html
├── repository-tree/
│   ├── [ ] index.html
│   ├── [ ] repository-tree.css
│   └── [ ] repository-tree.js
├── scripts/
│   ├── [x] audit-offline-output.mjs
│   ├── [x] build-offline.mjs
│   ├── [x] complete-file-comments.py
│   ├── [-] offline-manifest.json
│   ├── [ ] send-offline-email.py
│   ├── [ ] test_send_offline_email.py
│   └── [ ] update-repository-tree.py
├── [ ] README.md
├── [ ] index.html
├── [ ] package.json
└── [ ] style.css
```


## Offline Repository Tree integration (21 November 2026)
- [x] Embedded the repository tree HTML, stylesheet, and interaction script into the offline builder.
- [x] Declared the tree HTML/CSS/JS as shell `runtimeFiles` in `scripts/offline-manifest.json`, resolving the build's undeclared-input audit failure.
- [x] The standalone toolbar opens Repository Tree (Offline) in a separate window; tree controls work offline.
- [x] File source links are disabled in the offline snapshot because GitHub source browsing requires internet.
- [x] Updated offline docs and regression test.
- [ ] Confirm GitHub Actions build/audit and browser verification succeed.


## اصلاح ارسال ایمیل نسخه آفلاین — ۲۱ نوامبر ۲۰۲۶
- [x] Workflow ارسال ایمیل قبل از ارسال، Node.js و esbuild را آماده کرده و Build و Audit نسخه مستقل را اجرا می‌کند.
- [x] Builder خروجی خالی را رد می‌کند و در صورت نبود DOCTYPE، آن را ابتدای HTML قرار می‌دهد.
- [x] Audit و اسکریپت ایمیل خالی نبودن فایل، DOCTYPE ابتدایی و کامل بودن تگ‌های ریشه HTML را بررسی می‌کنند.
- [x] کامنت فارسی خط اول `scripts/send-offline-email.py` بازبینی و اصلاح شد.
- [ ] اجرای Workflow جدید و تأیید ارسال واقعی ایمیل.
