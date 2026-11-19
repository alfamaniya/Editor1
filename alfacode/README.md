# AlfaCode

موتور ویرایش کد ماژولار Editor1 برای HTML، CSS و JavaScript.

## وضعیت
- هسته سند، انتخاب، تراکنش، تاریخچه، ورودی و نمایش مستقل.
- parser، rules و completion برای زبان‌ها جدا هستند.
- آزمون‌های خودکار در `tests/`.
- نمایش کاتالوگ New page از JSONها مستقیم انجام می‌شود؛ پیشنهادهای داخل ویرایشگر هنوز از موتورهای legacy استفاده می‌کنند.

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

## اولویت
1. ممیزی runtime و اتصال loader به JSONها.
2. Context و درج صحیح.
3. اتصال HTML/CSS/JavaScript و کنترل snippetها.
4. تست regression و عملکرد.
5. Ranking و بهینه‌سازی.

جزئیات: [نقشه تکمیل کاتالوگ](../maps/catalog-completion.md)، [نقشه New page](../maps/new-page-catalog-integration.md).

اصل توسعه: ماژولار، سازگار با رفتار فعلی، offline-first و آزمون‌پذیر؛ README و نتایج واقعی آزمون بعد از تغییر به‌روز شوند.