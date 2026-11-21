<!-- #VISUAL-EDITOR.md: راهنمای کاربرد و معماری ابزار Visual Editor -->
# Visual Editor
## Editor practice scaffold
- The Editor's initial HTML/CSS/JavaScript content is now a lightweight editable mock of the Visual Settings panel (Elements/Settings modes, property categories, value entry, Apply/Reset) to provide a starting point for panel work.
- This scaffold is a code-editing sample, not a replacement for the live Visual Editor implementation. The actual live panel remains in `core/visual-editor/visual-editor.js` and its CSS.
- Existing browser-saved sources are preserved; the old default HTML Showcase starter is replaced during load.


## هدف
ویرایش بصری CSS عناصر انتخاب‌شده در Preview.
## گردش کار
1. Visual Settings حالت Visual را فعال می‌کند.
2. Select Element انتخاب از Preview را آغاز می‌کند.
3. Hover tooltip هویت عنصر (ID/class یا tag) را نمایش می‌دهد.
4. انتخاب عنصر Inspector/Settings را باز می‌کند.
5. propertyها تنظیم می‌شوند؛ draft در Preview قابل مشاهده است.
6. Apply تثبیت؛ Cancel لغو draft؛ Reset Category فقط دسته فعال را reset می‌کند.
7. Exit Visual workspace عادی را بازمی‌گرداند.
## Workspace
- حالت تمام‌صفحه و پنل سمت راست با تب Elements/Settings.
- Preview فضای باقیمانده را می‌گیرد؛ پنل در نمایش باریک به bottom sheet responsive تبدیل می‌شود.
- بررسی دستی viewport، scroll، selection، keyboard، restore و offline جدا از تست خودکار ثبت می‌شود.
## دسته‌ها
Color، Background، Border، Outline، Size، Shadow، Spacing، Typography، Layout، Flexbox، Grid، Position، Effects، Transform، Transition، Animation، Content، Scroll، SVG، Responsive و Custom CSS.
## آیکون‌های محلی و آفلاین
- مجموعه SVG در `core/icons/icon-pack.js` نگهداری می‌شود؛ پنل آیکون‌ها را با `data-icon` و API پکیج تزریق می‌کند.
- آیکون‌ها به شکل SVG inline رندر می‌شوند؛ نیاز به CDN یا اتصال اینترنت ندارند.
- فایل پکیج در `core/preview/preview.html` بارگذاری شده و Builder آفلاین آن را از مسیر محلی جمع‌آوری می‌کند.
- API پکیج شامل `svg`، `mount`، `sprite` و `symbolUse` است. جاسازی خودکار آیکون‌های موردنیاز در HTML خروجی مستقل هنوز مرحله بعدی است.


## وضعیت
Shared control factory و draft lifecycle پایه ثبت شده؛ تکمیل دسته‌ها، readback/validation، merge edge cases، تست و verification در roadmap پیگیری می‌شود.
- [Visual Editor completion roadmap](VISUAL-EDITOR-ROADMAP.md)
- [Properties checklist](VISUAL-PROPERTIES-ROADMAP.md)
