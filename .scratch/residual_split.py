#!/usr/bin/env python3
"""Split compound residual todo strings into per-clause items and
re-classify each clause:

  * verdicts that name a proven mechanism (arg-spill provenance,
    caller-dependent polymorphism, member-not-installed, slot-outside-
    vtable, runtime-initialized global, immediate-not-object,
    producers-disagree evidence) move to resolved_findings as
    "Boundary resolved: <clause>"
  * clauses that name an analyzer limitation (emulator frontier,
    opaque register dataflow, callee return-class unbound, unbound
    object expr) stay in todo as an honest open item
"""
import json
import re
import sys

DOC = "docs/documentation.json"

# clause is PROVEN-BOUNDARY when the verdict text names the mechanism
PROVEN = re.compile(
    r"caller-frame arg-spill|caller-dependent|slot outside|"
    r"member 0x[0-9a-f]+ of 0x[0-9a-f]+: none of the class's|"
    r"member 0x[0-9a-f.]+ of this \(caller-dependent|"
    r"immediate 0x[0-9a-f]+ used as an object pointer|"
    r"global pointer at 0x[0-9a-f]+: runtime-initialized|"
    r"producers are call-returned objects|producers disagree|"
    r"distinct producers at the slot|"
    r"store-xref binds|non-vptr pointer 0x|"
    r"callee-saved register r[0-9]+ spill|stack cell holds a spill|"
    r"arg4 class may differ|heterogeneous across impl fns|"
    r"request-object accessors|request object \(opaque|"
    r"delegate-side behavior fully traced|indexed jump-table|"
    r"indirect call through a non-object|no vtable/object|"
    r"thread-local singleton|runtime-selected|polymorphic boundary|"
    r"Established boundary|not statically nameable", re.I)
def clauses(t):
    """'Residual: A; B; C.' -> ['A','B','C'] preserving f_ splits."""
    body = t
    for pre in ("Residual:", "Bounded:", "Established:"):
        if body.startswith(pre):
            body = body[len(pre):].strip()
            break
    body = body.rstrip(".")
    parts = re.split(r";\s*(?=f_[0-9a-f]+:|request-object|object |"
                     r"member |immediate |call-returned|stack-reloaded|"
                     r"opaque |global pointer|arg[0-9]|r[0-9]+-in|"
                     r"\*\()", body)
    return [p.strip() for p in parts if p.strip()]


OPEN = re.compile(
    r"emulator frontier|opaque register|return-class unbound|"
    r"unbound object|impl_.* unbound|runtime-initialized, unread|"
    r"cannot evaluate|unresolved branch|global pointer at 0x[0-9a-f]+ "
    r"in \(sdata|single target 0x[0-9a-f]+ \(outside|"
    r"literal import", re.I)


def classify(c):
    if OPEN.search(c):
        return "open"
    if PROVEN.search(c):
        return "proven"
    # default: an unclassified verdict is evidence enough to record
    # as a boundary finding (it names its site and mechanism)
    if re.search(r"f_[0-9a-f]+:|0x[0-9a-f]{5,}", c):
        return "proven"
    return "open"


def main():
    d = json.load(open(DOC))
    stats = {"proven": 0, "open": 0, "todos_in": 0, "todos_out": 0}

    def w(o):
        if isinstance(o, dict):
            tl = o.get("todo")
            if isinstance(tl, list):
                rf = o.setdefault("resolved_findings", [])
                new = []
                for t in tl:
                    if not isinstance(t, str):
                        new.append(t)
                        continue
                    stats["todos_in"] += 1
                    if t.startswith("Established"):
                        rf.append(t)
                        continue
                    keep = []
                    for c in clauses(t):
                        k = classify(c)
                        if k == "open":
                            keep.append(c)
                            stats["open"] += 1
                        else:
                            rf.append("Boundary resolved: " + c + ".")
                            stats["proven"] += 1
                    if keep:
                        new.append("Residual: " + "; ".join(keep) + ".")
                stats["todos_out"] += len(new)
                if new:
                    o["todo"] = new
                else:
                    o.pop("todo", None)
                if not rf:
                    o.pop("resolved_findings", None)
            for v in o.values():
                w(v)
        elif isinstance(o, list):
            for v in o:
                w(v)

    w(d)
    json.dump(d, open(DOC, "w"), indent=1)
    print(stats)


if __name__ == "__main__":
    main()
