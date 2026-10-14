#!/usr/bin/env python3
"""
import_extract.py -- import extractor JSON into documentation.json.

Creates documentation skeletons for every discovered object. Machine-owned
structural fields (addresses, fault sites, parse helpers, vfunc calls) are
refreshed every run; human-owned semantic fields (description, meaning,
requirements, ...) are never overwritten once present.

Usage:
    python3 tools/import_extract.py [extractor.json] [--docs documentation.json]
                                    [--build 86.10-80260]
"""
import argparse
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import doclib


def _build_from_name(path, default=doclib.DEFAULT_BUILD):
    m = re.search(r"(\d+\.\d+-\d+)", os.path.basename(path))
    return m.group(1) if m else default


def _evidence(**kw):
    return doclib.ev(**kw)


# ------------------------------------------------------------ skeletons

def _arg_skeleton(direction, site_ev):
    return {
        "description": None,
        "direction": direction,
        "primitive": None,
        "semantic_type": None,
        "format": None,
        "unit": None,
        "accepted_values": None,
        "range": None,
        "special_values": None,
        "required": None,
        "default": None,
        "validation": None,
        "evidence": site_ev,
        "notes": None,
    }


def _action_skeleton(act, build):
    disp = {"kind": act.get("kind"), "entry_addr": act.get("entry_addr"),
            "voff": act.get("voff")}
    if act.get("kind") == "strcmp-dispatched":
        disp["compare_pc"] = act.get("compare_pc")
    ev = []
    if act.get("handler"):
        ev.append(_evidence(address=act["handler"],
                            function=act.get("handler_func"),
                            notes="action wrapper handler",
                            build=build))
    if act.get("entry_addr"):
        ev.append(_evidence(address=act["entry_addr"],
                            notes="action dispatch table entry",
                            build=build))
    if act.get("compare_pc"):
        ev.append(_evidence(address=act["compare_pc"],
                            notes="strcmp dispatch site",
                            build=build))
    return {
        "description": None,
        "visibility": "unknown",
        "reachability": None,
        "handler": act.get("handler"),
        "handler_func": act.get("handler_func"),
        "req_arg": act.get("req_arg"),
        "dispatch": disp,
        "implementation": {
            "calls": act.get("impl_calls") or [],
            "req_vcalls": act.get("req_vcalls") or [],
        },
        "inputs": {},
        "outputs": {},
        "validation": None,
        "requirements": None,
        "state_dependencies": None,
        "side_effects": None,
        "events_triggered": None,
        "state_transitions": None,
        "return_behavior": None,
        "fault_sites": [],
        "errors": [],
        "firmware_differences": [],
        "evidence": ev,
        "notes": None,
    }


def _service_skeleton(svc, build):
    return {
        "name": svc.get("name"),
        "control_path": svc.get("control_path"),
        "description": None,
        "visibility": "unknown",
        "registration": None,
        "availability": {
            "enabled_source": None,
            "cap_flags": None,
            "notes": None,
        },
        "object": None,
        "dispatcher": None,
        "actions": {},
        "state_variables": {},
        "events": {},
        "errors": [],
        "evidence": [],
        "notes": None,
    }


def _error_skeleton(site, code, code_expr, build):
    if code is not None:
        proven = ("request fault vfunc (+0x14) invoked at %s with constant "
                  "code %d" % (site, code))
    else:
        proven = ("request fault vfunc (+0x14) invoked at %s with computed "
                  "code %s" % (site, code_expr))
    return {
        "code": code,
        "code_expr": code_expr,
        "meaning": None,
        "fault_sites": [site],
        "conditions": [],
        "evidence": [_evidence(address=site,
                               notes="fault raise site", build=build)],
        "unresolved": {"proven": proven, "unknown": None},
        "notes": None,
    }


# ---------------------------------------------------------------- merge

def _merge_args(doc_args, ext_args, direction, build):
    for a in ext_args or []:
        name = a["name"]
        if name not in doc_args:
            site_ev = []
            if a.get("site"):
                site_ev.append(_evidence(address=a["site"],
                                         notes="%s-arg access site"
                                         % direction, build=build))
            if a.get("name_va"):
                site_ev.append(_evidence(address=a["name_va"],
                                         notes="argument name string",
                                         build=build))
            doc_args[name] = _arg_skeleton(direction, site_ev)
        arg = doc_args[name]
        # machine-owned primitive facts: always refreshed
        if direction == "in":
            arg["primitive"] = {
                "type_tag": a.get("type_tag"),
                "parse_helper": a.get("parse_helper"),
                "buf_cap": a.get("buf_cap"),
                "fmt": a.get("fmt"),
                "via_slot": a.get("via_slot"),
            }
        else:
            arg["primitive"] = {
                "fmt_helper": a.get("fmt_helper"),
                "fmt": a.get("fmt"),
                "via_slot": a.get("slot"),
            }
        # register helper as internal function
        helper = a.get("parse_helper") if direction == "in" else a.get("fmt_helper")
        if helper:
            _INTERNAL_HELPERS.setdefault(helper, {
                "role": ("input_arg_parser" if direction == "in"
                         else "output_formatter"),
                "used_by": []})
            _INTERNAL_HELPERS[helper]["used_by"].append(
                {"arg": name, "direction": direction, "site": a.get("site")})


def _merge_faults(entries, faults, build):
    """Ensure every extractor fault site is covered by an errors entry.
    Existing human entries are matched via their fault_sites list."""
    covered = set()
    for e in entries:
        for s in e.get("fault_sites") or []:
            covered.add(s)
    for f in faults or []:
        site = f.get("site")
        if not site or site in covered:
            continue
        entries.append(_error_skeleton(site, f.get("code"),
                                       f.get("code_expr") or f.get("source"),
                                       build))
        covered.add(site)


def _merge_action(doc_act, act, build):
    # machine-owned fields refreshed
    doc_act["handler"] = act.get("handler")
    doc_act["handler_func"] = act.get("handler_func")
    doc_act["req_arg"] = act.get("req_arg")
    disp = {"kind": act.get("kind"), "entry_addr": act.get("entry_addr"),
            "voff": act.get("voff")}
    if act.get("compare_pc") is not None:
        disp["compare_pc"] = act["compare_pc"]
    doc_act["dispatch"] = disp
    doc_act["implementation"] = {
        "calls": act.get("impl_calls") or [],
        "req_vcalls": act.get("req_vcalls") or [],
    }
    doc_act["fault_sites"] = [
        {"site": f.get("site"), "code": f.get("code"),
         "code_expr": f.get("code_expr") or f.get("source")}
        for f in act.get("faults") or []]
    _merge_args(doc_act.setdefault("inputs", {}), act.get("args_in"),
                "in", build)
    _merge_args(doc_act.setdefault("outputs", {}), act.get("args_out"),
                "out", build)
    _merge_faults(doc_act.setdefault("errors", []), act.get("faults"), build)
    # backfill handler evidence for skeletons created before handlers resolved
    ev = doc_act.setdefault("evidence", [])
    add = []
    if act.get("handler"):
        add.append(_evidence(address=act["handler"],
                             function=act.get("handler_func"),
                             notes="action wrapper handler", build=build))
    if act.get("entry_addr"):
        add.append(_evidence(address=act["entry_addr"],
                             notes="action dispatch table entry",
                             build=build))
    doclib.merge_evidence(ev, add)


def _merge_service(doc_svc, svc, build):
    doc_svc["name"] = svc.get("name")
    doc_svc["control_path"] = svc.get("control_path")
    doc_svc["registration"] = {
        "router": svc.get("router"),
        "cap_flags": svc.get("cap_flags"),
        "evidence": svc.get("evidence"),
    }
    avail = doc_svc.setdefault("availability", {})
    avail["enabled_source"] = svc.get("enabled")
    avail["cap_flags"] = svc.get("cap_flags")
    avail.setdefault("notes", None)
    doc_svc["object"] = svc.get("object")
    doc_svc["dispatcher"] = svc.get("dispatcher")
    ev = doc_svc.setdefault("evidence", [])
    add = []
    for addr, note in ((svc.get("router"), "service router function"),
                       ((svc.get("object") or {}).get("vptr"),
                        "service vtable"),
                       ((svc.get("dispatcher") or {}).get("addr"),
                        "service dispatcher")):
        if addr:
            add.append(_evidence(address=addr, notes=note, build=build))
    doclib.merge_evidence(ev, add)
    # dispatcher-level faults -> service error skeletons
    disp_faults = (svc.get("dispatcher") or {}).get("fault_sites") or []
    _merge_faults(doc_svc.setdefault("errors", []),
                  [{"site": f.get("pc"), "code": f.get("code"),
                    "code_expr": None} for f in disp_faults], build)
    for act in svc.get("actions") or []:
        name = act["name"]
        actions = doc_svc.setdefault("actions", {})
        if name not in actions:
            actions[name] = _action_skeleton(act, build)
        _merge_action(actions[name], act, build)


def _merge_capabilities(doc, api, build):
    caps = doc.setdefault("capabilities", {})
    for off, info in (api.get("capability_fields") or {}).items():
        cap = caps.setdefault(off, {
            "description": None,
            "effect": None,
            "loads": [],
            "stores": [],
            "affected_services": [],
            "evidence": [],
            "notes": None,
        })
        cap["loads"] = info.get("loads") or []
        cap["stores"] = info.get("stores") or []
    # link services gated by a field to that capability
    for svc in api.get("services") or []:
        en = svc.get("enabled") or {}
        off = en.get("off")
        if off is None:
            continue
        key = hex(off)
        if key in caps:
            affected = caps[key].setdefault("affected_services", [])
            label = doclib.service_label(svc)
            if label not in affected:
                affected.append(label)
            for st in caps[key].get("stores") or []:
                if st.get("pc"):
                    doclib.merge_evidence(
                        caps[key].setdefault("evidence", []),
                        [_evidence(address=st["pc"], function=st.get("func"),
                                   notes="capability field store site",
                                   build=build)])


def _merge_dispatch_candidates(doc, api, build):
    cands = doc.setdefault("dispatch_candidates", {})
    for c in api.get("unattached_dispatcher_candidates") or []:
        func = c.get("func")
        if not func:
            continue
        cand = cands.setdefault(func, {
            "func": func,
            "li_401_at": None,
            "kind": None,
            "compares": [],
            "vptr_candidates": [],
            "assessment": None,
            "evidence": [],
            "notes": None,
        })
        cand["func"] = func
        cand["li_401_at"] = c.get("li_401_at")
        cand["kind"] = c.get("kind")
        cand["compares"] = c.get("compares") or []
        cand["vptr_candidates"] = c.get("vptr_candidates") or []
        if c.get("li_401_at"):
            doclib.merge_evidence(
                cand.setdefault("evidence", []),
                [_evidence(address=c["li_401_at"], function=func,
                           notes="li r4,0x191 + fault emitter site",
                           build=build)])


def _merge_internal_functions(doc, build):
    fns = doc.setdefault("internal_functions", {})
    for addr, info in _INTERNAL_HELPERS.items():
        fn = fns.setdefault(addr, {
            "address": addr,
            "role": info["role"],
            "description": None,
            "why_external": None,
            "required_for_behavior": True,
            "used_by": [],
            "evidence": [_evidence(address=addr,
                                   notes="%s helper" % info["role"],
                                   build=build)],
            "notes": None,
        })
        fn["role"] = info["role"]
        fn["used_by"] = info["used_by"]


def run_import(api_path, doc_path, build=None):
    api = doclib.load_json(api_path)
    build = build or _build_from_name(api_path)
    if os.path.exists(doc_path):
        doc = doclib.load_json(doc_path)
    else:
        doc = {}
    doc["meta"] = {
        "binary": api.get("binary", doclib.DEFAULT_BINARY),
        "build": build,
        "schema_version": 1,
        "source_extract": os.path.basename(api_path),
        "generator": "tools/import_extract.py",
        "functions_mapped": api.get("functions_mapped"),
    }
    doc["routing"] = {
        "routers": api.get("routers"),
        "router_chain": api.get("router_chain"),
        "action_tables": api.get("action_tables"),
    }
    # Seed the request-vtable model from extraction, but do not overwrite
    # the manually reverse-engineered interface/lifetime record on later imports.
    if not doc.get("request_vtable"):
        doc["request_vtable"] = api.get("request_vtable")
    doc.setdefault("services", {})
    doc.setdefault("capabilities", {})
    doc.setdefault("internal_functions", {})
    doc.setdefault("dispatch_candidates", {})
    doc.setdefault("state_variables", {})
    doc.setdefault("uri_formats", {})
    doc.setdefault("payload_formats", {})
    doc.setdefault("firmware_differences", [])

    _INTERNAL_HELPERS.clear()
    n_new_svc = n_new_act = 0
    for svc in api.get("services") or []:
        key = doclib.service_key(svc)
        if key not in doc["services"]:
            doc["services"][key] = _service_skeleton(svc, build)
            n_new_svc += 1
            n_new_act += len(svc.get("actions") or [])
        else:
            n_new_act += sum(
                1 for act in svc.get("actions") or []
                if act["name"] not in (doc["services"][key].get("actions")
                                       or {}))
        _merge_service(doc["services"][key], svc, build)
    _merge_capabilities(doc, api, build)
    _merge_dispatch_candidates(doc, api, build)
    _merge_internal_functions(doc, build)
    doclib.save_json(doc_path, doc)
    return doc, n_new_svc, n_new_act


_INTERNAL_HELPERS = {}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("api", nargs="?", default=doclib.DEFAULT_API,
                    help="extractor JSON (default %(default)s)")
    ap.add_argument("--docs", default=doclib.DEFAULT_DOC,
                    help="documentation.json path")
    ap.add_argument("--build", default=None)
    args = ap.parse_args()
    doc, n_svc, n_act = run_import(args.api, args.docs, args.build)
    total_act = sum(len(s.get("actions") or {})
                    for s in doc["services"].values())
    print("imported -> %s" % args.docs)
    print("  services: %d (%d new)" % (len(doc["services"]), n_svc))
    print("  actions:  %d (%d new)" % (total_act, n_act))
    print("  capabilities: %d, internal helpers: %d, dispatch candidates: %d"
          % (len(doc["capabilities"]), len(doc["internal_functions"]),
             len(doc["dispatch_candidates"])))


if __name__ == "__main__":
    main()
