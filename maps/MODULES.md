<!-- #MODULES.md: فهرست ماژول‌ها و مسئولیت‌های اجزای مستقل پروژه -->
# ماژول‌ها و اجزای Editor1

## ماژول‌های فعال در `core/`
| مسیر/ماژول | مسئولیت کلی |
|---|---|
| `core/editor/` | UI و اتصال Editor به AlfaCode |
| `core/preview/` | محیط Preview و رندر live |
| `core/editor-bridge.js` | انتقال sourceها و relay فرمان‌های Workspace |
| `core/visual-editor/` | انتخاب عنصر و Inspector/CSS controls |
| `core/completion-catalog/` | نمایش، جستجو و مدیریت completion catalog |
| `core/css-suggestions/` | پیشنهادهای CSS |
| `core/javascript-suggestions/` | پیشنهادهای JavaScript |
| `core/tag-suggestions/` | پیشنهاد تگ‌های HTML |
| `core/new-page-action/` | اکشن ساخت صفحه |
| `core/browser-storage/` | UI ابزار ذخیره مرورگر |
| `core/extra-key-action/` | اتصال کلیدهای کمکی نمادها |
| `core/repository-tree-action/` | اکشن بازکردن صفحه درخت مخزن |
| `core/clear-editor-storage.js` | پاک‌سازی داده‌های Editor1 در مرورگر |

## AlfaCode
زیرساخت موتور در [ALFACODE.md](ALFACODE.md) و `alfacode/src/` ثبت شده است.
## Archive
- `backup/core-old/`: نسخه‌های پیشین اجزای فعال؛ تغییرات آرشیو فقط برای هدف مشخص.
## تکمیل جزئیات
برای هر ماژول مسیر فایل‌ها، ورودی/خروجی، event/message، dependencies، تست و وضعیت ثبت شود. فایل خالی/placeholder با ماژول تکمیل‌شده اشتباه نشود.
