"""Architecture definitions for PowerPC rotate and mask aliases."""
import unittest

import extract_soap_api as extractor
from tools import disas


def word(op, sh, mb, me, record=0):
    return op << 26 | 9 << 21 | 9 << 16 | sh << 11 | mb << 6 | me << 1 | record


class RotateMaskTests(unittest.TestCase):
    def test_aliases_and_record_forms(self):
        cases = [
            ((5, 0, 26), ("slwi", 9, 9, 5)),
            ((27, 5, 31), ("srwi", 9, 9, 5)),
            ((0, 27, 31), ("clrlwi", 9, 9, 27)),
            ((0, 0, 26), ("clrrwi", 9, 9, 5)),
            ((5, 0, 31), ("rotlwi", 9, 9, 5)),
            ((3, 0, 7), ("extlwi", 9, 9, 8, 3)),
            ((11, 24, 31), ("extrwi", 9, 9, 8, 3)),
            ((5, 7, 20), ("rlwinm", 9, 9, 5, 7, 20)),
            ((0, 0, 31), ("slwi", 9, 9, 0)),
        ]
        for fields, expected in cases:
            for record in (0, 1):
                with self.subTest(fields=fields, record=record):
                    wanted = (expected[0] + ("." if record else ""),) + expected[1:]
                    self.assertEqual(extractor.decode(word(21, *fields, record), 0),
                                     wanted)

    def test_reported_word(self):
        self.assertEqual(extractor.decode(0x552906FE, 0x10730274),
                         ("clrlwi", 9, 9, 27))
        self.assertEqual(disas.decode_for_listing(0x552906FE, 0x10730274),
                         ("rlwinm", 9, 9, 0, 27, 31))

    def test_insert_and_register_rotate_are_not_immediate_aliases(self):
        for op, name in ((20, "rlwimi"), (23, "rlwnm")):
            for record in (0, 1):
                with self.subTest(op=op, record=record):
                    expected = (name + ("." if record else ""), 9, 9, 5, 0, 26)
                    self.assertEqual(extractor.decode(word(op, 5, 0, 26, record), 0),
                                     expected)
                    self.assertEqual(disas.decode_for_listing(
                        word(op, 5, 0, 26, record), 0), expected)
                    text = disas.fmt_ins(0, expected)
                    self.assertTrue(text.startswith(expected[0] + " r9, r9,"))
