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

    def test_messages_are_ordered_and_reconstruct_exact_source(self):
        source = b"<!doctype html>" + b"a" * (MODULE.PART_SIZE + 10)
        messages = MODULE.build_messages(source, "sender@example.com",
                                         "receiver@example.com")
        self.assertEqual(len(messages), 2)
        self.assertIn("Part 001 of 002", messages[0]["Subject"])
        self.assertIn("Part 002 of 002", messages[1]["Subject"])
        attachments = [list(m.iter_attachments())[0] for m in messages]
        self.assertEqual(b"".join(a.get_content() for a in attachments), source)
        self.assertIn(hashlib.sha256(source).hexdigest(),
                      messages[0].get_content())


if __name__ == "__main__":
    unittest.main()
