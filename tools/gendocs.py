#!/usr/bin/env python3
"""
gendocs.py -- Markdown reference generator for the anacapad SOAP database.

Pipeline:

    documentation.json -> genmodel.normalize() -> Model IR
                       -> genmodel.qa()        -> loud consistency gate
                       -> render()             -> reference/*.md

Nothing in this file touches the raw JSON tree; all output is rendered
from the normalized IR so uncertainty states (confirmed / strong /
inferred / unresolved), bounded unknowns, removed/stub actions and
firmware differences survive into the generated docs unchanged.

Usage:
    python3 tools/gendocs.py                      # write reference/
    python3 tools/gendocs.py --qa-only            # IR + QA, no output
    python3 tools/gendocs.py --dump-ir FILE       # also dump normalized IR
"""
import argparse
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import doclib
import genmodel

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_OUT = os.path.join(ROOT, "reference")

STATUS_BADGE = {"confirmed": "`confirmed`", "strong": "`strong`",
                "inferred": "`inferred`", "unresolved": "`unresolved`"}


# --------------------------------------------------------------------------
# small rendering helpers
# --------------------------------------------------------------------------

def _e(text):
    """Escape a scalar for inline markdown."""
    if text is None:
        return ""
    return _esc(str(text)).replace("|", "\\|").replace("\n", " ").strip()


def _esc(text):
    """Prevent decompiler annotations like v[+0x2c](impl, ...) from being
    parsed as markdown links."""
    return text.replace("[", "\\[").replace("]", "\\]")


def _para(text):
    if text is None:
        return ""
    return _esc(str(text)).strip()


def _status(s):
    return STATUS_BADGE.get(s, "`%s`" % s if s else "_unassessed_")


def _sentinel(v):
    return v if v else ""


def _fmt_val(v):
    """Render accepted_values / special_values / range compactly."""
    if v is None:
        return ""
    if isinstance(v, list):
        return ", ".join("`%s`" % _e(x) for x in v)
    if isinstance(v, dict):
        if set(v) == {"min", "max"} or {"min", "max"} <= set(v):
            return "%s .. %s" % (v.get("min"), v.get("max"))
        return "; ".join("`%s` = %s" % (_e(k), _e(x)) for k, x in v.items())
    return _e(v)


def _req(v):
    return {True: "yes", False: "optional"}.get(v, _e(v))


def _ev_list(ev, out, indent=""):
    for e in ev or []:
        note = (" — " + _e(e.notes)) if e.notes else ""
        out.append("%s- %s%s" % (indent, _e(e.ref()), note))


def _ev_details(ev, out, title="Evidence"):
    if not ev:
        return
    out.append("<details><summary>%s (%d)</summary>" % (title, len(ev)))
    out.append("")
    _ev_list(ev, out)
    out.append("")
    out.append("</details>")
    out.append("")


def _block(out, title, b, level=4):
    """Render a SemanticBlock (or bare value) as a headed section."""
    if b is None:
        return
    if isinstance(b, genmodel.SemanticBlock):
        body = []
        if b.text:
            body.append(_para(b.text))
        for k, v in b.extra.items():
            if v is None:
                continue
            if isinstance(v, list):
                body.append("**%s:**" % k.replace("_", " "))
                for it in v:
                    body.append("- %s" % _e(it))
            elif isinstance(v, dict):
                body.append("**%s:**" % k.replace("_", " "))
                for kk, vv in v.items():
                    body.append("- `%s`: %s" % (_e(kk), _e(vv)))
            else:
                body.append("**%s:** %s" % (k.replace("_", " "), _e(v)))
        if not body:
            return
        heading = "%s %s" % ("#" * level, title)
        if b.status:
            heading += " " + _status(b.status)
        out.append(heading)
        out.append("")
        out.extend(body)
        if b.evidence:
            _ev_details(b.evidence, out)
        out.append("")
    elif isinstance(b, list):
        items = [x for x in b if isinstance(x, genmodel.SemanticBlock)]
        if not items:
            return
        out.append("%s %s" % ("#" * level, title))
        out.append("")
        for it in items:
            out.append("- %s" % _para(it.text))
        out.append("")
    else:
        out.append("%s %s" % ("#" * level, title))
        out.append("")
        out.append(_para(b))
        out.append("")


def _table(out, header, rows):
    out.append("| " + " | ".join(header) + " |")
    out.append("|" + "|".join("---" for _ in header) + "|")
    for r in rows:
        out.append("| " + " | ".join(r) + " |")
    out.append("")


def _generic(out, obj, depth=0):
    """Render an arbitrary dict/list primitive block compactly."""
    if isinstance(obj, str):
        if obj.strip():
            out.append(_para(obj))
        return
    if isinstance(obj, dict):
        for k, v in obj.items():
            if v is None or k == "client_summary":
                continue
            if isinstance(v, dict):
                out.append("- **%s:**" % _e(k))
                sub = []
                _generic(sub, v, depth + 1)
                out.extend("  " + s for s in sub)
            elif isinstance(v, list):
                if all(not isinstance(x, (dict, list)) for x in v):
                    if len(v) > 20:
                        out.append("- **%s** (%d):" % (_e(k), len(v)))
                        out.append("")
                        out.append("  ```")
                        out.append("  " + ", ".join(_e(x) for x in v))
                        out.append("  ```")
                    else:
                        out.append("- **%s:** %s" % (
                            _e(k), ", ".join("`%s`" % _e(x)
                                             for x in v)))
                else:
                    sub = []
                    _generic(sub, v, depth + 1)
                    if sub:
                        out.append("- **%s:**" % _e(k))
                        out.extend("  " + s for s in sub)
            else:
                out.append("- **%s:** %s" % (_e(k), _e(v)))
    elif isinstance(obj, list):
        for v in obj:
            if isinstance(v, dict):
                # inline small flat dicts: "- a: 1, b: 2"
                flat = all(not isinstance(x, (dict, list))
                           for x in v.values())
                if flat and len(v) <= 8:
                    out.append("- " + ", ".join("%s: %s" % (_e(k), _e(x))
                                                for k, x in v.items()
                                                if x is not None))
                else:
                    sub = []
                    _generic(sub, v, depth + 1)
                    out.append("-")
                    out.extend("  " + s for s in sub)
            elif isinstance(v, list):
                sub = []
                _generic(sub, v, depth + 1)
                out.extend(sub)
            else:
                out.append("- %s" % _e(v))


# --------------------------------------------------------------------------
# index
# --------------------------------------------------------------------------

def render_index(m):
    out = ["# anacapad SOAP/UPnP reference",
           "",
           "Binary `%s`, build `%s` — model-9 (Playbar/limelight). "
           "Generated from the frozen canonical static-analysis dataset "
           "(`docs/documentation.json`); no runtime verification was "
           "performed. The binary implementation is the ground truth "
           "throughout." % (os.path.basename(str(m.meta.get("binary"))),
                            m.meta.get("build")),
           "",
           "## Authoritative counts",
           ""]
    c = m.counts
    decl = m.meta.get("counts") or {}
    rows = []
    labels = [
        ("device_advertised", "device-advertised",
         "SCPD-defined actions on device-description serviceList services"),
        ("scpd_defined", "SCPD-defined",
         "actions declared in shipped SCPD documents"),
        ("binary_dispatched", "binary-dispatched",
         "canonical records resolving to a binary dispatch path"),
        ("implemented_actions", "implemented",
         "dispatched to a real implementation (excludes stubs)"),
        ("removed_stale", "removed/stale",
         "SCPD-defined but dispatch removed or replaced by a 401 stub"),
        ("internal_or_hidden_callable", "internal / hidden-callable",
         "callable by action name but not SCPD-advertised"),
        ("canonical_action_records", "canonical action records",
         "all action objects in the dataset"),
    ]
    for key, label, fallback in labels:
        d = decl.get(key) or {}
        definition = d.get("definition", fallback) if isinstance(d, dict) \
            else fallback
        computed = getattr(c, key)
        extra = ""
        if key in ("scpd_defined", "device_advertised", "removed_stale"):
            nc = (decl.get("removed_stale") or {}).get("undispatched")
            if nc:
                extra = " (incl. %d without canonical records)" % nc
        rows.append(["**%s**" % label, "%d%s" % (computed + (nc or 0)
                                                 if extra else computed,
                                                 extra),
                     _e(definition)])
    rows.append(["unique action names", str(c.unique_action_names),
                 "some names recur across services"])
    _table(out, ["Count", "Value", "Definition"], rows)
    out += ["## Confidence vocabulary", ""]
    term = m.meta.get("terminology") or {}
    if term:
        for k, v in term.items():
            out.append("- **%s** — %s" % (_e(k), _e(v)))
        out.append("")
    out += ["## Services", ""]
    rows = []
    for s in m.services:
        impl = sum(1 for a in s.actions.values() if a.is_implemented)
        stub = len(s.actions) - impl
        desc = "%d" % len(s.actions)
        if stub:
            desc += " (%d stub)" % stub
        rows.append(["[%s](services/%s.md)" % (s.name, s.slug),
                     "`%s`" % s.control_path, _e(s.visibility), desc,
                     _status(s.status)])
    _table(out, ["Service", "Control path", "Visibility", "Actions",
                 "Status"], rows)
    out += ["## Sections", "",
            "- [Architecture](architecture.md) — routing, dispatch, request "
            "lifecycle, shared subsystems",
            "- [Availability matrix](availability-matrix.md) — the full "
            "action-by-action surface",
            "- [State variables](state-variables.md) — evented and argument "
            "type variables",
            "- [Events](events.md) — GENA/LastChange and WSS eventing",
            "- [Errors](errors.md) — SOAP fault wire format and code "
            "vocabulary",
            "- [URI formats](uri-formats.md) — URI scheme grammars",
            "- [Payload formats](payload-formats.md) — opaque field/payload "
            "grammars",
            "- [HTTP API](http-api.md) — non-SOAP HTTP endpoints and "
            "diagnostics",
            "- [Subsystems](subsystems.md) — non-SOAP protocols and "
            "engines with coverage levels",
            "- [Firmware differences](firmware-differences.md) — "
            "cross-build/cross-model deltas",
            ""]
    return "\n".join(out)


# --------------------------------------------------------------------------
# architecture
# --------------------------------------------------------------------------

_SOAP_PRIM_KEYS = [
    "soap_fault_wire_format", "soap_fault_code_vocabulary",
    "soap_client", "soap_param_redaction", "upnp_client_stack",
    "upnp_eventing_impl", "upnp_genaclient", "gena_eventing",
    "subscription_manager", "wss_event_vocabulary",
    "internal_event_bus", "device_description_template", "svcmanifest",
    "xml_parser", "mega_impl_object", "svc_array",
    "composite_subobject_interfaces", "native_protocols",
    "hwmessagelib", "wifi_sonosnet", "bt_sbc", "ssdp_discovery",
    "ssdp_signed_msearch", "proprietary_headers",
]


def render_architecture(m):
    out = ["# Architecture", ""]
    rt = m.routing or {}
    routers = rt.get("routers") or {}
    out += ["## Routing", ""]
    rows = []
    for addr, r in routers.items():
        rows.append(["`%s`" % addr, _e(r.get("kind")),
                     str(r.get("n_records", ""))])
    _table(out, ["Router", "Kind", "Records"], rows)
    for addr, r in routers.items():
        recs = r.get("records") or []
        if not recs:
            continue
        out.append("### `%s` records" % addr)
        out.append("")
        rows = []
        for rec in recs:
            en = rec.get("enabled") or {}
            rows.append(["`%s`" % rec.get("path"), _e(rec.get("name")),
                         "`%s`" % _e(rec.get("cap_flags")),
                         "%s (`%s`)" % (_e(en.get("kind")),
                                        _e(en.get("raw_expr")))])
        _table(out, ["Path", "Service", "Cap flags", "Enabled gate"], rows)
    if rt.get("router_chain"):
        out.append("### Router chain")
        out.append("")
        for link in rt["router_chain"]:
            out.append("- `%s` → `%s` (at `%s`)" % (link.get("from"),
                                                  link.get("to"),
                                                  link.get("at")))
        out.append("")

    if m.request_vtable:
        out += ["## Request object vtable", "",
                "Every action wrapper interacts with the request through "
                "these vfunc slots (confidence: `%s`)." % _e(
                    m.request_vtable.get("confidence")),
                ""]
        rows = [["`%s`" % k, _e(v)] for k, v in m.request_vtable.items()
                if k != "confidence"]
        _table(out, ["Slot", "Purpose"], rows)

    if m.capabilities:
        out += ["## Capability fields", "",
                "Object fields the firmware reads to gate behavior. "
                "Read/write sites are static evidence; the *predicate* each "
                "gates is noted honestly where unresolved.", ""]
        rows = []
        for off, cap in m.capabilities.items():
            rows.append(["`%s`" % off, _e(cap.effect), _status(cap.status),
                         str(len(cap.loads))])
        _table(out, ["Field", "Effect", "Status", "Load sites"], rows)
        for off, cap in m.capabilities.items():
            if cap.affected_services or cap.notes:
                out.append("### `%s`" % off)
                out.append("")
                if cap.affected_services:
                    out.append("Affected services: %s"
                               % ", ".join(_e(x) for x in
                                           cap.affected_services))
                    out.append("")
                if cap.notes:
                    out.append(_para(cap.notes))
                    out.append("")

    if m.internal_functions:
        out += ["## Internal functions", ""]
        rows = []
        for addr, f in m.internal_functions.items():
            rows.append(["`%s`" % addr, _e(f.get("role")),
                         _e(f.get("description"))[:160]])
        _table(out, ["Address", "Role", "Description"], rows)

    if m.dispatch_candidates:
        out += ["## Dispatch candidates", "",
                "Functions that looked like dispatchers, with the verdict "
                "each received.", ""]
        for addr, c in m.dispatch_candidates.items():
            out.append("### `%s`" % addr)
            out.append("")
            if c.get("assessment"):
                out.append(_para(c["assessment"]))
                out.append("")
            if c.get("compares"):
                out.append("Compares: %s" % ", ".join(
                    "`%s`" % _e(x.get("str"))
                    for x in c["compares"] if x.get("str")))
                out.append("")

    out += ["## Shared subsystems", "",
            "Reusable primitives recovered from the binary — prefer these "
            "over re-reading per-action detail.", ""]
    sp = m.shared_primitives
    for k in _SOAP_PRIM_KEYS:
        if k not in sp:
            continue
        v = sp[k]
        out.append("### `%s`" % k)
        out.append("")
        if isinstance(v, dict):
            _generic(out, v)
        else:
            out.append(_para(v))
        out.append("")
    others = sorted(k for k in sp if k not in _SOAP_PRIM_KEYS)
    if others:
        out.append("### Other recovered subsystems")
        out.append("")
        out.append("Additional primitives recorded in the database "
                   "(see `documentation.json` `shared_primitives`):")
        out.append("")
        out.append(", ".join("`%s`" % k for k in others))
        out.append("")
    return "\n".join(out)


# --------------------------------------------------------------------------
# service pages
# --------------------------------------------------------------------------

def _is_noise(v):
    """Sentinel or near-sentinel value that adds no information."""
    if v is None:
        return True
    if isinstance(v, str):
        s = v.strip().lower()
        return s in doclib.SENTINELS or s.startswith("none") \
            or s.startswith("n/a")
    return False


def _arg_rows(args):
    rows = []
    for n, a in args.items():
        st = _e(a.semantic_type) or _e(a.format) or ""
        vals = _fmt_val(a.accepted_values)
        rng = _fmt_val(a.range)
        parts = [x for x in (vals, rng)
                 if x and not _is_noise(x)]
        uniq = []
        for x in parts:
            if x not in uniq:
                uniq.append(x)
        rng = " / ".join(uniq) or _e(vals) or _e(rng) or "—"
        rows.append(["`%s`" % n, st, _req(a.required), rng,
                     _e(a.default) or "—"])
    return rows


def _arg_details(out, args):
    """Per-arg notes — only where they add information beyond the table."""
    wrote = False
    for n, a in args.items():
        extras = []
        if not _is_noise(a.unit):
            extras.append("unit: %s" % _e(a.unit))
        if not _is_noise(a.special_values):
            extras.append("special values: %s" % _fmt_val(a.special_values))
        if not _is_noise(a.validation) \
                and _para(a.validation) != _para(a.description):
            extras.append("validation: %s" % _para(a.validation))
        if a.notes and _para(a.notes) != _para(a.description):
            extras.append(_para(a.notes))
        p = a.primitive
        if p and p.buf_cap:
            extras.append("buffer cap: `%s`" %
                          (hex(p.buf_cap) if isinstance(p.buf_cap, int)
                           else _e(p.buf_cap)))
        if not extras:
            continue
        wrote = True
        out.append("- **`%s`** — %s" % (n, _e(a.description)
                                        or "(no description)"))
        for x in extras:
            out.append("  - %s" % x)
    if wrote:
        out.append("")


def _render_errors(out, errors, level=4, heading="Errors"):
    if not errors:
        return
    if heading:
        out.append("%s %s" % ("#" * level, heading))
        out.append("")
    for e in errors:
        out.append("**`%s`** %s" % (e.code_label, _status(e.status)))
        out.append("")
        if e.meaning:
            out.append(_para(e.meaning))
            out.append("")
        for cnd in e.conditions:
            out.append("- %s" % _para(cnd.description))
        if e.conditions:
            out.append("")
        if e.unresolved:
            out.append("")
            u = e.unresolved
            if u.get("proven"):
                out.append("**Bounded unknown — proven:** %s"
                           % _para(u["proven"]))
            if u.get("unknown"):
                out.append("**Bounded unknown — unresolved:** %s"
                           % _para(u["unknown"]))
            out.append("")
        if e.notes:
            out.append(_para(e.notes))
            out.append("")
    out.append("")


def render_action(a):
    out = ["### `%s`" % a.name, ""]
    badges = ["visibility `%s`" % a.visibility,
              "reachability `%s`" % a.reachability,
              "confidence %s" % _status(a.status),
              "dispatch `%s`" % a.dispatch_kind]
    if a.is_stub:
        badges.append("**removed/stub — faults 401**")
    out.append(" · ".join(badges))
    out.append("")
    if a.summary:
        out.append(_para(a.summary))
        out.append("")
    if a.description:
        out.append("**Technical description:** %s" % _para(a.description))
        out.append("")
    if a.inputs:
        out.append("#### Inputs")
        out.append("")
        _table(out, ["Name", "Type", "Required", "Values / range",
                     "Default"], _arg_rows(a.inputs))
        _arg_details(out, a.inputs)
    if a.outputs:
        out.append("#### Outputs")
        out.append("")
        _table(out, ["Name", "Type", "Values / range"],
               [[r[0], r[1], r[3]] for r in _arg_rows(a.outputs)])
        _arg_details(out, a.outputs)
    _block(out, "Validation", a.validation)
    _block(out, "Requirements / preconditions", a.requirements)
    _block(out, "State dependencies", a.state_dependencies)
    if a.side_effects:
        out.append("#### Side effects")
        out.append("")
        for se in a.side_effects:
            if isinstance(se, genmodel.SemanticBlock):
                out.append("- %s" % _para(se.text))
            else:
                out.append("- %s" % _e(se))
        out.append("")
    _block(out, "State transitions", a.state_transitions)
    _block(out, "Events", a.events_triggered)
    _block(out, "Return behavior", a.return_behavior)
    _render_errors(out, a.errors)
    if a.unresolved:
        out.append("#### Bounded unknowns")
        out.append("")
        _generic(out, a.unresolved)
        out.append("")
    if a.firmware_differences:
        out.append("#### Firmware differences")
        out.append("")
        for x in a.firmware_differences:
            out.append("- %s" % _e(x))
        out.append("")
    if a.notes:
        out.append("#### Notes")
        out.append("")
        out.append(_para(a.notes))
        out.append("")
    impl = a.implementation
    det = []
    if a.handler:
        det.append("- handler `%s`" % a.handler)
    if a.dispatch:
        if a.dispatch.entry_addr:
            det.append("- dispatch entry `%s`%s"
                       % (a.dispatch.entry_addr,
                          " (voff `%s`)" % _e(a.dispatch.voff)
                          if a.dispatch.voff is not None else ""))
    if impl:
        if impl.impl_function:
            det.append("- impl `%s` (vfunc `%s`)"
                       % (impl.impl_function, _e(impl.impl_vfunc)))
        if impl.engine_status:
            det.append("- engine resolution `%s` → `%s`"
                       % (_e(impl.engine_status), _e(impl.engine_impl_func)))
        for c in impl.calls:
            det.append("- impl call `%s` obj `%s` slot `%s` arg4 `%s`"
                       % (_e(c.get("site")), _e(c.get("obj")),
                          _e(c.get("slot")), _e(c.get("arg4"))))
        for c in impl.req_vcalls:
            det.append("- req vcall `%s` slot `%s` (%s)"
                       % (_e(c.get("site")), _e(c.get("slot")),
                          _e(c.get("purpose"))))
    if impl and impl.description:
        det.append("- %s" % _e(impl.description))
    if impl and impl.notes:
        det.append("- %s" % _e(impl.notes))
    if a.implementation_notes:
        det.append("- %s" % _e(a.implementation_notes))
    if det or a.evidence:
        out.append("<details><summary>Implementation & "
                   "reverse-engineering evidence</summary>")
        out.append("")
        if det:
            out.extend(det)
            out.append("")
        _ev_list(a.evidence, out)
        out.append("")
        out.append("</details>")
        out.append("")
    return "\n".join(out)


def render_service(s):
    out = ["# `%s` — `%s`" % (s.name, s.control_path), ""]
    out.append("**visibility** `%s` · **status** %s"
               % (s.visibility, _status(s.status)))
    out.append("")
    if s.summary:
        out.append(_para(s.summary))
        out.append("")
    if s.description:
        out.append("**Technical description:** %s" % _para(s.description))
        out.append("")
    if s.availability and (s.availability.notes or s.availability.status
                           or s.availability.enabled_source):
        av = s.availability
        out += ["## Availability", ""]
        if av.status:
            out.append("- status %s" % _status(av.status))
        if av.cap_flags:
            out.append("- capability flags `%s`" % _e(av.cap_flags))
        if av.enabled_source:
            es = av.enabled_source
            out.append("- enabled gate: `%s` at `%s` (%s)"
                       % (_e(es.get("raw_expr")), _e(es.get("store_pc")),
                          _e(es.get("kind"))))
        if av.notes:
            out.append("- %s" % _para(av.notes))
        out.append("")
    if s.visibility_note:
        out.append("**Visibility note:** %s" % _para(s.visibility_note))
        out.append("")
    if s.dispatcher or s.registration:
        out += ["## Dispatch", ""]
        if s.registration:
            reg = s.registration
            out.append("- router `%s`, cap flags `%s`"
                       % (_e(reg.get("router")), _e(reg.get("cap_flags"))))
        if s.dispatcher:
            d = s.dispatcher
            out.append("- dispatcher `%s` kind `%s`"
                       % (_e(d.get("addr")), _e(d.get("kind"))))
            if d.get("action_table"):
                out.append("- action table `%s`" % d["action_table"])
        out.append("")
    n_impl = sum(1 for a in s.actions.values() if a.is_implemented)
    out += ["## Actions", ""]
    rows = []
    for n, a in s.actions.items():
        errs = ", ".join(sorted({str(e.code) for e in a.errors
                                 if e.code is not None},
                                key=int))
        rows.append(["`%s`" % n, _e(a.visibility), _e(a.reachability),
                     _status(a.status), _e(a.dispatch_kind), errs])
    _table(out, ["Action", "Visibility", "Reachability", "Confidence",
                 "Dispatch", "Error codes"], rows)
    for a in s.actions.values():
        out.append(render_action(a))
    if s.state_variables:
        out += ["## State variables", ""]
        rows = []
        for n, sv in s.state_variables.items():
            rows.append(["`%s`" % n, _e(sv.data_type),
                         "yes" if sv.evented else "no",
                         _e(sv.description)[:120]])
        _table(out, ["Name", "Type", "Evented", "Description"], rows)
    if s.events:
        out += ["## Events", ""]
        ev = s.events
        for attr, label in [("mechanism", "Mechanism"),
                            ("namespace", "Namespace"),
                            ("lastchange_var", "LastChange variable"),
                            ("lastchange_template", "LastChange template"),
                            ("no_template_note", None),
                            ("wss_note", None)]:
            v = getattr(ev, attr)
            if v:
                out.append("- %s%s" % (("**%s:** " % label) if label else "",
                                       _para(v)))
        if ev.wss_event_names:
            out.append("- **WSS event names:** %s" % ", ".join(
                "`%s`" % x for x in ev.wss_event_names))
        if ev.extra:
            _generic(out, ev.extra)
        out.append("")
    if s.errors:
        out += ["## Dispatcher-level errors", ""]
        _render_errors(out, s.errors, heading=None)
    if s.impl_return_pattern:
        out += ["## Implementation return pattern", ""]
        out.append(_para(s.impl_return_pattern))
        out.append("")
    if s.notes:
        out += ["## Notes", ""]
        if isinstance(s.notes, list):
            for n_ in s.notes:
                out.append("- %s" % _para(n_))
        else:
            out.append(_para(s.notes))
        out.append("")
    extra_render = {k: v for k, v in s.extra.items() if v}
    if extra_render:
        out += ["## Additional records", ""]
        for k, v in extra_render.items():
            out.append("### `%s`" % k)
            out.append("")
            _generic(out, v)
            out.append("")
    if s.impl_files:
        out.append("Implementation sources (recovered): %s"
                   % ", ".join("`%s`" % f for f in s.impl_files))
        out.append("")
    _ev_details(s.evidence, out, "Service evidence")
    return "\n".join(out)


# --------------------------------------------------------------------------
# topic pages
# --------------------------------------------------------------------------

def render_state_variables(m):
    out = ["# State variables", "",
           "Evented variables carry `<NAME val=\"...\"/>` elements inside "
           "`LastChange` documents; `A_ARG_TYPE_*` variables are SCPD "
           "argument-type declarations, not device state.", ""]
    allsv = m.all_state_variables()
    rows = []
    for k in sorted(allsv):
        sv = allsv[k]
        rows.append(["`%s`" % k, _e(sv.service), _e(sv.data_type),
                     ("yes" if sv.evented else "no")
                     if sv.evented is not None else "?",
                     _status(sv.status)])
    _table(out, ["Variable", "Service", "Type", "Evented", "Status"], rows)
    for k in sorted(allsv):
        sv = allsv[k]
        if not (sv.description or sv.accepted_values or sv.range
                or sv.related_actions or sv.notes
                or getattr(sv, "client_summary", None)):
            continue
        out.append("### `%s`" % k)
        out.append("")
        if getattr(sv, "client_summary", None):
            out.append(_para(sv.client_summary))
            out.append("")
            out.append("**Technical description:**")
            out.append("")
        if sv.description:
            out.append(_para(sv.description))
            out.append("")
        if sv.accepted_values:
            out.append("- accepted values: %s" % _fmt_val(
                sv.accepted_values))
        if sv.range:
            out.append("- range: %s" % _fmt_val(sv.range))
        if sv.form:
            out.append("- form: `%s`" % _e(sv.form))
        if sv.related_actions:
            out.append("- related actions: %s" % ", ".join(
                "`%s`" % r for r in sv.related_actions))
        if sv.notes:
            out.append("- %s" % _para(sv.notes))
        out.append("")
    return "\n".join(out)


def render_events(m):
    out = ["# Eventing", "",
           "UPnP GENA eventing plus the Sonos WSS subscription surface.", ""]
    for s in m.services:
        ev = s.events
        if not ev:
            continue
        out.append("## `%s`" % s.name)
        out.append("")
        if ev.mechanism:
            out.append(_para(ev.mechanism))
            out.append("")
        for attr, label in [("namespace", "Namespace"),
                            ("lastchange_var", "LastChange variable"),
                            ("lastchange_template", "Template"),
                            ("no_template_note", None),
                            ("wss_note", None)]:
            v = getattr(ev, attr)
            if v:
                out.append("- %s%s" % (("**%s:** " % label) if label else "",
                                       _para(v)))
        if ev.wss_event_names:
            out.append("- **WSS events:** %s" % ", ".join(
                "`%s`" % x for x in ev.wss_event_names))
        if ev.extra:
            _generic(out, ev.extra)
        out.append("")
    sp = m.shared_primitives.get("wss_event_vocabulary")
    if sp:
        out += ["## WSS subscription registry", ""]
        _generic(out, {k: v for k, v in sp.items() if k != "names"})
        if sp.get("names"):
            out.append("")
            out.append("Event names: %s"
                       % ", ".join("`%s`" % x for x in sp["names"]))
        out.append("")
    ge = m.shared_primitives.get("gena_eventing")
    if ge:
        out += ["## GENA internals", ""]
        _generic(out, ge)
        out.append("")
    return "\n".join(out)


def render_errors(m):
    out = ["# Errors", ""]
    fw = m.shared_primitives.get("soap_fault_wire_format")
    if fw:
        out += ["## SOAP fault wire format", ""]
        if isinstance(fw, dict):
            if fw.get("format"):
                out.append("```xml\n%s\n```" % fw["format"])
            if fw.get("note"):
                out.append(_para(fw["note"]))
                out.append("")
        out.append("")
    vocab = m.shared_primitives.get("soap_fault_code_vocabulary")
    if vocab:
        out += ["## Fault code vocabulary", ""]
        _generic(out, vocab)
        out.append("")
    out += ["## Per-action error surface", ""]
    for s in m.services:
        rows = []
        for a in s.actions.values():
            for e in a.errors:
                rows.append(["`%s`" % a.name, "`%s`" % e.code_label,
                             _status(e.status), _e(e.meaning)[:140]])
        if s.errors:
            for e in s.errors:
                rows.append(["_(dispatcher)_", "`%s`" % e.code_label,
                             _status(e.status), _e(e.meaning)[:140]])
        if not rows:
            continue
        out.append("### `%s`" % s.name)
        out.append("")
        _table(out, ["Action", "Code", "Status", "Meaning"], rows)
    return "\n".join(out)


def render_formats(m, kind, title, blurb):
    out = ["# %s" % title, "", blurb, ""]
    src = m.uri_formats if kind == "uri" else m.payload_formats
    for k, f in sorted(src.items()):
        out.append("## `%s` %s" % (k, _status(f.status)))
        out.append("")
        if getattr(f, "client_summary", None):
            out.append(_para(f.client_summary))
            out.append("")
            out.append("**Technical description:**")
            out.append("")
        if f.description:
            out.append(_para(f.description))
            out.append("")
        if f.format:
            out.append("```\n%s\n```" % f.format)
            out.append("")
        if f.fields:
            out.append("Fields: %s"
                       % ", ".join("`%s`" % _e(x) for x in f.fields))
            out.append("")
        if f.used_by:
            out.append("Used by: %s"
                       % "; ".join(_e(x) for x in f.used_by))
            out.append("")
        if f.notes:
            out.append(_para(f.notes))
            out.append("")
        if f.extra:
            _generic(out, f.extra)
            out.append("")
        _ev_details(f.evidence, out)
    return "\n".join(out)


_HTTP_KEYS = [
    "http_status_endpoints", "device_account_endpoint",
    "http_chunked_strictness", "httpcache_manager", "http_range",
    "muse_authhelper", "muse_common", "diagnostic_manifest",
    "diagnostics", "proprietary_headers", "discovery_layer",
    "ssdp_discovery", "ssdp_signed_msearch", "upnp_cloud_tunnel",
    "soap_client", "websocket_impl", "cert_identity",
    "device_auth", "noncehandler", "circuitbreaker", "hls_radio",
    "cloud_request", "cloud_registration", "service_accounts",
    "device_registration", "assoctracker", "target_udn_routing",
    "http_extra_endpoints", "csrf_protection",
    "device_description_variants", "gena_internals",
    "didl_classes_ext", "protocol_info_full", "icy_metadata",
    "alert_engine", "household_psk_vocabulary",
    "replication_elements", "token_refresh_state_machine",
    "xml_schema_clusters", "internal_error_families",
    "system_property_keys", "internal_result_namespace",
    "smapi_capability_vocabulary", "albumart_proxy",
    "muse_route_verbs",
]


def render_http_api(m):
    out = ["# HTTP / non-SOAP surface", "",
           "Endpoints and HTTP-layer behaviors recovered from the binary "
           "outside the SOAP control path. All are static-analysis "
           "records.", ""]
    sp = m.shared_primitives
    for k in _HTTP_KEYS:
        if k not in sp:
            continue
        v = sp[k]
        out.append("## `%s`" % k)
        out.append("")
        if v.get("client_summary"):
            out.append(_para(v["client_summary"]))
            out.append("")
            out.append("**Technical description:**")
            out.append("")
        _generic(out, v)
        out.append("")
    return "\n".join(out)


def render_firmware(m):
    out = ["# Firmware / model differences", ""]
    meta = m.firmware_diff_meta
    if meta.get("note"):
        out += [_para(meta["note"]), ""]
    for k in ("matrix_method", "crossbuild_matrix_artifact"):
        if meta.get(k):
            out.append("- **%s:** %s" % (k, _e(meta[k])
                                         if isinstance(meta[k], str)
                                         else json.dumps(meta[k])[:400]))
    if meta.get("product_surface"):
        out += ["", "## Product surface", ""]
        _generic(out, meta["product_surface"])
    if meta.get("service_urn_matrix"):
        out += ["", "## Service-URN matrix", ""]
        _generic(out, meta["service_urn_matrix"])
    out += ["", "## Entries", ""]
    for e in m.firmware_differences:
        out.append("### %s" % _e(e.item))
        out.append("")
        if e.detail:
            out.append(_para(e.detail))
            out.append("")
        if e.builds:
            _table(out, ["Build", "State"],
                   [["`%s`" % b, _e(v)] for b, v in e.builds.items()])
        if e.extra:
            _generic(out, e.extra)
            out.append("")
    return "\n".join(out)


_STATUS_ORDER = {"absent": 0, "vocab": 1, "partial": 2,
                 "documented": 3}


def render_subsystems(m):
    out = ["# Non-SOAP subsystems", "",
           "Self-contained protocols/engines living in the same binary "
           "beside or below the UPnP layer. `absent` = no coverage, "
           "`vocab` = names/strings catalogued but semantics "
           "undecoded, `partial` = some real documentation exists. "
           "Evidence addresses are the rodata anchor strings.",
           ""]
    subs = sorted(m.subsystems.items(),
                  key=lambda kv: (_STATUS_ORDER.get(
                      kv[1].get("status"), 9), kv[0]))
    rows = [["`%s`" % n, "**%s**" % _e(s.get("status") or "?"),
             _e(s.get("summary") or "")]
            for n, s in subs]
    _table(out, ["Subsystem", "Coverage", "Summary"], rows)
    for n, s in subs:
        out += ["## `%s`" % n, ""]
        out.append("**coverage** `%s`" % _e(s.get("status") or "?"))
        out.append("")
        if s.get("client_summary"):
            out.append(_para(s["client_summary"]))
            out.append("")
        if s.get("summary"):
            out.append("**Technical description:**")
            out.append("")
            out.append(_para(s["summary"]))
            out.append("")
        if s.get("anchors"):
            out.append("- binary anchors: %s"
                       % ", ".join("`%s`" % _e(a)
                                   for a in s["anchors"]))
            out.append("")
        _generic(out, {k: v for k, v in s.items()
                       if k not in ("summary", "status", "anchors",
                                    "evidence")})
        _ev_details([genmodel.Evidence.from_raw(e)
                     for e in s.get("evidence") or []], out)
    return "\n".join(out)


def render_availability(m):
    out = ["# Availability matrix", "",
           "Every canonical action record. `advertised` services are in the "
           "served device-description `serviceList` (all except AudioIn); "
           "every canonical action is declared in its service's shipped "
           "SCPD. `stub` = dispatched to a reject-all fault (removed "
           "surface).",
           ""]
    decl = (m.meta.get("counts") or {})
    undisp = (decl.get("removed_stale") or {}).get("undispatched_actions")
    if undisp:
        out.append("In addition, %d SCPD-advertised actions have **no "
                   "dispatch record at all** (hard/soft removed): %s"
                   % (len(undisp), ", ".join("`%s`" % x for x in undisp)))
        out.append("")
    for s in m.services:
        out.append("## `%s` — `%s` (%s)" % (s.name, s.control_path,
                                            s.visibility))
        out.append("")
        rows = []
        for n, a in s.actions.items():
            flag = "stub" if a.is_stub else (
                "hidden-callable" if a.is_hidden_callable else "callable")
            rows.append(["`%s`" % n, _e(a.visibility), flag,
                         _status(a.status),
                         "`%s`" % (a.handler or "-")])
        _table(out, ["Action", "Visibility", "Wire status", "Confidence",
                     "Handler"], rows)
    return "\n".join(out)


# --------------------------------------------------------------------------
# driver
# --------------------------------------------------------------------------

def render_all(m, outdir):
    files = {"index.md": render_index(m),
             "architecture.md": render_architecture(m),
             "state-variables.md": render_state_variables(m),
             "events.md": render_events(m),
             "errors.md": render_errors(m),
             "uri-formats.md": render_formats(
                 m, "uri", "URI formats",
                 "URI scheme grammars recovered from literal tables and "
                 "parser call sites."),
             "payload-formats.md": render_formats(
                 m, "payload", "Payload formats",
                 "Opaque payload/field grammars recovered from sscanf/"
                 "printf templates and parser functions."),
             "http-api.md": render_http_api(m),
             "subsystems.md": render_subsystems(m),
             "firmware-differences.md": render_firmware(m),
             "availability-matrix.md": render_availability(m)}
    svc_dir = os.path.join(outdir, "services")
    os.makedirs(svc_dir, exist_ok=True)
    for s in m.services:
        files[os.path.join("services", "%s.md" % s.slug)] = \
            render_service(s)
    os.makedirs(outdir, exist_ok=True)
    written = []
    for rel, text in files.items():
        p = os.path.join(outdir, rel)
        with open(p, "w") as fh:
            fh.write(text if text.endswith("\n") else text + "\n")
        written.append(rel)
    return written


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--docs", default=doclib.DEFAULT_DOC)
    ap.add_argument("--api", default=doclib.DEFAULT_API)
    ap.add_argument("--out", default=DEFAULT_OUT)
    ap.add_argument("--qa-only", action="store_true")
    ap.add_argument("--dump-ir")
    args = ap.parse_args()

    doc = json.load(open(args.docs))
    ct_path = os.path.join(os.path.dirname(args.docs), "client_text.json")
    client_text = (json.load(open(ct_path))
                   if os.path.exists(ct_path) else None)
    model = genmodel.normalize(doc, client_text)

    api_total = None
    if os.path.exists(args.api):
        api = json.load(open(args.api))
        api_total = sum(len(s.get("actions") or [])
                        for s in api.get("services") or [])

    result = genmodel.qa(model, api_total)
    for w in result.warnings:
        print("WARNING: %s" % w)
    for e in result.errors:
        print("ERROR: %s" % e)
    if not result.ok:
        print("generation aborted: %d error(s)" % len(result.errors))
        return 1

    if args.dump_ir:
        def default(o):
            if isinstance(o, (set,)):
                return sorted(o)
            try:
                from dataclasses import is_dataclass
                if is_dataclass(o):
                    return {k: default(v) for k, v in vars(o).items()}
            except Exception:
                pass
            return str(o)
        json.dump(model, open(args.dump_ir, "w"), default=default, indent=1)
        print("wrote IR -> %s" % args.dump_ir)

    if not args.qa_only:
        written = render_all(model, args.out)
        print("wrote %d files under %s" % (len(written), args.out))
    print("QA: %d error(s), %d warning(s)"
          % (len(result.errors), len(result.warnings)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
