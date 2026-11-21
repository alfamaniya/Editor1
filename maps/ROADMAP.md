<!-- #ROADMAP.md: ثبت نقشه راه، اولویت‌ها و وضعیت پیشرفت پروژه -->
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

## Visual Editor — انتخاب المان و تنظیمات بصری

- [x] افزودن دکمه Visual Settings به نوار ابزار.
- [x] فعال‌سازی انتخاب المان در Preview و نمایش دسته‌های Color، Border، Size، Shadow، Spacing و Typography.
- [x] ساخت پنل کنترل دسته‌ای با Apply و Back.
- [x] انتقال تغییرات تأییدشده به CSS Editor و بازتاب در Preview.
- [x] جداسازی Visual Editor در ماژول JavaScript مستقل و CSS اختصاصی.
- [x] اتصال فایل‌های جدید به Preview و Offline Manifest.
- [ ] آزمون مرورگر: انتخاب المان، دسته‌ها، Apply/Back و همگام‌سازی CSS.
- [ ] تست مرورگر: انتخاب عناصر مختلف، selector path، Apply/Back، و بررسی CSS در تب CSS.
- [x] اصلاح Selector انتخاب خود `body`؛ دیگر `body >` ناقص تولید نمی‌شود.
- [x] Apply پراپرتی‌ها را با Rule موجود دارای Selector یکسان ادغام می‌کند و پراپرتی‌های دیگر (مانند `margin` و `line-height`) را نگه می‌دارد؛ فقط Selectorهای بدون Rule به بلوک Visual Styles افزوده می‌شوند.
- [ ] آزمون مرورگر برای انتخاب `body` و تغییر رنگ؛ تأیید اینکه Rule جدید ساخته نمی‌شود و پراپرتی‌های موجود حفظ می‌شوند.
- [ ] تست حالت Offline و موبایل؛ هنوز تست واقعی انجام نشده است.

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


## Restore and connect Code Catalog button — 19 November 2026
- [x] Rename the root toolbar placeholder `json` to `Code Catalog` and add ID `codeCatalog`.
- [x] Restore active `core/new-page-action/new-page-action.html`, `new-page-action.css`, and `new-page-action.js` from archived legacy versions, updating button label and accessible text.
- [x] Connect the native root button to open `core/completion-catalog/completion-catalog.html` in a new tab; retain legacy Web Component behavior for compatibility.
- [x] Add the root toolbar action to the offline build bootstrap using the embedded catalog page.
- [x] Correct the offline manifest shell coordinator path from `script.js` to `core/editor-bridge.js`.
- [ ] Run offline build and audit, then test the catalog button in browser (online and offline) and verify catalog search/filter/sort/draft controls.


## اتصال Helper Keys — ۱۹ نوامبر ۲۰۲۶

- [x] ایجاد فایل مستقل `core/extra-key-action/extra-key-action.js` برای اتصال دکمه‌های علائم پایین صفحه به ادیتور.
- [x] اتصال دکمه‌ها به پیام `alfacode:extra-key-command` و استفاده از handler قدیمی `applyExtraKey` در Editor.
- [x] جایگزینی دکمه‌های placeholder پایین صفحه با علائم پرکاربرد.
- [x] افزودن فایل به offline manifest و مستندسازی README.
- [x] اصلاح اسکریپت Build برای embed کردن ماژول Helper Keys در خروجی مستقل (تغییر منبع ثبت شد).
- [ ] اجرای Build آفلاین و آزمون کلیک واقعی در مرورگر؛ هنوز تأیید نشده.


## Mobile Helper Keys — 19 November 2026
- [x] Added a mobile-only symbol accessory row, hidden by default.
- [x] Show only when editor focus and detected native keyboard visibility coincide.
- [x] Mobile row has one horizontally scrollable line and the requested nine symbol buttons.
- [x] Keep existing desktop footer helper keys and insertion pathway unchanged.
- [x] Use Visual Viewport height change heuristic; no direct native keyboard-open event is available.
- [ ] Manual device testing for keyboard timing, viewport edge cases, Android/iOS, and offline artifact.


## Live Preview regression fix — 19 November 2026
- [x] Fixed malformed newline escape in `core/editor-bridge.js` that prevented the bridge script from parsing and receiving editor source updates.
- [x] Fixed malformed newline escape in `core/extra-key-action/extra-key-action.js`.
- [ ] Run automated syntax/build validation and manually confirm live Preview.


## Visual Editor completion roadmap — 19 November 2026
- [x] Registered the detailed Visual Editor completion plan in `maps/VISUAL-EDITOR-ROADMAP.md`.
- [x] Linked the plan from README.
- [x] Recorded staged scope: UI/UX redesign; complete Color, Border, Size, Shadow, Spacing, Typography; advanced Layout/Flex/Grid/Position/Effects/Transform/Transition; Draft/Apply/Cancel/Reset; CSS integrity; testing and acceptance criteria.
- [ ] Begin Stage A: redesign the Visual Editor interface and establish consistent control/button standards.
- [ ] Implement subsequent stages according to the detailed map; do not mark items complete without verification.


## Visual Editor redesign started — 19 November 2026
- [x] Replaced the previous single settings panel with a builder-style overlay: Elements rail on the left, top status strip, and Inspector on the right.
- [x] Added a clear Select Element action and selected-element tag/selector display.
- [x] Redesigned the panel and control styling with a restrained dark UI and orange accent; added narrow viewport adjustments.
- [ ] Element insertion tiles are currently visual placeholders; insertion/search are not functional yet.
- [ ] Visual Editor category settings remain the existing initial set; the roadmap for completing them remains open.
- [ ] Verify interactions in browser, responsive layouts, and offline build before calling this stage fully tested.
- [x] Updated README and detailed Visual Editor roadmap to reflect this implementation.


## Visual Editor properties and settings roadmap — 20 November 2026
- [x] Added a dedicated detailed map for Inspector properties and every nested control: `maps/VISUAL-PROPERTIES-ROADMAP.md`.
- [x] Covered Color, Border, Size, Shadow, Spacing/Box Model, Typography, Layout/Flex/Grid, Position, Effects, Transform, Transition/Animation, Content/Element-specific, Responsive/Breakpoints, Presets/Utilities, and CSS integrity.
- [x] Registered the new map in README and the Visual Editor completion map.
- [ ] Implement the shared control state contract and then deliver categories in the map's staged sequence; all listed controls are planned, not implemented yet.
\n\n## Visual Editor shared controls infrastructure — 20 November 2026\n- [x] Added reusable property field and draft lifecycle helpers in `core/visual-editor/property-controls.js`.\n- [x] Connected the shared helper before Visual Editor initialization in Preview.\n- [x] Integrated draft, commit, cancel, and category reset actions.\n- [x] Added source-level regression checks and included the new module in JavaScript syntax checks.\n- [ ] Confirm actual browser interaction, CSS update/rollback, category reset, and offline build.\n

## Visual Editor Color category — 20 November 2026
- [x] Implemented Color panel: Background, Text, Border, Opacity, HEX picker/entry, swatches, Linear/Radial gradients.
- [x] Corrected Reset Category draft behavior so clearing properties can override committed properties when applied.
- [ ] Run full automated suite, offline build, and manual browser interaction before considering Color fully verified.


## Visual Editor Color category — 20 November 2026
- [x] Implemented Color panel: Background, Text, Border, Opacity, HEX picker/entry, swatches, Linear/Radial gradients.
- [x] Corrected Reset Category draft behavior so clearing properties can override committed properties when applied.
- [ ] Run full automated suite, offline build, and manual browser interaction before considering Color fully verified.


## Visual Editor full-screen workspace layout refinement — 20 November 2026
- [ ] Use only one fixed right-side panel; combine element browsing and Inspector settings in it, switching modes when needed.
- [ ] Preview/Canvas fills remaining space to the left and available height.
- [ ] Panel is viewport-fixed; panel contents and Preview scroll separately; lock page scrolling while Visual is open.
- [ ] Full-screen toolbar and safe exit back to normal Editor.
- [ ] Responsive panel collapse/overlay on small screens and manual verification.

- [ ] Clicking the Visual button switches the editor into a dedicated full-screen workspace/overlay, replacing the normal editor workspace while active.
- [ ] Left Elements rail and right Inspector rail are fixed/pinned, with viewport-height sizing (`100vh`/dynamic viewport equivalent) and stable panel widths; they do not scroll with the Preview.
- [ ] Preview/Canvas occupies all remaining horizontal space strictly between the two rails and expands/shrinks responsively.
- [ ] Keep each rail's content scrolling independently when it exceeds its height; Preview/canvas scrolling is separate. Prevent the document/page itself from scrolling while Visual workspace is active.
- [ ] Top Visual toolbar stays within the full-screen workspace; workspace uses correct layering and avoids overlap with the normal app header/workspace.
- [ ] On narrow screens, adapt/collapse rails or provide a controlled toggle so Preview remains usable without breaking the fixed-height workspace.
- [ ] Exit/close Visual mode restores the normal editor layout without losing selection, drafts, or committed CSS.
- [ ] Verify at desktop, tablet, and narrow viewport sizes; browser/manual verification is still pending.


## Visual Editor — hover element identity label (implementation added; verification pending)
- [x] Implemented in `core/visual-editor/visual-editor.js`: hovering a Preview element in Visual mode displays a label beside the cursor showing its ID and/or class.
- [x] Both ID and class are shown when present; fallback to whichever exists or tag name.
- [x] Label follows the pointer, is clamped inside Preview, and has `pointer-events: none`.
- [x] Hides when Visual mode exits or selection ends; multiple/long classes are handled with truncation and full title.
- [ ] Automated coverage added; CI and manual browser verification pending. Detailed checklist is in `maps/VISUAL-EDITOR-ROADMAP.md`.

## Visual Editor single-panel full-screen workspace — 20 November 2026

- [x] Visual mode expands Preview to fill the viewport and hides the regular Header/Footer/Editor pane/divider.
- [x] One right-side panel replaces the former dual-rail layout; Elements and Settings tabs switch within the same panel.
- [x] Selecting a Preview element transitions to Settings mode.
- [x] Exit Visual restores the standard workspace and updates the toolbar state.
- [x] Regression tests added for panel modes and full-screen communication.
- [ ] CI result and browser/manual desktop/tablet/mobile verification pending.

### Visual workspace CI status — 20 November 2026
- [x] 116/116 automated tests passed (Run 44623052830).
- [x] Offline build/audit passed and artifact commit pushed (Run 44623039708).
- [ ] Browser and responsive visual verification remain pending.


## Visual Editor preview/panel overlap correction — 20 November 2026
- [x] Root workspace styles now set Preview's right edge to the panel's left edge; the preview no longer extends beneath the fixed settings panel.
- [x] Desktop uses the panel width rule; small viewports use the same responsive width rule as the panel.
- [ ] Confirm visual appearance and resizing in a browser at desktop/tablet/mobile.



## ثبت تغییرات ۲۰ نوامبر ۲۰۲۶ — بررسی کار VS Code
- [x] افزودن تب‌های موبایل Editor/Preview و تعویض پنل فعال با کلاس‌های workspace.
- [x] هنگام ورود Visual، نمایش Preview و بازگردانی تب قبلی موبایل هنگام خروج.
- [x] پشتیبانی safe-area و اندازه‌های مناسب لمس برای Editor و پنل Visual در موبایل.
- [x] افزودن اکشن نوار ابزار **Build Offline File** و ثبت ماژول آن در Offline Manifest/Builder.
- [x] اکشن آفلاین: Snapshot از پوسته Standalone؛ اکشن آنلاین: دانلود خروجی Offline آماده.
- [x] ساخت factory مشترک کنترل‌های Inspector و چرخه Draft / Apply / Cancel / Reset Category.
- [x] آغاز پیاده‌سازی Color: HEX، palette، opacity و گرادیان Linear/Radial با دو color stop.
- [x] تک‌پنل Visual Editor با Elements/Settings و رفتار پنل bottom-sheet در موبایل.
- [ ] اجرای CI روی تغییرات جدید و تأیید دانلود واقعی در مرورگر.
- [ ] تست دستی Visual Editor و workspace در موبایل/دسکتاپ، و بررسی عملکرد آفلاین.

**یادداشت:** تیک‌های بالا به معنی ثبت پیاده‌سازی در commitهای ۲۰ نوامبر هستند، نه ادعای تست مرورگر دستی. وضعیت CI/مرورگر را جداگانه ثبت می‌کنیم.


## حذف اکشن دانلود ناخواسته — ۲۱ نوامبر ۲۰۲۶
- [x] حذف Build Offline File button و کد دانلود/Snapshot آن؛ این اکشن مستقل از فرایند Build خودکار GitHub بود.
- [x] حفظ `scripts/build-offline.mjs`، `scripts/offline-manifest.json` و Workflow ساخت خروجی آفلاین.
- [x] تست و Audit برای تأیید حذف دکمه از خروجی و نبود اشاره به ماژول اکشن تنظیم شد.
- [ ] منتظر اجرای CI برای تولید مجدد `offline/AlfaCode-Offline.html` و پاس شدن Audit.


## رفع وابستگی‌های Visual Editor در Build آفلاین — ۲۱ نوامبر ۲۰۲۶
- [x] افزودن `property-controls.js` به اسکریپت‌های Preview در Offline Manifest و قرار دادن آن قبل از `visual-editor.js`.
- [x] تزریق stylesheet پنل Visual به پوسته اصلی Offline برای حالت Portal (به‌جای اتکا به URL فایل CSS بیرونی).
- [x] Builder چک می‌کند که shared controls و CSS پنل در خروجی حضور داشته باشند.
- [x] Audit خروجی این دو مورد را بررسی می‌کند.
- [ ] CI/build جدید و تأیید عملکرد Visual Settings در فایل Offline.
**دامنه:** فقط اکشن/مسیر تولید `offline/AlfaCode-Offline.html` و manifest/audit مرتبط تغییر داده شدند؛ موتور AlfaCode دست‌نخورده است.


## آماده‌سازی Repository Tree (۲۱ نوامبر ۲۰۲۶)
- [x] عنوان دکمه شماره ۲ در Header به `Repository Tree` تغییر کرد؛ هنوز اکشن کلیک ندارد.
- [x] صفحه مستقل `repository-tree.html` ایجاد شد و فعلاً placeholder ساده است.
- [ ] تعریف رفتار درخت مخزن و اتصال دکمه؛ منتظر دستور کاربر.


## جداسازی صفحه Repository Tree — ۲۱ نوامبر ۲۰۲۶
- [x] ایجاد پوشه `repository-tree/` برای صفحه مستقل درخت مخزن.
- [x] تفکیک ساختار صفحه، استایل و منطق در `index.html`، `repository-tree.css` و `repository-tree.js`.
- [x] افزودن کامنت فارسی با قالب توافق‌شده در ابتدای هر فایل.
- [ ] اتصال دکمه Header و پیاده‌سازی قابلیت‌های درخت؛ منتظر دستور بعدی.


## اتصال دکمه Repository Tree — ۲۱ نوامبر ۲۰۲۶
- [x] افزودن شناسه `repositoryTree` به دکمه Header.
- [x] ایجاد `core/repository-tree-action/repository-tree-action.js` برای اتصال دکمه به صفحه مستقل `repository-tree/index.html`.
- [x] باز کردن صفحه در تب جدید با مسیر نسبی.
- [x] ثبت تغییر در README.
- [ ] آزمون کلیک در مرورگر و نسخه آفلاین.


## درخت مخزن پویا از GitHub API — ۲۱ نوامبر ۲۰۲۶
- [x] صفحه Repository Tree از حالت placeholder به نمایش ساختار زنده تبدیل شد.
- [x] دریافت recursive tree از API مخزن و شاخه `main` بدون نیاز به ثبت دستی مسیر فایل‌ها.
- [x] ساخت درخت سلسله‌مراتبی پوشه‌ها/فایل‌ها، مرتب‌سازی نام‌ها، شمارش و لینک مستقیم فایل‌ها.
- [x] کنترل‌های Refresh، Expand all و Collapse all و نمایش پیام خطا/محدودیت API.
- [x] README به‌روزرسانی شد.
- [ ] آزمون صفحه در مرورگر؛ به‌ویژه بررسی CORS/دسترسی API و رفتار rate limit.
**محدودیت:** GitHub API فقط پوشه‌هایی را گزارش می‌کند که در Git قابل ثبت باشند؛ پوشه خالی در Git ثبت نمی‌شود. نمایش تغییرات تازه در صفحه پس از Refresh یا بارگذاری دوباره انجام می‌شود.


## Repository Tree — GitHub Actions تولید HTML ثابت — ۲۱ نوامبر ۲۰۲۶
- [x] Workflow برای اجرا پس از هر Push به `main` و اجرای دستی اضافه شد.
- [x] اسکریپت Python مسیرهای tracked در Git را خوانده و درخت HTML سلسله‌مراتبی تولید می‌کند.
- [x] صفحه `repository-tree/index.html` با بخش تولیدشده هاردکد شده و در زمان نمایش API فراخوانی نمی‌کند.
- [x] README به‌روزرسانی شد.
- [ ] اجرای Workflow و بررسی صفحه در مرورگر؛ از اینجا تست واقعی انجام نشده.
**محدودیت:** Git پوشه خالی را ثبت نمی‌کند. اگر درخت تغییر کرده باشد Workflow فایل صفحه را Commit و Push می‌کند؛ این Commit با GITHUB_TOKEN برای جلوگیری از اجرای زنجیره‌ای Workflow استفاده می‌شود.


## نمایش کامنت خط اول کنار فایل‌ها در Repository Tree — ۲۱ نوامبر ۲۰۲۶
- [x] اسکریپت تولید درخت برای استخراج شرح از کامنت خط اول فایل‌ها به‌روزرسانی شد.
- [x] شرح استخراج‌شده در خط دوم و زیر نام فایل در HTML ثابت نمایش داده می‌شود؛ فایل‌هایی که قالب شرح را ندارند بدون شرح نمایش داده می‌شوند.
- [x] استایل شرح فایل‌ها به CSS اضافه شد.
- [x] README به‌روزرسانی شد.
- [x] اجرای GitHub Action و Commit درخت ثابت با شرح‌ها تأیید شد؛ Run 44897638146 موفق بود.\n- [ ] بررسی بصری در مرورگر موبایل و دسکتاپ.


## استانداردسازی کامنت فارسی و نمایش توضیحات در Repository Tree — ۲۱ نوامبر ۲۰۲۶

- [x] ایجاد اسکریپت `scripts/complete-file-comments.py` برای افزودن کامنت فارسی خط اول به فایل‌های قابل کامنت‌گذاری.
- [x] حفظ فایل‌هایی که از قبل دارای کامنت استاندارد نام فایل و توضیح هستند.
- [x] مستثنا کردن JSON (به دلیل نداشتن syntax کامنت معتبر) و فایل‌های `.gitkeep`.
- [x] اتصال اسکریپت تکمیل کامنت‌ها به Workflow بازسازی درخت مخزن.
- [x] اصلاح ترتیب نمایش درخت: نام فایل در خط اول و شرح در خط دوم.
- [x] اصلاح CSS برای چیدمان دوخطی، شکستن متن بلند و سازگاری موبایل.
- [x] مستندسازی روش در README.
- [x] اجرای Workflow: ۱۳۳ کامنت فارسی به فایل‌های قابل کامنت‌گذاری اضافه شد؛ ۱۳۴ فایل در Commit اکشن تغییر کرد (شامل HTML تولیدشده).\n- [x] درخت HTML ثابت بازسازی و Commit شد؛ Run 44897638146 موفق بود.\n- [ ] بررسی بصری صفحه در مرورگر موبایل و دسکتاپ.
- [ ] بررسی دستی صفحه Repository Tree در موبایل و دسکتاپ.

**محدودیت:** کامنت‌ها برای فایل‌های فاقد توضیح با شرح فارسی تولیدشده از نام فایل و پوشه درج می‌شوند؛ JSON و placeholderها کامنت نمی‌گیرند. اجرای اکشن و بازبینی نمایش نهایی هنوز تأیید نشده است.

- [x] بازبینی شمارنده درخت: ۱۴۳ فایل شرح دارند؛ ۱۳ فایل بدون شرح باقی مانده‌اند (JSONهای استاندارد، `.gitkeep` و چهار فایل خالی).
- [x] اصلاح استخراج شرح برای فایل‌های دارای shebang؛ شرح در خط دوم خوانده می‌شود.
## قانون پیگیری تدریجی کامنت فارسی فایل‌ها

- [x] درخت کامل فایل‌های مخزن در README به چک‌لیست تبدیل شد؛ تیک‌ها فقط برای فایل‌هایی ثبت می‌شوند که ChatGPT محتوا را بررسی و کامنت فارسی خط اول را کامل/اصلاح کرده باشد.
- [x] پس از هر درخواست اجرایی، ابتدا کار اصلی انجام می‌شود و در پایان یک فایل بدون تیک برای تکمیل کامنت انتخاب می‌شود؛ سپس تیک همان فایل و درخت README به‌روز می‌شود.
- [x] در این نوبت کامنت `scripts/update-repository-tree.py` بازبینی و اصلاح شد.
- [x] در این نوبت کامنت `scripts/complete-file-comments.py` بازبینی و قالب خط اول آن استاندارد شد؛ تیک آن در درخت README ثبت شد.
- [ ] این فرایند در درخواست‌های بعدی ادامه می‌یابد؛ فایل‌های JSON و فایل‌های فاقد syntax کامنت معتبر، از چک‌لیست کامنت‌گذاری خارج هستند.


## دسته‌بندی و تفکیک مستندات — ۲۱ نوامبر ۲۰۲۶

- [x] افزودن نمایه موضوعی به README به‌عنوان نقطه ورود اسناد.
- [x] ایجاد سند قوانین و استانداردها: `maps/RULES.md`.
- [x] ایجاد سند معماری سطح بالا: `maps/ARCHITECTURE.md`.
- [x] ایجاد قالب و ثبت اولیه صفحات/سطوح UI: `maps/PAGES.md`.
- [x] ایجاد فهرست موتورهای شناسایی‌شده با تأکید بر تأیید dependencies: `maps/ENGINES.md`.
- [x] ایجاد فهرست ماژول‌های Core: `maps/MODULES.md`.
- [x] ایجاد نقشه جریان داده اولیه (سطح بالا، نه قرارداد API): `maps/DATA-FLOW.md`.
- [x] ایجاد راهنمای AlfaCode: `maps/ALFACODE.md`.
- [x] ایجاد راهنمای Visual Editor: `maps/VISUAL-EDITOR.md`.
- [x] ایجاد راهنمای ذخیره‌سازی: `maps/STORAGE.md`.
- [x] ایجاد راهنمای Offline Build/Audit: `maps/OFFLINE.md`.
- [x] ایجاد راهنمای تست و verification: `maps/TESTING.md`.
- [ ] بررسی عمیق هر سند با سورس واقعی، تکمیل API/dependency/eventها و اصلاح statusها.
- [ ] تبدیل README به نمایه سبک: انتقال تدریجی توضیحات تخصصی به سند حوزه مربوط، بدون حذف یا جابه‌جایی ناگهانی اطلاعات.
