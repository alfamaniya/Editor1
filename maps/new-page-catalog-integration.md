# اتصال کاتالوگ‌ها به New page

هدف: New page داده‌ها را مستقیماً از سه JSON دریافت کند؛ بدون کاتالوگ موازی.

## انجام‌شده
- Loader مستقل `core/completion-catalog/catalog-loader.js` برای دریافت هر سه JSON.
- بررسی HTTP و ساختار `records`، فیلتر رکوردهای غیرفعال، خطای جداگانه برای هر زبان (fail-soft).
- صفحه کاتالوگ New page به داده‌های JSON وصل شد؛ جست‌وجو و فیلتر زبان روی داده‌های بارگذاری‌شده.

## باقی‌مانده — اولویت
1. اتصال runtime پیشنهادهای داخل Editor به JSONها؛ حذف وابستگی‌های legacy پس از تست.
2. context filtering: HTML parent/child/attributes، CSS property/value، JavaScript member/identifier؛ کنترل snippet.
3. درج و حفظ cursor/selection؛ کلیدهای Escape/Enter/Tab/Arrow و جلوگیری از تکرار.
4. تست loader، خطای JSON مستقل، regression، CI و online/offline/browser/mobile.
5. به‌روزرسانی README با نتایج واقعی آزمون و ارزیابی latency/حجم.

منابع: `alfacode/data/completions.html.json`, `completions.css.json`, `completions.javascript.json`.
اصل: ماژولار، offline-first، fail-soft و snippetهای غیرفعال به‌صورت پیش‌فرض.