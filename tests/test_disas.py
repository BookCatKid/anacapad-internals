"""Instruction-word regressions for the linear RE disassembler."""
import unittest
import io
from contextlib import redirect_stdout
from types import SimpleNamespace
from unittest.mock import patch

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


class GuardDecodeTests(unittest.TestCase):
    def test_unsigned_compare_immediate_and_condition_register(self):
        instruction = disas.decode_for_listing(0x2B9FDBFF, 0x10447690)
        self.assertEqual(instruction, ("cmplwi", 7, 31, 0xDBFF))
        self.assertEqual(disas.fmt_ins(0x10447690, instruction),
                         "cmplwi cr7, r31, 0xdbff")

    def test_signed_compare_keeps_negative_immediate(self):
        self.assertEqual(disas.decode_for_listing(0x2F83FFFF, 0),
                         ("cmpwi", 7, 3, -1))

    def test_zero_shift_mask_keeps_its_actual_bounds(self):
        self.assertEqual(disas.decode_for_listing(0x5529063E, 0),
                         ("rlwinm", 9, 9, 0, 24, 31))
        self.assertEqual(disas.decode_for_listing(0x57FF07FE, 0),
                         ("rlwinm", 31, 31, 0, 31, 31))

    def test_record_form_move_is_visible(self):
        self.assertEqual(disas.decode_for_listing(0x7C7D1B79, 0),
                         ("mr.", 29, 3))

    def test_conditional_return_does_not_end_a_listing(self):
        # The real manifest wrapper uses this conditional bclr at 0x10002214.
        words = {0x10002214: 0x4D820020,
                 0x10002218: 0x38600001,
                 0x1000221C: 0x4E800020}
        output = io.StringIO()
        with patch.object(disas, "_elf", SimpleNamespace(u32=words.get)):
            with redirect_stdout(output):
                disas.disas(0x10002214)
        self.assertIn("bclr bo=12,bi=2", output.getvalue())
        self.assertIn("10002218", output.getvalue())
        self.assertIn("1000221c", output.getvalue())

    def test_spe_pair_transfer_preserves_stack_copy_operands(self):
        self.assertEqual(disas.decode_for_listing(0x11484B00, 0x105E7768),
                         ("evlddx", 10, 8, 9))
        self.assertEqual(disas.decode_for_listing(0x11484B20, 0x105E7778),
                         ("evstddx", 10, 8, 9))


if __name__ == "__main__":
    unittest.main()
