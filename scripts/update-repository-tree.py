# update-repository-tree.py: تولید HTML ثابت درخت مخزن و نمایش شرح خط اول فایل‌ها
import html
import re
import subprocess
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "repository-tree" / "index.html"
START = "<!-- BEGIN GENERATED REPOSITORY TREE -->"
END = "<!-- END GENERATED REPOSITORY TREE -->"
OWNER, REPO, BRANCH = "alfamaniya", "Editor1", "main"
DESCRIPTION_PATTERN = re.compile(r"#\s*[^:]+:\s*(.*?)\s*(?:\*/|-->)?$")

def node():
    return {"folders": {}, "files": []}

def build(paths):
    root = node()
    for path in paths:
        parts = path.split("/")
        current = root
        for segment in parts[:-1]:
            current = current["folders"].setdefault(segment, node())
        current["files"].append({"name": parts[-1], "path": path})
    return root

def first_line_description(path):
    try:
        with (ROOT / path).open("r", encoding="utf-8", errors="replace") as source:
            line = source.readline(4096).strip()
            if line.startswith("#!"):
                line = source.readline(4096).strip()
    except (OSError, UnicodeError):
        return ""
    match = DESCRIPTION_PATTERN.search(line)
    return match.group(1).strip() if match else ""

def render(current, depth=0):
    rows = []
    for name in sorted(current["folders"], key=str.casefold):
        child = current["folders"][name]
        opened, marker = (" open", "▾") if depth == 0 else ("", "▸")
        rows.append(f'<li class="folder-node"><details{opened}><summary class="node-row"><span class="twisty" aria-hidden="true">{marker}</span><span class="folder-icon">📁</span><span class="folder-name">{html.escape(name)}</span></summary><ul>{render(child, depth + 1)}</ul></details></li>')
    for file in sorted(current["files"], key=lambda item: item["name"].casefold()):
        name, path = html.escape(file["name"]), html.escape(file["path"], quote=True)
        description = first_line_description(file["path"])
        description_html = f'<span class="file-description">{html.escape(description)}</span>' if description else ""
        encoded = "/".join(quote(part, safe="") for part in file["path"].split("/"))
        url = f"https://github.com/{OWNER}/{REPO}/blob/{BRANCH}/{encoded}"
        rows.append(f'<li class="file-node"><div class="node-row file-row"><span class="twisty"></span><span class="file-icon">📄</span><a class="file-name file-link" href="{url}" target="_blank" rel="noopener noreferrer" title="{path}">{name}</a>{description_html}</div></li>')
    return "\n".join(rows)

def main():
    raw = subprocess.check_output(["git", "ls-tree", "-r", "--name-only", "HEAD"], cwd=ROOT, text=True)
    tree = build([line for line in raw.splitlines() if line])
    block = (f'{START}\n<ul class="tree-list"><li class="folder-node"><details open><summary class="node-row">'
             f'<span class="twisty" aria-hidden="true">▾</span><span class="folder-icon">📁</span>'
             f'<span class="folder-name">{REPO}/</span></summary><ul>{render(tree)}</ul></details></li></ul>\n{END}')
    page = PAGE.read_text(encoding="utf-8")
    if START not in page or END not in page:
        raise SystemExit("Generated-tree markers missing in repository-tree/index.html")
    before, remaining = page.split(START, 1)
    _, after = remaining.split(END, 1)
    updated = before + block + after
    if updated != page:
        PAGE.write_text(updated, encoding="utf-8")
        print("Static repository tree updated with first-line file descriptions.")
    else:
        print("Static repository tree and descriptions are already current.")

if __name__ == "__main__":
    main()
