<!-- #DATA-FLOW.md: مسیر داده و پیام‌ها میان Editor1، Editor، Preview و ابزارها -->
# جریان داده و رویدادها
این سند مسیرها را در سطح معماری خلاصه می‌کند. نام پیام‌ها، payload و ترتیب دقیق باید از سورس استخراج و تأیید شوند.
## Editor به Preview
1. کاربر sourceهای HTML/CSS/JavaScript را ویرایش می‌کند.
2. Editor تغییر source را اعلام می‌کند.
3. `core/editor-bridge.js` پیام را دریافت و به Preview منتقل می‌کند.
4. Preview sourceها را اعمال و خروجی را رندر می‌کند.
5. Preview refresh/rebuild sourceهای جاری را دوباره اعمال می‌کند.
## Visual Editor
1. Visual mode فعال و Preview برای انتخاب آماده می‌شود.
2. عنصر انتخاب می‌شود و Inspector selector/identity را نشان می‌دهد.
3. کنترل‌ها draft را تغییر می‌دهند و Preview به‌روزرسانی زنده می‌شود.
4. Apply commit؛ Cancel لغو draft؛ Reset Category فقط دسته فعال را reset می‌کند.
5. CSS به Editor برگردانده/ادغام می‌شود؛ حفظ ruleهای نامرتبط و CSS دستی معیار مهم است.
## ذخیره‌سازی
- `core/browser-storage.js` API `window.Editor1Storage` را ارائه می‌کند.
- اتصال نهایی به Workspace و autosave نیازمند بررسی/تأیید است.
## Offline
- manifest منابع را تعریف می‌کند؛ Builder بسته standalone می‌سازد؛ Audit خروجی را بررسی می‌کند؛ workflow می‌تواند artifact را commit کند.
## تکمیل
پس از بررسی سورس هر مسیر، نام event/message، payload، مقصد، خطاها، تست و sequence diagram ثبت شود. این سند فعلاً قرارداد API دقیق نیست.
