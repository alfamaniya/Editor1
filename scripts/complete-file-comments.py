# #complete-file-comments.py: تکمیل کامنت فارسی خط اول فایل‌های قابل کامنت‌گذاری مخزن
"""Add Persian first-line descriptions to commentable tracked files without overwriting existing ones."""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SKIP_EXTENSIONS = {".json", ".json5", ".jsonl"}
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
    "property-controls.js": "ساخت کنترل‌های تنظیم پراپرتی‌های بصری",
    "repository-tree.js": "کنترل باز و بسته‌کردن درخت ثابت مخزن",
    "repository-tree.css": "استایل نمایش ساختار درخت مخزن",
    "update-repository-tree.py": "تولید HTML ثابت درخت مخزن و درج توضیحات فایل‌ها",
    "complete-file-comments.py": "تکمیل کامنت فارسی خط اول فایل‌های قابل کامنت‌گذاری",
    "build-offline.mjs": "ساخت نسخه مستقل و آفلاین پروژه",
    "audit-offline-output.mjs": "ممیزی خروجی آفلاین و منابع وابسته",
    "send-offline-email.py": "تقسیم و ارسال فایل نسخه آفلاین از طریق ایمیل",
    "test_send_offline_email.py": "آزمون‌های ارسال و بازسازی بخش‌های فایل آفلاین",
    "ROADMAP.md": "ثبت نقشه راه، اولویت‌ها و وضعیت پیشرفت پروژه",
    "README.md": "مستندات اصلی و راهنمای پروژه",
    "package.json": "تعریف تنظیمات پروژه و فرمان‌های npm",
}

def comment_syntax(path):
    ext = path.suffix.lower()
    if ext in {".js", ".mjs", ".cjs"}:
        return "// #", ""
    if ext == ".css":
        return "/* #", " */"
    if ext in {".html", ".htm", ".md"}:
        return "<!-- #", " -->"
    if ext in {".py", ".yml", ".yaml", ".sh", ".toml", ".ini"}:
        return "# ", ""
    return None

def description_for(path):
    if path.name in DESCRIPTIONS:
        return DESCRIPTIONS[path.name]
    folder = path.parent.name.replace("-", " ").replace("_", " ")
    filename = path.stem.replace("-", " ").replace("_", " ")
    return f"فایل {filename} مربوط به بخش {folder} پروژه"

def already_described(line, path):
    return path.name in line and ":" in line and line.strip().startswith(("#", "//", "/*", "<!--"))

def main():
    tracked = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode("utf-8").split("\0")
    added = []
    for relative in tracked:
        if not relative:
            continue
        path = ROOT / relative
        if not path.is_file() or path.name == ".gitkeep" or relative.startswith(".github/workflows/") or path.suffix.lower() in SKIP_EXTENSIONS:
            continue
        syntax = comment_syntax(path)
        if syntax is None:
            continue
        try:
            source = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError):
            continue
        if not source:
            continue
        lines = source.splitlines()
        insertion = 1 if lines and lines[0].startswith("#!") else 0
        if insertion < len(lines) and already_described(lines[insertion], path):
            continue
        prefix, suffix = syntax
        comment = f"{prefix}{path.name}: {description_for(path)}{suffix}"
        if insertion:
            lines.insert(insertion, comment)
            updated = "\n".join(lines) + ("\n" if source.endswith("\n") else "")
        else:
            updated = comment + "\n" + source
        path.write_text(updated, encoding="utf-8")
        added.append(relative)
    print(f"Persian descriptions added: {len(added)}")
    for path in added:
        print(path)

if __name__ == "__main__":
    main()
