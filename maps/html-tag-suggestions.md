# پیشنهاد تگ HTML

**وضعیت:** ممیزی اختلاف‌های Shadow و اصلاح Adapter آزمایشی انجام شد؛ اجرای CI پس از اصلاح در انتظار نتیجه است. Runtime همچنان Legacy است.

## انجام‌شده
- ۳۲ Fixture ثابت برای context، prefix، closing، chain، SVG، void، duplicate و موقعیت Cursor.
- بررسی ۱۷ اختلاف ثبت‌شده؛ منشأهای اصلی شامل تشخیص والد/context در Adapter، محدودیت parentTags و تفاوت ترتیب محلی با رتبه عمومی بود.
- Adapter اکنون پشته عناصر باز را از درخت parser استخراج می‌کند و parent واقعی را از context معنایی جدا نگه می‌دارد.
- گزینه‌های موجود در Legacy به‌عنوان کف سازگاری حفظ می‌شوند؛ parentTags برای گسترش گزینه‌های جدید اعمال می‌شود.
- ترتیب گزینه‌های Legacy حفظ و رتبه rank/order برای گزینه‌های افزوده استفاده می‌شود.
- هیچ تغییری در Runtime یا JSON اعمال نشده است.

## باقی‌مانده — اولویت
**P1 آزمون:** اجرای CI برای Adapter اصلاح‌شده و بررسی گزارش اختلاف‌های جدید.
**P2 داده و context:** تعیین سیاست نهایی parentTags و namespace/context برای پوشش گسترده‌تر، با تطبیق content model مرجع.
**P3 اتصال:** طراحی و پیاده‌سازی Runtime adapter فقط پس از تأیید سیاست‌ها؛ حفظ close/jump-close، chain، قرارداد UI و درج/Cursor.
**P4 Regression:** آزمون مرورگر، کلیدها، Undo/Redo، موبایل/دسکتاپ و IME فارسی؛ سپس build و آزمون آفلاین.

معیار تکمیل: context و parent/child درست، درج امن، کلیدها و IME آزمایش‌شده و README به‌روز.
