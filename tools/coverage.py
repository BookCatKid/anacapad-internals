#!/usr/bin/env python3
"""
coverage.py -- documentation coverage report.

Two measures, kept distinct everywhere:

  structurally present -- the extractor discovered the object
  semantically complete -- the doc entry meets the completeness rules in
                          doclib (meaningful description, all fields
                          assessed, fault paths resolved or explicitly
                          unresolved-with-evidence)

Usage:
    python3 tools/coverage.py [--docs documentation.json] [--api extractor.json]
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import doclib


def report(api, doc):
    lines = []
    p = lines.append

    services = api.get("services") or []
    dservices = doc.get("services") or {}

    # ---------------- services ----------------
    svc_total = len(services)
    svc_done = sum(
        1 for s in services
        if not doclib.service_issues(dservices.get(s["control_path"]) or {}))
    p("SERVICES")
    p("%d / %d discovered   %d / %d documented"
      % (svc_total, svc_total, svc_done, svc_total))
    p("")

    # ---------------- actions ----------------
    act_total = sum(len(s.get("actions") or []) for s in services)
    act_done = 0
    in_total = in_done = out_total = out_done = 0
    fault_total = fault_done = 0
    for s in services:
        dsvc = dservices.get(s["control_path"]) or {}
        dactions = dsvc.get("actions") or {}
        for a in s.get("actions") or []:
            da = dactions.get(a["name"]) or {}
            if not doclib.action_issues(a["name"], da):
                act_done += 1
            for arg in a.get("args_in") or []:
                in_total += 1
                darg = (da.get("inputs") or {}).get(arg["name"]) or {}
                if not doclib.arg_issues(arg["name"], darg):
                    in_done += 1
            for arg in a.get("args_out") or []:
                out_total += 1
                darg = (da.get("outputs") or {}).get(arg["name"]) or {}
                if not doclib.arg_issues(arg["name"], darg):
                    out_done += 1
            for f in a.get("faults") or []:
                site = f.get("site")
                fault_total += 1
                entries = [e for e in da.get("errors") or []
                           if site in (e.get("fault_sites") or [])]
                if any(doclib._err_entry_complete(e) for e in entries):
                    fault_done += 1
        # dispatcher-level faults count too
        for f in (s.get("dispatcher") or {}).get("fault_sites") or []:
            fault_total += 1
            entries = [e for e in dsvc.get("errors") or []
                       if f.get("pc") in (e.get("fault_sites") or [])]
            if any(doclib._err_entry_complete(e) for e in entries):
                fault_done += 1
    p("ACTIONS")
    p("%d discovered   %d / %d semantically complete"
      % (act_total, act_done, act_total))
    p("")
    p("INPUTS")
    p("%d / %d documented" % (in_done, in_total))
    p("")
    p("OUTPUTS")
    p("%d / %d documented" % (out_done, out_total))
    p("")
    p("ERROR CONDITIONS")
    p("%d / %d fault paths documented   %d unresolved"
      % (fault_done, fault_total, fault_total - fault_done))
    p("")

    # ---------------- state variables ----------------
    n_sv = sum(len(s.get("state_variables") or {})
               for s in dservices.values())
    n_sv += len(doc.get("state_variables") or {})
    sv_done = 0
    for s in dservices.values():
        for name, var in (s.get("state_variables") or {}).items():
            if not doclib.statevar_issues(name, var):
                sv_done += 1
    for name, var in (doc.get("state_variables") or {}).items():
        if not doclib.statevar_issues(name, var):
            sv_done += 1
    n_sv_ext = sum(len(s.get("state_variables") or {}) for s in services)
    p("STATE VARIABLES")
    p("%d extractor-discovered   %d declared in docs   %d documented"
      % (n_sv_ext, n_sv, sv_done))
    p("")

    # ---------------- capabilities ----------------
    caps = doc.get("capabilities") or {}
    cap_done = sum(1 for k, c in caps.items()
                   if not doclib.capability_issues(k, c))
    p("CAPABILITY FIELDS")
    p("%d discovered   %d documented" % (len(caps), cap_done))
    p("")

    # ---------------- dispatch candidates ----------------
    cands = doc.get("dispatch_candidates") or {}
    cand_done = sum(1 for f, c in cands.items()
                    if not doclib.candidate_issues(f, c))
    p("UNATTACHED DISPATCH CANDIDATES")
    p("%d discovered   %d assessed" % (len(cands), cand_done))
    p("")

    # ---------------- hidden actions ----------------
    hidden = [(s["control_path"], n, a) for s in services
              for n, a in (dservices.get(s["control_path"]) or {})
              .get("actions", {}).items()
              if a.get("visibility") == "hidden"]
    vis_unknown = sum(
        1 for s in services
        for a in ((dservices.get(s["control_path"]) or {})
                  .get("actions") or {}).values()
        if a.get("visibility") in (None, "unknown"))
    p("HIDDEN ACTIONS")
    p("%d classified hidden   %d actions still unclassified"
      % (len(hidden), vis_unknown))
    p("")

    # ---------------- internal functions ----------------
    fns = doc.get("internal_functions") or {}
    req = {a: f for a, f in fns.items() if f.get("required_for_behavior")}
    fn_done = sum(1 for a, f in req.items()
                  if not doclib.internal_fn_issues(a, f))
    p("INTERNAL FUNCTIONS (behavior-relevant)")
    p("%d required   %d documented   %d total declared"
      % (len(req), fn_done, len(fns)))
    p("")

    # ---------------- formats ----------------
    for section, label in (("uri_formats", "URI FORMATS"),
                           ("payload_formats", "PAYLOAD FORMATS")):
        specs = doc.get(section) or {}
        done = sum(1 for s in specs.values()
                   if doclib.is_meaningful(s.get("description"))[0])
        p(label)
        p("%d declared   %d documented" % (len(specs), done))
        p("")

    # ---------------- overall ----------------
    units = svc_total + act_total + in_total + out_total + fault_total \
        + len(caps) + len(cands) + len(req) + n_sv
    done = svc_done + act_done + in_done + out_done + fault_done \
        + cap_done + cand_done + fn_done + sv_done
    pct = (100.0 * done / units) if units else 100.0
    p("OVERALL (structural + first-pass semantic)")
    p("%d / %d documentation units complete   (%.1f%%)" % (done, units, pct))
    p("")

    # ---------------- binary-verified tier ----------------
    # An action is binary-verified when every claim is confirmed/strong
    # with evidence and no generic wrapper-level text counts as its
    # semantics. Anything else lands in one of the honest-lower tiers.
    ver_done = 0
    for s in services:
        dsvc = dservices.get(s["control_path"]) or {}
        for a in s.get("actions") or []:
            da = (dsvc.get("actions") or {}).get(a["name"]) or {}
            if not doclib.action_verified_issues(a["name"], da):
                ver_done += 1
    unresolved_beh = 0
    for s in services:
        dsvc = dservices.get(s["control_path"]) or {}
        for a in s.get("actions") or []:
            da = (dsvc.get("actions") or {}).get(a["name"]) or {}
            for e in da.get("errors") or []:
                if e.get("status") == "unresolved":
                    unresolved_beh += 1
            for an_, arg in (da.get("inputs") or {}).items():
                if arg.get("status") == "unresolved":
                    unresolved_beh += 1
            for an_, arg in (da.get("outputs") or {}).items():
                if arg.get("status") == "unresolved":
                    unresolved_beh += 1
    # ---------------- honest tiered report ----------------
    # Every status means what it says: `confirmed` requires every
    # externally observable child unit confirmed with evidence and no
    # material unknown. These tiers are computed from the docs'
    # self-declared statuses, which lint enforces propagate correctly.
    OBS = ("validation", "requirements", "state_dependencies",
           "events_triggered", "state_transitions", "return_behavior")
    RANK = {"confirmed": 3, "strong": 2, "inferred": 1, "unresolved": 0}
    def weakest_child(act):
        worst = 3
        def chk(s):
            nonlocal worst
            worst = min(worst, RANK.get(s, 1))
        for f in OBS:
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
        return worst
    tiers = {"confirmed": 0, "strong": 0, "inferred": 0, "unresolved": 0}
    material = unresolved_err = hidden_verified = 0
    n_internal = n_actions_doc = 0
    unresolved_children = 0
    for dsvc in dservices.values():
        for da in (dsvc.get("actions") or {}).values():
            n_actions_doc += 1
            tiers[da.get("status", "unresolved")] = \
                tiers.get(da.get("status", "unresolved"), 0) + 1
            unknown = False
            for e in da.get("errors") or []:
                if isinstance(e.get("unresolved"), dict) \
                        and e["unresolved"].get("unknown"):
                    unresolved_err += 1
                    unknown = True
            if weakest_child(da) < 2:
                unresolved_children += 1
                unknown = True
            if unknown:
                material += 1
            if da.get("visibility") in ("internal", "hidden"):
                n_internal += 1
                if da.get("reachability"):
                    hidden_verified += 1
    p("COVERAGE TIERS (docs %d actions; extractor %d)"
      % (n_actions_doc, act_total))
    p("  structurally mapped (dispatch+args found):   %d / %d"
      % (n_actions_doc, n_actions_doc))
    p("  semantic first-pass (fields assessed):       %d / %d"
      % (act_done, act_total))
    p("  strong (evidence-heavy, gaps remain):        %d / %d"
      % (tiers.get("strong", 0), n_actions_doc))
    p("  fully binary-confirmed:                      %d / %d"
      % (tiers.get("confirmed", 0), n_actions_doc))
    p("  actions with material unknowns:              %d / %d"
      % (material, n_actions_doc))
    p("  unresolved error domains:                    %d records"
      % unresolved_err)
    p("  actions with unresolved child units:         %d"
      % unresolved_children)
    p("  internal/hidden actions reachability-set:    %d / %d"
      % (hidden_verified, n_internal))
    n_ev = sum(len(s.get("events") or {}) for s in dservices.values())
    p("  state variables declared:                    %d"
      % n_sv)
    p("  service event models:                        %d services"
      % n_ev)
    p("  uri_formats declared:                        %d"
      % len(doc.get("uri_formats") or {}))
    p("  payload_formats declared:                    %d"
      % len(doc.get("payload_formats") or {}))
    return "\n".join(lines), done, units


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--docs", default=doclib.DEFAULT_DOC)
    ap.add_argument("--api", default=doclib.DEFAULT_API)
    args = ap.parse_args()
    if not os.path.exists(args.docs):
        sys.exit("no documentation at %s -- run import_extract.py first"
                 % args.docs)
    doc = doclib.load_json(args.docs)
    api = doclib.load_json(args.api)
    text, done, units = report(api, doc)
    print(text)


if __name__ == "__main__":
    main()
