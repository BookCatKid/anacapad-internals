#!/usr/bin/env python3
"""Tests for the documentation workflow tools (stdlib unittest).

Run:  python3 -m unittest discover -s tests -v   (from anacapad-soap/)
or:   python3 tests/test_tools.py
"""
import copy
import json
import os
import shutil
import sys
import tempfile
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))

import doclib
import import_extract
import validate
import lint
import coverage
import worksheet

FIXTURE = os.path.join(ROOT, "tests", "fixture_api.json")


def fully_documented_arg(direction="in"):
    return {
        "description": "Free-form user label stored with the object.",
        "status": "confirmed",
        "direction": direction,
        "primitive": {"type_tag": 7, "parse_helper": "0x9000"},
        "semantic_type": "string",
        "format": "any",
        "unit": "none",
        "accepted_values": "unconstrained",
        "range": "unbounded",
        "special_values": "none",
        "required": True,
        "default": "none",
        "validation": "none",
        "evidence": [doclib.ev(address="0x8010", notes="arg site")],
        "notes": None,
    }


class TextQualityTests(unittest.TestCase):
    def test_rejects_placeholders(self):
        for bad in ("TODO", "unknown", "TBD", "none", "?", "Plays.",
                    "Seek"):
            ok, _ = doclib.is_meaningful(bad, "X")
            self.assertFalse(ok, bad)

    def test_rejects_name_echo(self):
        cases = [("Seek action.", "Seek"), ("The volume.", "Volume"),
                 ("does Seek", "Seek"), ("InstanceID input", "InstanceID"),
                 ("Play", "Play"), ("Volume", "Volume"),
                 ("GetMute request parameter", "GetMute")]
        for text, ident in cases:
            ok, why = doclib.is_meaningful(text, ident)
            self.assertFalse(ok, "%s (%s) should fail: %s" % (text, ident, why))

    def test_accepts_real_descriptions(self):
        cases = [("Changes the playback position of the current transport.",
                  "Seek"),
                 ("Selects how Target is interpreted, such as track number "
                  "or playback time.", "Unit"),
                 ("Identifies the transport instance; normal playback uses "
                  "instance 0.", "InstanceID")]
        for text, ident in cases:
            ok, why = doclib.is_meaningful(text, ident)
            self.assertTrue(ok, "%s should pass: %s" % (text, why))


class ImportTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.doc_path = os.path.join(self.tmp, "documentation.json")
        self.doc, _, _ = import_extract.run_import(FIXTURE, self.doc_path,
                                                 "TEST-1")

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def test_skeleton_created(self):
        self.assertIn("/Test/Control", self.doc["services"])
        svc = self.doc["services"]["/Test/Control"]
        self.assertIn("DoThing", svc["actions"])
        self.assertIn("HiddenOne", svc["actions"])
        act = svc["actions"]["DoThing"]
        self.assertEqual(act["handler"], "0x8000")
        self.assertEqual(set(act["inputs"]), {"Mode", "Target"})
        self.assertEqual(set(act["outputs"]), {"Result"})
        # two fault sites -> two error skeleton entries
        self.assertEqual(len(act["fault_sites"]), 2)
        self.assertEqual(len(act["errors"]), 2)
        codes = [e["code"] for e in act["errors"]]
        self.assertIn(718, codes)
        # computed code keeps provenance
        e = [e for e in act["errors"] if e["code"] is None][0]
        self.assertEqual(e["code_expr"], "vret(r5,+0x34)")
        self.assertIn("vret(r5,+0x34)", e["unresolved"]["proven"])

    def test_dispatcher_faults_imported(self):
        svc = self.doc["services"]["/Test/Control"]
        sites = [s for e in svc["errors"] for s in e["fault_sites"]]
        self.assertIn("0x6010", sites)

    def test_internal_helpers_seeded(self):
        fns = self.doc["internal_functions"]
        self.assertIn("0x9000", fns)
        self.assertIn("0x9010", fns)
        self.assertTrue(fns["0x9000"]["required_for_behavior"])

    def test_no_overwrite_human(self):
        # human edits the doc, re-import must preserve it
        self.doc["services"]["/Test/Control"]["actions"]["DoThing"][
            "description"] = "Does the thing described on the tin."
        self.doc["services"]["/Test/Control"]["actions"]["DoThing"][
            "status"] = "confirmed"
        doclib.save_json(self.doc_path, self.doc)
        doc2, _, _ = import_extract.run_import(FIXTURE, self.doc_path,
                                               "TEST-1")
        act = doc2["services"]["/Test/Control"]["actions"]["DoThing"]
        self.assertEqual(act["description"],
                         "Does the thing described on the tin.")
        self.assertEqual(act["status"], "confirmed")

    def test_machine_fields_refreshed(self):
        # change extractor output -> structural fields update
        api = doclib.load_json(FIXTURE)
        api["services"][0]["actions"][0]["handler"] = "0x9999"
        api_path = os.path.join(self.tmp, "api2.json")
        doclib.save_json(api_path, api)
        doc2, _, _ = import_extract.run_import(api_path, self.doc_path,
                                               "TEST-1")
        act = doc2["services"]["/Test/Control"]["actions"]["DoThing"]
        self.assertEqual(act["handler"], "0x9999")

    def test_import_idempotent(self):
        doclib.save_json(self.doc_path, self.doc)
        before = doclib.load_json(self.doc_path)
        import_extract.run_import(FIXTURE, self.doc_path, "TEST-1")
        after = doclib.load_json(self.doc_path)
        self.assertEqual(before, after)


class ValidateTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.doc_path = os.path.join(self.tmp, "documentation.json")
        self.doc, _, _ = import_extract.run_import(FIXTURE, self.doc_path,
                                                 "TEST-1")

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def test_skeleton_has_no_structural_errors(self):
        self.assertEqual(validate.structural_errors(self.doc), [])

    def test_skeleton_is_incomplete(self):
        report = validate.semantic_report(self.doc)
        self.assertTrue(len(report) > 0)

    def test_fully_documented_action_passes(self):
        act = self.doc["services"]["/Test/Control"]["actions"]["DoThing"]
        act.update({
            "description": "Applies a mode change to the test object and "
                           "returns a status string.",
            "status": "confirmed",
            "visibility": "advertised",
            "requirements": "none",
            "state_dependencies": "none",
            "side_effects": "none",
            "events_triggered": "none",
            "state_transitions": "none",
            "return_behavior": "returns Result string",
            "validation": "none",
            "inputs": {n: fully_documented_arg("in")
                       for n in ("Mode", "Target")},
            "outputs": {"Result": fully_documented_arg("out")},
        })
        # keep fault coverage: complete the two entries
        for e in act["errors"]:
            if e["code"] == 718:
                e.update({
                    "status": "confirmed",
                    "meaning": "Request rejected because the object state "
                               "does not permit the change.",
                    "conditions": [{
                        "description": "Raised when the impl call returns "
                                       "a nonzero status.",
                        "evidence": [doclib.ev(address="0x8030")]}],
                })
            else:
                e["unresolved"]["unknown"] = (
                    "Which impl return codes map here is not yet traced; "
                    "resume from vfunc slot +0x34 on *(r3-in+0x4).")
        iss = doclib.action_issues("DoThing", act)
        self.assertEqual(iss, [])

    def test_unresolved_error_needs_unknown(self):
        act = self.doc["services"]["/Test/Control"]["actions"]["DoThing"]
        e = act["errors"][0]
        self.assertFalse(doclib._err_entry_complete(e))
        e["unresolved"]["unknown"] = "what remains unanswered"
        self.assertTrue(doclib._err_entry_complete(e))

    def test_empty_list_is_not_assessed(self):
        self.assertFalse(doclib.assessed([]))
        self.assertFalse(doclib.assessed(None))
        self.assertFalse(doclib.assessed(""))
        self.assertTrue(doclib.assessed("none"))
        self.assertTrue(doclib.assessed([{"description": "x"}]))


class LintTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.doc_path = os.path.join(self.tmp, "documentation.json")
        self.api = doclib.load_json(FIXTURE)
        self.doc, _, _ = import_extract.run_import(FIXTURE, self.doc_path,
                                                   "TEST-1")

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def test_clean_import_flags_visibility_and_weak(self):
        ws = lint.lint(self.doc, self.api)
        self.assertTrue(any("visibility" in w for w in ws))
        self.assertFalse(any("ORPHAN" in w for w in ws))

    def test_flags_name_echo(self):
        act = self.doc["services"]["/Test/Control"]["actions"]["DoThing"]
        act["description"] = "DoThing action."
        ws = lint.lint(self.doc, self.api)
        self.assertTrue(any("echoes identifier" in w for w in ws))

    def test_flags_confirmed_without_evidence(self):
        self.doc["capabilities"]["0xcdc"]["status"] = "confirmed"
        self.doc["capabilities"]["0xcdc"]["evidence"] = []
        self.doc["capabilities"]["0xcdc"]["description"] = (
            "Bitmask gating which SOAP services respond to requests.")
        self.doc["capabilities"]["0xcdc"]["effect"] = (
            "Clears matching service cap_flags at request routing time.")
        ws = lint.lint(self.doc, self.api)
        self.assertTrue(any("no evidence" in w for w in ws))

    def test_flags_stale_and_orphan(self):
        # doc action not in extractor -> stale
        self.doc["services"]["/Test/Control"]["actions"]["Ghost"] = \
            copy.deepcopy(self.doc["services"]["/Test/Control"]["actions"]
                          ["DoThing"])
        ws = lint.lint(self.doc, self.api)
        self.assertTrue(any("STALE" in w and "Ghost" in w for w in ws))
        # extractor action missing from docs -> orphan
        del self.doc["services"]["/Test/Control"]["actions"]["HiddenOne"]
        ws = lint.lint(self.doc, self.api)
        self.assertTrue(any("ORPHAN" in w and "HiddenOne" in w for w in ws))

    def test_flags_duplicate_error_codes(self):
        act = self.doc["services"]["/Test/Control"]["actions"]["DoThing"]
        dup = copy.deepcopy(act["errors"][0])
        dup["fault_sites"] = ["0xdead"]
        act["errors"].append(dup)
        ws = lint.lint(self.doc, self.api)
        self.assertTrue(any("duplicate error code" in w for w in ws))

    def test_flags_hidden_without_reachability(self):
        act = self.doc["services"]["/Test/Control"]["actions"]["DoThing"]
        act["visibility"] = "hidden"
        ws = lint.lint(self.doc, self.api)
        self.assertTrue(any("hidden action without reachability" in w
                            for w in ws))


class CoverageTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.doc_path = os.path.join(self.tmp, "documentation.json")
        self.api = doclib.load_json(FIXTURE)
        self.doc, _, _ = import_extract.run_import(FIXTURE, self.doc_path,
                                                   "TEST-1")

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def test_counts(self):
        text, done, units = coverage.report(self.api, self.doc)
        # fixture: 2 services, 2 actions, 2 inputs, 1 output,
        # 2 action faults + 2 dispatcher faults = 4 fault paths,
        # 1 capability, 1 dispatch candidate, 2 required helpers
        self.assertEqual(done, 0)
        self.assertEqual(units, 2 + 2 + 2 + 1 + 4 + 1 + 1 + 2)
        self.assertIn("2 discovered", text)
        self.assertIn("0 / 2 semantically complete", text)


class WorksheetTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.doc_path = os.path.join(self.tmp, "documentation.json")
        self.api = doclib.load_json(FIXTURE)
        self.doc, _, _ = import_extract.run_import(FIXTURE, self.doc_path,
                                                   "TEST-1")

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def test_worksheet_content(self):
        svc = worksheet.find_service(self.api, "TestSvc")
        act = worksheet.find_action(svc, "DoThing")
        text = worksheet.worksheet(self.api, self.doc, svc, act)
        self.assertIn("Service: TestSvc", text)
        self.assertIn("0x8000", text)          # handler
        self.assertIn("Mode", text)
        self.assertIn("0x8010", text)          # arg site
        self.assertIn("0x9000", text)          # parse helper
        self.assertIn("vret(r5,+0x34)", text)  # fault provenance
        self.assertIn("STILL UNDOCUMENTED", text)
        self.assertIn("action description", text)

    def test_ambiguous_action_rejected(self):
        svc = worksheet.find_service(self.api, "TestSvc")
        self.assertIsNone(worksheet.find_action(svc, "D"))


if __name__ == "__main__":
    unittest.main()
