#!/usr/bin/env python3
"""Send the complete standalone AlfaCode HTML source in one plain-text email."""

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

    if not source:
        print("Offline HTML is empty; no email was sent.", file=sys.stderr)
        return 1

    message = MIMEText(source, _subtype="plain", _charset="utf-8")
    message["Subject"] = SUBJECT
    message["From"] = username
    message["To"] = RECIPIENT

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as smtp:
            smtp.ehlo()
            smtp.starttls(context=context)
            smtp.ehlo()
            smtp.login(username, app_password)
            smtp.send_message(message)
    except (OSError, smtplib.SMTPException) as error:
        print(f"Email delivery failed: {error}", file=sys.stderr)
        return 1

    print(f"Email delivery completed: one email sent to {RECIPIENT}.")
    print(f"Complete HTML source sent in one message body: {len(raw_source)} bytes.")
    print("No attachments were created or sent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
