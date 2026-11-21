#!/usr/bin/env python3
# send-offline-email.py: تقسیم، اعتبارسنجی و ارسال فایل نسخه آفلاین از طریق ایمیل
"""Send the standalone AlfaCode HTML in one email with three ordered attachments."""
from email.message import EmailMessage
from pathlib import Path
import hashlib
import os
import smtplib
import ssl
import sys

ROOT = Path(__file__).resolve().parents[1]
SOURCE_FILE = ROOT / "offline" / "AlfaCode-Offline.html"
RECIPIENT = "a.mamghanian@isaco.ir"
SUBJECT = "AlfaCode Offline"
PART_SIZE = 750 * 1024  # 750 KiB per attachment; total remains Gmail-safe.


def split_bytes(data: bytes, part_size: int = PART_SIZE) -> list[bytes]:
    """Split raw bytes without changing or losing any source bytes."""
    if part_size <= 0:
        raise ValueError("part_size must be positive")
    return [data[i:i + part_size] for i in range(0, len(data), part_size)]


def build_message(data: bytes, username: str, recipient: str = RECIPIENT,
                 part_size: int = PART_SIZE) -> EmailMessage:
    parts = split_bytes(data, part_size)
    if len(parts) != 3:
        raise ValueError(f"Expected exactly 3 attachments, but the file produces {len(parts)} parts at {part_size} bytes each.")
    total = len(parts)
    whole_hash = hashlib.sha256(data).hexdigest()
    msg = EmailMessage()
    msg["Subject"] = SUBJECT
    msg["From"] = username
    msg["To"] = recipient
    msg.set_content(
        f"AlfaCode Offline source attached as {total} numbered binary files in this single email.\n"
        f"Original size: {len(data)} bytes\n"
        f"Whole-file SHA-256: {whole_hash}\n\n"
        "Save all numbered attachments and join the .bin files in ascending numeric order "
        "to reconstruct AlfaCode-Offline.html. Do not open individual parts as HTML."
    )
    for number, part in enumerate(parts, 1):
        filename = f"AlfaCode-Offline.part-{number:03d}-of-{total:03d}.bin"
        msg.add_attachment(part, maintype="application", subtype="octet-stream", filename=filename)
    return msg


def main() -> int:
    username = os.environ.get("GMAIL_USERNAME", "").strip()
    app_password = os.environ.get("GMAIL_APP_PASSWORD", "").replace(" ", "")
    if not username or not app_password:
        print("Missing required GitHub Actions secrets: GMAIL_USERNAME and/or GMAIL_APP_PASSWORD.", file=sys.stderr)
        return 1
    if not SOURCE_FILE.is_file():
        print(f"Offline HTML file not found: {SOURCE_FILE}", file=sys.stderr)
        return 1

    raw = SOURCE_FILE.read_bytes()
    try:
        source = raw.decode("utf-8")
    except UnicodeDecodeError as error:
        print(f"Offline HTML is not valid UTF-8: {error}", file=sys.stderr)
        return 1
    if not raw or not source.strip():
        print("Offline HTML validation failed: generated file is empty.", file=sys.stderr)
        return 1
    if not source.lstrip().lower().startswith("<!doctype html"):
        print("Offline HTML validation failed: missing leading DOCTYPE.", file=sys.stderr)
        return 1
    if "<html" not in source.lower() or "</html>" not in source.lower():
        print("Offline HTML validation failed: incomplete HTML root document.", file=sys.stderr)
        return 1

    try:
        message = build_message(raw, username)
    except ValueError as error:
        print(f"Attachment count validation failed: {error}", file=sys.stderr)
        return 1
    attachments = list(message.iter_attachments())
    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as smtp:
            smtp.ehlo()
            smtp.starttls(context=ssl.create_default_context())
            smtp.ehlo()
            smtp.login(username, app_password)
            smtp.send_message(message)
            print(f"Sent one email with {len(attachments)} attachments.")
    except (OSError, smtplib.SMTPException) as error:
        print(f"Email delivery failed: {error}", file=sys.stderr)
        return 1

    print(f"Email delivery completed: 1 email sent to {RECIPIENT}.")
    print(f"Original file: {len(raw)} bytes; {len(attachments)} attachments, each at most {PART_SIZE} bytes.")
    print(f"Whole-file SHA-256: {hashlib.sha256(raw).hexdigest()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
