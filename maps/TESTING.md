<!-- #TESTING.md: راهنمای تست خودکار، CI، ساخت آفلاین و بررسی دستی Editor1 -->
# تست و کیفیت
## تست AlfaCode
- محل: `alfacode/tests/`.
- فرمان Node test در workflow `.github/workflows/alfacode-tests.yml` تعریف شده است.
- پوشش فایل‌ها: core editor، catalog، completion runtime/data، HTML fixtures/shadow، Visual Editor و workspace layout.
## CI workflows
- `alfacode-tests.yml`: syntax/test checks و regression.
- `build-offline.yml`: build و audit نسخه standalone و احتمال commit artifact.
- `repository-tree-update.yml`: تکمیل کامنت‌های قابل اعمال و تولید درخت HTML.
- `send-offline-email.yml`: workflow ارسال نسخه offline با درخواست دستی و secrets.
## انواع verification را جدا گزارش کنید
- **Automated test:** test command اجرا شده.
- **CI:** run با status مشاهده‌شده.
- **Build/Audit:** builder/audit واقعاً اجرا شده.
- **Manual browser:** تعامل واقعی مرورگر/device بررسی شده.
- **Offline manual:** نسخه standalone در حالت offline باز و بررسی شده.
## معیار گزارش
تست مرتبط، نتیجه، خطاهای باقی‌مانده و verification pending گزارش شوند؛ عدم اجرا موفقیت محسوب نمی‌شود.
