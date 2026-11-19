# AlfaCode — مستند فنی موتور ویرایشگر

AlfaCode موتور مستقل و ماژولار ویرایش کد در پروژه Editor1 است. این موتور در حال حاضر برای HTML، CSS و JavaScript زیرساخت سند، ورودی، نمایش، تحلیل زبان و تکمیل خودکار فراهم می‌کند.

## دامنه و وضعیت

- هسته ویرایشگر از جزئیات زبان‌ها مستقل طراحی شده است.
- هر زبان parser، قواعد و ماژول تکمیل خودکار جداگانه دارد.
- رابط میزبان در `core/editor/` قرار دارد و موتور را به محیط Editor1 متصل می‌کند.
- آزمون‌های خودکار در `tests/` نگهداری می‌شوند.
- داده‌های مرجع تکمیل خودکار اکنون در سه فایل مستقل `data/completions.html.json`، `data/completions.css.json` و `data/completions.javascript.json` نگهداری می‌شوند؛ فایل یکپارچه اولیه پس از ممیزی ارجاع‌ها حذف شده است. اتصال کامل موتورهای زمان اجرا به این داده‌ها هنوز در برنامه توسعه کاتالوگ قرار دارد.
- در اجرای اولیه مرحله ۲-۲ برنامه اعتبارسنجی کاتالوگ، ۱۵ آزمون ساختاری و منفی به ۲۶ آزمون هسته افزوده شدند و هر ۴۱ آزمون موفق بودند. در ادامه، آزمون‌های داده برای تفکیک سه فایل گسترش یافتند؛ وضعیت جاری و نتیجه اجرای جدید در بخش آزمون ثبت شده است. ممیزی ۳۴۸ رکورد نیز بدون اختلاف مفقود، اضافه یا معنایی پایان یافت.
- آزمون‌های خودکار موجود، آزمون واقعی مرورگر، IME فارسی یا دستگاه موبایل محسوب نمی‌شوند.

## ساختار واقعی AlfaCode

```text
alfacode/
├── data/
│   ├── completions.html.json  (۱۴۶ رکورد HTML)
│   ├── completions.css.json  (929 رکورد CSS)
│   └── completions.javascript.json (908 رکورد JavaScript)
├── examples/
├── src/
│   ├── core/
│   │   ├── document.js
│   │   ├── editor-state.js
│   │   ├── editor.js
│   │   ├── history.js
│   │   ├── selection.js
│   │   └── transaction.js
│   ├── features/
│   │   ├── bracket-matching/
│   │   ├── line-numbers/
│   │   └── syntax-highlighting/
│   ├── input/
│   ├── language/
│   │   ├── css/
│   │   ├── html/
│   │   ├── javascript/
│   │   ├── language-manager.js
│   │   ├── parser-manager.js
│   │   └── tokenizer.js
│   ├── rendering/
│   ├── themes/
│   └── utils/
├── tests/
└── README.md
```

## مسئولیت لایه‌ها

| مسیر | مسئولیت |
|---|---|
| `src/core/` | سند، وضعیت ویرایشگر، انتخاب، تراکنش و تاریخچه |
| `src/input/` | دریافت ورودی صفحه‌کلید و کلیپ‌بورد |
| `src/rendering/` | نمایش خطوط، نمای ویرایشگر و مکان‌نما |
| `src/language/` | توکن‌سازی، مدیریت زبان و هماهنگی parserها |
| `src/language/html/` | قواعد، parser و تکمیل HTML |
| `src/language/css/` | قواعد، parser و تکمیل CSS |
| `src/language/javascript/` | قواعد، parser و تکمیل JavaScript |
| `src/features/` | امکانات مستقل مانند رنگ‌بندی، شماره خطوط و تطبیق پرانتز |
| `src/themes/` | تم‌های روشن و تاریک |
| `data/` | داده مرجع نسخه‌دار |
| `tests/` | آزمون‌های خودکار |

## قراردادهای هسته

### Document
`src/core/document.js` متن خام سند را مستقل از DOM نگهداری می‌کند. عملیات درج، حذف و جایگزینی، دریافت خطوط و تبدیل موقعیت‌ها را فراهم می‌کند.

- Offsetها صفرمبنا و بر اساس واحدهای UTF-16 جاوااسکریپت هستند.
- شماره خط و ستون در APIهای موقعیتی از یک شروع می‌شوند.
- پایان خط در محدوده متن خط محاسبه نمی‌شود.
- نسخه سند فقط با تغییر واقعی محتوا افزایش می‌یابد.

### EditorState
`src/core/editor-state.js` سند جاری و انتخاب متن را نگهداری می‌کند و snapshot وضعیت را ارائه می‌دهد. این ماژول مسئول DOM یا دریافت رویدادهای ورودی نیست.

### Selection
`src/core/selection.js` دو سر انتخاب `anchor` و `head` را نگهداری می‌کند. جهت انتخاب حفظ می‌شود و محدوده مرتب‌شده از `from` و `to` قابل دسترسی است.

### Transaction
`src/core/transaction.js` عملیات درج، حذف و جایگزینی را به‌صورت یک تغییر اتمی اعمال می‌کند. همه مراحل پیش از اعمال نهایی اعتبارسنجی می‌شوند تا در صورت خطا سند نیمه‌تغییر نکند.

### History
`src/core/history.js` تاریخچه تغییرات و عملیات Undo/Redo را مدیریت می‌کند. جزئیات گروه‌بندی و اتصال آن باید با پیاده‌سازی جاری همین فایل سنجیده شود.

### Editor
`src/core/editor.js` هماهنگ‌کننده هسته است و وضعیت، تراکنش، ورودی، نمایش و تاریخچه را به هم متصل می‌کند. منطق اختصاصی رابط میزبان در این لایه قرار نمی‌گیرد.

## ورودی و نمایش

- `input/input-controller.js`: هماهنگی رویدادهای ورودی.
- `input/keyboard-handler.js`: کلیدهای صفحه‌کلید و فرمان‌های ویرایش.
- `input/clipboard-handler.js`: عملیات کلیپ‌بورد.
- `rendering/editor-view.js`: نمای ویرایشگر.
- `rendering/line-renderer.js`: رندر خطوط و محتوای متنی.
- `rendering/cursor-renderer.js`: نمایش مکان‌نما.

قرارداد دقیق هر تابع باید از سورس همان ماژول خوانده شود؛ این README شرح مسئولیت‌هاست و جایگزین مرجع API در کد نیست.

## زبان‌ها و تحلیل

هر زبان در پوشه مستقل قرار دارد. parser ساختار زبان را تحلیل می‌کند، قواعد زبان اطلاعات واژگانی و ساختاری را فراهم می‌کنند و ماژول completion پیشنهادها را تولید می‌کند. Tokenizer و ParserManager و LanguageManager هماهنگی مشترک را بر عهده دارند.

| زبان | فایل‌های شاخص |
|---|---|
| HTML | `html-language.js`، `html-parser.js`، `html-rules.js`، `html-completion.js` |
| CSS | `css-language.js`، `css-parser.js`، `css-rules.js`، `css-completion.js` |
| JavaScript | `javascript-language.js`، `javascript-parser.js`، `javascript-rules.js`، `javascript-completion.js` |

## امکانات مستقل

- رنگ‌بندی نحوی در `features/syntax-highlighting/`
- شماره خطوط در `features/line-numbers/`
- تطبیق پرانتزها در `features/bracket-matching/`
- مدیریت تم در `themes/theme-manager.js`

این اجزا تا حد امکان از هسته سند مستقل نگه داشته شده‌اند.

## تکمیل خودکار و کاتالوگ داده

ماژول‌های تکمیل زبان در حال حاضر منطق اجرایی و زمینه‌ای خود را دارند. انتخاب پیشنهاد با صفحه‌کلید بر اساس هویت منویی که گزینه را نمایش داده به handler مربوط هدایت می‌شود: منوی HTML از درج تگ‌محور و منوهای CSS/JavaScript از درج مستقیم متن استفاده می‌کنند. این طراحی مانع وابستگی مسیر درج به وضعیت احتمالی ناهماهنگ تب فعال می‌شود. آزمایش دستی کاربر در نسخه آنلاین نیز تأیید کرد که انتخاب پیشنهاد `display` در context یک rule، فقط متن `display` را درج می‌کند و تگ HTML ناخواسته ساخته نمی‌شود؛ این تأیید فعلاً فقط مربوط به نسخه آنلاین است و نسخه آفلاین جداگانه آزمایش نشده است. dispatch منومحور در `src/input/suggestion-dispatcher.js` قرار دارد و آزمون رگرسیون آن، به‌همراه آزمون درج متنی ویژگی CSS، در `tests/alfacode.test.mjs` نگهداری می‌شود. رابط‌های پیشنهاد در مخزن میزبان قرار دارند:

- HTML: `core/tag-suggestions/`
- CSS: `core/css-suggestions/`
- JavaScript: `core/javascript-suggestions/`
- صفحه کاتالوگ: `core/completion-catalog/`

فایل مرجع اولیه `data/completions.json` شامل ۳۴۸ رکورد بود: ۶۰ HTML، ۱۷۴ CSS و ۱۱۴ JavaScript. داده‌ها اکنون در سه فایل `data/completions.html.json` (۶۰ رکورد)، `data/completions.css.json` (۱۷۴ رکورد) و `data/completions.javascript.json` (۱۱۴ رکورد) نیز تفکیک شده‌اند. آزمون داده در `tests/completions-data.test.mjs` به‌روزرسانی شده تا سه فایل را بخواند، envelope و نسخه‌ها، زبان و تعداد رکوردها را کنترل کند و schema و یکتایی شناسه‌ها و کلیدهای معنایی را هم روی مجموعه ادغام‌شده اعتبارسنجی کند. فایل آزمون اکنون ۱۷ آزمون داده دارد؛ اجرای واقعی مجموعه در GitHub Actions شماره ۱۵۱ با موفقیت تأیید شده است. ممیزی ارجاع‌ها نشان داد هیچ مصرف‌کننده اجرایی به فایل یکپارچه قدیمی وابسته نیست؛ این فایل پس از موفقیت آزمون‌ها حذف شد. اتصال کاتالوگ به موتورهای زمان اجرا همچنان خارج از این تغییر است. جزئیات در [برنامه تفکیک کاتالوگ تکمیل خودکار](../maps/catalog-split.md) ثبت شده است. snippetهای نمایشی JavaScript غیرفعال باقی می‌مانند. منطق context، رتبه‌بندی، فیلتر، stack و محدوده جایگزینی باید در موتور باقی بماند.

برنامه‌های ناتمام این مسیر:
- [آزمون و اعتبارسنجی داده مرجع — مرحله ۲-۲ (تکمیل‌شده)](../maps/catalog-data-validation.md)
- [توسعه مدیریت و انتشار کاتالوگ — مراحل بعدی](../maps/catalog-management-and-release.md)

## بسته‌بندی آفلاین

کد موتور AlfaCode از ورودی `core/editor/editor.js` وارد بسته می‌شود و وابستگی‌های JavaScript آن از طریق گراف import شناسایی می‌شوند. تعریف قابلیت‌ها، صفحه‌های فعال و نقش‌های مونتاژ نسخه آفلاین در `scripts/offline-manifest.json` نگهداری می‌شود. اسکریپت ساخت مسیر فایل‌های HTML/CSS/JS اجزا، نقطه‌های ورود باندل و منابع پویا را از Manifest می‌خواند؛ ارجاع‌های HTML/CSS و گراف importهای JavaScript نیز به‌صورت بازگشتی بررسی می‌شوند. منابع پویا در `runtimeFiles` ثبت می‌شوند. تست‌ها، نمونه‌ها و مستندات جزو منابع runtime نیستند. منطق اختصاصی تولید بعضی Web Componentها همچنان در build script قرار دارد. ممیزی ورودی‌های runtime وابستگی خارجی شبکه‌ای پیدا نکرد؛ fetchهای موجود در اجزای نسخه میزبانی‌شده به فایل‌های محلی اشاره دارند و در بسته مستقل با assetهای جاسازی‌شده یا wrapperهای آفلاین جایگزین می‌شوند. اعتبارسنجی ساخت URLهای شبکه‌ای شامل HTTP/HTTPS، WebSocket، FTP، localhost، IPv4 و نشانی‌های protocol-relative را در منابع متنی runtime شناسایی می‌کند؛ ارجاع‌های خارجی HTML/CSS و importهای خارجی JavaScript نیز بررسی می‌شوند. خروجی نهایی از نظر وجود سندهای توکار editor/preview و CSS/JavaScript درون‌خطی کنترل می‌شود و فایل نهایی پس از نوشتن موفق فایل موقت جایگزین می‌شود. این بررسی ایستا و مبتنی بر اسکن متنی است؛ بنابراین ممکن است URL موجود در comment یا متن نمونه را نیز تشخیص دهد و URLهایی را که در زمان اجرا به‌صورت پویا ساخته می‌شوند از دست بدهد. این بررسی جای آزمون واقعی مرورگر و قطع اینترنت را نمی‌گیرد. مسیر New page (بازشدن کاتالوگ، نمایش فهرست و بازگشت) و نمایش زنده HTML، اعمال CSS و اجرای JavaScript در Preview توسط کاربر بررسی و تأیید شده‌اند. ذخیره و بازیابی محتوای هر سه تب HTML، CSS و JavaScript پس از Refresh، جابه‌جایی بین تب‌ها با حفظ محتوای مستقل هر تب و بارگذاری اولیه صفحه پس از قطع اینترنت و نمایش Preview محتوای HTML در حالت قطع اینترنت نیز توسط کاربر تأیید شده‌اند؛ آزمون CSS و JavaScript در حالت قطع اینترنت، عملکرد سایر قابلیت‌ها و آزمون کامل با شبکه مسدودشده هنوز انجام نشده‌اند. [برنامه بازطراحی و آزمون نهایی ساخت آفلاین](../maps/offline-build-redesign.md) وضعیت گام‌های اجرا و آزمون را ثبت می‌کند. Workflow ساخت آفلاین نیز با الگوی عمومی تغییر فایل‌ها در مخزن فعال می‌شود؛ Markdown، آزمون‌ها، مثال‌ها و فایل خروجی تولیدشده مستثنا هستند تا فایل runtime تازه در مسیر جدید از trigger جا نماند و commit خروجی حلقه ساخت ایجاد نکند. این trigger گسترده‌تر از فهرست پوشه‌های ثابت است، اما تعیین منابع واقعی بسته همچنان فقط از Manifest و کشف وابستگی‌ها انجام می‌شود.

در خروجی مستقل آفلاین، صفحه `core/completion-catalog/completion-catalog.html` به‌همراه stylesheet و bundle کامل JavaScript آن در سند اصلی جاسازی می‌شود. در نتیجه صفحه کاتالوگ در حالت آفلاین بدون درخواست فایل‌های جداگانه یا وابستگی شبکه‌ای قابل باز شدن است؛ این بسته‌بندی در `scripts/build-offline.mjs` و نقش `completionCatalog` در `scripts/offline-manifest.json` تعریف شده است.

## آزمون

اجرای آزمون‌های AlfaCode در مخزن با Node.js انجام می‌شود:

```bash
node --experimental-default-type=module --test alfacode/tests/alfacode.test.mjs alfacode/tests/completions-data.test.mjs
```

Workflow متناظر `.github/workflows/alfacode-tests.yml` است. مجموعه هسته ۲۸ آزمون و فایل `tests/completions-data.test.mjs` پس از افزودن آزمون‌های JS-1 و JS-2 شامل ۴۸ آزمون داده کاتالوگ است؛ مجموع ۷۶ آزمون است؛ اجرای PR شماره ۱۵ در [AlfaCode Tests #44397119631](https://github.com/alfamaniya/Editor1/actions/runs/44397119631) با ۷۶ موفق و صفر ناموفق پایان یافت. اجرای پس از تکمیل HTML-1 در [Run #154](https://github.com/alfamaniya/Editor1/actions/runs/44386975357) با ۴۴ موفق و صفر ناموفق پایان یافت؛ اجرای نهایی پس از تکمیل پوشش مقدارهای CSS در [AlfaCode Tests #191](https://github.com/alfamaniya/Editor1/actions/runs/44392206875) با ۶۶ موفق و صفر ناموفق پایان یافت؛ ساخت نسخه آفلاین در [Build AlfaCode Offline #180](https://github.com/alfamaniya/Editor1/actions/runs/44392206906) نیز موفق شد. آزمون‌های داده سه فایل زبان را با `node:fs/promises` می‌خوانند و JSON، envelope، تفکیک زبان، تعداد رکوردها، schema، نوع member و یکتایی سراسری شناسه‌ها و کلیدهای معنایی را بررسی می‌کنند؛ وابستگی جدیدی اضافه نشده است. triggerهای push و pull_request مسیر `alfacode/data/**` را پوشش می‌دهند و فرمان workflow هر دو فایل آزمون را اجرا می‌کند. اجرای اولیه job برای commit `ce21d8b8f50f0c6acb290310d3345f413518922a` در GitHub Actions شماره ۱۵۱ با نتیجه ۴۳ موفق تأیید شد. پس از حذف فایل یکپارچه قدیمی نیز اجرای مجدد در [Run #152](https://github.com/alfamaniya/Editor1/actions/runs/44380792087) با ۴۳ موفق، صفر ناموفق، صفر لغوشده و صفر ردشده پایان یافت. ساخت بسته مستقل آفلاین برای همان commit در [Run #153](https://github.com/alfamaniya/Editor1/actions/runs/44380792319) نیز موفق شد. در ممیزی زیرمرحله ۲-۲-۳ هر ۶۰ رکورد HTML، هر ۱۷۴ رکورد CSS و هر ۱۱۴ رکورد اولیه JavaScript با منابع آن ممیزی قبلی مقایسه شدند و اختلاف مفقود/اضافه/معنایی مشاهده نشد. آزمون مرورگر یا دستگاه در این مرحله انجام نشده است. آزمون خودکار به‌تنهایی رفتار مرورگر، لمس، IME فارسی یا بسته آفلاین را تأیید نمی‌کند.

## اصول توسعه

1. هسته از جزئیات زبان و رابط میزبان مستقل بماند.
2. هر زبان در ماژول جداگانه توسعه یابد.
3. parser، tokenizer و syntax highlighter مسئولیت‌های جدا داشته باشند.
4. قابلیت‌های جانبی در ماژول‌های مستقل نگهداری شوند.
5. داده JSON فقط داده باشد و به‌عنوان کد اجرا نشود.
6. تغییرات واقعی در این README و README اصلی منعکس شوند.
7. قابلیت یا آزمون تأییدنشده، تکمیل‌شده اعلام نشود.

## برنامه تکمیل پیشنهاد تگ HTML

[برنامه مستقل آزمون مرورگر، IME و ارزیابی پوشش context پیشنهاد تگ HTML](../maps/html-tag-suggestions.md) وضعیت کارهای باقی‌مانده را نگهداری می‌کند.


## نقشه راه تکمیل کاتالوگ سه زبان

موجودی فعلی و برنامه تکمیل مرحله‌ای پیشنهادهای HTML، CSS و JavaScript در [نقشه راه تکمیل کاتالوگ](../maps/catalog-completion.md) نگهداری می‌شود. کاتالوگ‌ها اکنون ۱۴۶ HTML، ۹۲۹ CSS و ۹۰۸ JavaScript (مجموع ۱۹۸۳) دارند. JS-1 تا JS-2 در PRهای #14 و #15 ادغام شده‌اند؛ مراحل JS-3 تا JS-13 در PRهای جداگانه و checkpointها انجام شده اما هنوز ادغام نشده‌اند. ممیزی ساختاری JavaScript-13 JSON را parse کرد و ۹۰۸ رکورد را بررسی کرد: ۱۱۱ شناسه، ۷۵۰ member، ۴۴ snippet و ۳ literal؛ شناسه‌ها و کلیدهای معنایی یکتا، orderها مثبت، ۴۴ snippet غیرفعال و memberها دارای owner/memberKind معتبرند. این بررسی ساختاری است و جای CI نهایی، بررسی معنایی همه APIها، یا آزمون مرورگر/IME را نمی‌گیرد. اتصال داده‌های کاتالوگ به پیشنهادهای زمان اجرا هنوز انجام نشده است. HTML-1 تا HTML-10 و CSS-1 تا CSS-12 تکمیل و PRهایشان ادغام شده‌اند؛ همه ۱۷۹ ویژگی CSS حداقل یک value وابسته دارند. نتایج قدیمی CI/Offline Build به‌عنوان تاریخچه باقی می‌مانند و تأیید وضعیت فعلی JS-3 تا JS-13 محسوب نمی‌شوند.


## سیاست منابع و صحت‌سنجی کاتالوگ

ورود یا اصلاح هر رکورد در `data/` مشروط به گردآوری از منابع معتبر و ثبت ارجاع است: HTML از WHATWG و MDN، CSS از مشخصات W3C و MDN، JavaScript از ECMA-262 و MDN و Web APIها از مشخصات رسمی مربوط و MDN. هر رکورد از نظر تعریف، نحو، نوع، مقادیر/آرگومان‌ها، context، وضعیت استاندارد یا آزمایشی/منسوخ و سازگاری مرورگر بررسی می‌شود. آزمون JSON فقط صحت ساختاری را می‌سنجد و جای صحت‌سنجی معنایی را نمی‌گیرد. موارد مبهم یا دارای اختلاف مستندات تا تعیین تکلیف وارد پیشنهادهای عادی نمی‌شوند. گزارش منابع و نتیجه بررسی هر مرحله باید همراه تغییرات آن نگهداری شود.


### گزارش اجرای JavaScript-9

- ۹۵ عضو Browser API و ۶ شناسه سراسری جدید افزوده شدند؛ JavaScript از ۶۸۹ به **۷۹۰ رکورد** رسید، مجموع سه کاتالوگ به **۱۸۶۵ رکورد** افزایش یافت.
- پوشش: Window (۳۴ عضو)، Location (۱۲)، History (۸)، Navigator (۱۰)، Storage (۶)، StorageEvent (۵)، Clipboard (۴)، Screen (۶)، Performance (۷) و StorageManager (۳).
- همه اعضا با `runtimeScope=web-api` و `availability=window-only` ثبت شدند؛ منبع استاندارد بر اساس interface مشخص است. `crypto` به‌عنوان global browser/worker جدا ثبت شد.
- محدودیت‌های security/permission، popup blocker، same-origin، synchronous storage و clipboard/geolocation access در توضیحات درج شد. API جدیدتر Navigation API در پیشنهادهای عادی نیامد.
- آزمون اختصاصی JS-9 شامل ۹۵ عضو مورد انتظار، ۶ شناسه، فراداده، نوع member، order مثبت و نکات امنیتی است؛ شمارش مورد انتظار JavaScript در تست‌های کلی به ۷۹۰ تغییر یافت.
- منابع بررسی: [MDN Window](https://developer.mozilla.org/en-US/docs/Web/API/Window)، [MDN Location](https://developer.mozilla.org/en-US/docs/Web/API/Location)، [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)، [MDN Navigator](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)، [MDN Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)، [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)، [MDN Screen](https://developer.mozilla.org/en-US/docs/Web/API/Screen)، [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/API/Performance)، [WHATWG HTML](https://html.spec.whatwg.org/) و [W3C Performance Timeline](https://www.w3.org/TR/performance-timeline/).
- این مرحله داده و آزمون را تغییر می‌دهد؛ آزمون دستی مرورگر/IME و اتصال به runtime انجام نشده است.
