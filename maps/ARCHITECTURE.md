<!-- #ARCHITECTURE.md: نمای معماری سطح بالای Editor1 و ارتباط بخش‌های پروژه -->
# معماری کلی Editor1

## هدف
این سند معماری را در سطح بخش‌ها توضیح می‌دهد؛ جزئیات صفحات، موتور AlfaCode، ذخیره‌سازی و Offline در اسناد جداگانه هستند.

## بخش‌های اصلی
- **Shell / Workspace:** `index.html` و `style.css`؛ چارچوب کلی برنامه و پنل‌های Editor و Preview.
- **Core UI modules:** `core/` شامل اجزای فعال Editor، Preview، Catalog، پیشنهادها، ذخیره‌سازی، Visual Editor و bridge.
- **AlfaCode:** موتور Editor در `alfacode/src/`؛ طبق محدودیت پروژه فقط با اجازه صریح کاربر تغییر می‌کند.
- **Data:** `alfacode/data/` شامل داده‌های پیشنهاد HTML/CSS/JavaScript.
- **Offline distribution:** `scripts/`، `offline/` و manifest؛ ساخت نسخه مستقل و ممیزی خروجی.
- **Tests and CI:** تست‌ها در `alfacode/tests/` و workflowها در `.github/workflows/`.
- **Archive:** `backup/` برای نسخه‌های قدیمی/غیرفعال.

## ارتباط سطح بالا
1. Shell پنل‌های فعال را میزبانی می‌کند.
2. Editor کد سه زبان را مدیریت و پیام تغییرات را به bridge ارسال می‌کند.
3. Bridge sourceها را به Preview منتقل می‌کند.
4. Preview سند را در محیط جدا رندر می‌کند؛ Visual Editor از Preview برای انتخاب عناصر استفاده می‌کند.
5. ابزارهای Catalog، پیشنهادها و ذخیره‌سازی به Shell/Editor متصل می‌شوند.
6. Offline Builder اجزای manifest را بسته‌بندی و HTML مستقل تولید می‌کند؛ Audit خروجی را بررسی می‌کند.

## وضعیت و دقت
این نقشه نمای اولیه بر اساس فایل‌ها و README موجود است. جزئیات dependencyها، پیام‌ها و APIها باید هنگام بررسی سورس واقعی تأیید شوند؛ این سند dependency graph کامل نیست.

## اسناد مرتبط
- [صفحات](PAGES.md) · [موتورها](ENGINES.md) · [ماژول‌ها](MODULES.md) · [جریان داده](DATA-FLOW.md) · [AlfaCode](ALFACODE.md) · [Offline](OFFLINE.md)
