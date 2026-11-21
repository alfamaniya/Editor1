<!-- #ALFACODE.md: معماری و محدوده موتور AlfaCode editor در پروژه Editor1 -->
# AlfaCode — موتور ویرایش کد
## محدوده
کد موتور در `alfacode/src/`، داده‌های پیشنهاد در `alfacode/data/` و تست‌ها در `alfacode/tests/` نگهداری می‌شوند. تغییر سورس موتور فقط با درخواست صریح کاربر انجام می‌شود.
## لایه‌ها
### Core
- `core/document.js`: مدل سند و عملیات متن.
- `core/editor-state.js`: state جاری Editor.
- `core/editor.js`: API و هماهنگی اصلی Editor.
- `core/history.js`: undo/redo و history.
- `core/selection.js`: selection و cursor range.
- `core/transaction.js`: تغییر متن به صورت transaction.
### Features
- Bracket Matching: جفت‌یابی bracketها.
- Line Numbers: شماره خطوط و خط فعال.
- Syntax Highlighting: رنگ‌آمیزی بر پایه tokenها.
### Input
Clipboard handler، input controller، keyboard handler و suggestion dispatcher.### Language pipeline
Tokenizer، Language Manager و Parser Manager؛ برای HTML/CSS/JavaScript adapters، parsers، rules و completionهای مرتبط.### Rendering
Editor View، Line Renderer و Cursor Renderer.### Themes and utilities
Theme Manager و dark/light CSS؛ utilityها در حال حاضر placeholderهای خالی گزارش شده‌اند.
## Completion data
`alfacode/data/completions.html.json`، `completions.css.json` و `completions.javascript.json` داده‌های پیشنهادها را نگهداری می‌کنند. ساختار و runtime آن‌ها باید با تست‌ها بررسی شوند.
## Tests
تست‌ها در `alfacode/tests/` قرار دارند.
## اسناد مرتبط
[Modules](MODULES.md) · [Testing](TESTING.md) · [Roadmap](ROADMAP.md)
