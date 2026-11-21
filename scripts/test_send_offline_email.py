# test_send_offline_email.py: آزمون‌های ارسال و بازسازی بخش‌های فایل آفلاین
import hashlib
import importlib.util
from pathlib import Path
import unittest

SCRIPT = Path(__file__).with_name("send-offline-email.py")
SPEC = importlib.util.spec_from_file_location("send_offline_email", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class OfflineEmailChunkTests(unittest.TestCase):
    def test_split_preserves_bytes_and_size_limit(self):
        source = bytes(range(256)) * 9000
        parts = MODULE.split_bytes(source, 700 * 1024)
        self.assertEqual(b"".join(parts), source)
        self.assertTrue(all(0 < len(part) <= 700 * 1024 for part in parts))

    def test_exact_multiple_has_no_empty_part(self):
        source = b"x" * (MODULE.PART_SIZE * 2)
        self.assertEqual([len(p) for p in MODULE.split_bytes(source)],
                         [MODULE.PART_SIZE, MODULE.PART_SIZE])

    def test_one_email_contains_three_ordered_attachments_and_reconstructs(self):
        source = b"<!doctype html>" + b"a" * (MODULE.PART_SIZE * 2 + 10)
        message = MODULE.build_message(source, "sender@example.com",
                                     "receiver@example.com")
        self.assertEqual(message["Subject"], "AlfaCode Offline")
        self.assertEqual(message["To"], "receiver@example.com")
        attachments = list(message.iter_attachments())
        self.assertEqual(len(attachments), 3)
        self.assertEqual(
            [a.get_filename() for a in attachments],
            [
                "AlfaCode-Offline.part-001-of-003.bin",
                "AlfaCode-Offline.part-002-of-003.bin",
                "AlfaCode-Offline.part-003-of-003.bin",
            ],
        )
        self.assertEqual(b"".join(a.get_content() for a in attachments), source)
        self.assertIn(
            hashlib.sha256(source).hexdigest(),
            message.get_body(preferencelist=("plain",)).get_content(),
        )

    def test_file_size_that_produces_more_or_fewer_parts_is_rejected(self):
        with self.assertRaises(ValueError):
            MODULE.build_message(b"small html", "sender@example.com")
        oversized = b"x" * (MODULE.PART_SIZE * 3 + 1)
        with self.assertRaises(ValueError):
            MODULE.build_message(oversized, "sender@example.com")


if __name__ == "__main__":
    unittest.main()
