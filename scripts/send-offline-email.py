#!/usr/bin/env python3
"""Send the standalone AlfaCode HTML source in consecutive plain-text email bodies."""

from email.mime.text import MIMEText
from pathlib import Path
import os
import smtplib
import ssl
import sys

ROOT = Path(__file__).resolve().parents[1]
SOURCE_FILE = ROOT / "offline" / "AlfaCode-Offline.html"
RECIPIENT = "a.mamghanian@isaco.ir"
SUBJECT = "AlfaCode Offline"
MAX_CHUNK_BYTES = 40_000


def split_utf8(text: str, max_bytes: int) -> list[str]:
    chunks: list[str] = []
    current: list[str] = []
    current_bytes = 0

    for character in text:
        character_bytes = len(character.encode("utf-8"))
        if character_bytes > max_bytes:
            raise ValueError("A single character exceeds the configured email chunk size.")

        if current and current_bytes + character_bytes > max_bytes:
            chunks.append("".join(current))
            current = []
            current_bytes = 0

        current.append(character)
        current_bytes += character_bytes

    if current:
        chunks.append("".join(current))

    return chunks


def main() -> int:
    username = os.environ.get("GMAIL_USERNAME", "").strip()
    app_password = os.environ.get("GMAIL_APP_PASSWORD", "").replace(" ", "")

    if not username or not app_password:
        print("Missing required GitHub Actions secrets: GMAIL_USERNAME and/or GMAIL_APP_PASSWORD.", file=sys.stderr)
        return 1

    if not SOURCE_FILE.is_file():
        print(f"Offline HTML file not found: {SOURCE_FILE}", file=sys.stderr)
        return 1

    raw_source = SOURCE_FILE.read_bytes()
    try:
        source = raw_source.decode("utf-8")
    except UnicodeDecodeError as error:
        print(f"Offline HTML is not valid UTF-8: {error}", file=sys.stderr)
        return 1

    if not source.lstrip().lower().startswith("<!doctype html"):
        print("Offline HTML validation failed: the file does not begin with a DOCTYPE declaration.", file=sys.stderr)
        return 1

    chunks = split_utf8(source, MAX_CHUNK_BYTES)
    if not chunks:
        print("Offline HTML is empty; no email was sent.", file=sys.stderr)
        return 1

    context = ssl.create_default_context()
    sent_bytes = 0

    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as smtp:
            smtp.ehlo()
            smtp.starttls(context=context)
            smtp.ehlo()
            smtp.login(username, app_password)

            for chunk in chunks:
                message = MIMEText(chunk, _subtype="plain", _charset="utf-8")
                message["Subject"] = SUBJECT
                message["From"] = username
                message["To"] = RECIPIENT
                smtp.send_message(message)
                sent_bytes += len(chunk.encode("utf-8"))

    except (OSError, smtplib.SMTPException) as error:
        print(f"Email delivery failed: {error}", file=sys.stderr)
        return 1

    print(f"Email delivery completed: {len(chunks)} plain-text email(s) sent to {RECIPIENT}.")
    print(f"Source size: {len(raw_source)} bytes; source characters sent: {sent_bytes} bytes.")
    print("No attachments were created or sent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
