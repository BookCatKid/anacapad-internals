#!/usr/bin/env python3
"""Tests for the documentation workflow tools (stdlib unittest).

Run:  python3 -m unittest discover -s tests -v   (from anacapad-internals/)
or:   python3 tests/test_tools.py
"""
import copy
import json
import os
import re
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
import genmodel
import gendocs
import gensite

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


def _gen_action(name="DoThing", **over):
    a = {
        "description": "Does a documented thing.",
        "status": "strong",
        "visibility": "advertised",
        "reachability": "callable",
        "handler": "0x8000",
        "dispatch": {"kind": "direct", "entry_addr": "0x9000",
                     "voff": None},
        "inputs": {}, "outputs": {}, "errors": [], "fault_sites": [],
        "evidence": [doclib.ev(address="0x8000", notes="handler")],
        "notes": None,
    }
    a.update(over)
    return a


def _gen_service(path="/X/Control", name="SvcX", actions=None, **over):
    s = {
        "name": name, "control_path": path,
        "description": "Test service.",
        "status": "strong", "visibility": "advertised",
        "availability": {"notes": "always registered"},
        "actions": actions or {"DoThing": _gen_action()},
        "evidence": [doclib.ev(address="0x7000", notes="svc")],
    }
    s.update(over)
    return s


def _gen_doc(services, counts=None):
    doc = {"meta": {"binary": "anacapad", "build": "T-1",
                    "schema_version": 1},
           "services": services}
    if counts:
        doc["meta"]["counts"] = counts
    return doc


class GenModelTests(unittest.TestCase):
    def test_counts(self):
        doc = _gen_doc({
            "/A/Control": _gen_service("/A/Control", "SvcA",
                                       actions={"X": _gen_action("X")}),
            "/B/Control": _gen_service("/B/Control", "SvcB",
                                       visibility="internal",
                                       actions={
                                           "Y": _gen_action(
                                               "Y", visibility="internal",
                                               reachability="hidden-callable")}),
        })
        m = genmodel.normalize(doc)
        self.assertEqual(m.counts.canonical_action_records, 2)
        self.assertEqual(m.counts.implemented_actions, 2)
        self.assertEqual(m.counts.scpd_defined, 1)
        self.assertEqual(m.counts.internal_or_hidden_callable, 1)

    def test_count_contradiction_errors(self):
        doc = _gen_doc({"/A/Control": _gen_service()},
                       counts={"canonical_action_records": {"value": 99}})
        m = genmodel.normalize(doc)
        r = genmodel.qa(m)
        self.assertTrue(any("canonical_action_records" in e
                            for e in r.errors))

    def test_conflicting_duplicate_action(self):
        a1 = _gen_action("Get", handler="0x1000")
        a2 = _gen_action("Get", handler="0x2000")
        doc = _gen_doc({
            "/R/ConnectionManager/Control": _gen_service(
                "/R/ConnectionManager/Control", "ConnectionManager",
                actions={"Get": a1}),
            "/S/ConnectionManager/Control": _gen_service(
                "/S/ConnectionManager/Control", "ConnectionManager",
                actions={"Get": a2}),
        })
        m = genmodel.normalize(doc)
        self.assertNotEqual(m.services[0].slug, m.services[1].slug)
        r = genmodel.qa(m)
        self.assertTrue(any("conflicting definitions" in e
                            for e in r.errors))

    def test_stub_flag_and_render(self):
        stub = _gen_action("StartTransmission", status="confirmed",
                           dispatch={"kind": "strcmp_stub",
                                     "entry_addr": "0x1", "voff": 8})
        doc = _gen_doc({"/AudioIn/Control": _gen_service(
            "/AudioIn/Control", "AudioIn", visibility="hidden",
            actions={"StartTransmission": stub})})
        m = genmodel.normalize(doc)
        a = m.services[0].actions["StartTransmission"]
        self.assertTrue(a.is_stub)
        self.assertFalse(a.is_implemented)
        self.assertEqual(m.counts.removed_stale, 1)
        md = gendocs.render_service(m.services[0])
        self.assertIn("removed/stub", md)
        self.assertIn("strcmp_stub", md)

    def test_client_text_overlay(self):
        a = _gen_action(description="dispatch table entry")
        doc = _gen_doc({"/A/Control": _gen_service(
            "/A/Control", "A", description="svc impl detail",
            actions={"Play": a})})
        overlay = {"services": {"/A/Control": {
            "summary": "Friendly service blurb.",
            "actions": {"Play": "Friendly action blurb.",
                        "Ghost": "stale"}}}}
        m = genmodel.normalize(doc, overlay)
        s = m.services[0]
        self.assertEqual(s.summary, "Friendly service blurb.")
        self.assertEqual(s.actions["Play"].summary,
                         "Friendly action blurb.")
        md = gendocs.render_service(s)
        self.assertIn("Friendly action blurb.", md)
        self.assertIn("Technical details", md)
        self.assertIn("dispatch table entry", md)
        self.assertIn("::: details", md)
        r = genmodel.qa(m)
        self.assertTrue(any("/A/Control.Ghost" in e
                            for e in r.errors))

    def test_type_mismatch_warns(self):
        a = _gen_action(inputs={"ID": {
            "direction": "in", "status": "confirmed",
            "description": "numeric id",
            "primitive": {"type_tag": 4, "parse_helper": "0x1",
                          "buf_cap": 24},
            "format": "utf-8 text", "evidence": []}})
        m = genmodel.normalize(_gen_doc({"/A/Control":
                                         _gen_service(actions={"A": a})}))
        r = genmodel.qa(m)
        self.assertTrue(any("type_tag 4" in w for w in r.warnings))

    def test_bounded_unknown_survives(self):
        a = _gen_action(errors=[{
            "code": None, "code_expr": "vret(r5,+0x34)",
            "meaning": "computed rc passthrough",
            "status": "strong", "fault_sites": ["0x1234"],
            "conditions": [{"description": "impl rc forwarded",
                            "evidence": [doclib.ev(address="0x1234")]}],
            "evidence": [doclib.ev(address="0x1234")],
            "unresolved": {"proven": "rc is returned",
                           "unknown": "which rc each state produces"}}])
        m = genmodel.normalize(_gen_doc({"/A/Control":
                                         _gen_service(actions={"A": a})}))
        e = m.services[0].actions["A"].errors[0]
        self.assertTrue(e.is_bounded_unknown)
        self.assertEqual(e.unresolved["unknown"],
                         "which rc each state produces")
        md = gendocs.render_service(m.services[0])
        self.assertIn("Bounded unknown", md)

    def test_arg_prose_empty_model(self):
        # prose references InstanceID but the action declares no args
        # (and another action declares it, seeding the vocabulary)
        declares = _gen_action("Other", inputs={"InstanceID": {
            "direction": "in", "status": "confirmed",
            "description": "instance",
            "primitive": {"type_tag": 4, "parse_helper": "0x1",
                          "buf_cap": 24},
            "format": "decimal integer", "evidence": []}})
        empty = _gen_action("NoArgs",
                            description="Seeks to InstanceID position.",
                            args_verified_empty=None)
        m = genmodel.normalize(_gen_doc({"/A/Control": _gen_service(
            actions={"Other": declares, "NoArgs": empty})}))
        r = genmodel.qa(m)
        self.assertTrue(any("empty argument model" in e
                            for e in r.errors))

    def test_stale_unresolved_after_resolution(self):
        a = _gen_action(implementation={
            "engine_resolution": {"status": "resolved",
                                  "impl_func": "0x999"},
            "notes": "worker sibling unresolved"})
        m = genmodel.normalize(_gen_doc({"/A/Control":
                                         _gen_service(actions={"A": a})}))
        r = genmodel.qa(m)
        self.assertTrue(any("still says" in e for e in r.errors))


class GenSiteTests(unittest.TestCase):
    """gensite.py wraps `npm run docs:build`; the sidebar/config lives in
    reference/.vitepress/config.mts (TypeScript, evaluates at build time).
    These tests check the config contract rather than running the build."""

    CFG = os.path.join(os.path.dirname(os.path.dirname(
        os.path.abspath(__file__))), "reference", ".vitepress",
        "config.mts")

    def test_config_exists_and_discovers_services(self):
        src = open(self.CFG).read()
        self.assertIn("dirItems('soap', '/soap'", src)
        self.assertIn("readdirSync", src)
        self.assertIn("'soap/state-variables'", src)

    def test_config_sets_base_and_search(self):
        src = open(self.CFG).read()
        self.assertIn("'/anacapad-internals/'", src)
        self.assertIn("provider: 'local'", src)

    def test_config_disables_vue_hostile_markdown(self):
        src = open(self.CFG).read()
        for rule in ("html_inline", "html_block", "curly_attributes"):
            self.assertIn("'%s'" % rule, src)


class TodoPolicyTests(unittest.TestCase):
    """Completeness policy: a record is finished only when everything
    recoverable from the binaries for it is documented. Any record that
    still carries structured unknowns must carry an informative `todo`
    (established / still unknown / next step). No generated page may emit
    grading or coverage metadata. TODO presence is derived from the
    record's own content, never from the deprecated `status`/`confidence`
    bookkeeping fields."""

    DOCS = os.path.join(ROOT, "docs", "documentation.json")
    # evidence items, resolution verdicts and per-expression decode
    # metadata are domain facts, not record-level completeness signals
    SKIP_KEYS = {"evidence", "engine_resolution", "enabled",
                 "enabled_source"}
    UNKNOWN_KEYS = {"unresolved", "open_questions", "unknowns", "gaps"}
    BADGE = re.compile(
        r"`(confirmed|strong|partial|inferred|weak|vocab|absent|"
        r"documented|unresolved|resolved|todo)`")
    GENERIC_TODO = re.compile(
        r"^\s*(todo|tbd|tbc|fixme|investigate|research|unknown|"
        r"needs work|more research needed|details unknown)"
        r"[\s.]*$", re.I)

    @classmethod
    def setUpClass(cls):
        cls.doc = doclib.load_json(cls.DOCS)
        cls.tmp = tempfile.mkdtemp()
        m = genmodel.normalize(cls.doc)
        cls.written = gendocs.render_all(m, cls.tmp)
        cls.pages = {}
        for rel in cls.written:
            with open(os.path.join(cls.tmp, rel)) as fh:
                cls.pages[rel] = fh.read()
        cls.all_md = "\n".join(cls.pages.values())

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp)

    # -- helpers ----------------------------------------------------------
    def _incomplete(self, o, path="", _in_skipped=False):
        """Yield (path, signal) for records that still carry structured
        unknowns but no todo. Signals: a non-empty unresolved/
        open_questions/unknowns/gaps key, or an action implementation
        block whose impl_function is null without a resolved engine
        verdict (a resolved reject-all dispatcher is a documented
        limitation, not an unknown)."""
        if isinstance(o, dict):
            if not _in_skipped and not o.get("todo"):
                for k in self.UNKNOWN_KEYS:
                    if o.get(k):
                        yield path, "structured unknown: %s" % k
                        break
                else:
                    impl = o.get("implementation")
                    if isinstance(impl, dict) and "impl_function" in impl \
                            and not impl["impl_function"] \
                            and (impl.get("engine_resolution") or {}) \
                                    .get("status") != "resolved":
                        yield path, "impl_function untraced"
            for k, v in o.items():
                yield from self._incomplete(
                    v, "%s/%s" % (path, k),
                    _in_skipped or k in self.SKIP_KEYS)
        elif isinstance(o, list):
            for i, v in enumerate(o):
                yield from self._incomplete(
                    v, "%s[%d]" % (path, i), _in_skipped)

    def _todos(self, o, path=""):
        if isinstance(o, dict):
            if "todo" in o:
                yield path, o["todo"]
            for k, v in o.items():
                yield from self._todos(v, "%s/%s" % (path, k))
        elif isinstance(o, list):
            for i, v in enumerate(o):
                yield from self._todos(v, "%s[%d]" % (path, i))

    # -- data policy ------------------------------------------------------
    def test_every_record_with_structured_unknowns_has_todo(self):
        missing = list(self._incomplete(self.doc))
        self.assertEqual([], missing[:50])

    def test_no_bare_or_generic_todos(self):
        bad = []
        for path, todo in self._todos(self.doc):
            items = todo if isinstance(todo, list) else [todo]
            for t in items:
                if not isinstance(t, str) or len(t.strip()) < 20 \
                        or self.GENERIC_TODO.match(t):
                    bad.append((path, t))
        self.assertEqual([], bad[:50])

    # -- generated-output policy ------------------------------------------
    def test_no_status_columns_or_badge_lines(self):
        hits = [(p, l) for p, t in self.pages.items()
                for l in t.split("\n")
                if re.search(r"\|\s*Status\s*\|", l)
                or self.BADGE.search(l)]
        self.assertEqual([], hits[:30])

    def test_no_confidence_vocabulary_sections(self):
        for pat in ("Confidence vocabulary", "confidence vocabulary",
                    "coverage tier", "coverage summary",
                    "substantially decoded tier"):
            self.assertNotIn(pat, self.all_md)

    def test_no_coverage_percentages(self):
        hits = [l for t in self.pages.values() for l in t.split("\n")
                if re.search(r"\d+\s*%\s*(of|coverage|documented)", l,
                             re.I)
                or re.search(r"coverage[^\n]{0,40}\d+\s*%", l, re.I)]
        self.assertEqual([], hits[:30])

    def test_no_em_or_en_dashes(self):
        hits = [(p, l) for p, t in self.pages.items()
                for l in t.split("\n") if re.search("[\u2014\u2013]", l)]
        self.assertEqual([], hits[:30])

    def test_open_work_page_collects_todos(self):
        ow = self.pages.get("subsystems/open-work.md", "")
        self.assertIn("## Subsystems", ow)
        self.assertIn("## SOAP services", ow)
        self.assertIn("## State variables", ow)
        self.assertIn("## Internal functions", ow)
        self.assertIn("## Other records", ow)

    def test_no_placeholder_todo_rendered(self):
        hits = [l for t in self.pages.values() for l in t.split("\n")
                if re.search(r"TODO:?\s*:?\s*$", l.strip())
                and "open-work" not in l]
        self.assertEqual([], hits[:30])


if __name__ == "__main__":
    unittest.main()
