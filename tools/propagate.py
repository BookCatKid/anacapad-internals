#!/usr/bin/env python3
"""Recompute honest statuses: parents = weakest observable child.

Rules (established during the integrity pass):
- Rank order: unresolved < inferred < strong < confirmed.
- Any strong/confirmed claim object with an empty/missing evidence array
  is downgraded to inferred (empty evidence is not proof).
- An error record carrying a non-empty `unresolved` dict caps at strong.
- An action's status is the weakest observable child status, floored at
  'strong' when its dispatch/handler/impl chain is structurally proven
  (handler address + dispatcher known, or args_verified_empty argless).
  Confirmed therefore requires every observable child to be confirmed.
- A service's status is the weakest contained action, unless it has no
  actions and its own record is evidence-backed (AudioIn reject-all).

Usage: python3 tools/propagate.py [--write]
"""
import json
import sys

RANK = {"unresolved": 0, "inferred": 1, "strong": 2, "confirmed": 3}
REV = {v: k for k, v in RANK.items()}

CHILD_FIELDS = ["inputs", "outputs", "errors", "validation", "requirements",
                "state_dependencies", "side_effects", "events_triggered",
                "state_transitions", "return_behavior"]


def iter_status_objs(v):
    if isinstance(v, dict):
        if "status" in v:
            yield v
        else:
            for x in v.values():
                yield from iter_status_objs(x)
    elif isinstance(v, list):
        for x in v:
            yield from iter_status_objs(x)


def has_unresolved_unknown(e):
    u = e.get("unresolved")
    return isinstance(u, dict) and bool(u)


def structure_proven(act):
    h = act.get("handler") or act.get("handler_func")
    imp = act.get("implementation") or {}
    impl = imp.get("impl_function") or imp.get("impl_vfunc")
    if not impl:
        # impl invoked through the service object vtable: *(r3-in+0x4)->v[slot]
        impl = any(c.get("obj") == "*(r3-in+0x4)" for c in imp.get("calls") or [])
    if act.get("args_verified_empty"):
        return bool(h)
    return bool(h) and bool(impl)


def main():
    doc_path = sys.argv[sys.argv.index("--docs") + 1] if "--docs" in sys.argv else "docs/documentation.json"
    doc = json.load(open(doc_path))
    downgraded = {"claims": 0, "err_unknown": 0}
    counts = {"confirmed": 0, "strong": 0, "inferred": 0, "unresolved": 0}

    for svc in doc["services"].values():
        acts = svc.get("actions", {})
        weakest = None
        for a in acts.values():
            # 1. empty-evidence demotion + unresolved-unknown cap
            floor = 3
            for field in CHILD_FIELDS:
                if field not in a:
                    continue
                for o in iter_status_objs(a[field]):
                    if o.get("status") in ("confirmed", "strong") and not o.get("evidence"):
                        o["status"] = "inferred"
                        downgraded["claims"] += 1
                    if has_unresolved_unknown(o) and o.get("status") == "confirmed":
                        o["status"] = "strong"
                        downgraded["err_unknown"] += 1
                    floor = min(floor, RANK.get(o.get("status"), 0))
            # 2. action status = weakest child, floored at strong if chain proven
            if structure_proven(a):
                floor = max(floor, 2)
            a["status"] = REV[floor]
            counts[a["status"]] += 1
            if weakest is None or floor < weakest:
                weakest = floor
        if acts:
            svc["status"] = REV[max(0, weakest)]
    print("downgraded:", downgraded)
    print("actions:", counts)
    if "--write" in sys.argv:
        json.dump(doc, open(doc_path, "w"), indent=1)
        print("wrote", doc_path)


if __name__ == "__main__":
    main()
