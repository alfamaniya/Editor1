# #complete-file-comments.py: افزودن کامنت فارسی استاندارد به فایل‌های قابل کامنت‌گذاری مخزن
"""Add a Persian first-line file description comment to commentable tracked files."""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SKIP = {".json", ".json5", ".jsonl"}
DESCRIPTIONS = {
    "index.html": "ساخت رابط اصلی و نقطه ورود صفحه",
    "editor.js": "مدیریت رفتار و رویدادهای ویرایشگر",
    "editor.css": "تعریف ظاهر و چیدمان ویرایشگر",
    "preview.js": "مدیریت پیش‌نمایش و به‌روزرسانی محتوای آن",
    "preview.css": "استایل‌دهی پنل پیش‌نمایش",
    "preview.html": "ساختار پنل پیش‌نمایش",
    "header.js": "مدیریت رفتار و دکمه‌های سربرگ",
    "header.css": "استایل‌دهی سربرگ",
    "header.html": "ساختار HTML سربرگ",
    "visual-editor.js": "مدیریت انتخاب المان و تنظیمات بصری",
    "visual-editor.css": "استایل پنل و ابزارهای ویرایش بصری",
    "property-controls.js": "ساخت و مدیریت کنترل‌های تنظیم پراپرتی‌های بصری",
    "repository-tree.js": "کنترل باز و بسته‌کردن درخت ثابت مخزن",
    "repository-tree.css": "استایل نمایش ساختار درخت مخزن",
    "update-repository-tree.py": "تولید HTML ثابت درخت مخزن و درج توضیحات فایل‌ها",
    "complete-file-comments.py": "افزودن کامنت فارسی استاندارد به فایل‌های قابل کامنت‌گذاری مخزن",
    "build-offline.mjs": "ساخت نسخه مستقل و آفلاین پروژه",
    "audit-offline-output.mjs": "ممیزی خروجی آفلاین و منابع وابسته",
    "send-offline-email.py": "تقسیم و ارسال فایل نسخه آفلاین از طریق ایمیل",
    "test_send_offline_email.py": "آزمون‌های ارسال و بازسازی بخش‌های فایل آفلاین",
    "ROADMAP.md": "ثبت نقشه راه، اولویت‌ها و وضعیت پیشرفت پروژه",
    "README.md": "مستندات اصلی و راهنمای پروژه",
    "package.json": "تعریف تنظیمات پروژه و فرمان‌های npm",
}
def comment_prefix(path):
    ext = path.suffix.lower()
    if ext in {".js", ".mjs", ".cjs"}:
        return "// ", ""
    if ext == ".css":
        return "/* ", " */"
    if ext in {".html", ".htm", ".md"}:
        return "<!-- ", " -->"
    if ext in {".py", ".yml", ".yaml", ".sh", ".toml", ".ini"}:
        return "# ", ""
    return None

def description_for(path):
    if path.name in DESCRIPTIONS:
        return DESCRIPTIONS[path.name]
    folder = path.parent.name.replace("-", " ").replace("_", " ")
    filename = path.stem.replace("-", " ").replace("_", " ")
    return f"فایل {filename} مربوط به بخش {folder} پروژه"

def has_standard_comment(line, path):
    return path.name in line and ":" in line and line.strip().startswith(("#", "//", "/*", "<!--"))

def main():
    tracked = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode("utf-8").split("\\0")
    changed = []
    for raw in tracked:
        if not raw:
            continue
        path = ROOT / raw
        if not path.is_file() or path.name == ".gitkeep" or path.suffix.lower() in SKIP:
            continue
        syntax = comment_prefix(path)
        if syntax is None:
            continue
        try:
            content = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError):
            continue
        if not content or has_standard_comment(content.splitlines()[0], path):
            continue
        opening, closing = syntax
        comment = f"{opening}#{path.name}: {description_for(path)}{closing}"
        path.write_text(comment + "\\n" + content, encoding="utf-8")
        changed.append(raw)
    print(f"Persian file comments added: {len(changed)}")
    for item in changed:
        print(item)

if __name__ == "__main__":
    main()
