#!/usr/bin/env python3
"""
validate.py -- strict validation of documentation.json.

Two passes:

  structural  -- schema-shaped checks: enums, required fields, evidence
                 record validity, fault-site coverage accounting.
  semantic    -- completeness rules from doclib (is the documentation
                 actually meaningful and finished?).

Usage:
    python3 tools/validate.py [--docs documentation.json]
    python3 tools/validate.py --strict   # nonzero exit on any gap
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import doclib


def check_evidence_list(lst, where, errors):
    for e in lst or []:
        errors.extend(doclib.evidence_errors(e, where))


def structural_errors(doc):
    errors = []

    def err(msg):
        errors.append(msg)

    meta = doc.get("meta") or {}
    for k in ("binary", "build", "schema_version"):
        if k not in meta:
            err("meta.%s missing" % k)

    for path, svc in (doc.get("services") or {}).items():
        w = "service %s" % path
        if svc.get("name") is None:
            err("%s: missing name" % w)
        if svc.get("control_path") != path:
            err("%s: control_path mismatch %r" % (w, svc.get("control_path")))
        if svc.get("status") not in doclib.STATUSES:
            err("%s: bad status %r" % (w, svc.get("status")))
        if svc.get("visibility") not in doclib.VISIBILITIES:
            err("%s: bad visibility %r" % (w, svc.get("visibility")))
        check_evidence_list(svc.get("evidence"), w, errors)
        for e in svc.get("errors") or []:
            _check_error_entry(e, w, err, errors)
        for name, var in (svc.get("state_variables") or {}).items():
            wv = "%s state %s" % (w, name)
            if var.get("status") not in doclib.STATUSES:
                err("%s: bad status" % wv)
            check_evidence_list(var.get("evidence"), wv, errors)
        for name, act in (svc.get("actions") or {}).items():
            wa = "%s action %s" % (w, name)
            if act.get("status") not in doclib.STATUSES:
                err("%s: bad status %r" % (wa, act.get("status")))
            if act.get("visibility") not in doclib.VISIBILITIES:
                err("%s: bad visibility %r" % (wa, act.get("visibility")))
            if not isinstance(act.get("inputs"), dict):
                err("%s: inputs not an object" % wa)
            if not isinstance(act.get("outputs"), dict):
                err("%s: outputs not an object" % wa)
            for an, arg, direction in doclib.iter_args(act):
                wg = "%s %s-arg %s" % (wa, direction, an)
                if arg.get("direction") != direction:
                    err("%s: direction mismatch" % wg)
                if arg.get("status") not in doclib.STATUSES:
                    err("%s: bad status %r" % (wg, arg.get("status")))
                check_evidence_list(arg.get("evidence"), wg, errors)
            for e in act.get("errors") or []:
                _check_error_entry(e, wa, err, errors)
            check_evidence_list(act.get("evidence"), wa, errors)

    for off, cap in (doc.get("capabilities") or {}).items():
        w = "capability %s" % off
        if cap.get("status") not in doclib.STATUSES:
            err("%s: bad status" % w)
        check_evidence_list(cap.get("evidence"), w, errors)

    for addr, fn in (doc.get("internal_functions") or {}).items():
        w = "internal fn %s" % addr
        if fn.get("status") not in doclib.STATUSES:
            err("%s: bad status" % w)
        if not isinstance(fn.get("required_for_behavior"), bool):
            err("%s: required_for_behavior must be boolean" % w)
        check_evidence_list(fn.get("evidence"), w, errors)

    for func, cand in (doc.get("dispatch_candidates") or {}).items():
        w = "dispatch candidate %s" % func
        if cand.get("status") not in doclib.STATUSES:
            err("%s: bad status" % w)
        check_evidence_list(cand.get("evidence"), w, errors)

    for name, var in (doc.get("state_variables") or {}).items():
        w = "state variable %s" % name
        if var.get("status") not in doclib.STATUSES:
            err("%s: bad status" % w)
        check_evidence_list(var.get("evidence"), w, errors)

    for section in ("uri_formats", "payload_formats"):
        for name, spec in (doc.get(section) or {}).items():
            w = "%s %s" % (section, name)
            if spec.get("status") not in doclib.STATUSES:
                err("%s: bad status" % w)
            check_evidence_list(spec.get("evidence"), w, errors)
    return errors


def _check_error_entry(e, where, err, errors):
    we = "%s error code=%s" % (where, e.get("code"))
    if e.get("status") not in doclib.STATUSES:
        err("%s: bad status" % we)
    if not isinstance(e.get("fault_sites"), list):
        err("%s: fault_sites must be a list" % we)
    check_evidence_list(e.get("evidence"), we, errors)
    for c in e.get("conditions") or []:
        if not isinstance(c.get("description"), str):
            err("%s: condition missing description" % we)
        check_evidence_list(c.get("evidence"),
                            "%s condition" % we, errors)
    if e.get("status") == "unresolved":
        u = e.get("unresolved") or {}
        if not u.get("proven"):
            err("%s: unresolved entry missing 'proven'" % we)


def semantic_report(doc):
    """Return list of (object_label, [issues])."""
    report = []
    for path, svc in (doc.get("services") or {}).items():
        iss = doclib.service_issues(svc)
        if iss:
            report.append(("service %s" % path, iss))
        for name, var in (svc.get("state_variables") or {}).items():
            iss = doclib.statevar_issues(name, var)
            if iss:
                report.append(("state %s/%s" % (svc.get("name"), name), iss))
        for name, act in (svc.get("actions") or {}).items():
            iss = doclib.action_issues(name, act)
            if iss:
                report.append(("action %s.%s" % (svc.get("name"), name), iss))
    for off, cap in (doc.get("capabilities") or {}).items():
        iss = doclib.capability_issues(off, cap)
        if iss:
            report.append(("capability %s" % off, iss))
    for addr, fn in (doc.get("internal_functions") or {}).items():
        if not fn.get("required_for_behavior"):
            continue
        iss = doclib.internal_fn_issues(addr, fn)
        if iss:
            report.append(("internal fn %s" % addr, iss))
    for func, cand in (doc.get("dispatch_candidates") or {}).items():
        iss = doclib.candidate_issues(func, cand)
        if iss:
            report.append(("dispatch candidate %s" % func, iss))
    for name, var in (doc.get("state_variables") or {}).items():
        iss = doclib.statevar_issues(name, var)
        if iss:
            report.append(("state variable %s" % name, iss))
    return report


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--docs", default=doclib.DEFAULT_DOC)
    ap.add_argument("--strict", action="store_true",
                    help="exit nonzero if any semantic gap remains")
    ap.add_argument("--verbose", action="store_true",
                    help="print every issue, not just counts")
    args = ap.parse_args()
    if not os.path.exists(args.docs):
        sys.exit("no documentation at %s -- run import_extract.py first"
                 % args.docs)
    doc = doclib.load_json(args.docs)
    errors = structural_errors(doc)
    report = semantic_report(doc)
    n_issues = sum(len(i) for _, i in report)
    print("STRUCTURAL: %d error(s)" % len(errors))
    for e in errors:
        print("  ERROR %s" % e)
    print("SEMANTIC: %d incomplete object(s), %d open issue(s)"
          % (len(report), n_issues))
    if args.verbose:
        for label, issues in report:
            print("  %s" % label)
            for i in issues:
                print("    - %s" % i)
    if errors or (args.strict and n_issues):
        sys.exit(1)


if __name__ == "__main__":
    main()
