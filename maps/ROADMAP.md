# نقشه راه واحد Editor1

**مرجع یگانه برنامه‌ریزی پروژه.** وضعیت‌ها فقط بر اساس تغییرات و آزمون‌های ثبت‌شده علامت‌گذاری می‌شوند. این فایل جایگزین نقشه‌های پراکنده قبلی است؛ تاریخ بازبینی: ۱۹ نوامبر ۲۰۲۶.

## اصلاح آزمایشی عرض Gutter — ۱۹ نوامبر ۲۰۲۶

- [x] محدود کردن `.alfacode-gutter-host` به عرض ثابت ۴۲px (flex-basis/width/min-width/max-width).
- [x] جدا کردن عرض Layout از اندازه ذاتی کد: `width: max-content` و `min-width: 100%`.
- [x] Canvas همچنان می‌تواند از عرض محتوا پیروی کند؛ Overflow باید در `.editor-host` اسکرول شود.
- [x] افزودن Regression assertions برای قواعد جدید در `workspace-layout.test.mjs`.
- [ ] اجرای CI و تست دستی نسخه آفلاین در عرض بسیار کم؛ نتیجه واقعی مرورگر هنوز تأیید نشده است.

## جابه‌جایی فایل ورودی اصلی — ۱۹ نوامبر ۲۰۲۶

- [x] نسخه قبلی `index.html` با نام `index-original-disabled.html` نگهداری شد تا دیگر نقطه ورود اصلی نباشد.
- [x] فایل ارسال‌شده `index (2).html` بدون تغییر محتوایی در مسیر `index.html` قرار گرفت.
- [x] نسخه جدید `index.html` فعلاً مستقل است؛ به فایل‌ها، اجزا، CSS یا JS موجود مخزن متصل نشده است.
- [x] هر دو فایل پس از ثبت، از GitHub دوباره خوانده و با منبع خود مقایسه شدند؛ محتوا دقیقاً برابر بود.
- [ ] بازبینی و اصلاح نسخه جدید پیش از اتصال به معماری اصلی.

## وضعیت کلی

- [x] اتصال کاتالوگ‌های JSON مربوط به HTML، CSS و JavaScript به مسیرهای پیشنهاددهی زنده.
- [x] Loader مشترک و پشتیبانی از داده‌های تعبیه‌شده در خروجی آفلاین.
- [x] ابزار پیش‌نویس محلی برای مدیریت کاتالوگ و اعتبارسنجی پایه.
- [x] آزمون ساختاری و Runtime کاتالوگ‌ها؛ CI ثبت‌شده: ۱۰۶ تست موفق، صفر شکست (Run 44495592185).
- [x] ساخت و ممیزی ایستای نسخه آفلاین؛ Run 44495576645، بدون منبع خارجی شناسایی‌شده در خروجی.
- [ ] تکمیل آزمون‌های واقعی مرورگر، دستگاه و قطع اینترنت؛ این موارد با CI ایستا تأیید نمی‌شوند.

## اولویت ۱ — تکمیل موتور پیشنهادهای زنده

### HTML
- [x] اتصال داده JSON به موتور پیشنهادها با حفظ مسیر سازگاری Legacy.
- [x] Adapter آزمایشی، Fixtureهای ثابت و آزمون Shadow اولیه.
- [ ] تکمیل و تثبیت Context تگ، Attribute و ارتباط Parent/Child.
- [ ] بررسی اختلاف‌های Shadow و دسته‌بندی دقیق regression، اختلاف رتبه و گسترش مجاز.
- [x] اصلاح آزمون Shadow به‌گونه‌ای که اختلاف رفتاری غیرمجاز باعث شکست تست و CI شود؛ ۳۲ Fixture در اجرای ثبت‌شده بدون اختلاف بودند.
- [ ] حذف کاتالوگ Legacy فقط پس از تطابق تأییدشده و Regression کامل.

### CSS
- [x] اتصال گروه‌های selector، property، value، at-rule، function و unit به داده JSON.
- [x] تشخیص مرز declaration در CSS بدون اشتباه گرفتن آکولاد/دونقطه داخل string و comment؛ آزمون‌های Regression اضافه شد.
- [ ] تکمیل فیلتر Context برای selector/property/value و ترکیب‌های واقعی CSS.
- [ ] آزمون نمایش، رتبه‌بندی و درج پیشنهادها در سناریوهای واقعی.

### JavaScript
- [x] اتصال پیشنهادهای identifier و member مبتنی بر owner.
- [x] تشخیص اولیه نوع متغیر برای سازنده‌ها، literalهای رایج و برخی APIهای DOM.
- [x] پشتیبانی از inference برای alias ساده متغیرها و افزودن Regression test.
- [ ] تکمیل inference برای زنجیره فراخوانی، مقدار بازگشتی تابع، class/inheritance و import/export.
- [ ] تفکیک دقیق‌تر static و instance در سناریوهای پیچیده.
- [ ] تکمیل Context و آزمون آن با نمونه‌های واقعی.

### درج، صفحه‌کلید و Snippet
- [ ] تأیید حفظ Cursor و Selection و جایگزینی دقیق متن انتخاب‌شده.
- [ ] جلوگیری از درج تکراری یا تخریب متن مجاور.
- [ ] آزمون Enter، Tab، Escape و کلیدهای جهت‌دار در همه زبان‌ها.
- [ ] آزمون IME فارسی و ورودی ترکیبی.
- [ ] تعریف قرارداد Snippet، placeholder و محل Cursor؛ Snippetهای JavaScript تا زمان تأیید صریح غیرفعال بمانند.
- [ ] آزمون Undo/Redo و Regression پس از هر اصلاح.

## اولویت ۲ — ممیزی محتوایی و رفتاری کاتالوگ‌ها

- [x] بررسی ساختار، نسخه، شناسه‌ها و فیلدهای پایه هر سه JSON.
- [x] بررسی ارجاع‌های HTML از جمله parentTags و اصلاح رکورد dl.
- [x] بررسی ارجاع propertyName در CSS.
- [x] بررسی owner و memberKind در JavaScript.
- [x] افزودن آزمون‌های ساختاری و یکپارچگی به CI.
- [ ] بازبینی محتوایی label، description، insertText و metadata همه رکوردها.
- [ ] تطبیق نمونه‌ها با HTML Living Standard، CSS و مستندات رسمی JavaScript؛ ثبت منبع و تاریخ/نسخه مرجع.
- [ ] بررسی کامل Attributeهای HTML و ارتباط آن‌ها با تگ‌ها.
- [ ] آزمون UI جستجو، فیلتر، فهرست خالی، Duplicate، انتخاب با کلیک/کیبورد و درج.
- [ ] ثبت و اصلاح ایرادهای قابل بازتولید و اجرای Regression.

## اولویت ۳ — تأیید واقعی نسخه آفلاین

### تأییدشده در CI
- [x] Build مستقل Offline.
- [x] ممیزی ایستای ۸۰ فایل Runtime و نبود منبع خارجی در خروجی بررسی‌شده.
- [x] تأیید حضور رکوردهای سه کاتالوگ در فایل مستقل.
- [x] Build و audit موفق: Run 44495576645.
- [x] حجم خروجی ثبت‌شده در آن اجرا: حدود ۱۷۵۷٫۰۹ KiB.

### آزمون‌های باز روی دستگاه
- [ ] اجرای فایل مستقل در مرورگر دسکتاپ با اینترنت قطع‌شده.
- [ ] ثبت Network و Console واقعی در زمان بارگذاری و استفاده.
- [ ] آزمون Preview مربوط به HTML، CSS و JavaScript بدون اینترنت.
- [ ] آزمون New Page، ذخیره/بازیابی، Reset، تب‌ها و Divider.
- [ ] آزمون موبایل واقعی: لمس، تغییر اندازه، کلیدهای کمکی و IME فارسی.
- [ ] ثبت دستگاه، سیستم‌عامل، مرورگر و نتیجه تکرارپذیر هر سناریو.

**محدودیت:** Build و ممیزی ایستا جای اجرای واقعی مرورگر و قطع شبکه را نمی‌گیرند.

## اولویت ۴ — مدیریت و انتشار کاتالوگ

### انجام‌شده
- [x] پنل پیش‌نویس برای HTML، CSS و JavaScript.
- [x] ورود JSON، CSV و TSV؛ Paste داده‌های کپی‌شده از Excel.
- [x] افزودن، ویرایش و حذف رکورد در پیش‌نویس.
- [x] تشخیص شناسه/رکورد تکراری و اعتبارسنجی پایه و اختصاصی زبان.
- [x] کنترل ارجاع‌های parentTags در HTML و propertyName در CSS.
- [x] ذخیره محلی، بازیابی، بازگردانی داده اولیه و خروجی JSON نسخه‌دار.
- [x] جلوگیری از فعال‌شدن ناخواسته Snippetهای JavaScript.

### باقی‌مانده
- [ ] ورود مستقیم XLSX و رابط نگاشت ستون‌ها.
- [ ] تکمیل Validator برای هم‌ارزی با تمام قواعد Schema و ارجاعات بین‌رکوردی.
- [ ] طراحی انتشار امن GitHub با حداقل مجوز، تأیید صریح، کنترل SHA، شاخه و مدیریت Conflict.
- [ ] آزمون انتشار در محیط آزمایشی پیش از انتشار واقعی.
- [ ] آزمون دستی پنل در دسکتاپ و موبایل.

**مرز امنیتی فعلی:** پنل فقط پیش‌نویس محلی و خروجی JSON می‌سازد؛ Token یا Secret در مرورگر دریافت یا ذخیره نمی‌شود و انتشار مستقیم فعال نیست.

## اصلاح ارسال ایمیل نسخه آفلاین — ۱۹ نوامبر ۲۰۲۶

- [x] جایگزینی بدنه ایمیل حجیم با پیوست‌های باینری شماره‌دار؛ هر بخش حداکثر ۷۵۰ KiB است.
- [x] ارسال هر بخش در یک پیام جداگانه با شماره ترتیبی، تعداد کل و SHA-256 کل فایل و همان بخش.
- [x] افزودن آزمون خودکار حفظ بایت‌ها، محدودیت اندازه، ترتیب پیوست‌ها و بازسازی فایل؛ آزمون‌ها پیش از ارسال در Workflow اجرا می‌شوند.
- [ ] اجرای اکشن واقعی و تأیید دریافت همه ایمیل‌ها و بازسازی فایل در مقصد.

**محدودیت تأیید:** تا پیش از اجرای Workflow، ارسال و دریافت واقعی ایمیل تأییدشده نیست.

## اولویت ۵ — کیفیت، کارایی و تحویل

### انجام‌شده
- [x] تست‌های ساختاری، Runtime، مدیریت کاتالوگ و latency در CI.
- [x] ۱۰۶ تست موفق و صفر شکست در Run 44495592185.
- [x] p95 اندازه‌گیری‌شده در GitHub Actions: HTML برابر ۱٫۴۳ ms، CSS برابر ۰٫۱۱ ms و JavaScript برابر ۰٫۰۹ ms.
- [x] Build و ممیزی ایستای Offline در Run 44495576645.

### باقی‌مانده
- [ ] اندازه‌گیری latency و مصرف حافظه روی دستگاه واقعی و موبایل.
- [ ] Regression کامل UI شامل Context، Cursor/Selection، درج، Undo/Redo، کلیدها و IME.
- [ ] ممیزی محتوایی استانداردها و ثبت منابع مرجع.
- [ ] تکمیل آزمون واقعی Offline در مرورگر و موبایل.
- [ ] تکمیل XLSX و انتشار امن کاتالوگ.
- [ ] رفع مغایرت احتمالی مستندات با رفتار واقعی Runtime.
- [ ] ثبت نتایج نهایی و بستن موارد باز فقط پس از آزمون قابل تکرار.

**تفسیر کارایی:** اعداد p95 بالا فقط مربوط به runner گیت‌هاب هستند و تضمین عملکرد دستگاه کاربر نیستند.

## معیارهای پایان پروژه

- [ ] منبع داده پیشنهادهای HTML/CSS/JavaScript یکپارچه و Legacy فقط پس از تطابق کامل حذف شده باشد.
- [ ] Context، رتبه‌بندی و درج پیشنهادها در سناریوهای واقعی درست باشد.
- [ ] Cursor، Selection، کلیدها، Undo/Redo و IME فارسی آزمون شده باشند.
- [ ] کاتالوگ‌ها از نظر محتوا و ارجاعات با منابع معتبر ممیزی شده باشند.
- [ ] نسخه آفلاین با قطع واقعی اینترنت در دسکتاپ و موبایل تأیید شده باشد.
- [ ] مدیریت کاتالوگ XLSX، اعتبارسنجی کامل و انتشار امن را پشتیبانی کند.
- [ ] CI سبز باشد و README با وضعیت واقعی پروژه هماهنگ بماند.

## ثبت اصلاحات و تأیید این مرحله — ۱۹ نوامبر ۲۰۲۶

- [x] JavaScript: inference برای aliasهای ساده متغیر به‌صورت بازگشتی اضافه شد؛ چرخه alias با مجموعه visited متوقف می‌شود.
- [x] تست‌های Runtime برای aliasهای Date، Map و String اضافه شد.
- [x] HTML Shadow: adapter آزمایشی، گزینه‌های Legacy را در فیلتر contexts حفظ می‌کند؛ آزمون دیگر صرفاً وجود آرایه اختلاف را بررسی نمی‌کند و صفر اختلاف برچسب/ترتیب را برای ۳۲ Fixture الزام می‌کند.
- [x] GitHub Actions: Run 44497589186 موفق؛ ۱۰۷ تست موفق، صفر شکست. گزارش Shadow: ۳۲ Fixture و صفر اختلاف.
- [x] CSS: تشخیص Context در presence of strings/comments اصلاح شد؛ آزمون Run 44497848391 شامل ۱۰۸ تست موفق، صفر شکست.
- [x] Offline Build: Run 44497830716 موفق.
- [x] Offline Build: Run 44497589099 موفق.

**دامنه تأیید:** این نتایج، آزمون‌های خودکار Node/CI و Build آفلاین‌اند. inference پیشرفته، اجرای واقعی مرورگر، قطع شبکه، موبایل، IME، Cursor/Selection و سایر موارد باز این نقشه هنوز تأیید نشده‌اند.

## قواعد نگهداری نقشه

1. این فایل تنها مرجع نقشه راه است؛ نقشه موضوعی جداگانه ساخته نشود.
2. هر تغییر وضعیت، نتیجه آزمون و تصمیم فنی در همین فایل ثبت شود.
3. فقط کارهای واقعاً انجام‌شده و قابل تأیید تیک بخورند.
4. README اصلی فقط خلاصه وضعیت و پیوند همین فایل را نگه دارد.


## تأیید عملی نسخه آفلاین از طریق ایمیل — ۱۹ نوامبر ۲۰۲۶

- [x] دریافت سه ایمیل شامل بخش‌های BIN نسخه آفلاین.
- [x] ذخیره هر سه بخش روی دستگاه.
- [x] باز کردن بخش‌ها با Notepad و چسباندن محتوا به ترتیب در فایل واحد.
- [x] اجرای فایل بازسازی‌شده در Google Chrome با اینترنت قطع و بدون نصب/استفاده از نرم‌افزار دیگری؛ سایت بالا آمد و اجرا شد (گزارش مستقیم کاربر).
- [ ] آزمون عملکردی پیشنهادهای HTML/CSS/JavaScript، درج، Preview، ذخیره/بازیابی و سایر قابلیت‌ها در حالت آفلاین.
- [ ] بررسی اینکه بازسازی دستی از BIN با روش دقیق و قابل تکرار و کنترل SHA-256 انجام شود؛ اجرای موفق فعلی، تأیید checksum بازسازی نیست.

**دامنه تأیید:** این یک موفقیت واقعی در انتقال، بازسازی دستی و بارگذاری نسخه آفلاین در Chrome است. فقط بالا آمدن سایت ثبت شده؛ آزمون تمام قابلیت‌ها هنوز انجام نشده است.


## بررسی و اصلاح باگ پیشنهاد زنجیره‌ای HTML — ۱۹ نوامبر ۲۰۲۶

- [x] ریشه ایراد پیدا شد: گزینه‌های `kind: child` در حالت زنجیره‌ای از محل Cursor درج می‌شوند، اما منطق قبلی علامت `<` را فرض می‌کرد که از قبل موجود باشد.
- [x] تابع مستقل `buildHTMLTagInsertion` به HTML completion اضافه شد تا prefix و موقعیت Cursor برای انتخاب اولیه، child، void و close تعیین شود.
- [x] مسیر `applyTagSuggestion` در Editor از helper مشترک استفاده می‌کند؛ انتخاب child اکنون `<tag>` را درج می‌کند.
- [x] Regression test برای نوع open، child معمولی، child void و close افزوده شد.
- [x] CI اجرا شد و Regression/کل مجموعه سبز است: Run 44506283327، ۱۰۹ تست موفق، صفر شکست؛ Shadow: ۳۲ Fixture، صفر اختلاف.
- [x] Offline Build و Audit پس از اصلاح: Run 44506256461 موفق؛ ۸۰ فایل Runtime، ۰ منبع خارجی؛ خروجی مستقل ۱٬۸۰۳٬۴۶۸ بایت.
- [ ] آزمون دستی تکرار چند انتخاب متوالی با پنجره پیشنهادها باز، روی نسخه آنلاین و فایل آفلاین.

**تأیید CI:** اصلاح سورس و Regression تأیید خودکار شده‌اند. **تأیید دستی نهایی** در مرورگر (تکرار انتخاب چند تگ بدون بستن منو) هنوز نیاز است؛ بنابراین باگ تا آن تکرار دستی بسته نهایی محسوب نمی‌شود.


## به‌روزرسانی نمونه پیش‌فرض ویرایشگر — ۱۹ نوامبر ۲۰۲۶

- [x] نمونه HTML از Starter ساده به صفحه showcase با انواع تگ‌های ساختاری، متن، لیست، جدول، فرم و عناصر دیگر گسترش یافت.
- [x] CSS نمونه شامل selectorها، pseudo-class/element، attribute، layout Flex/Grid، media query و reduced-motion شد.
- [x] JavaScript نمونه چند عملکرد و ساختار متفاوت آموزشی (data types، function، array/object، condition/loop، DOM events/form، Date/Intl، timer، Promise، Map/Set و error handling) را پوشش می‌دهد.
- [x] SVG نمونه به صورت data URI تعبیه شد تا پیش‌نمایش برای تصویر نیاز به اتصال اینترنت نداشته باشد.
- [x] بررسی کد هنگام تغییر نمونه، خطای مرجع `isClosing` در `applyTagSuggestion` نیز کشف و تعریف آن اصلاح شد.
- [ ] CI برای تست‌ها، syntax و build آفلاین پس از این commitها.
- [ ] بررسی دستی پیش‌نمایش همه تب‌ها و کارکردهای نمونه HTML در مرورگر.


### تکمیل نمونه‌های آغازین و اصلاحات حین ممیزی — ۱۹ نوامبر ۲۰۲۶
- [x] نمونه HTML از نمونه بسیار ساده به مجموعه‌ای متنوع از تگ‌های ساختاری، متنی، لیستی، جدول، فرم و عناصر کاربردی گسترش یافت.
- [x] CSS برای selectorهای پایه و ترکیبی، attribute/pseudo، flex/grid، responsive و reduced-motion مثال دارد.
- [x] نمونه JavaScript انواع داده، destructuring، function/arrow، شرط، حلقه، map/filter، DOM، فرم، Date/Intl، timer، Promise، async/await، Map/Set و try/catch را نشان می‌دهد.
- [x] نمونه تصویر از منبع خارجی به SVG inline منتقل شد تا offline-safe بماند.
- [x] خطای undefined بودن `isClosing` در مسیر اعمال پیشنهاد HTML، هنگام بررسی کد کشف و تعریف آن اضافه شد.
- [x] Template literals تو در تو در نمونه JavaScript به رشته‌سازی ساده تغییر یافتند تا در template والد، interpolation ناخواسته ایجاد نکنند.
- [x] CI پس از نمونه‌های گسترش‌یافته: Run 44507418489، ۱۰۹ تست موفق، صفر شکست؛ ۳۲ HTML Shadow Fixture صفر اختلاف.
- [x] Offline Build: Run 44507418383 موفق؛ ۸۰ فایل Runtime، ۰ منبع خارجی؛ Audit passed.
- [ ] بازبینی دستی Preview و اجرای نمونه JavaScript در مرورگر؛ چون هنوز کاربر تست مرورگر این تغییر را انجام نداده است.


## اصلاح ارسال ایمیل: سه پیوست در یک پیام — ۱۹ نوامبر ۲۰۲۶

- [x] حفظ روش فعلی تقسیم فایل به قطعات باینری شماره‌دار، با اندازه حداکثر ۷۵۰ KiB.
- [x] تغییر ارسال از چند پیام به **یک ایمیل با دقیقاً سه پیوست**؛ فایل‌هایی که کمتر یا بیشتر از سه بخش تولید کنند، پیش از ارسال رد می‌شوند.
- [x] آزمون‌های خودکار: سه attachment، نام‌گذاری/ترتیب، بازسازی دقیق بایت‌ها و SHA-256 کل فایل، و رد تعداد بخش نامناسب.
- [ ] اجرای اکشن واقعی و تأیید دریافت یک ایمیل با سه ضمیمه.


## اصلاح پایدار تغییر اندازه Editor و Preview — ۱۹ نوامبر ۲۰۲۶

- [x] اصلاح grid sizing برای کوچک‌شدن واقعی ستون‌ها و جلوگیری از overflow ناشی از iframe.
- [x] افزودن grid row صریح با `minmax(0, 1fr)` و min/max-width/height صفر روی پنل‌ها و iframeها.
- [x] جایگزینی وابستگی صرف به `window.resize` با `ResizeObserver` روی workspace و هر panel.
- [x] ارسال resize event به iframeهای داخلی هنگام تغییر اندازه panel یا drag divider.
- [x] افزودن regression checks برای CSS shrink/overflow و Observer/iframe resize behavior.
- [ ] آزمون بصری دستی در مرورگر دسکتاپ با resize پنجره و drag divider؛ این مرحله به تأیید دستی نیاز دارد.


## ممیزی Responsive Layout — ۱۹ نوامبر ۲۰۲۶
- [x] شرط pointer-coarse و ارتفاع صفحه که Layout موبایل را مستقل از عرض فعال می‌کرد، در CSS اصلی و اجزای مرتبط حذف شد.
- [x] breakpoint موبایل در Layout، Editor، Header و Mobile workspace به عرض ۷۰۰px محدود شد.
- [x] اسکرول افقی Editor داخل scroll-host حفظ شد.
- [x] Regression test برای breakpointهای عرض‌محور و containment اضافه شد.
- [ ] تست مرورگر واقعی: کاهش/افزایش عرض، resize چندباره و بررسی فضای خالی کنار Preview؛ تست ایستا رفتار بصری را اثبات نمی‌کند.


## حذف Mobile UI و CSS اختصاصی — ۱۹ نوامبر ۲۰۲۶
- [x] حذف breakpointهای CSS مخصوص موبایل از صفحه اصلی، Editor، Header و New Page.
- [x] حذف کنترل سوییچر پنل موبایل و کلیدهای کمکی موبایل از HTML و بارگذاری اسکریپت‌ها.
- [x] حذف ۶ فایل مربوط به mobile-workspace و mobile-extra-keys و حذف آن‌ها از Offline manifest.
- [x] حذف ارتباط JavaScript با کلیدهای کمکی موبایل.
- [ ] تست واقعی در مرورگر برای layout دوپنله در عرض‌های کوچک و بزرگ و resize بدون refresh.

- [x] پاکسازی تکمیلی Media Queryهای موبایل در اکشن‌های Header، Completion Catalog و Tag Suggestions؛ حذف touch-action: manipulation از اکشن‌ها.


## آزمایش حذف CSS ریشه — ۱۹ نوامبر ۲۰۲۶
- [x] نسخه `style.css` قبل از تغییر با نام `style-backup.css` در ریشه ذخیره شد.
- [x] `style.css` اصلی خالی شد تا اثر CSS ریشه در عیب‌یابی Layout بررسی شود.
- [ ] آزمون کاربر در مرورگر دسکتاپ؛ ثبت رفتار Gutter و فضای سفید Preview در این حالت.
- [ ] پس از تست، تصمیم برای بازگردانی فایل پشتیبان یا اصلاح CSS.

**توجه:** CSS داخلی iframeها دست‌نخورده باقی ماند؛ این آزمایش فقط CSS ریشه را حذف کرد.


## انتقال استایل Header و Clear tabs به CSS ریشه — ۱۹ نوامبر ۲۰۲۶
- [x] تهیه نسخه پشتیبان `core/header/header-style-backup.css`.
- [x] تهیه نسخه پشتیبان `core/clear-tabs/clear-tabs-style-backup.css`.
- [x] انتقال قواعد Header و Clear tabs به `style.css` مرکزی.
- [x] تبدیل Header و Clear tabs به Light DOM تا استایل ریشه بتواند آن‌ها را کنترل کند.
- [x] خالی‌کردن فایل‌های `core/header/header.css` و `core/clear-tabs/clear-tabs.css` پس از تهیه نسخه پشتیبان.
- [x] هماهنگ‌سازی Header و clear-tabs در منطق ساخت نسخه آفلاین با CSS ریشه.
- [ ] اجرای تست‌های CI و بررسی دستی آنلاین/آفلاین؛ هنوز نتیجه مرورگر پس از این انتقال تأیید نشده.


## قانون معماری CSS مرکزی — ۱۹ نوامبر ۲۰۲۶
- [x] تصویب قانون: تمام CSSهای فعال باید در `style.css` ریشه باشند؛ ساخت CSS مستقل جدید ممنوع.
- [x] تصویب قانون: المان‌های هم‌نوع باید از استایل مشترک استفاده کنند و بلوک‌های تکراری ایجاد نشوند.
- [x] تعیین روش iframe: سند iframe باید CSS مرکزی ریشه را خودش بارگذاری کند؛ CSS صفحه مادر به داخل iframe نفوذ نمی‌کند.
- [x] ایجاد سند مرجع `maps/CSS-ARCHITECTURE.md` و لینک آن در README.
- [ ] مهاجرت تدریجی CSS فعال موجود از `core/` و سایر پوشه‌ها به `style.css`.
- [ ] یکپارچه‌سازی قواعد مشابه و حذف تکرارهای selector/قواعد.
- [ ] حذف فایل‌های CSS فعال قدیمی پس از انتقال و اصلاح بارگذاری‌ها.
- [ ] آزمون CI و مرورگر آنلاین/آفلاین پس از مهاجرت؛ تا آن زمان قانون مستند است اما مهاجرت کامل نشده.


## بازنگری معماری CSS/JS — ۱۹ نوامبر ۲۰۲۶
- [x] قانون قبلی «همه CSSها فقط در style.css ریشه» با معماری منعطف‌تر جایگزین شد.
- [x] قانون جدید: هر صفحه/بخش UI اصلی می‌تواند CSS اختصاصی واحد برای ظاهر خودش داشته باشد.
- [x] قانون جدید: عناصر مشابه باید قواعد و کلاس‌های استایل مشترک را reuse کنند؛ CSS مجزا برای اکشن یا عنصر کوچک ایجاد نشود.
- [x] قانون جدید: قابلیت‌ها و اکشن‌های دارای منطق/تعامل، JavaScript مستقل داشته باشند و JS از CSS جدا بماند.
- [ ] بررسی و سازمان‌دهی CSSهای فعلی طبق قانون جدید؛ حذف فایل‌ها فقط بعد از انتقال و تست.
- [ ] بررسی JSهای اکشن‌محور برای جداسازی منطق از ظاهر و هماهنگی نسخه آنلاین/آفلاین.


## انتقال فایل‌های CSS و JavaScript ریشه به پوشه backup — ۱۹ نوامبر ۲۰۲۶
- [x] ایجاد پوشه `backup/` در ریشه مخزن.
- [x] انتقال با حفظ دقیق محتوا: `style.css`، `style-backup.css` و `script.js` به `backup/`.
- [x] تطبیق محتويات فایل‌های کپی‌شده با فایل‌های اصلی پیش از حذف نسخه‌های ریشه.
- [x] حذف نسخه‌های اصلی از ریشه پس از تأیید کپی.
- [x] به‌روزرسانی README و ثبت ساختار جدید.
- [ ] بررسی وابستگی‌های باقی‌مانده به فایل‌های منتقل‌شده؛ `index.html` جدید مستقل است و اتصال‌های آن عمداً تغییر نکرده‌اند.


## انتقال ایندکس قدیمی به backup — ۱۹ نوامبر ۲۰۲۶
- [x] انتقال `index-original-disabled.html` به `backup/index-original-disabled.html`.
- [x] بررسی تطابق کامل محتوای کپی با فایل اصلی پیش از حذف نسخه ریشه.
- [x] حذف فایل از ریشه پس از تأیید کپی.
- [x] به‌روزرسانی README و ثبت عملیات.


## کامنت‌گذاری توضیحی فارسی در ایندکس جدید — ۱۹ نوامبر ۲۰۲۶

- [x] افزودن شرح فارسی به بخش سند و Metaها، CSS reset، نوارهای بالا/پایین، دو پنل، Divider و قواعد responsive.
- [x] افزودن کامنت به گزینه‌های Header/Footer، عنوان‌ها و ناحیه‌های خالی Editor و Preview برای مشخص‌کردن وضعیت فعلی و کارکرد موردنظر.
- [x] توضیح منطق JavaScript: دریافت عناصر، stateهای کشیدن، محاسبه عرض، محدودیت حداقل اندازه، Mouse و Touch eventها و پایان تعامل.
- [x] تغییر فقط توضیحات کامنتی انجام شد؛ رفتار و اتصال‌های فعلی ایندکس عمداً دست‌نخورده باقی ماندند.
- [ ] بررسی بصری و اجرای دستی فایل در مرورگر پس از تغییر کامنت‌ها (صرفاً برای کنترل نهایی).


## اصلاح ساختار Header و Footer — ۱۹ نوامبر ۲۰۲۶
- [x] تبدیل گزینه‌های هدر و فوتر به عناصر واقعی `button type="button"` (۹ گزینه Header، ۶ گزینه Footer).
- [x] افزودن reset استایل button در CSS داخلی برای حفظ ظاهر فعلی.
- [ ] اتصال اکشن هر دکمه به فایل JavaScript مستقل در مراحل بعد؛ هنوز عملکرد کلیک پیاده‌سازی نشده است.


## جداسازی استایل عمومی Buttonها — ۱۹ نوامبر ۲۰۲۶
- [x] ایجاد فایل ریشه `style.css` برای استایل عمومی دکمه‌های Header و Footer.
- [x] انتقال قواعد `.scroll-area .item`، حالت Hover و اندازه دکمه‌های Footer از CSS داخلی به فایل خارجی.
- [x] اتصال فایل `style.css` از طریق `<link rel="stylesheet">` در `index.html`.
- [x] محدوده CSS جدید فقط استایل کلی Buttonهاست؛ استایل‌های Layout و سایر اجزا در این مرحله دست‌نخورده‌اند.
- [ ] بررسی بصری در مرورگر و نسخه آفلاین پس از اتصال.


## English-only LTR interface and clean core folder — 19 November 2026
- [x] Set root document language to English and direction to LTR.
- [x] Replace the visible document title with English.
- [x] Remove RTL direction settings from Editor and Preview panes; set direction to LTR.
- [x] Replace non-English accessible resize label with `Resize panels`.
- [x] Move the existing `core/` component directory intact to `core-old/`, then archive it under `backup/core-old/`; keep active `core/` reserved for JavaScript modules.
- [x] Create a new `core/` directory represented by `.gitkeep` (Git cannot store truly empty folders).
- [ ] Review all UI-visible strings in components, dialogs, tooltips, and status messages for English-only compliance.
- [ ] Validate LTR layout in browser, including offline build.


## پیاده‌سازی موتور یکپارچه ذخیره‌سازی مرورگر — ۱۹ نوامبر ۲۰۲۶

- [x] تصمیم معماری: همه قابلیت‌های ذخیره‌سازی مرورگر در یک فایل JavaScript مرکزی نگهداری شوند.
- [x] ایجاد `core/browser-storage.js` با API سراسری `window.Editor1Storage` برای استفاده بدون module.
- [x] پیاده‌سازی ابزارهای LocalStorage (خواندن/نوشتن JSON، حذف، پاک‌سازی کلیدهای اختصاصی Editor1 و فهرست کلیدها).
- [x] پیاده‌سازی IndexedDB (ایجاد DB/store، ذخیره/خواندن/حذف/فهرست/پاک‌سازی رکوردهای namespace).
- [x] پیاده‌سازی مدیریت کوکی‌های قابل مشاهده JavaScript (خواندن/ثبت/حذف/پاک‌سازی) با توضیح محدودیت کوکی HttpOnly.
- [x] افزودن helperهای پروژه، زمان‌بندی Auto-save، تشخیص قابلیت‌ها و تخمین فضای ذخیره‌سازی.
- [x] افزودن پاک‌سازی یکپارچه داده‌های اختصاصی Editor1 با گزینه پاک‌سازی کوکی‌ها.
- [ ] آزمون Syntax و بررسی خطاهای اجرایی؛ سپس آزمون مرورگر واقعی.
- [ ] اتصال موتور به index/Editor و تعریف مسیر ذخیره کدها، تنظیمات و پروژه‌ها.
- [ ] آزمون ذخیره/بازیابی، quota، قطع اینترنت، چند تب و اجرای فایل آفلاین.

**دامنه:** موتور ساخته شده ولی فعلاً به رابط Editor وصل نشده است؛ قابلیت‌های Auto-save و ذخیره پروژه فقط API آماده دارند و رفتار یکپارچه واقعی پس از اتصال و آزمون تأیید می‌شود.


## Browser data cleanup button — 19 November 2026
- [x] Added `core/clear-editor-storage.js` as a standalone Header action.
- [x] Removes `editor1`-prefixed LocalStorage/SessionStorage keys, visible Editor1 cookies, Editor1-named IndexedDB databases, and CacheStorage entries whose names include Editor1.
- [x] Added confirmation prompt and success/failure feedback.
- [x] Connected action to `index.html` and renamed button to `clear editor data`.
- [ ] Manual browser and offline-file testing to confirm cleanup behavior and that unrelated website data remains untouched.
**Limitations:** Only identifiable Editor1-related storage is targeted. HttpOnly cookies and cookies scoped to alternate paths/domains may not be removable from JavaScript.


## Editor Bridge and Preview integration — 19 November 2026

- [x] Root `index.html` now embeds the existing HTML/CSS/JavaScript editor and preview panels in flexible iframe containers.
- [x] Created `core/editor-bridge.js` to receive source changes from the editor and relay the three language sources to Preview; forwards reset and clear-all commands.
- [x] Replaced inline workspace styling with shared root `style.css` rules for the layout and reusable toolbar button style.
- [x] Preserved the existing AlfaCode engine files under `alfacode/src/` unchanged.
- [x] Copied existing editor, preview, storage, completion-catalog, and suggestion UI runtime files from `backup/core-old/` to active `core/` paths, preserving archived originals.
- [x] Corrected iframe URLs to the active `core/editor/editor.html` and `core/preview/preview.html` documents.
- [x] Added a current-tab-only clear command to the active editor UI script (not to AlfaCode engine files).
- [ ] Test editing and live preview updates in browser; verify resize stability, mobile behavior, and offline operation.
- [ ] Migrate editor/preview implementation and runtime dependencies from `backup/core-old/` into active `core/` modules after integration tests.
- [x] Disable the `clear tab` button visibly until a current-tab-only command is implemented; it is not available in the reused editor script.
- [ ] Reconcile `scripts/offline-manifest.json` and build/audit output paths with the actual active/archived component locations.


## Reset Project / Clear Tab / Clear All Tabs — 19 November 2026
- [x] Wired the three Header controls to Editor actions through `core/editor-bridge.js`.
- [x] Added confirmation dialogs to avoid accidental loss of code.
- [x] Reset Project restores the starter sources for HTML/CSS/JavaScript and selects HTML.
- [x] Clear Tab removes code only from the active language.
- [x] Clear All Tabs removes code from all three language tabs without switching the selected language.
- [x] All actions render, schedule storage, and publish source updates; Preview receives the updated sources.
- [x] Hide all completion/suggestion menus after Clear All Tabs and Reset Project (not just the HTML menu).
- [ ] Manual browser test: verify confirm/cancel, each button action, persistence after reload, and Preview update.
