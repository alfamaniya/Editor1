# نقشه راه تکمیل کاتالوگ پیشنهادهای HTML، CSS و JavaScript

## هدف
تکمیل تدریجی داده‌های مرجع پیشنهاد خودکار AlfaCode برای سه زبان HTML، CSS و JavaScript؛ به‌گونه‌ای که پیشنهادها از نظر پوشش زبانی، دسته‌بندی، زمینه معتبر، توضیح و رفتار درج قابل اتکا باشند.

این سند فقط نقشه راه و موجودی فعلی را ثبت می‌کند. این سند موجودی، مراحل، منابع و گزارش اجرای واقعی کاتالوگ را ثبت می‌کند. اتصال موتور زمان اجرا به کاتالوگ موضوع این برنامه نیست.

## وضعیت فعلی کاتالوگ

| زبان | فایل داده | تعداد فعلی رکورد |
|---|---|---:|
| HTML | `alfacode/data/completions.html.json` | ۱۴۶ |
| CSS | `alfacode/data/completions.css.json` | 929 |
| JavaScript | `alfacode/data/completions.javascript.json` | ۵۳۴ |
| **مجموع** | سه فایل مستقل | **۱۵۰۲** |

## ۱. نقشه راه HTML

| دسته فعلی | تعداد | موارد موجود |
|---|---:|---|
| متن و محتوا | ۴۲ | div، span، p، i، h1، h2، strong، em، br، hr، h3، h4، h5، h6، hgroup، blockquote، pre، b، u، mark، small، s، cite، q، dfn، abbr، code، var، samp، kbd، data، time، sub، sup، ruby، rt، rp، bdi، bdo، wbr، ins، del |
| پیوند و رسانه | ۹ | a، img، picture، source، audio، video، track، map، area |
| فهرست‌ها | ۶ | li، ul، ol، dt، dd، menu |
| ساختار سند | ۱۰ | script، link، meta، title، style، base، noscript، html، head، body |
| سایر عناصر | ۱ | button |
| بخش‌بندی و ناوبری | ۹ | section، header، footer، main، article، nav، aside، address، search |
| فرم‌ها | ۱۳ | form، input، label، textarea، select، option، optgroup، fieldset، legend، output، datalist، meter، progress |
| جدول‌ها | ۱۰ | table، thead، tbody، tr، th، td، caption، colgroup، tfoot، col |
| گروه‌بندی محتوا | ۲ | figure، figcaption |
| عناصر تعاملی و توکار | ۹ | details، summary، dialog، iframe، embed، object، template، slot، canvas |
| گرافیک SVG | ۳۵ | svg، g، path، circle، rect، line، polyline، polygon، ellipse، text، defs، use، symbol، title، desc، image، textPath، tspan، linearGradient، radialGradient، stop، pattern، clipPath، mask، filter، feGaussianBlur، feOffset، feBlend، feColorMatrix، feComposite، feFlood، feMerge، feMergeNode، marker، foreignObject |

### مراحل تکمیل HTML
- [x] HTML-1 — تکمیل عناصر متنی و معنایی: `h3` تا `h6`، `hgroup`، عناصر نقل‌قول، تأکید و نشانه‌گذاری متن، کد و داده، زمان، زیرنویس/بالانویس، نوشتار دوجهته، ruby و عناصر درج/حذف متن. در این مرحله ۳۲ تگ جدید افزوده شد.
- [x] HTML-2 — تکمیل عناصر ساختار معنایی و گروه‌بندی محتوا: `aside`، `address`، `figure` و `figcaption` افزوده شدند. عنصر `search` در HTML-2 برای بررسی سازگاری به تعویق افتاد؛ در ممیزی HTML-10 با تأیید WHATWG و MDN و وضعیت Baseline Widely available به کاتالوگ اضافه شد.
- [x] HTML-3 — تکمیل پیوند، تصویر و رسانه: `picture`، `source`، `audio`، `video`، `track`، `map` و `area`؛ void بودن و والدهای معتبر `source`، `track` و `area` ثبت شد.
- [x] HTML-4 — تکمیل فهرست‌ها: `menu` اضافه شد و ارتباط آن با `li` در فراداده و آزمون کنترل شد.
- [x] HTML-5 — تکمیل فرم‌ها: `fieldset`، `legend`، `output`، `datalist`، `meter` و `progress` اضافه شدند؛ `button` از قبل موجود بود.
- [x] HTML-6 — تکمیل جدول‌ها: `col` اضافه شد و به‌عنوان عنصر void با والد مجاز `colgroup` ثبت شد.
- [x] HTML-7 — تکمیل عناصر تعاملی و توکار: `details`، `summary`، `dialog`، `iframe`، `embed`، `object`، `template`، `slot` و `canvas` اضافه شدند.
- [x] HTML-8 — تکمیل SVG: عناصر تعریف و استفاده مجدد، عنوان/توضیح، تصویر، متن روی مسیر، گرادیان، الگو، clipping، mask، filter و primitives پرکاربرد افزوده شدند؛ namespace و context برابر SVG ثبت شد.
- [x] HTML-9 — ممیزی عناصر منسوخ: هیچ‌یک از عناصر deprecated شناخته‌شده در کاتالوگ عادی درج نشده‌اند؛ عناصر قدیمی مانند `acronym`، `applet`، `center`، `font`، `marquee`، `frameset`، `param`، `rb` و `rtc` حذف/غیرموجود نگه داشته شدند. عناصر آزمایشی مانند `fencedframe` و `selectedcontent` نیز به پیشنهادهای عادی افزوده نشدند.
- [x] HTML-10 — ممیزی نهایی انجام شد: دسته‌ها، توضیحات، ترتیب، شناسه‌ها، namespace، contexts، parentTags و void بودن عناصر کنترل شدند؛ عنصر استاندارد `search` نیز با توجه به پشتیبانی گسترده از ۲۰۲۳ اضافه شد.

## ۲. نقشه راه CSS

### موجودی نهایی دسته‌های CSS

| نوع رکورد | تعداد |
|---|---:|
| ویژگی‌ها (property) | ۱۷۹ |
| انتخابگرها (selector) | ۶۴ |
| مقادیر وابسته به ویژگی (value) | ۲۶۸ |
| قواعد at-rule | ۱۵ |
| توابع CSS | ۵۱ |
| واحدهای CSS | ۳۳ |
| **مجموع** | **929** |

### مراحل تکمیل CSS
- [x] CSS-1 — تکمیل ویژگی‌های پایه و جعبه: margin، padding و گونه‌ها، border و گونه‌ها، outline، width/height و min/max، box-sizing و اندازه‌گیری.
- [x] CSS-2 — تکمیل رنگ و پس‌زمینه: backgroundهای چندگانه، background-position/size/repeat، gradient، opacity و روش‌های رنگ‌نویسی.
- [x] CSS-3 — تکمیل تایپوگرافی و متن: font و گونه‌ها، line-height، letter-spacing، word-spacing، text-indent، text-overflow و word-break.
- [x] CSS-4 — تکمیل چیدمان Flexbox: ویژگی‌های container و item و مقادیر معتبر هر ویژگی.
- [x] CSS-5 — تکمیل چیدمان Grid: grid-template، areas، auto-flow، gap، جای‌گذاری و ویژگی‌های item.
- [x] CSS-6 — تکمیل موقعیت‌دهی و نمایش: display، position، inset، float، clear، overflow و stacking context.
- [x] CSS-7 — تکمیل انتخابگرها: ترکیب‌گرها، attribute selectorها، pseudo-classها و pseudo-elementهای پرکاربرد؛ تفکیک انتخابگر از مقدار ویژگی.
- [x] CSS-8 — تکمیل جلوه‌های بصری: shadow، radius، filter، transform، transition و animation با مقادیر و توابع مرتبط.
- [x] CSS-9 — تکمیل طراحی واکنش‌گرا و قواعد: media، supports، container query، ویژگی‌های سفارشی و توابع var/calc/clamp.
- [x] CSS-10 — تکمیل واحدها و توابع: طول، درصد، زاویه، زمان، رنگ، توابع ریاضی و توابع پرکاربرد CSS.
- [x] CSS-11 — برای هر یک از ۱۷۹ ویژگی دست‌کم یک مقدار یا نمونه مقدار معتبرِ وابسته به همان property ثبت شد؛ مقادیر عمومی و نمونه‌های پیچیده در context خود باقی ماندند.
- [x] CSS-12 — ممیزی نهایی پوشش، دسته‌بندی، ترتیب، توضیح، یکتایی شناسه‌ها و ارتباط property با value.

### گزارش اجرای CSS-1

- ویژگی‌های جعبه و اندازه: ویژگی‌های logical برای margin/padding، border و outline، aspect-ratio و اندازه‌های logical افزوده شدند.
- هر مورد به‌عنوان CSS property با شناسه یکتا و توضیح تخصصی ثبت شد؛ ویژگی‌های موجود تکرار نشدند.

### گزارش اجرای CSS-2

- Color and backgrounds: 39 مورد جدید شامل ویژگی‌ها و مقادیر مرتبط ثبت شد؛ رکوردهای تکراری کنار گذاشته شدند.
- منابع بررسی: W3C CSS Snapshot 2026 و MDN CSS Reference؛ مقادیر به property مرتبط محدود شدند.

### گزارش اجرای CSS-3

- ویژگی‌های تایپوگرافی و متن به همراه مقادیر معتبر font-style، text-overflow، word-break، overflow-wrap، hyphens، writing-mode و text-decoration-line افزوده شدند.
- تعداد رکوردهای جدید: 47. منابع: W3C CSS Snapshot 2026 و MDN CSS Reference.

### گزارش اجرای CSS-4

- ویژگی‌های flex container و item، shorthandهای flex و place-* و مقادیر معتبر flex-direction، flex-wrap، align-items، justify-content و align-content ثبت شدند.
- تعداد رکوردهای جدید: 14. منابع: W3C Flexbox/Box Alignment و MDN CSS Reference.

### گزارش اجرای CSS-5

- ویژگی‌های Grid template/auto placement، grid area/row/column و justify-self به همراه مقادیر مرتبط ثبت شدند.
- تعداد رکوردهای جدید: 28. منابع: W3C Grid Layout و Box Alignment؛ MDN CSS Reference.

### گزارش اجرای CSS-6

- inset و گونه‌های منطقی، float/clear، overflow-x/y و containment/content-visibility افزوده شدند؛ مقادیر display و overflow به ویژگی مربوط متصل شدند.
- تعداد رکوردهای جدید: 36. منابع: CSS Positioned Layout، CSS Overflow، CSS Containment و MDN.

### گزارش اجرای CSS-7

- ترکیب‌گرها، attribute selectorها، pseudo-classها و pseudo-elementهای استاندارد و پرکاربرد ثبت شدند؛ موارد آزمایشی/کم‌پشتیبانی وارد پیشنهاد عادی نشدند.
- تعداد رکوردهای جدید: 53. منابع: W3C Selectors Level 4 و MDN Selectors Reference.

### گزارش اجرای CSS-8

- ویژگی‌های border-image، filter/backdrop-filter، transform سه‌بعدی، transition، animation و scroll snapping با مقادیر مرتبط افزوده شدند.
- تعداد رکوردهای جدید: 52. منابع: W3C Transforms, Filter Effects, Transitions, Animations, Scroll Snap و MDN.

### گزارش اجرای CSS-9

- at-ruleهای جاری و کاربردی شامل media/supports/container، layer، import/namespace، page/font-face/keyframes، property و scope ثبت شدند. قواعد منسوخ/غیر استاندارد وارد کاتالوگ نشدند.
- تعداد رکوردهای جدید: 15. منابع: W3C CSS Conditional Rules, Cascade, At-rules و MDN.

### گزارش اجرای CSS-10

- توابع ریاضی، رنگ، gradient، transform، timing و grid track و واحدهای طول، زاویه، زمان، درصد و fr ثبت شدند.
- تعداد رکوردهای جدید: 84. توابع/واحدهای آزمایشی یا فاقد پشتیبانی کافی وارد پیشنهادهای عادی نشدند. منابع: W3C CSS Values & Units، Color، Images، Transforms و MDN.

### گزارش اجرای CSS-11

- بازبینی پوشش پس از ادغام نشان داد ۱۲۴ ویژگی هنوز مقدار اختصاصی نداشتند؛ در اصلاح تکمیلی برای تمام آن‌ها مقدارهای وابسته به ویژگی ثبت شد. آزمون جدید تضمین می‌کند هیچ property بدون دست‌کم یک value مالک‌دار باقی نماند.
- مواردی مانند مقدارهای پیچیده shorthand به‌عنوان نمونه درج ثبت شدند و نه دستور زبان کامل property.

- مقادیر تکمیلی ویژگی‌های layout، position، overflow، cursor، box-sizing، visibility، border-style، text، font، flex، vertical-align و animation ثبت شدند.
- تعداد رکوردهای جدید: 37. تمام valueها با propertyName دقیق و آزمون مالکیت ویژگی ذخیره شدند؛ پیشنهاد عمومی نامرتبط ایجاد نشد.
- منابع: ماژول‌های W3C مربوط و MDN CSS Reference.

### گزارش اصلاح تکمیلی پوشش مقدارهای CSS-11

- تعداد مقدارهای جدید در اصلاح تکمیلی: 319؛ هر ۱۷۹ property اکنون دست‌کم یک value اختصاصی دارد.
- PR اصلاحی [#13](https://github.com/alfamaniya/Editor1/pull/13) پس از موفقیت ۶۶ آزمون در `main` ادغام شد.

### گزارش اجرای CSS-12 و ممیزی نهایی

- اصلاح تکمیلی CSS-11 با PR #13 ادغام شد؛ اکنون هر ۱۷۹ ویژگی حداقل یک مقدار وابسته به خودش دارد.

- وضعیت انتشار کد: هر ۱۲ PR با merge commit مستقل به `main` منتقل شدند؛ شاخه اصلی اکنون شامل تمام مراحل CSS-1 تا CSS-12 است.

- تعداد نهایی CSS پس از اصلاح پوشش مقدارها: 929 رکورد؛ property: 179، selector: 64، value: 587، at-rule: 15، function: 51، unit: 33.
- 59 توضیح عمومی و مبهم به شرح تخصصی ارتقا یافت. شناسه‌ها و کلیدهای معنایی تکراری صفر؛ value بدون property معتبر صفر.
- برای at-ruleها، functionها و واحد fr context درج شد. آزمون نهایی ساختار، یکتایی، مالکیت value و انواع جدید افزوده شد.
- منابع: [W3C CSS Snapshot 2026](https://www.w3.org/TR/css/)، [W3C CSS Specifications](https://www.w3.org/Style/CSS/specs.en.html)، [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference).

### درخواست‌های Pull Request مراحل CSS

۱۲ PR مرحله‌ای CSS-1 تا CSS-12 و PR اصلاحی #13 پس از موفقیت آزمون‌ها در شاخه `main` ادغام شدند:

- [CSS-1 — PR #1](https://github.com/alfamaniya/Editor1/pull/1)
- [CSS-2 — PR #2](https://github.com/alfamaniya/Editor1/pull/2)
- [CSS-3 — PR #3](https://github.com/alfamaniya/Editor1/pull/3)
- [CSS-4 — PR #4](https://github.com/alfamaniya/Editor1/pull/4)
- [CSS-5 — PR #5](https://github.com/alfamaniya/Editor1/pull/5)
- [CSS-6 — PR #6](https://github.com/alfamaniya/Editor1/pull/6)
- [CSS-7 — PR #7](https://github.com/alfamaniya/Editor1/pull/7)
- [CSS-8 — PR #8](https://github.com/alfamaniya/Editor1/pull/8)
- [CSS-9 — PR #9](https://github.com/alfamaniya/Editor1/pull/9)
- [CSS-10 — PR #10](https://github.com/alfamaniya/Editor1/pull/10)
- [CSS-11 — PR #11](https://github.com/alfamaniya/Editor1/pull/11)
- [CSS-12 — PR #12](https://github.com/alfamaniya/Editor1/pull/12)

## ۳. نقشه راه JavaScript

### موجودی فعلی دسته‌ها

| دسته فعلی | تعداد |
|---|---:|
| کلمات کلیدی | ۵۲ |
| اشیاء و توابع سراسری | ۲۵ |
| متدهای console | ۱۱ |
| متدهای document | ۵ |
| متدهای window | ۶ |
| متدهای Array | ۳ |
| متدهای Math | ۸ |
| متدهای JSON | ۲ |
| متدهای Promise | ۵ |
| الگوهای تکمیل | ۸ |
| مقادیر زبانی (literal) | ۳ |
| **مجموع** | **۱۲۸** |

### مراحل تکمیل JavaScript
- [x] JS-1 — بازبینی کلمات کلیدی و مقادیر زبانی: پوشش واژه‌های رزروشده، رزروشده آینده، زمینه‌ای و literalهای ثابت؛ تفکیک دقیق کلیدواژه از مقدار و نام سراسری.
- [x] JS-2 — تکمیل اشیاء و توابع استاندارد سراسری: Number، String، Object، Date، RegExp، Map، Set، Symbol، Error، URL و توابع تبدیل و بررسی؛ متدهای ایستا و نمونه، ویژگی‌ها و APIهای محیطی با وضعیت استاندارد تفکیک شدند.
- [x] JS-3 — تکمیل متدهای Array: ۳۹ متد نمونه و ۳ ویژگی نمونه شامل پیمایش، جست‌وجو، تبدیل، تغییر آرایه، کپی، مرتب‌سازی و iteratorها اضافه شد؛ متدهای mutating از non-mutating جدا توضیح داده شدند و metadata استاندارد نسخه ثبت شد.
- [x] JS-4 — تکمیل String و Number: ۹ عضو شامل ویژگی‌های سازنده، iterator رشته و ویژگی‌های static مربوط به constructorها تکمیل شد؛ مجموعه متدهای String و Number موجود بازبینی و با منابع رسمی تطبیق داده شد.
- [x] JS-5 — تکمیل متدها و ویژگی‌های سازنده و prototype در Object، Date و RegExp؛ شامل ویژگی‌های سازنده، متدهای نمادین RegExp و تبدیل Date به primitive.
- [x] JS-6 — تکمیل Math و JSON و پوشش Map/Set/WeakMap/WeakSet؛ شامل متدها، ویژگی‌ها، iteratorها و روش‌های جدید ES2026.
- [x] JS-7 — تکمیل اعضای Promise و کنترل ناهمگام؛ متدهای static، prototype، withResolvers/try و پوشش کلیدواژه‌های async/await.
- [x] JS-8 — تکمیل DOM: انتخاب عناصر، پیمایش، ساخت/حذف، ویژگی‌ها، کلاس‌ها، dataset، style، رویدادها و فرم‌ها.
- [x] JS-9 — تکمیل Browser API: window، location، history، navigator، storage، timers، URL، clipboard و APIهای پرکاربرد؛ با تفکیک محیط مرورگر از JavaScript عمومی.
- [x] JS-10 — تکمیل شبکه و داده: fetch، Request، Response، Headers، FormData، Blob و AbortController/AbortSignal؛ APIهای شبکه و داده ثبت شدند.
- [ ] JS-11 — تکمیل ماژول‌ها، کلاس‌ها و الگوهای کدنویسی: import/export، constructor، getter/setter، ارث‌بری و الگوهای متداول.
- [ ] JS-12 — بازبینی snippetها و الگوهای چندخطی: فقط مواردی که درج آن‌ها امن و قابل پیش‌بینی است فعال شوند؛ الگوهای نمایشی یا آزمایشی غیرفعال بمانند.
- [ ] JS-13 — ممیزی نهایی پوشش، توضیحات، دسته‌بندی، محیط اجرا، ترتیب و یکتایی شناسه‌ها.


### گزارش اجرای JavaScript-1

- کاتالوگ از ۱۱۴ به ۱۲۸ رکورد رسید: ۵۲ کلیدواژه/نام زمینه‌ای، ۳ literal ثابت و ۷۳ رکورد متعلق به گروه‌های موجود دیگر.
- طبقه‌بندی کلیدواژه‌ها اکنون بین واژه‌های همیشه رزروشده، رزروشده در strict mode، رزروشده وابسته به context، کلیدواژه‌های زمینه‌ای و واژه‌های رزروشده آینده تمایز می‌گذارد.
- موارد جاافتاده شامل `with`، `enum`، شش واژه رزروشده آینده در strict mode و کلیدواژه‌های زمینه‌ای `as`، `get`، `set`، `meta` و `target` اضافه شدند.
- `true`، `false` و `null` از دسته کلیدواژه‌ها خارج و با نوع مستقل `literal` ثبت شدند. `this` کلیدواژه باقی ماند؛ `undefined`، `NaN` و `Infinity` literal نیستند و در دامنه نام‌های سراسری بررسی می‌شوند.
- literalهای عددی، رشته‌ای، template و regular expression به‌صورت نمونه ثابت پیشنهاد نمی‌شوند؛ دامنه مقادیر آن‌ها باز است و باید هنگام تایپ ساخته شوند. آرایه و شیء نیز ساختارهای عبارتی‌اند، نه literal اتمی مستقل برای پیشنهاد ثابت.
- `with` و واژه‌های رزروشده آینده به‌صورت غیرفعال نگهداری می‌شوند تا در پیشنهادهای عادی ظاهر نشوند. `using` با وضعیت `stage-4-es2027` و حالت غیرفعال نگهداری می‌شود؛ پیشنهاد مدیریت صریح منابع در ۱۲ نوامبر ۲۰۲۶ به مرحله ۴ رسیده، اما جزو نسخه منتشرشده ES2026 نیست.
- آزمون‌های اختصاصی برای پوشش دسته‌بندی کلیدواژه‌ها، تفکیک literalها و غیرفعال‌بودن موارد آینده اضافه شدند. این مرحله فقط داده و اعتبارسنجی کاتالوگ را تغییر می‌دهد؛ اتصال به موتور زمان اجرا و آزمون دستی مرورگر در دامنه آن نیست.
- منابع بررسی: [ECMAScript 2026 — Lexical Grammar](https://262.ecma-international.org/index.html#sec-ecmascript-language-lexical-grammar)، [MDN — Lexical grammar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar)، [MDN — Grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types)، و [TC39 — Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management).

- PR مرحله JS-1: [#14](https://github.com/alfamaniya/Editor1/pull/14) در `main` ادغام شد؛ commit ادغام `e9379e9` است. اجرای [AlfaCode Tests #44394508336](https://github.com/alfamaniya/Editor1/actions/runs/44394508336) با ۶۹ موفق و صفر ناموفق پایان یافت.


### گزارش اجرای JavaScript-2

- موجودی کاتالوگ JavaScript از ۱۲۸ به **۳۷۶ رکورد** رسید؛ مجموع سه کاتالوگ HTML، CSS و JavaScript اکنون **۱۴۵۱ رکورد** است.
- تعداد رکوردهای JavaScript: ۹۸ شناسه، ۲۶۷ عضو/ویژگی، ۸ snippet غیرفعال و ۳ literal.
- ۴۳ شیء/تابع سراسری و اعضای مرتبط تکمیل شدند؛ موارد جدید شامل `BigInt`، `Function`، `globalThis`، توابع تبدیل URI، توابع بررسی عددی و سازنده‌های فرعی Error هستند.
- اعضای `Number`، `String`، `Object`، `Date`، `RegExp`، `Map`، `Set`، `Symbol`، `Error` و `BigInt` به متدهای ایستا، متدهای نمونه و ویژگی‌ها تفکیک شدند؛ `Boolean.prototype` و `Function.prototype` نیز برای تکمیل APIهای پایه پوشش داده شدند.
- متدهای `Set` از ES2025، `Object.groupBy` و `Map.groupBy` و متدهای رشته‌ای Unicode از ES2024، و `RegExp.escape` از ES2025 با برچسب نسخه استاندارد ثبت شدند.
- `Error.isError` در ES2026 استاندارد است، اما به‌دلیل پشتیبانی محدود مرورگرها غیرفعال نگه داشته شد. ویژگی `Error.stack` استاندارد ECMAScript نیست و به‌صورت وابسته به پیاده‌سازی و غیرفعال ثبت شد.
- `URL` و اعضایش طبق WHATWG URL Standard ثبت شدند، اما با `runtimeScope=web-api` از اشیاء داخلی ECMAScript جدا هستند. `createObjectURL` و `revokeObjectURL` به محیط Window و Dedicated Worker محدود شدند.
- `Symbol.dispose`، `Symbol.asyncDispose`، `SuppressedError`، `DisposableStack`، `AsyncDisposableStack` و کلیدواژه `using` با وضعیت `stage-4-es2027` و غیرفعال ثبت شدند؛ پیشنهاد Explicit Resource Management در ۱۲ نوامبر ۲۰۲۶ به مرحله ۴ رسیده، اما هنوز در استاندارد منتشرشده ES2026 نیست.
- توابع قدیمی `escape` و `unescape` با وضعیت deprecated و غیرفعال نگهداری شدند تا در پیشنهادهای عادی ظاهر نشوند.
- برای رکوردهای member فیلد `memberKind` اضافه شد تا متد/ویژگی ایستا، نمونه‌ای و API میزبان به‌صورت روشن تفکیک شود. ترتیب رکوردها در هر دسته بازشماری شد؛ ممیزی اولیه شناسه و کلید معنایی تکراری، رکورد بدون owner یا دسته‌بندی ناقص نشان نداد.
- آزمون‌های اختصاصی JS-2 برای پوشش اشیاء و توابع سراسری، اعضای static/prototype، وضعیت نسخه‌های جدید، جداسازی URL و APIهای آینده/منسوخ اضافه شدند. اتصال این داده‌ها به موتور پیشنهاد زمان اجرا و آزمون دستی مرورگر در دامنه این مرحله نیست.
- منابع: [ECMAScript 2026](https://262.ecma-international.org/)، [MDN Standard built-in objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)، [MDN Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)، [MDN String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)، [MDN Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)، [MDN Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)، [MDN Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)، [MDN Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)، [MDN RegExp.escape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/escape)، [MDN Error.isError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/isError)، [WHATWG URL Standard](https://url.spec.whatwg.org/)، [TC39 Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management)، [TC39 finished proposals](https://github.com/tc39/proposals/blob/main/finished-proposals.md) و [ECMAScript 2027 draft](https://tc39.es/ecma262/).
- PR مرحله JS-2: [#15](https://github.com/alfamaniya/Editor1/pull/15)؛ اجرای [AlfaCode Tests #44397119631](https://github.com/alfamaniya/Editor1/actions/runs/44397119631) با ۷۶ موفق و صفر ناموفق پایان یافت. PR هنوز در `main` ادغام نشده است.

## ۴. روش گردآوری منابع و صحت‌سنجی (الزامی)

هیچ رکورد تازه یا اصلاح‌شده‌ای بدون بررسی منبع معتبر وارد کاتالوگ نمی‌شود. افزایش تعداد رکوردها هدف مستقل نیست؛ دقت و قابلیت استناد اولویت دارد.

### منابع مرجع
- HTML: استاندارد زنده WHATWG برای HTML و مستندات MDN.
- CSS: مشخصات و ماژول‌های منتشرشده W3C و مستندات MDN.
- JavaScript: استاندارد ECMAScript (ECMA-262) و مستندات MDN.
- Web APIها: مشخصات رسمی WHATWG/W3C یا استاندارد مرجع همان API و مستندات MDN؛ این موارد از قابلیت‌های خود ECMAScript جدا ثبت شوند.
- سازگاری مرورگر: داده‌های سازگاری MDN و در صورت نیاز جداول پشتیبانی مرورگرها؛ این داده‌ها جایگزین استاندارد مرجع نیستند.

### مراحل صحت‌سنجی هر رکورد
1. شناسایی دقیق نام، نوع و دامنه قابلیت؛ مشخص شود جزء استاندارد زبان است یا API محیط اجرا.
2. یافتن تعریف در استاندارد یا مستند رسمی مرجع و ثبت نشانی منبع و عنوان بخش/شناسه مرتبط.
3. تطبیق توضیح، نحو، مقادیر/آرگومان‌ها، نوع خروجی و محدودیت‌های کاربرد با مستندات مرجع.
4. تطبیق مستقل با MDN یا منبع فنی معتبر دوم؛ اختلاف‌ها باید بررسی و حل شوند.
5. تعیین وضعیت: استاندارد و جاری، در حال توسعه/آزمایشی، منسوخ، یا پشتیبانی محدود.
6. بررسی context واقعی، والدهای مجاز HTML، رابطه CSS property/value، و محیط اجرای JavaScript/Browser API.
7. ثبت منابع و نتیجه بررسی در گزارش ممیزی مرحله؛ سپس ارائه فهرست موارد تأییدشده برای تصویب پیش از تغییر JSON.

### معیار پذیرش
- منبع اولیه رسمی یا استانداردی باید وجود داشته باشد؛ MDN منبع تکمیلی و توضیحی مهم است.
- نام یا رفتار بدون پشتوانه مستند وارد نشود.
- موارد منسوخ، تجربی، غیر استاندارد یا کم‌پشتیبانی با برچسب روشن و خارج از پیشنهاد عادی نگهداری شوند یا حذف شوند.
- اگر منابع معتبر اختلاف دارند یا وضعیت مورد روشن نیست، رکورد تا تعیین تکلیف وارد کاتالوگ نشود.
- آزمون ساختاری JSON به‌تنهایی صحت معنایی را ثابت نمی‌کند؛ صحت معنایی، context و سازگاری باید جداگانه بررسی شوند.
- برای هر مرحله، فهرست منابع استفاده‌شده و موارد تأیید/رد/نیازمند بررسی در گزارش همان مرحله ثبت شود.

## ۵. قواعد مشترک برای افزودن هر پیشنهاد

- [ ] هر رکورد شناسه یکتا و پایدار داشته باشد.
- [ ] زبان، نوع، دسته، عنوان و توضیح رکورد روشن و سازگار باشند.
- [ ] پیشنهاد فقط در context معتبر نمایش داده شود؛ برای عناصر HTML والدهای مجاز و برای CSS ارتباط property/value رعایت شود.
- [ ] پیشنهادهای مخصوص مرورگر از موارد استاندارد زبان JavaScript تفکیک شوند.
- [ ] عناصر و APIهای منسوخ، آزمایشی یا کم‌پشتیبانی بدون برچسب وارد پیشنهادهای عادی نشوند.
- [ ] ترتیب نمایش بر اساس کاربرد و ارتباط با context تعیین شود، نه صرفاً ترتیب الفبایی.
- [ ] متن درج‌شونده از عنوان نمایشی جدا باشد؛ درج ناخواسته تگ، آکولاد یا snippet رخ ندهد.
- [ ] داده‌ها در سه فایل مستقل زبان باقی بمانند و envelope و نسخه schema حفظ شود.

## ۶. ترتیب اجرای پیشنهادی

1. [ ] مرحله اول: تکمیل HTML؛ دسته‌ها به‌ترتیب HTML-1 تا HTML-10.
2. [ ] مرحله دوم: تکمیل CSS؛ دسته‌ها به‌ترتیب CSS-1 تا CSS-12.
3. [ ] مرحله سوم: تکمیل JavaScript؛ دسته‌ها به‌ترتیب JS-1 تا JS-13.
4. [ ] مرحله چهارم: اعتبارسنجی یکپارچه سه کاتالوگ، کنترل شناسه‌ها و schema و اجرای آزمون‌های خودکار.
5. [ ] مرحله پنجم: بررسی رفتار پیشنهاد و درج در contextهای واقعی هر سه زبان و سپس بررسی نسخه آفلاین.

## ۷. روش اجرای هر مرحله

هر مرحله به بخش‌های کوچک تقسیم می‌شود:
1. گردآوری مستندات از منابع معتبر و ثبت ارجاع‌ها.
2. بررسی استاندارد و فهرست موارد موجود/جاافتاده در همان بخش.
3. صحت‌سنجی مستقل موارد و ارائه فهرست دقیق موارد پیشنهادی برای تأیید.
4. افزودن یا اصلاح رکوردها فقط پس از تأیید.
5. اجرای آزمون‌های مربوط و رفع خطا.
6. ثبت گزارش منابع و به‌روزرسانی این نقشه راه و READMEهای مرتبط.
7. توقف و دریافت تأیید برای مرحله بعد.

## ۸. محدوده و موارد خارج از این نقشه راه

- اتصال سه فایل JSON به موتورهای زمان اجرای Autocomplete، پروژه‌ای مستقل است و در این نقشه راه انجام نمی‌شود.
- بازطراحی رابط کاربری پیشنهادها یا تغییر رفتار صفحه‌کلید جزو این برنامه نیست، مگر آنکه در مرحله‌ای جداگانه تصویب شود.
- تعداد نهایی رکوردها از پیش تعیین نمی‌شود؛ معیار، پوشش مفید و معتبر است نه افزایش تعداد.
- هیچ مرحله‌ای صرفاً با اضافه‌شدن رکوردها تکمیل‌شده محسوب نمی‌شود؛ آزمون ساختاری و بررسی context نیز لازم است.

## گزارش اجرای HTML-1\n\n- تاریخ اجرا: ۲۰۲۶-۱۱-۱۸\n- موارد افزوده‌شده: `h3`, `h4`, `h5`, `h6`, `hgroup`, `blockquote`, `pre`, `b`, `u`, `mark`, `small`, `s`, `cite`, `q`, `dfn`, `abbr`, `code`, `var`, `samp`, `kbd`, `data`, `time`, `sub`, `sup`, `ruby`, `rt`, `rp`, `bdi`, `bdo`, `wbr`, `ins`, `del`.\n- دسته‌بندی داده‌ها: همه رکوردها در namespace برابر `html`، نوع `tag` و عملیات `open` ثبت شدند؛ `wbr` به‌عنوان void و `rt`/`rp` با والد مجاز `ruby` مشخص شدند.\n- منابع مرجع: [WHATWG HTML Living Standard — The text-level semantics](https://html.spec.whatwg.org/multipage/text-level-semantics.html)، [WHATWG HTML Living Standard — Edits](https://html.spec.whatwg.org/multipage/edits.html)، [WHATWG HTML Living Standard — Grouping content](https://html.spec.whatwg.org/multipage/grouping-content.html)، [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element).\n- تعداد HTML: ۹۲؛ CSS: ۱۷۴؛ JavaScript: ۱۱۴؛ مجموع: ۳۸۰. آزمون اختصاصی حضور ۳۲ تگ HTML-1 نیز به مجموعه آزمون داده اضافه شد. اجرای آزمون پس از اصلاح شمارنده‌ها در [Run #154](https://github.com/alfamaniya/Editor1/actions/runs/44386975357) با ۴۴ آزمون موفق و صفر ناموفق پایان یافت؛ ساخت مستقل آفلاین در [Run #153](https://github.com/alfamaniya/Editor1/actions/runs/44386965362) نیز موفق بود.\n\n## وضعیت اجرا
- [x] موجودی اولیه سه فایل و دسته‌های فعلی استخراج شد.
- [x] HTML-1 اجرا شد: ۳۲ تگ جدید افزوده شد؛ موجودی HTML از ۶۰ به ۹۲ رسید.
- [x] HTML-2 اجرا شد: ۴ تگ تأییدشده افزوده شد؛ موجودی HTML از ۹۲ به ۹۶ رسید.
- [x] CSS-1 تا CSS-12 تکمیل و هر ۱۲ درخواست Pull Request پس از موفقیت CI به‌ترتیب در `main` ادغام شدند.
- [x] JavaScript-1 تا JavaScript-7 تکمیل داده‌ای شدند؛ JS-9 تا JS-13 باقی هستند.
- [ ] اعتبارسنجی نهایی انجام نشده است.


## گزارش اجرای HTML-2

- تاریخ اجرا: ۲۰۲۶-۱۱-۱۸
- موارد افزوده‌شده: `aside`، `address`، `figure` و `figcaption`.
- دسته‌بندی: `aside` و `address` در «بخش‌بندی و ناوبری»؛ `figure` و `figcaption` در «گروه‌بندی محتوا».
- فراداده و محدودیت زمینه: هر چهار رکورد در namespace برابر `html`، نوع `tag`، عملیات `open` و غیر void ثبت شدند. برای `figcaption` والد مجاز `figure` مشخص شد؛ این عنصر باید اولین یا آخرین فرزند `figure` باشد. این محدودیت ترتیبی در توضیح/مستند مرحله ثبت شده و parentTags رابطه والد را محدود می‌کند.
- نکات معنایی: `address` فقط برای اطلاعات تماس نزدیک‌ترین `article` یا کل سند است و نباید شامل heading، عناصر sectioning، `header`، `footer` یا `address` تو در تو باشد. `aside` برای محتوای مرتبطِ غیرمستقیم است و نباید فرزند `address` باشد. `figure` محتوای مستقل و قابل ارجاع را گروه‌بندی می‌کند و caption اختیاری است.
- عنصر `search` با وجود تعریف در استاندارد و MDN، در این مرحله افزوده نشد؛ وضعیت پشتیبانی/سازگاری آن باید جداگانه و پیش از پیشنهاد عادی بررسی شود.
- منابع رسمی: [WHATWG — aside](https://html.spec.whatwg.org/multipage/sections.html#the-aside-element)، [WHATWG — address](https://html.spec.whatwg.org/multipage/sections.html#the-address-element)، [WHATWG — figure and figcaption](https://html.spec.whatwg.org/multipage/grouping-content.html#the-figure-element)، [MDN — aside](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/aside)، [MDN — figure](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figure)، [MDN — figcaption](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figcaption)، [MDN — HTML elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements).
- تعداد پس از مرحله: HTML برابر ۹۶، CSS برابر ۱۷۴، JavaScript برابر ۱۱۴ و مجموع ۳۸۴ رکورد. یک آزمون اختصاصی HTML-2 به آزمون‌های داده اضافه شد؛ اجرای [AlfaCode Tests #44388559166](https://github.com/alfamaniya/Editor1/actions/runs/44388559166) با ۴۵ آزمون موفق و صفر ناموفق پایان یافت. ساخت بسته مستقل آفلاین در [Build AlfaCode Offline #44388538002](https://github.com/alfamaniya/Editor1/actions/runs/44388538002) نیز موفق شد.


## گزارش اجرای HTML-3 تا HTML-10

- تاریخ اجرا: ۲۰۲۶-۱۱-۱۸
- دامنه مجوز اجرا: کاربر اجرای پیوسته HTML-3 تا HTML-10 را بدون توقف و تأییدهای بین‌مرحله‌ای مجاز کرد.
- HTML-3: هفت عنصر `picture`، `source`، `audio`، `video`، `track`، `map` و `area` افزوده شدند. عناصر void و والدهای محدودشده `source`، `track` و `area` مشخص شدند.
- HTML-4: عنصر `menu` افزوده شد؛ ارتباط `li` با والد `menu` از قبل در داده وجود داشت و در آزمون پوشش بررسی شد.
- HTML-5: شش عنصر `fieldset`، `legend`، `output`، `datalist`، `meter` و `progress` افزوده شدند. `button` از قبل در کاتالوگ موجود بود.
- HTML-6: عنصر void `col` با والد مجاز `colgroup` افزوده شد.
- HTML-7: عناصر `details`، `summary`، `dialog`، `iframe`، `embed`، `object`، `template`، `slot` و `canvas` افزوده شدند. `embed` به‌درستی void ثبت شد.
- HTML-8: ۲۵ عنصر SVG پرکاربرد برای تعریف/استفاده مجدد، متن، گرادیان، الگو، clipping، mask، filter و فیلترهای پایه افزوده شدند. نام‌های case-sensitive و namespace برابر `svg` حفظ شد.
- HTML-9: ممیزی عناصر deprecated انجام شد. هیچ عنصر deprecated در فهرست عادی موجود نیست. عناصر منسوخ شناخته‌شده از جمله `acronym`، `applet`، `basefont`، `big`، `center`، `dir`، `font`، `frame`، `frameset`، `marquee`، `menuitem`، `nobr`، `noembed`، `noframes`، `param`، `plaintext`، `rb`، `rtc`، `strike`، `tt` و `xmp` در کاتالوگ عادی وجود ندارند. عناصر در حال توسعه/آزمایشی مانند `fencedframe` و `selectedcontent` نیز وارد نشده‌اند.
- HTML-10: ممیزی نهایی شمارش و فراداده انجام شد. عنصر `search` که در HTML-2 به دلیل تردید درباره پشتیبانی کنار گذاشته شده بود، با بررسی تازه به‌عنوان عنصر استاندارد جاری و Baseline Widely available به کاتالوگ افزوده شد. پشتیبانی گسترده آن از Chrome/Edge/Firefox 118 و Safari 17 به بعد در داده MDN گزارش شده است؛ این عنصر با مقدار `input type="search"` متفاوت است.
- تعداد افزوده‌شده در این مجموعه: ۵۰ رکورد؛ HTML از ۹۶ به ۱۴۶ رسید. CSS برابر ۱۷۴ و JavaScript برابر ۱۱۴ باقی ماند؛ مجموع سه کاتالوگ ۴۳۴ رکورد است.
- منابع اولیه و تکمیلی: [WHATWG HTML — Embedded content](https://html.spec.whatwg.org/multipage/embedded-content.html)، [WHATWG — Lists](https://html.spec.whatwg.org/multipage/grouping-content.html#the-menu-element)، [WHATWG — Forms](https://html.spec.whatwg.org/multipage/forms.html)، [WHATWG — Tables](https://html.spec.whatwg.org/multipage/tables.html)، [WHATWG — Interactive elements](https://html.spec.whatwg.org/multipage/interactive-elements.html)، [WHATWG — SVG/foreign content](https://html.spec.whatwg.org/multipage/syntax.html#foreign-elements)، [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)، [MDN deprecated and obsolete elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements#obsolete_and_deprecated_elements)، [MDN search element and compatibility](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search)، [MDN SVG element reference](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element).
- آزمون‌های ساختاری و اختصاصی برای HTML-3 تا HTML-10 به فایل `alfacode/tests/completions-data.test.mjs` افزوده شدند. اجرای [AlfaCode Tests #164](https://github.com/alfamaniya/Editor1/actions/runs/44389086922) برای commit شامل آزمون‌های HTML-3 تا HTML-10 با ۵۳ آزمون موفق، صفر ناموفق پایان یافت. ساخت مستقل آفلاین در [Build AlfaCode Offline #167](https://github.com/alfamaniya/Editor1/actions/runs/44389070493) نیز موفق شد. این نتایج آزمون خودکار و ساخت را تأیید می‌کنند، نه آزمون دستی مرورگر یا IME.

## وضعیت اجرای HTML
- [x] HTML-1 تا HTML-10 تکمیل شدند.
- [x] موجودی HTML: ۱۴۶ رکورد.
- [x] CSS-1 تا CSS-12 تکمیل شدند؛ JS-1 و JS-2 نیز تکمیل داده‌ای شدند.
- [ ] اتصال کاتالوگ به موتور زمان اجرا خارج از این مجموعه تغییرات است.


### گزارش اجرای JavaScript-3

- کاتالوگ JavaScript از ۳۷۶ به **۴۱۸ رکورد** افزایش یافت؛ مجموع سه کاتالوگ به **۱۴۹۳ رکورد** رسید.
- ۴۲ عضو Array اضافه شدند: ۳۹ متد نمونه شامل متدهای پیمایش، جست‌وجو، تغییر، کپی، مرتب‌سازی، iteratorها و ۳ ویژگی نمونه (`constructor`، `length` و `Symbol.unscopables`).
- متدهای تغییردهنده مانند `push`، `pop`، `splice`، `sort`، `reverse`، `shift`، `unshift`، `fill` و `copyWithin` در توضیحات مشخص شدند؛ متدهای جدید `toReversed`، `toSorted`، `toSpliced` و `with` به‌عنوان نسخه‌های بدون تغییر آرایه اصلی معرفی شدند.
- `findLast`، `findLastIndex` و متدهای نسخه ES2023، به همراه `at`، `flat` و `flatMap` ثبت شدند.
- آزمون اختصاصی JS-3 برای پوشش اعضای Array، نوع ویژگی‌ها و تفاوت mutating/non-mutating اضافه شد.
- منابع بررسی: [MDN Array reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) و [ECMAScript specification](https://262.ecma-international.org/).
- این مرحله صرفاً کاتالوگ و آزمون داده را تغییر می‌دهد؛ اتصال موتور پیشنهادها به JSONها و آزمون دستی مرورگر انجام نشده است.


### گزارش اجرای JavaScript-4

- کاتالوگ JavaScript از ۴۱۸ به **۴۲۷ رکورد** رسید؛ مجموع HTML/CSS/JavaScript اکنون **۱۵۰۲ رکورد** است.
- ۹ عضو جدید اضافه شدند: `String.prototype.constructor`، `String.prototype.[Symbol.iterator]`، `String.prototype`، ویژگی‌های static `String.length` و `String.name`؛ `Number.prototype.constructor`، `Number.prototype`، `Number.length` و `Number.name`.
- متدهای String و Number موجود بازبینی شدند؛ متدهای standard instance/static و properties تفکیک شدند.
- آزمون اختصاصی JS-4 برای پوشش متدها و ویژگی‌های String/Number و نوع memberKind اضافه شد.
- منابع: [ECMA-262 2026](https://tc39.es/ecma262/2026/) و [MDN String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)، [MDN Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).
- این مرحله صرفاً کاتالوگ و آزمون داده را تغییر می‌دهد؛ اتصال به موتور autocomplete و آزمون دستی مرورگر/IME انجام نشده است.


## گزارش اجرای JavaScript-5

- تاریخ اجرا: ۲۰۲۶-۱۱-۱۹
- کاتالوگ JavaScript از ۴۲۷ به **۴۵۰ رکورد** رسید؛ در JS-5 تعداد **۲۳ عضو** برای Object، Date و RegExp افزوده شد. مجموع سه کاتالوگ **۱۵۲۵ رکورد** است.
- Object: ویژگی‌های سازنده (prototype، length، name)، constructor نمونه و well-known Symbol.toStringTag اضافه شد.
- Date: ویژگی‌های static (prototype، length، name)، constructor نمونه، Symbol.toPrimitive و Symbol.toStringTag ثبت شدند.
- RegExp: ویژگی‌های سازنده، constructor نمونه، lastIndex، toString و متدهای well-known symbol شامل match، matchAll، replace، search و split و ویژگی Symbol.toStringTag اضافه شدند.
- موارد deprecated و legacy مانند accessorهای __proto__ و متدهای قدیمی Object.__defineGetter__ / __lookupGetter__ در پیشنهادهای عادی این مرحله افزوده نشدند.
- آزمون اختصاصی JS-5 برای ۲۳ عضو و memberKind افزوده شد؛ شمارنده‌های تست JavaScript و مجموع کاتالوگ نیز به‌روزرسانی شدند.
- منابع رسمی: [ECMA-262 2026 — Object](https://tc39.es/ecma262/2026/multipage/fundamental-objects.html)، [Date](https://tc39.es/ecma262/2026/multipage/numbers-and-dates.html)، [RegExp](https://tc39.es/ecma262/2026/multipage/text-processing.html)، [MDN Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)، [MDN RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).
- این مرحله داده و آزمون را تغییر می‌دهد؛ اتصال کاتالوگ به موتور پیشنهادها و آزمایش دستی مرورگر/IME انجام نشده است.


## گزارش اجرای JavaScript-6

- تاریخ اجرا: ۲۰۲۶-۱۱-۱۹
- کاتالوگ JavaScript از ۴۵۰ به **۵۲۲ رکورد** رسید؛ **۷۲ عضو** برای Math، JSON، Map، Set، WeakMap و WeakSet افزوده شدند. مجموع سه کاتالوگ **۱۵۹۷ رکورد** است.
- Math: متدهای مثلثاتی، لگاریمی، گردکردن و محاسبات عددی و ثابت‌های ریاضی تکمیل شدند؛ `Math.f16round` (ES2025) و `Math.sumPrecise` (ES2026) نیز ثبت شدند.
- JSON: `JSON.rawJSON` و `JSON.isRawJSON` به‌عنوان قابلیت‌های ES2026، همراه `Symbol.toStringTag` ثبت شدند.
- Map/WeakMap: `getOrInsert` و `getOrInsertComputed` (ES2026)، ویژگی‌های سازنده و `Symbol.toStringTag` تکمیل شدند.
- Map/Set: `Symbol.iterator`، `Symbol.species` و ویژگی‌های سازنده تکمیل شدند. متدهای Set جدید ES2025 از قبل در کاتالوگ بودند و تکرار نشدند.
- WeakSet: متدهای add/delete/has، ویژگی‌های سازنده و `Symbol.toStringTag` اضافه شدند.
- آزمون اختصاصی JS-6 برای ۷۲ عضو و نسخه استاندارد هر قابلیت افزوده شد؛ شمارنده‌های تست JavaScript و مجموع سه کاتالوگ به‌روزرسانی شدند. CI ابتدا ۲۷ order نامعتبر در دسته‌های تازه کشف کرد؛ همه مقادیر اصلاح شدند و commit اصلاحی جداگانه ثبت شد.
- منابع رسمی: [ECMA-262 2026 — Numbers and Dates / Math](https://tc39.es/ecma262/2026/multipage/numbers-and-dates.html)، [Keyed Collections](https://tc39.es/ecma262/2026/multipage/keyed-collections.html)، [Structured Data / JSON](https://tc39.es/ecma262/2026/multipage/structured-data.html)، [MDN Math](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)، [MDN JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)، [MDN Keyed Collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections).
- این مرحله داده و آزمون را تغییر می‌دهد؛ اتصال کاتالوگ به موتور پیشنهادها و آزمایش دستی مرورگر/IME انجام نشده است.


## گزارش اجرای JavaScript-7

- تاریخ اجرا: ۲۰۲۶-۱۱-۱۹
- کاتالوگ JavaScript از ۵۲۲ به **۵۳۴ رکورد** رسید؛ **۱۲ عضو** Promise افزوده شدند. مجموع سه کاتالوگ **۱۶۰۹ رکورد** است.
- متدهای جدید: `Promise.any`، `Promise.withResolvers` و `Promise.try`؛ با وضعیت نسخه ES2021، ES2024 و ES2025 به‌ترتیب.
- ویژگی‌های سازنده و prototype: `name`، `length`، `prototype`، `Symbol.species`، `Promise.prototype.constructor` و `Symbol.toStringTag`.
- متدهای نمونه `then`، `catch` و `finally` تکمیل شدند.
- آزمون اختصاصی JS-7 برای ۱۲ عضو، نسخه استاندارد و وجود کلیدواژه‌های `async` و `await` اضافه شد.
- منابع رسمی: [ECMA-262 2026 — Promise Objects](https://tc39.es/ecma262/2026/multipage/control-abstraction-objects.html)، [MDN Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)، [MDN async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)، [MDN await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await).
- این مرحله داده و آزمون را تغییر می‌دهد؛ اتصال کاتالوگ به موتور پیشنهادها و آزمایش دستی مرورگر/IME انجام نشده است.


## گزارش اجرای JavaScript-8

- تاریخ اجرا: ۲۰۲۶-۱۱-۱۹
- تعداد **۱۵۵ عضو DOM و HTML DOM** افزوده شد؛ کاتالوگ JavaScript از ۵۳۴ به **۶۸۹ رکورد** و مجموع سه کاتالوگ از ۱۶۰۹ به **۱۷۶۴ رکورد** رسید.
- دامنه شامل Node و tree manipulation، ParentNode/ChildNode، EventTarget، Document، Element و selector/attributeها، HTMLElement، DOMTokenList، فرم و کنترل‌های input/textarea/select/button است.
- همه رکوردهای افزوده با runtimeScope برابر `web-api`، availability برابر `window-only` و منبع مشخص `WHATWG DOM` یا `WHATWG HTML` ثبت شدند؛ اعضای deprecated، legacy و experimental به پیشنهاد عادی وارد نشدند.
- برای `innerHTML`، `insertAdjacentHTML` و `HTMLFormElement.submit` هشدارهای امنیتی/رفتاری درج شد تا کاربرد ورودی نامطمئن و bypass اعتبارسنجی فرم روشن باشد.
- آزمون اختصاصی JS-8 برای تمام ۱۵۵ عضو و فراداده، دسته‌بندی، order مثبت، یکتایی شناسه/label و موارد امنیتی افزوده شد.
- منابع: [WHATWG DOM Living Standard](https://dom.spec.whatwg.org/)، [WHATWG HTML — DOM interfaces](https://html.spec.whatwg.org/multipage/dom.html)، [MDN DOM overview](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)، [MDN EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)، [MDN HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)، [MDN HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement).
- این مرحله داده و آزمون را تغییر می‌دهد؛ اتصال کاتالوگ به موتور پیشنهادها و آزمون دستی مرورگر/IME انجام نشده است.


### گزارش اجرای JavaScript-10

- افزوده‌شده: 82 رکورد؛ JavaScript 872، مجموع 1947.
- APIهای Fetch، Request/Response، Headers، FormData، Blob و AbortController/AbortSignal ثبت شدند. Bodyها stream و در حالت عادی یک‌بارمصرف هستند؛ HTTP status خطا به‌تنهایی fetch را reject نمی‌کند.
- منابع: [Fetch Standard](https://fetch.spec.whatwg.org/)، [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)، [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)، [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)، [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)، [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers)، [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)، [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)، [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
- آزمون JS-10 افزوده شد؛ CI در PR بررسی می‌شود.

## گزارش اجرای JavaScript-9

- ۹۵ عضو Browser API و ۶ شناسه سراسری جدید افزوده شدند؛ JavaScript از ۶۸۹ به **۷۹۰ رکورد** رسید، مجموع سه کاتالوگ به **۱۸۶۵ رکورد** افزایش یافت.
- پوشش: Window (۳۴ عضو)، Location (۱۲)، History (۸)، Navigator (۱۰)، Storage (۶)، StorageEvent (۵)، Clipboard (۴)، Screen (۶)، Performance (۷) و StorageManager (۳).
- همه اعضا با `runtimeScope=web-api` و `availability=window-only` ثبت شدند؛ منبع استاندارد بر اساس interface مشخص است. `crypto` به‌عنوان global browser/worker جدا ثبت شد.
- محدودیت‌های security/permission، popup blocker، same-origin، synchronous storage و clipboard/geolocation access در توضیحات درج شد. API جدیدتر Navigation API در پیشنهادهای عادی نیامد.
- آزمون اختصاصی JS-9 شامل ۹۵ عضو مورد انتظار، ۶ شناسه، فراداده، نوع member، order مثبت و نکات امنیتی است؛ شمارش مورد انتظار JavaScript در تست‌های کلی به ۷۹۰ تغییر یافت.
- منابع بررسی: [MDN Window](https://developer.mozilla.org/en-US/docs/Web/API/Window)، [MDN Location](https://developer.mozilla.org/en-US/docs/Web/API/Location)، [MDN History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)، [MDN Navigator](https://developer.mozilla.org/en-US/docs/Web/API/Navigator)، [MDN Web Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)، [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)، [MDN Screen](https://developer.mozilla.org/en-US/docs/Web/API/Screen)، [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/API/Performance)، [WHATWG HTML](https://html.spec.whatwg.org/) و [W3C Performance Timeline](https://www.w3.org/TR/performance-timeline/).
- این مرحله داده و آزمون را تغییر می‌دهد؛ آزمون دستی مرورگر/IME و اتصال به runtime انجام نشده است.
