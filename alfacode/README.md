<!-- #README.md: مستندات اصلی و راهنمای پروژه -->
# AlfaCode

موتور ویرایش کد ماژولار Editor1 برای HTML، CSS و JavaScript.

## وضعیت
- هسته سند، انتخاب، تراکنش، تاریخچه، ورودی و نمایش مستقل.
- parser، rules و completion برای زبان‌ها جدا هستند.
- آزمون‌های خودکار در `tests/`.
- پیشنهادهای زنده HTML، CSS و JavaScript از طریق Loader مشترک به کاتالوگ‌های JSON متصل‌اند؛ HTML برای حفظ سازگاری هنوز مسیر Legacy را نیز نگه می‌دارد.

## کاتالوگ‌ها
- `data/completions.html.json`: ۱۴۶
- `data/completions.css.json`: ۹۲۹
- `data/completions.javascript.json`: ۹۰۸
- **مجموع: ۱۹۸۳ رکورد**

## ساختار
```
alfacode/
├── data/       # کاتالوگ‌ها
├── examples/
├── src/
│   ├── core/       # سند، state، selection، transaction، history
│   ├── input/     # صفحه‌کلید و clipboard
│   ├── rendering/ # نمایش و Cursor
│   ├── language/  # parser، tokenizer، completion
│   ├── features/
│   ├── themes/
│   └── utils/
└── tests/
```

## وضعیت کار
- آزمون Shadow HTML: ۳۲ Fixture با صفر اختلاف در Run 44497589186.
- آزمون‌های خودکار: ۱۰۸ موفق، صفر شکست (Run 44497848391).
- JavaScript inference از aliasهای ساده متغیر پشتیبانی می‌کند؛ inference پیشرفته هنوز باقی است.
- تشخیص Context در CSS نسبت به brace/colon داخل string و comment مقاوم شده است.

## نقشه راه
جزئیات کارهای انجام‌شده و باقی‌مانده در [نقشه راه واحد](../maps/ROADMAP.md) ثبت می‌شود.
اصل توسعه: ماژولار، سازگار با رفتار فعلی، offline-first و آزمون‌پذیر؛ README و نتایج واقعی آزمون بعد از تغییر به‌روز شوند.