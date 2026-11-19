# اتصال کاتالوگ‌ها به New page

هدف: اتصال JSONهای HTML/CSS/JavaScript به New page با حفظ رفتار فعلی و پشتیبانی آفلاین.

## باقی‌مانده — اولویت
**P1 ممیزی:** بررسی New page، موتور و loaderهای موجود؛ قرارداد API، schema و fallback.
**P2 Loader:** بارگذاری سه فایل، schema/language/version checks، cache، مسیر محلی و fail-soft.
**P3 اتصال/context:** اتصال به تب فعال؛ جلوگیری از cross-language و listener تکراری؛ فیلتر context/metadata، CSS property/value و HTML parent/child/attributes؛ browser-only و snippetهای غیرفعال.
**P4 درج:** تطبیق label/name/keys؛ درج درست tag/property/value/snippet؛ حفظ selection/Cursor؛ کلیدهای Escape/Enter/Tab/Arrow و جلوگیری از تکرار.
**P5 آزمون/offline:** loader، خطای JSON مستقل، context، درج و regression؛ CI؛ تست New page online/offline؛ جاسازی JSON، حجم و latency.
**P6 تکمیل:** README/معماری؛ حذف loader قدیمی پس از ممیزی؛ ثبت نتایج.

فایل‌ها: `alfacode/data/completions.html.json`, `completions.css.json`, `completions.javascript.json`.

اصول: modular، offline-first، fail-soft و بدون فعال‌سازی ناخواسته snippet.