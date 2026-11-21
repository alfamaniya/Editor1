<!-- #VISUAL-EDITOR.md: راهنمای کاربرد و معماری ابزار Visual Editor -->
# Visual Editor
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
## وضعیت
Shared control factory و draft lifecycle پایه ثبت شده؛ تکمیل دسته‌ها، readback/validation، merge edge cases، تست و verification در roadmap پیگیری می‌شود.
- [Visual Editor completion roadmap](VISUAL-EDITOR-ROADMAP.md)
- [Properties checklist](VISUAL-PROPERTIES-ROADMAP.md)
