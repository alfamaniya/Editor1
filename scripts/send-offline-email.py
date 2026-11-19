#!/usr/bin/env python3
"""Send the standalone AlfaCode HTML as ordered, size-limited email attachments."""
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
PART_SIZE = 750 * 1024  # 750 KiB, below the requested 700–800 KiB range.


def split_bytes(data: bytes, part_size: int = PART_SIZE) -> list[bytes]:
    """Split raw bytes without changing or losing any source bytes."""
    if part_size <= 0:
        raise ValueError("part_size must be positive")
    return [data[i:i + part_size] for i in range(0, len(data), part_size)]


def build_messages(data: bytes, username: str, recipient: str = RECIPIENT,
                   part_size: int = PART_SIZE) -> list[EmailMessage]:
    parts = split_bytes(data, part_size)
    total = len(parts)
    whole_hash = hashlib.sha256(data).hexdigest()
    messages = []
    for number, part in enumerate(parts, 1):
        part_hash = hashlib.sha256(part).hexdigest()
        filename = f"AlfaCode-Offline.part-{number:03d}-of-{total:03d}.bin"
        msg = EmailMessage()
        msg["Subject"] = f"{SUBJECT} — Part {number:03d} of {total:03d}"
        msg["From"] = username
        msg["To"] = recipient
        msg.set_content(
            f"AlfaCode Offline source — part {number} of {total}.\n"
            f"Sequence: {number:03d}/{total:03d}\n"
            f"Original size: {len(data)} bytes\n"
            f"Whole-file SHA-256: {whole_hash}\n"
            f"This-part size: {len(part)} bytes\n"
            f"This-part SHA-256: {part_hash}\n\n"
            "Save every numbered attachment. Join the .bin files in ascending "
            "numeric order to reconstruct AlfaCode-Offline.html. Do not open "
            "individual parts as HTML."
        )
        msg.add_attachment(part, maintype="application", subtype="octet-stream",
                           filename=filename)
        messages.append(msg)
    return messages


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
    if not source.lstrip().lower().startswith("<!doctype html") or not raw:
        print("Offline HTML validation failed: empty file or missing DOCTYPE.", file=sys.stderr)
        return 1

    messages = build_messages(raw, username)
    sent = 0
    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as smtp:
            smtp.ehlo()
            smtp.starttls(context=ssl.create_default_context())
            smtp.ehlo()
            smtp.login(username, app_password)
            for number, message in enumerate(messages, 1):
                smtp.send_message(message)
                sent += 1
                print(f"Sent part {number}/{len(messages)}.")
    except (OSError, smtplib.SMTPException) as error:
        print(f"Email delivery failed after {sent}/{len(messages)} parts: {error}", file=sys.stderr)
        return 1

    print(f"Email delivery completed: {sent} ordered emails sent to {RECIPIENT}.")
    print(f"Original file: {len(raw)} bytes; each attachment is at most {PART_SIZE} bytes.")
    print(f"Whole-file SHA-256: {hashlib.sha256(raw).hexdigest()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
