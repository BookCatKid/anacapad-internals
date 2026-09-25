#!/usr/bin/env python3
"""
Shared library for the anacapad SOAP documentation workflow.

Loads the extractor JSON (binary-derived structural facts) and
documentation.json (human + skeleton semantics), and implements the
completeness rules shared by validate.py, coverage.py, worksheet.py and
lint.py so every tool judges documentation identically.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_API = os.path.join(ROOT, "soap_api-86.10-80260.json")
DOCS_DIR = os.path.join(ROOT, "docs")
DEFAULT_DOC = os.path.join(DOCS_DIR, "documentation.json")
DEFAULT_SCHEMA = os.path.join(DOCS_DIR, "documentation.schema.json")

DEFAULT_BINARY = "anacapad"
DEFAULT_BUILD = "86.10-80260"

STATUSES = ("confirmed", "strong", "inferred", "unresolved")
EVIDENCE_TYPES = ("firmware", "live_test", "network_capture",
                  "runtime_trace", "device_observation")
VISIBILITIES = ("advertised", "hidden", "internal", "unknown")
DISPATCH_KINDS = ("table", "strcmp", "reject-all", "switch", "hash",
                  "unknown", "none")

# Explicit sentinels meaning "assessed, and the answer is nothing / N/A".
# A null field means NOT YET ASSESSED; a sentinel means deliberately empty.
SENTINELS = ("none", "n/a", "unconstrained", "any", "unbounded")

_WEAK = {"todo", "tbd", "fixme", "xxx", "unknown", "placeholder", "stub",
         "none", "n/a", "?", "..."}
# Words that add no meaning when wrapped around an identifier.
_BLAND = ("action", "actions", "command", "commands", "argument", "arguments",
          "arg", "args", "parameter", "parameters", "param", "params",
          "input", "inputs", "output", "outputs", "service", "services",
          "variable", "variables", "statevariable", "error", "errors",
          "code", "codes", "field", "function", "handler", "value",
          "values", "flag", "string", "number", "integer", "int", "bool",
          "boolean", "method", "call", "request", "response", "the", "a",
          "an", "does", "is", "for", "of", "to", "get", "set", "this",
          "that", "current", "new", "sonos", "upnp", "soap")


def _norm(s):
    return re.sub(r"[^a-z0-9]", "", str(s).lower())


def is_meaningful(text, ident=None):
    """Return (ok, reason). A description is meaningful if it is a real
    sentence that does not merely restate the identifier."""
    if not isinstance(text, str) or not text.strip():
        return False, "missing/empty"
    t = text.strip()
    if _norm(t) in {_norm(w) for w in _WEAK}:
        return False, "placeholder text"
    low = t.lower()
    for w in ("todo", "fixme", "tbd", "placeholder", "wibble"):
        if re.search(r"\b" + w + r"\b", low):
            return False, "contains '%s'" % w
    if ident:
        ni, nt = _norm(ident), _norm(t)
        if nt == ni:
            return False, "echoes identifier"
        # strip one leading bland prefix ("does"/"the") then trailing bland
        # words; if the remainder equals the identifier it is a name-echo.
        rem = nt
        for pre in ("does", "the", "a", "an"):
            if rem.startswith(pre) and len(rem) > len(pre):
                rem = rem[len(pre):]
        changed = True
        while changed and rem != ni:
            changed = False
            for suf in _BLAND:
                if rem != suf and rem.endswith(suf):
                    rem = rem[:-len(suf)]
                    changed = True
        if rem == ni:
            return False, "echoes identifier '%s'" % ident
    words = re.findall(r"[A-Za-z']+", t)
    if len(t) < 12 or len(words) < 3:
        return False, "too short to carry meaning"
    return True, ""


def assessed(v):
    """True if a documentation field has been deliberately filled.
    None/""/[]/{} are unassessed; sentinel strings and real content count."""
    if v is None:
        return False
    if isinstance(v, str):
        return v.strip() != ""
    if isinstance(v, (list, dict)):
        return len(v) > 0
    return True


def ev(address=None, function=None, callsite=None, notes=None,
       status="confirmed", type_="firmware",
       binary=DEFAULT_BINARY, build=DEFAULT_BUILD):
    """Construct a schema-conformant evidence record."""
    d = {"type": type_, "binary": binary, "build": build, "status": status}
    if function:
        d["function"] = function
    if address:
        d["address"] = address
    if callsite:
        d["callsite"] = callsite
    if notes:
        d["notes"] = notes
    return d


def ev_key(e):
    return (e.get("type"), e.get("binary"), e.get("build"),
            e.get("function"), e.get("address"), e.get("callsite"))


def merge_evidence(existing, additions):
    """Append evidence records not already present (dedupe by key)."""
    seen = {ev_key(e) for e in existing}
    for e in additions:
        if ev_key(e) not in seen:
            existing.append(e)
            seen.add(ev_key(e))
    return existing


# ---------------------------------------------------------------- loading

def load_json(path):
    with open(path) as f:
        return json.load(f)


def save_json(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(obj, f, indent=2, sort_keys=False)
        f.write("\n")


def service_key(svc):
    """Services are keyed by control path (names are not unique:
    two ConnectionManager services exist)."""
    return svc["control_path"]


def service_label(svc):
    return "%s (%s)" % (svc.get("name", "?"), svc.get("control_path", "?"))


def iter_actions(doc):
    """Yield (svc_path, svc_doc, action_name, action_doc)."""
    for path, svc in (doc.get("services") or {}).items():
        for name, act in (svc.get("actions") or {}).items():
            yield path, svc, name, act


def iter_args(action_doc):
    """Yield (arg_name, arg_doc, direction)."""
    for name, a in (action_doc.get("inputs") or {}).items():
        yield name, a, "in"
    for name, a in (action_doc.get("outputs") or {}).items():
        yield name, a, "out"


def fault_sites_of(action_doc):
    return [f.get("site") for f in (action_doc.get("fault_sites") or [])
            if f.get("site")]


# ------------------------------------------------- completeness rules

def arg_issues(name, arg):
    """List of human-readable gaps; empty list = semantically complete."""
    issues = []
    ok, why = is_meaningful(arg.get("description"), name)
    if not ok:
        issues.append("description (%s)" % why)
    if arg.get("status") == "unresolved":
        issues.append("status unresolved")
    if arg.get("required") not in (True, False, "conditional"):
        issues.append("required/optional not assessed")
    for fld in ("semantic_type", "format", "accepted_values", "range",
                "special_values", "default", "validation", "unit"):
        if not assessed(arg.get(fld)):
            issues.append("%s not assessed" % fld)
    return issues


def _err_entry_complete(e):
    """An error entry is complete if it is either resolved (meaningful
    meaning + at least one complete condition) or explicitly documented
    as unresolved with proven/unknown filled and evidence attached."""
    if e.get("status") == "unresolved":
        u = e.get("unresolved") or {}
        return (assessed(u.get("proven")) and assessed(u.get("unknown"))
                and assessed(e.get("evidence")))
    if not is_meaningful(e.get("meaning"))[0]:
        return False
    conds = e.get("conditions") or []
    if not conds:
        return False
    for c in conds:
        if not is_meaningful(c.get("description"))[0]:
            return False
        if not assessed(c.get("evidence")):
            return False
    return True


def _fault_coverage(action):
    """Return (uncovered_sites, sites_with_incomplete_entries)."""
    entries = action.get("errors") or []
    uncovered, incomplete = [], []
    for f in action.get("fault_sites") or []:
        site = f.get("site")
        if not site:
            continue
        matching = [e for e in entries
                    if site in (e.get("fault_sites") or [])]
        if not matching:
            uncovered.append(site)
        elif not any(_err_entry_complete(e) for e in matching):
            incomplete.append(site)
    return uncovered, incomplete


def action_issues(name, act):
    issues = []
    ok, why = is_meaningful(act.get("description"), name)
    if not ok:
        issues.append("action description (%s)" % why)
    if act.get("status") == "unresolved":
        issues.append("action status unresolved")
    vis = act.get("visibility")
    if vis == "unknown" or not vis:
        issues.append("visibility not classified")
    elif vis == "hidden":
        ok, why = is_meaningful(act.get("reachability"))
        if not ok:
            issues.append("hidden action lacks reachability (%s)" % why)
    for an, arg, direction in iter_args(act):
        for i in arg_issues(an, arg):
            issues.append("%s %s: %s" % (direction, an, i))
    uncovered, incomplete = _fault_coverage(act)
    for s in uncovered:
        issues.append("fault site %s has no error entry" % s)
    for s in incomplete:
        issues.append("fault site %s error entry incomplete" % s)
    for fld in ("requirements", "state_dependencies", "side_effects",
                "events_triggered", "state_transitions", "return_behavior",
                "validation"):
        if not assessed(act.get(fld)):
            issues.append("%s not assessed" % fld)
    if not assessed(act.get("evidence")):
        issues.append("no evidence records")
    return issues


def service_issues(svc):
    issues = []
    ok, why = is_meaningful(svc.get("description"), svc.get("name"))
    if not ok:
        issues.append("description (%s)" % why)
    if svc.get("status") == "unresolved":
        issues.append("status unresolved")
    avail = svc.get("availability") or {}
    ok, why = is_meaningful(avail.get("notes"))
    if not ok:
        issues.append("availability notes (%s)" % why)
    if not assessed(svc.get("evidence")):
        issues.append("no evidence records")
    return issues


def capability_issues(key, cap):
    issues = []
    ok, why = is_meaningful(cap.get("description"), key)
    if not ok:
        issues.append("description (%s)" % why)
    ok, why = is_meaningful(cap.get("effect"))
    if not ok:
        issues.append("effect (%s)" % why)
    if cap.get("status") == "unresolved":
        issues.append("status unresolved")
    return issues


def internal_fn_issues(addr, fn):
    issues = []
    ok, why = is_meaningful(fn.get("description"), addr)
    if not ok:
        issues.append("description (%s)" % why)
    ok, why = is_meaningful(fn.get("why_external"))
    if not ok:
        issues.append("why_external (%s)" % why)
    if fn.get("status") == "unresolved":
        issues.append("status unresolved")
    return issues


def candidate_issues(func, cand):
    issues = []
    ok, why = is_meaningful(cand.get("assessment"), func)
    if not ok:
        issues.append("assessment (%s)" % why)
    if cand.get("status") == "unresolved":
        issues.append("status unresolved")
    return issues


def statevar_issues(name, var):
    issues = []
    ok, why = is_meaningful(var.get("description"), name)
    if not ok:
        issues.append("description (%s)" % why)
    if not assessed(var.get("data_type")):
        issues.append("data_type not assessed")
    if var.get("evented") not in (True, False):
        issues.append("evented not assessed")
    if var.get("status") == "unresolved":
        issues.append("status unresolved")
    return issues


def evidence_errors(e, where):
    """Structural validation of one evidence record."""
    errs = []
    if not isinstance(e, dict):
        return ["%s: evidence not an object" % where]
    if e.get("type") not in EVIDENCE_TYPES:
        errs.append("%s: bad evidence type %r" % (where, e.get("type")))
    if e.get("status") not in STATUSES:
        errs.append("%s: bad evidence status %r" % (where, e.get("status")))
    if not (e.get("address") or e.get("callsite") or e.get("function")
            or e.get("notes")):
        errs.append("%s: evidence record carries no locator" % where)
    return errs
