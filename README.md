# Editor1

ویرایشگر وب HTML، CSS و JavaScript با پیش‌نمایش زنده و نسخه مستقل آفلاین.

## وضعیت
- کاتالوگ‌های JSON هر سه زبان به موتورهای پیشنهاد زنده متصل‌اند؛ Legacy در HTML تا تکمیل Regression به‌عنوان سازگاری حفظ شده است.
- CSS از JSON برای selector، property، value، at-rule، function و unit استفاده می‌کند؛ JavaScript از JSON برای identifier و owner-scoped member بهره می‌برد.
- JavaScript inference اکنون aliasهای ساده متغیر را دنبال می‌کند؛ inference زنجیره‌ای، بازگشت تابع، class/inheritance و module analysis همچنان توسعه‌نیافته‌اند.
- آزمون Shadow HTML برای ۳۲ Fixture اختلاف برچسب/ترتیب را صفر الزام می‌کند.
- GitHub Actions Run 44497589186: **۱۰۷ تست موفق، صفر شکست**؛ Shadow: ۳۲ Fixture، صفر اختلاف.
- Offline Build Run 44497589099 موفق است؛ آزمون واقعی مرورگر و قطع شبکه همچنان لازم است.
- پنل مدیریت کاتالوگ پیش‌نویس محلی و خروجی JSON می‌سازد؛ انتشار مستقیم GitHub فعال نیست.

## نقشه راه

تمام اولویت‌ها، کارهای انجام‌شده و باقی‌مانده فقط در [نقشه راه واحد پروژه](./maps/ROADMAP.md) نگهداری می‌شوند.
## ساختار
- `core/`: اجزای رابط
- `alfacode/`: موتور و کاتالوگ
- `scripts/`: ابزار ساخت
- `offline/`: خروجی

## اجرا
از ریشه مخزن اجرا کنید:
```bash
python -m http.server 8000
```
سپس `http://localhost:8000` را باز کنید. به‌دلیل JavaScript modules، اجرای مستقیم `file://` مناسب توسعه نیست.

## خروجی آفلاین
از `scripts/build-offline.mjs` و `scripts/offline-manifest.json` ساخته می‌شود. پس از تغییر سورس، build را مجدداً اجرا کنید؛ خروجی را دستی ویرایش نکنید.

## آزمون
نتایج CI و آزمون دستی جدا ثبت شوند؛ Build موفق جایگزین تست مرورگر نیست.