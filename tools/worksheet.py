#!/usr/bin/env python3
"""
worksheet.py -- print a reverse-engineering worksheet for one action.

    python3 tools/worksheet.py AVTransport Seek
    python3 tools/worksheet.py /MediaRenderer/AVTransport/Control Seek

Service may be given by name or control path. The worksheet lists every
structural fact the extractor recovered plus everything still undocumented,
so an RE agent can work one action at a time.
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import doclib


def find_service(api, query):
    for s in api.get("services") or []:
        if s.get("control_path") == query or s.get("name") == query:
            return s
    matches = [s for s in api.get("services") or []
               if query.lower() in (s.get("name") or "").lower()
               or query.lower() in (s.get("control_path") or "").lower()]
    return matches[0] if len(matches) == 1 else None


def find_action(svc, name):
    for a in svc.get("actions") or []:
        if a.get("name") == name:
            return a
    matches = [a for a in svc.get("actions") or []
               if name.lower() in (a.get("name") or "").lower()]
    return matches[0] if len(matches) == 1 else None


def _fmt(x):
    return "null" if x is None else str(x)


def worksheet(api, doc, svc, act):
    out = []
    p = out.append
    path = svc["control_path"]
    doc_svc = (doc.get("services") or {}).get(path) or {}
    doc_act = (doc_svc.get("actions") or {}).get(act["name"]) or {}

    p("=" * 72)
    p("WORKSHEET: %s . %s" % (svc.get("name"), act.get("name")))
    p("=" * 72)
    p("Service: %s" % svc.get("name"))
    p("Path:    %s" % path)
    p("Router:  %s   cap_flags: %s" % (svc.get("router"),
                                     svc.get("cap_flags")))
    en = svc.get("enabled") or {}
    p("Enabled: %s = %s" % (en.get("kind"), en.get("raw_expr")))
    obj = svc.get("object") or {}
    p("Object:  %s -> vptr %s (source %s)"
      % (obj.get("expr"), obj.get("vptr"), obj.get("source")))
    disp = svc.get("dispatcher") or {}
    p("Disp:    %s [%s] table %s"
      % (disp.get("addr"), disp.get("kind"), disp.get("action_table")))
    p("")
    p("Action: %s" % act.get("name"))
    p("  kind: %s   voff: %s   table entry: %s"
      % (act.get("kind"), _fmt(act.get("voff")), act.get("entry_addr")))
    if act.get("compare_pc"):
        p("  strcmp site: %s" % act["compare_pc"])
    p("")
    p("WRAPPER / HANDLER")
    p("  handler: %s (func %s)   request arg reg: %s"
      % (_fmt(act.get("handler")), _fmt(act.get("handler_func")),
         _fmt(act.get("req_arg"))))
    p("")
    p("INPUTS")
    if act.get("args_in"):
        for a in act["args_in"]:
            p("  %s" % a["name"])
            p("    access site: %s  via req vfunc +0x%x"
              % (a.get("site"), a.get("via_slot") or 0))
            p("    parse helper: %s  type_tag: %s  buf_cap: %s  fmt: %s"
              % (_fmt(a.get("parse_helper")), _fmt(a.get("type_tag")),
                 _fmt(a.get("buf_cap")), _fmt(a.get("fmt"))))
            p("    name string: %s" % _fmt(a.get("name_va")))
    else:
        p("  (none discovered)")
    p("")
    p("OUTPUTS")
    if act.get("args_out"):
        for a in act["args_out"]:
            p("  %s" % a["name"])
            p("    output site: %s  fmt helper: %s  fmt: %s"
              % (a.get("site"), _fmt(a.get("fmt_helper")),
                 _fmt(a.get("fmt"))))
    else:
        p("  (none discovered)")
    p("")
    p("REQUEST VFUNC CALLS")
    for v in act.get("req_vcalls") or []:
        p("  +0x%02x (%s) at %s"
          % (v.get("slot") or 0, v.get("purpose"), v.get("site")))
    if not (act.get("req_vcalls")):
        p("  (none recorded)")
    p("")
    p("IMPLEMENTATION CALLS")
    for c in act.get("impl_calls") or []:
        p("  %s -> vfunc[+0x%x]  at %s  arg4=%s"
          % (c.get("obj"), c.get("slot") or 0, c.get("site"),
             _fmt(c.get("arg4"))))
    if not (act.get("impl_calls")):
        p("  (none recorded)")
    p("")
    p("FAULT PATHS")
    for f in act.get("faults") or []:
        p("  site %s  code=%s  source=%s"
          % (f.get("site"), _fmt(f.get("code")),
             _fmt(f.get("code_expr") or f.get("source"))))
    if not (act.get("faults")):
        p("  (none recorded)")
    p("")
    p("SERVICE-LEVEL FAULTS (dispatcher)")
    for f in disp.get("fault_sites") or []:
        p("  site %s  code=%s" % (f.get("pc"), _fmt(f.get("code"))))
    p("")
    p("KNOWN EVIDENCE")
    for e in doc_act.get("evidence") or []:
        loc = e.get("address") or e.get("callsite") or e.get("function")
        p("  %s %s" % (e.get("type"), loc))
        if e.get("notes"):
            p("       %s" % e["notes"])
    p("")
    p("EXISTING DOC")
    p("  description: %s" % _fmt(doc_act.get("description")))
    p("  visibility: %s" % doc_act.get("visibility"))
    p("")
    p("STILL UNDOCUMENTED")
    issues = doclib.action_issues(act["name"], doc_act)
    if issues:
        for i in issues:
            p("  - %s" % i)
    else:
        p("  (nothing -- action is semantically complete)")
    # error entry details
    if doc_act.get("errors"):
        p("")
        p("ERROR ENTRIES IN DOC")
        for e in doc_act["errors"]:
            p("  code=%s expr=%s%s"
              % (_fmt(e.get("code")), _fmt(e.get("code_expr")),
                 " (unresolved)" if e.get("unresolved") else ""))
            u = e.get("unresolved") or {}
            if u.get("proven"):
                p("    proven: %s" % u["proven"])
            if u.get("unknown"):
                p("    unknown: %s" % u["unknown"])
            for c in e.get("conditions") or []:
                p("    condition: %s" % c.get("description"))
    p("")
    return "\n".join(out)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("service")
    ap.add_argument("action")
    ap.add_argument("--api", default=doclib.DEFAULT_API)
    ap.add_argument("--docs", default=doclib.DEFAULT_DOC)
    args = ap.parse_args()
    api = doclib.load_json(args.api)
    doc = doclib.load_json(args.docs) if os.path.exists(args.docs) else {}
    svc = find_service(api, args.service)
    if not svc:
        sys.exit("no service matching %r" % args.service)
    act = find_action(svc, args.action)
    if not act:
        sys.exit("no action matching %r in %s"
                 % (args.action, svc.get("name")))
    print(worksheet(api, doc, svc, act))


if __name__ == "__main__":
    main()
