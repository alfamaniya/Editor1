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
- صفحه/اکشن Repository Tree به GitHub API متکی است؛ در HTML مستقل، اسکریپت آنلاین آن حذف می‌شود.
- دکمه در خروجی با برچسب `Repository Tree (Online)` باقی می‌ماند و پیام نیاز به اینترنت را نمایش می‌دهد.
- Audit خروجی، هر تگ دارای `src`/`href` خارجی در shell را ممنوع می‌کند؛ بنابراین اسکریپت آنلاین باید از خروجی Standalone حذف شود.
- پس از هر تغییر Builder، نتیجه Build و Audit باید از CI تأیید شود.
