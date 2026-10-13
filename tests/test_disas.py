"""Instruction-word regressions for the linear RE disassembler."""
import unittest

from tools import disas


class IndexedLoadDecodeTests(unittest.TestCase):
    def test_mdputil_jump_table_preserves_table_base(self):
        # mdputil:0x10000c38 loads a displacement and then adds r9 to it.
        instruction = disas.decode_for_listing(0x7D49502E, 0x10000C38)
        self.assertEqual(instruction, ("lwzx", 10, 9, 10))
        self.assertEqual(disas.fmt_ins(0x10000C38, instruction),
                         "lwzx r10, r9, r10")

    def test_update_form_is_distinct(self):
        instruction = disas.decode_for_listing(0x7D49506E, 0x10000C38)
        self.assertEqual(instruction, ("lwzux", 10, 9, 10))
        self.assertEqual(disas.fmt_ins(0x10000C38, instruction),
                         "lwzux r10, r9, r10")

    def test_other_loads_keep_shared_decode_behavior(self):
        self.assertEqual(disas.decode_for_listing(0x80640008, 0x10000C38),
                         ("lwz", 3, 4, 8))


if __name__ == "__main__":
    unittest.main()
