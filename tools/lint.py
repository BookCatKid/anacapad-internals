#!/usr/bin/env python3
"""
lint.py -- documentation quality linter.

Catches weak documentation and cross-consistency problems that field-level
validation cannot see:

  - descriptions that merely echo the identifier ("Seek action", "The
    volume", "Plays.")
  - confirmed/strong claims without evidence records
  - extractor objects with no doc entry (orphans)
  - doc objects that no longer appear in extractor output (stale)
  - resolved error entries with no conditions or no provenance
  - hidden actions/services without reachability documentation
  - duplicate error codes covering the same action
  - fault sites claimed by more than one error entry

Usage:
    python3 tools/lint.py [--docs documentation.json] [--api extractor.json]
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import doclib


def _check_text(warnings, where, field, text, ident=None):
    if text is None:
        return
    ok, why = doclib.is_meaningful(text, ident)
    if not ok and text.strip().lower() not in doclib.SENTINELS:
        warnings.append("%s: weak %s (%s): %r" % (where, field, why, text))


def _check_claim_evidence(warnings, where, status, evidence):
    if status in ("confirmed", "strong") and not (evidence or []):
        warnings.append("%s: status '%s' with no evidence records"
                        % (where, status))


def _check_generic(warnings, where, field, text):
    """Generic wrapper-level prose never counts as semantics."""
    if doclib.is_generic_claim(text):
        warnings.append("%s: generic %s (not binary-verified semantics):"
                        " %.60r" % (where, field, text))


def _check_generic_fields(warnings, where, obj, fields):
    for f in fields:
        _check_generic(warnings, where, f, (obj or {}).get(f))


def _weakest_child(act):
    """Lowest confidence among an action's externally observable child
    units. A `confirmed` action requires every observable child to be
    confirmed and free of material unknowns."""
    obs = ("validation", "requirements", "state_dependencies",
           "events_triggered", "state_transitions", "return_behavior")
    rank = {"confirmed": 3, "strong": 2, "inferred": 1, "unresolved": 0}
    worst = 3
    def chk(s):
        nonlocal worst
        worst = min(worst, rank.get(s, 1))
    for f in obs:
        c = act.get(f)
        if isinstance(c, dict):
            chk(c.get("status"))
        elif isinstance(c, list):
            for e in c:
                if isinstance(e, dict):
                    chk(e.get("status"))
    for grp in ("inputs", "outputs"):
        for v in (act.get(grp) or {}).values():
            if isinstance(v, dict):
                chk(v.get("status"))
    for e in act.get("errors") or []:
        if isinstance(e, dict):
            chk(e.get("status"))
            if isinstance(e.get("unresolved"), dict) \
                    and e["unresolved"].get("unknown"):
                worst = min(worst, 2)
    imp = act.get("implementation")
    if isinstance(imp, dict) and "status" in imp:
        chk(imp["status"])
    se = act.get("side_effects")
    if isinstance(se, list):
        for e in se:
            if isinstance(e, dict):
                chk(e.get("status"))
    return worst


def lint(doc, api):
    warnings = []

    # ---- per-object text quality + claim evidence ----
    for path, svc in (doc.get("services") or {}).items():
        w = "service %s" % svc.get("name", path)
        _check_text(warnings, w, "description", svc.get("description"),
                    svc.get("name"))
        _check_claim_evidence(warnings, w, svc.get("status"),
                              svc.get("evidence"))
        _check_text(warnings, w, "availability notes",
                    (svc.get("availability") or {}).get("notes"))
        if svc.get("visibility") == "hidden" and not (svc.get("availability")
                                                    or {}).get("notes"):
            warnings.append("%s: hidden service lacks availability notes" % w)
        codes = {}
        for e in svc.get("errors") or []:
            if e.get("status") == "unresolved":
                continue
            if not e.get("conditions"):
                warnings.append("%s: error %s resolved but has no conditions"
                                % (w, e.get("code")))
            if not e.get("meaning"):
                warnings.append("%s: error %s resolved but no meaning"
                                % (w, e.get("code")))
            _check_text(warnings, w, "error meaning", e.get("meaning"))
            c = e.get("code")
            if c is not None:
                if c in codes:
                    warnings.append("%s: duplicate error code %s" % (w, c))
                codes[c] = True
        for name, act in (svc.get("actions") or {}).items():
            wa = "%s.%s" % (svc.get("name"), name)
            _check_text(warnings, wa, "description",
                        act.get("description"), name)
            _check_claim_evidence(warnings, wa, act.get("status"),
                                  act.get("evidence"))
            _check_generic_fields(warnings, wa, act,
                                  ("description", "requirements",
                                   "state_dependencies", "events_triggered",
                                   "state_transitions", "return_behavior",
                                   "validation"))
            if act.get("visibility") == "hidden":
                ok, why = doclib.is_meaningful(act.get("reachability"))
                if not ok:
                    warnings.append("%s: hidden action without reachability"
                                    " status" % wa)
            if act.get("visibility") == "internal" \
                    and not act.get("reachability"):
                warnings.append("%s: internal action without reachability"
                                % wa)
            if not act.get("reachability") \
                    and not (svc.get("dispatcher") or {}):
                warnings.append("%s: reachability not classified" % wa)
            if act.get("visibility") == "unknown":
                warnings.append("%s: visibility still 'unknown'" % wa)
            # status propagation: a confirmed action must not contain any
            # weaker or unresolved observable child
            if act.get("status") == "confirmed" \
                    and _weakest_child(act) < 3:
                warnings.append("%s: status 'confirmed' but an observable"
                                " child is weaker/unresolved" % wa)
            # stale scaffold: impl decoded but arg model still empty
            impl = act.get("implementation") or {}
            if (impl.get("impl_function") or impl.get("impl_vfunc")
                    or impl.get("impl_addr")) \
                    and not act.get("inputs") and not act.get("outputs") \
                    and not act.get("args_verified_empty"):
                warnings.append("%s: impl known but inputs/outputs empty"
                                " (stale scaffold)" % wa)
            seen_sites = {}
            codes = {}
            for e in act.get("errors") or []:
                c = e.get("code")
                if c is not None:
                    if c in codes:
                        warnings.append("%s: duplicate error code %s"
                                        % (wa, c))
                    codes[c] = True
                if e.get("status") != "unresolved":
                    if not e.get("conditions"):
                        warnings.append(
                            "%s: error %s resolved but has no conditions"
                            % (wa, c))
                    if not e.get("meaning"):
                        warnings.append(
                            "%s: error %s resolved but no meaning" % (wa, c))
                    _check_text(warnings, wa, "error meaning",
                                e.get("meaning"))
                    _check_generic(warnings, "%s error %s" % (wa, c),
                                   "meaning", e.get("meaning"))
                    for ci, cond in enumerate(e.get("conditions") or []):
                        _check_generic(warnings,
                                       "%s error %s condition[%d]"
                                       % (wa, c, ci), "description",
                                       cond.get("description"))
                _check_claim_evidence(warnings, "%s error %s" % (wa, c),
                                      e.get("status"), e.get("evidence"))
                for s in e.get("fault_sites") or []:
                    # a site may legitimately carry several distinct codes
                    # through one emitter; flag only ambiguous duplicate
                    # claims (same code twice, or an uncoded entry repeated)
                    if s in seen_sites and (e.get("code") is None
                                            or e.get("code") in seen_sites[s]):
                        warnings.append(
                            "%s: fault site %s claimed ambiguously by "
                            "multiple error entries" % (wa, s))
                    seen_sites.setdefault(s, set()).add(e.get("code"))
            for an, arg, direction in doclib.iter_args(act):
                wg = "%s %s-arg %s" % (wa, direction, an)
                _check_text(warnings, wg, "description",
                            arg.get("description"), an)
                _check_claim_evidence(warnings, wg, arg.get("status"),
                                      arg.get("evidence"))
                _check_generic_fields(warnings, wg, arg,
                                      ("description", "accepted_values",
                                       "range", "special_values",
                                       "default", "validation"))
            in_names = set(act.get("inputs") or {})
            for an in act.get("outputs") or {}:
                if an in in_names:
                    warnings.append(
                        "%s: %s appears as both input and output" % (wa, an))
            se = act.get("side_effects")
            if isinstance(se, list):
                for i, s in enumerate(se):
                    sd = s.get("description") if isinstance(s, dict) else s
                    _check_text(warnings, "%s side_effect[%d]" % (wa, i),
                                "description", sd)
                    _check_generic(warnings, "%s side_effect[%d]" % (wa, i),
                                   "description", sd)
        # service status must not exceed its weakest action
        if svc.get("status") == "confirmed" and any(
                a.get("status") != "confirmed"
                for a in (svc.get("actions") or {}).values()):
            warnings.append("%s: status 'confirmed' but contains "
                            "non-confirmed actions" % w)
        # empty state/event models are coverage gaps, not completeness
        if not svc.get("state_variables") and not svc.get("events"):
            warnings.append("%s: no state-variable/event model documented"
                            % w)

    # ---- capabilities / internal fns / candidates ----
    for off, cap in (doc.get("capabilities") or {}).items():
        w = "capability %s" % off
        _check_text(warnings, w, "description", cap.get("description"), off)
        _check_text(warnings, w, "effect", cap.get("effect"))
        _check_claim_evidence(warnings, w, cap.get("status"),
                              cap.get("evidence"))
    for addr, fn in (doc.get("internal_functions") or {}).items():
        w = "internal fn %s" % addr
        _check_text(warnings, w, "description", fn.get("description"))
        _check_text(warnings, w, "why_external", fn.get("why_external"))
        _check_claim_evidence(warnings, w, fn.get("status"),
                              fn.get("evidence"))
        if fn.get("required_for_behavior") and not fn.get("why_external"):
            warnings.append("%s: required_for_behavior but why_external empty"
                            % w)
    # dispatch candidates resolved to a registered service must not stay
    # orphaned: any candidate with a vptr/install evidence or a reject-all
    # classification that lacks a 'service' link is a consistency bug
    for func, cand in (doc.get("dispatch_candidates") or {}).items():
        w = "dispatch candidate %s" % func
        _check_text(warnings, w, "assessment", cand.get("assessment"), func)
        linked = cand.get("service")
        if linked:
            lsvc = (doc.get("services") or {}).get(linked)
            if not lsvc:
                warnings.append("%s: links to unknown service %s"
                                % (w, linked))
            elif (lsvc.get("dispatcher") or {}).get("func") != func:
                warnings.append("%s: linked service %s does not name it as"
                                " dispatcher" % (w, linked))
        elif not cand.get("non_soap") \
                and (cand.get("kind") or cand.get("vptr_candidates")):
            warnings.append("%s: dispatcher evidence present but not linked"
                            " to a service" % w)
    for name, var in (doc.get("state_variables") or {}).items():
        _check_text(warnings, "state var %s" % name, "description",
                    var.get("description"), name)
    for section in ("uri_formats", "payload_formats"):
        for name, spec in (doc.get(section) or {}).items():
            w = "%s %s" % (section, name)
            _check_text(warnings, w, "description", spec.get("description"),
                        name)
            _check_claim_evidence(warnings, w, spec.get("status"),
                                  spec.get("evidence"))

    # ---- cross-consistency vs extractor output ----
    ext_services = {}
    for s in api.get("services") or []:
        ext_services[s["control_path"]] = s
    for path, esvc in ext_services.items():
        dsvc = (doc.get("services") or {}).get(path)
        if not dsvc:
            warnings.append("ORPHAN: extractor service %s missing from docs"
                            % path)
            continue
        ext_actions = {a["name"] for a in esvc.get("actions") or []}
        doc_actions = set(dsvc.get("actions") or {})
        for a in ext_actions - doc_actions:
            warnings.append("ORPHAN: action %s.%s missing from docs"
                            % (esvc.get("name"), a))
        for a in doc_actions - ext_actions:
            warnings.append("STALE: doc action %s.%s not in extractor output"
                            % (esvc.get("name"), a))
        ea = {a["name"]: a for a in esvc.get("actions") or []}
        for an in ext_actions & doc_actions:
            ext_in = {x["name"] for x in ea[an].get("args_in") or []}
            ext_out = {x["name"] for x in ea[an].get("args_out") or []}
            dact = dsvc["actions"][an]
            doc_in = set(dact.get("inputs") or {})
            doc_out = set(dact.get("outputs") or {})
            for g in ext_in - doc_in:
                warnings.append("ORPHAN: input %s.%s.%s missing from docs"
                                % (esvc.get("name"), an, g))
            for g in doc_in - ext_in:
                warnings.append("STALE: doc input %s.%s.%s not in extractor"
                                % (esvc.get("name"), an, g))
            for g in ext_out - doc_out:
                warnings.append("ORPHAN: output %s.%s.%s missing from docs"
                                % (esvc.get("name"), an, g))
            for g in doc_out - ext_out:
                warnings.append("STALE: doc output %s.%s.%s not in extractor"
                                % (esvc.get("name"), an, g))
    for path in (doc.get("services") or {}):
        if path not in ext_services:
            warnings.append("STALE: doc service %s not in extractor output"
                            % path)
    ext_cands = {c.get("func")
                 for c in api.get("unattached_dispatcher_candidates") or []}
    for func in ext_cands - set(doc.get("dispatch_candidates") or {}):
        warnings.append("ORPHAN: dispatch candidate %s missing from docs"
                        % func)
    return warnings


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--docs", default=doclib.DEFAULT_DOC)
    ap.add_argument("--api", default=doclib.DEFAULT_API)
    args = ap.parse_args()
    if not os.path.exists(args.docs):
        sys.exit("no documentation at %s" % args.docs)
    doc = doclib.load_json(args.docs)
    api = doclib.load_json(args.api)
    warnings = lint(doc, api)
    print("%d lint warning(s)" % len(warnings))
    for w in warnings:
        print("  %s" % w)
    if warnings:
        sys.exit(1)


if __name__ == "__main__":
    main()
