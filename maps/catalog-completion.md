# تکمیل کاتالوگ HTML، CSS و JavaScript

## انجام‌شده
- صفحه فهرست کاتالوگ به جدول پویا با تمام فیلدهای JSON تبدیل شده؛ جستجوی همه فیلدها، مرتب‌سازی ستون و اسکرول افقی اضافه شده است.
- HTML-1 تا 10: ۱۴۶ رکورد.
- CSS-1 تا 12: ۹۲۹ رکورد.
- JS-1 تا 13: ۹۰۸ رکورد؛ snippetها غیرفعال.
- مجموع ۱۹۸۳ رکورد؛ داده‌ها جدا، آزمون و ممیزی اولیه انجام شده.

## باقی‌مانده — اولویت
**P1 اتصال:** ممیزی موتور و نقاط اتصال؛ اعتبارسنجی نهایی سه JSON؛ loader مشترک با cache و خطای مستقل؛ اتصال JavaScript و حفظ رفتار درج.
**P2 context/درج:** Context Engine؛ Snippet Engine (snippetها خاموش پیش‌فرض)؛ اتصال CSS property/value/selector؛ اتصال HTML tag/attribute/parent-child.
**P3 کیفیت:** Ranking؛ اندازه‌گیری و بهینه‌سازی سرعت/cache؛ آزمون یکپارچه، regression، مرورگر و offline.

## داده‌ها
- `alfacode/data/completions.html.json`
- `alfacode/data/completions.css.json`
- `alfacode/data/completions.javascript.json`

معیار: منابع معتبر، metadata/context درست، browser-only تفکیک‌شده، درج امن، حفظ Cursor و README به‌روز.