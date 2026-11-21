<!-- #OFFLINE.md: توضیح ساخت، ممیزی و انتشار نسخه مستقل آفلاین Editor1 -->
# نسخه Offline
## خروجی
`offline/AlfaCode-Offline.html` خروجی مستقل تولیدشده است؛ دستی ویرایش نشود.
## اجزا
- `scripts/offline-manifest.json`: منابع و ترتیب build.
- `scripts/build-offline.mjs`: جمع‌آوری منابع و تولید HTML standalone.
- `scripts/audit-offline-output.mjs`: بررسی ساختار و منابع خروجی.
- `.github/workflows/build-offline.yml`: workflow ساخت و audit و به‌روزرسانی artifact.
- `scripts/send-offline-email.py` و workflow ارسال: بسته‌بندی/ارسال با secrets.
## روند
1. سورس فعال را تغییر دهید.
2. Builder را اجرا کنید.
3. Audit و تست مرتبط را اجرا کنید.
4. نسخه مستقل را در مرورگر، مخصوصاً Visual و موبایل، بررسی کنید.
5. نتیجه CI و manual verification را جدا ثبت کنید.
## وضعیت
وجود build/audit به معنی پاس بودن آخرین run نیست؛ نتیجه باید از CI بررسی شود.

## Repository Tree در خروجی مستقل
- Builder صفحه درخت (\`repository-tree/index.html\`، CSS و JavaScript) را در HTML مستقل جاسازی می‌کند.
- دکمه \`Repository Tree (Offline)\` snapshot ساختار را در پنجره جدید باز می‌کند؛ نمایش درخت، باز و بسته‌کردن پوشه‌ها، شمارنده‌ها و Expand/Collapse All بدون اینترنت کار می‌کنند.
- لینک فایل‌ها در نسخه آفلاین به لینک غیرفعال تبدیل می‌شوند؛ باز کردن سورس GitHub همچنان به اتصال اینترنت نیاز دارد.
- لینک‌های GitHub در سورس درخت مخزن استثنای محدود دارند چون Builder آن‌ها را در snapshot آفلاین خنثی می‌کند؛ Audit خروجی نهایی همچنان نبود URL/endpoint شبکه‌ای را کنترل می‌کند.
- Audit منابع خارجی HTML/CSS و وابستگی‌های شبکه‌ای runtime را بررسی می‌کند؛ پس از تغییر Builder، نتیجه Build و Audit باید از CI تأیید شود.
- پس از هر تغییر Builder، نتیجه Build و Audit باید از CI تأیید شود.
