"""Argument findings must survive Markdown generation."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

import gendocs
import genmodel


class ArgumentFindingsTests(unittest.TestCase):
    def test_findings_render_for_inputs_and_outputs(self):
        for direction in ("inputs", "outputs"):
            with self.subTest(direction=direction):
                action = genmodel.Action.from_raw("Test", "/Test/Control", "Act", {
                    direction: {"Position": {
                        "description": "Insertion position.",
                        "resolved_findings": ["Value < 2 at 0x1234.",
                                              "Zero means append."],
                    }},
                })
                rendered = gendocs.render_action(action)
                self.assertIn("  - **resolved findings:**", rendered)
                self.assertIn("    - Value < 2 at 0x1234.", rendered)
                self.assertIn("    - Zero means append.", rendered)

    def test_absent_or_empty_findings_add_no_details(self):
        for raw in ({}, {"resolved_findings": []},
                    {"resolved_findings": None}):
            with self.subTest(raw=raw):
                out = []
                gendocs._arg_details(out, {
                    "Position": genmodel.Argument.from_raw("Position", raw)})
                self.assertEqual(out, [])
