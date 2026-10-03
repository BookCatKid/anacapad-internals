#!/usr/bin/env python3
"""
gendocs.py -- Markdown reference generator for the anacapad internals database.

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


def _snip(text, limit=200):
    """Truncate at a word boundary with an ellipsis; never mid-word."""
    t = str(text or "").strip()
    if len(t) <= limit:
        return t
    cut = t[:limit].rsplit(" ", 1)[0].rstrip(",;:.")
    return cut + " ..."


def _pt(m, page, key):
    """Hand-authored client-facing prose for a page/section, from
    client_text.json 'pages'. Returns a paragraph string or None."""
    pages = getattr(m, "pages_client", {}) or {}
    v = (pages.get(page) or {}).get(key)
    return _para(v) if v else None


def _pt_add(m, out, page, key):
    t = _pt(m, page, key)
    if t:
        out += [t, ""]


def _generic_lines(obj, depth=0):
    buf = []
    _generic(buf, obj, depth)
    return buf


def _details(out, lines, summary="Technical details"):
    """Wrap technical content in a collapsible block (VitePress :::
    details container renders markdown inside)."""
    out.append("::: details %s" % summary)
    out.append("")
    out.extend(lines)
    out.append("")
    out.append(":::")
    out.append("")


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
        note = ("; " + _e(e.notes)) if e.notes else ""
        out.append("%s- %s%s" % (indent, _e(e.ref()), note))


def _ev_details(ev, out, title="Evidence"):
    if not ev:
        return
    out.append("::: details %s (%d)" % (title, len(ev)))
    out.append("")
    _ev_list(ev, out)
    out.append("")
    out.append(":::")
    out.append("")


def _block(out, title, b, level=4):
    """Render a SemanticBlock (or bare value) as a headed section."""
    if b is None:
        return
    if isinstance(b, genmodel.SemanticBlock):
        body = []
        if b.text:
            body.append(_para(b.text))
        for t in _todo_lines(b.todo):
            body.append("**TODO:** %s" % t)
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
    out = ["# anacapad internals", ""]
    _pt_add(m, out, "index", "intro")
    out += ["Binary `%s`, build `%s`, model-9 (Playbar/limelight). "
            "Generated from the frozen canonical static-analysis dataset "
            "(`docs/documentation.json`); no runtime verification was "
            "performed. The binary implementation is the ground truth "
            "throughout." % (os.path.basename(str(m.meta.get("binary"))),
                             m.meta.get("build")),
            "",
            "## Authoritative counts",
            ""]
    _pt_add(m, out, "index", "counts")
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
    out += ["## Sections", "",
            "- [Architecture](architecture.md): routing, dispatch, request "
            "lifecycle, shared subsystems",
            "- [SOAP / UPnP](soap/index.md): the seventeen services, "
            "state variables, eventing, errors, and wire grammars",
            "- [muse API](muse/index.md): the v1 REST surface, resources, "
            "outbound client, and spec streams",
            "- [HTTP layer](http/index.md): non-SOAP HTTP endpoints, "
            "discovery, auth, and outbound clients",
            "- [Subsystems](subsystems/index.md): non-SOAP protocols, "
            "engines, and on-device daemons",
            "- [Firmware differences](firmware-differences.md): "
            "cross-build/cross-model deltas",
            "- [Firmware artifacts](artifacts/index.md): every "
            "extractable file in the image, playable or downloadable",
            ""]
    return "\n".join(out)


def _service_table(m, link_prefix):
    rows = []
    for s in m.services:
        impl = sum(1 for a in s.actions.values() if a.is_implemented)
        stub = len(s.actions) - impl
        desc = "%d" % len(s.actions)
        if stub:
            desc += " (%d stub)" % stub
        rows.append(["[%s](%s%s.md)" % (s.name, link_prefix, s.slug),
                     "`%s`" % s.control_path, _e(s.visibility), desc])
    _table_rows = [["Service", "Control path", "Visibility", "Actions"],
                   rows]
    return _table_rows


def render_soap_index(m):
    out = ["# SOAP / UPnP", ""]
    _pt_add(m, out, "soap", "intro")
    out += ["## Services", ""]
    header, rows = _service_table(m, "")
    _table(out, header, rows)
    out += ["## In this section", "",
            "- [State variables](state-variables.md): evented and "
            "argument-type variables, one page per service",
            "- [Events](events.md): GENA/LastChange and WSS eventing",
            "- [Errors](errors.md): SOAP fault wire format and code "
            "vocabulary",
            "- [URI formats](uri-formats.md): URI scheme grammars",
            "- [Payload formats](payload-formats.md): opaque "
            "field/payload grammars",
            "- [Availability matrix](availability-matrix.md): the full "
            "action-by-action surface",
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
    "ssdp_signed_msearch", "proprietary_headers", "chirp_sdk",
]


def render_architecture(m):
    out = ["# Architecture", ""]
    _pt_add(m, out, "architecture", "intro")
    rt = m.routing or {}
    routers = rt.get("routers") or {}
    out += ["## Routing", ""]
    _pt_add(m, out, "architecture", "routing")
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
        for rec in recs:
            for t in _todo_lines(rec.get("todo")):
                out.append("- **TODO:** %s" % t)
    if rt.get("router_chain"):
        out.append("### Router chain")
        out.append("")
        for link in rt["router_chain"]:
            out.append("- `%s` → `%s` (at `%s`)" % (link.get("from"),
                                                  link.get("to"),
                                                  link.get("at")))
        out.append("")

    if m.request_vtable:
        out += ["## Request object vtable", ""]
        _pt_add(m, out, "architecture", "request_vtable")
        _details(out, ["Every action wrapper interacts with the request "
                       "through these vfunc slots."])
        for t in _todo_lines(m.request_vtable.get("todo")):
            out.append("- **TODO:** %s" % t)
        out.append("")
        rows = [["`%s`" % k, _e(v)] for k, v in m.request_vtable.items()
                if k != "todo"]
        _table(out, ["Slot", "Purpose"], rows)

    if m.capabilities:
        out += ["## Capability fields", ""]
        _pt_add(m, out, "architecture", "capability_fields")
        _details(out, ["Object fields the firmware reads to gate behavior. "
                       "Read/write sites are static evidence; the "
                       "*predicate* each gates is noted honestly where "
                       "unresolved."])
        rows = []
        for off, cap in m.capabilities.items():
            rows.append(["`%s`" % off, _e(cap.effect), str(len(cap.loads))])
        _table(out, ["Field", "Effect", "Load sites"], rows)
        for off, cap in m.capabilities.items():
            if cap.affected_services or cap.notes \
                    or getattr(cap, "todo", None):
                out.append("### `%s`" % off)
                out.append("")
                for t in _todo_lines(getattr(cap, "todo", None)):
                    out.append("- **TODO:** %s" % t)
                if cap.affected_services:
                    out.append("Affected services: %s"
                               % ", ".join(_e(x) for x in
                                           cap.affected_services))
                    out.append("")
                if cap.notes:
                    _details(out, [_para(cap.notes)])

    if m.internal_functions:
        out += ["## Internal functions", ""]
        _pt_add(m, out, "architecture", "internal_functions")
        rows = []
        for addr, f in m.internal_functions.items():
            rows.append(["`%s`" % addr, _e(f.get("role")),
                         _e(_snip(f.get("description"), 160))])
        _table(out, ["Address", "Role", "Description"], rows)
        open_fns = [(a, f) for a, f in m.internal_functions.items()
                    if f.get("todo")]
        if open_fns:
            lines = []
            for addr, f in sorted(open_fns):
                t = f["todo"]
                first = t[0] if isinstance(t, list) else t
                lines.append("- `%s`: %s" % (addr, _para(first)))
            _details(out, lines, "Functions with remaining unknowns")

    if m.dispatch_candidates:
        out += ["## Dispatch candidates", ""]
        _pt_add(m, out, "architecture", "dispatch_candidates")
        _details(out, ["Functions that looked like dispatchers, with the "
                       "verdict each received."])
        for addr, c in m.dispatch_candidates.items():
            out.append("### `%s`" % addr)
            out.append("")
            cand = []
            if c.get("assessment"):
                cand += [_para(c["assessment"]), ""]
            if c.get("compares"):
                cand += ["Compares: %s" % ", ".join(
                    "`%s`" % _e(x.get("str"))
                    for x in c["compares"] if x.get("str"))]
            if cand:
                _details(out, cand)

    out += ["## Shared subsystems", ""]
    _pt_add(m, out, "architecture", "shared_subsystems")
    sp = m.shared_primitives
    for k in _SOAP_PRIM_KEYS:
        if k not in sp:
            continue
        v = sp[k]
        out.append("### `%s`" % k)
        out.append("")
        if isinstance(v, dict):
            if v.get("client_summary"):
                out.append(_para(v["client_summary"]))
                out.append("")
            for t in _todo_lines(v.get("todo")):
                out.append("- **TODO:** %s" % t)
            _details(out, _generic_lines(
                {kk: vv for kk, vv in v.items()
                 if kk not in ("client_summary", "todo")}))
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
        rng = " / ".join(uniq) or _e(vals) or _e(rng) or "none"
        rows.append(["`%s`" % n, st, _req(a.required), rng,
                     _e(a.default) or "none"])
    return rows


def _arg_details(out, args):
    """Per-arg notes; only where they add information beyond the table."""
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
        for t in _todo_lines(a.todo):
            extras.append("**TODO:** %s" % t)
        p = a.primitive
        if p and p.buf_cap:
            extras.append("buffer cap: `%s`" %
                          (hex(p.buf_cap) if isinstance(p.buf_cap, int)
                           else _e(p.buf_cap)))
        if not extras:
            continue
        wrote = True
        out.append("- **`%s`**: %s" % (n, _e(a.description)
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
        out.append("**`%s`**" % e.code_label)
        out.append("")
        out += _todo_lines(e.todo)
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
                out.append("**Bounded unknown (proven):** %s"
                           % _para(u["proven"]))
            if u.get("unknown"):
                out.append("**Bounded unknown (unresolved):** %s"
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
              "dispatch `%s`" % a.dispatch_kind]
    if a.is_stub:
        badges.append("**removed/stub, faults 401**")
    out.append(" · ".join(badges))
    out.append("")
    if a.summary:
        out.append(_para(a.summary))
        out.append("")
    if a.todo:
        for t in _todo_lines(a.todo):
            out.append("**TODO:** %s" % t)
        out.append("")
    if a.description:
        _details(out, [_para(a.description)])
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
    tech = []
    _block(tech, "Validation", a.validation)
    _block(tech, "Requirements / preconditions", a.requirements)
    _block(tech, "State dependencies", a.state_dependencies)
    if a.side_effects:
        tech.append("#### Side effects")
        tech.append("")
        for se in a.side_effects:
            if isinstance(se, genmodel.SemanticBlock):
                tech.append("- %s" % _para(se.text))
                for t in _todo_lines(se.todo):
                    tech.append("  - **TODO:** %s" % t)
            else:
                tech.append("- %s" % _e(se))
        tech.append("")
    _block(tech, "State transitions", a.state_transitions)
    _block(tech, "Events", a.events_triggered)
    _block(tech, "Return behavior", a.return_behavior)
    _render_errors(tech, a.errors)
    if a.unresolved:
        tech.append("#### Bounded unknowns")
        tech.append("")
        _generic(tech, a.unresolved)
        tech.append("")
    if a.firmware_differences:
        tech.append("#### Firmware differences")
        tech.append("")
        for x in a.firmware_differences:
            tech.append("- %s" % _e(x))
        tech.append("")
    if a.notes:
        tech.append("#### Notes")
        tech.append("")
        tech.append(_para(a.notes))
        tech.append("")
    if tech:
        _details(out, tech, "Technical analysis")
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
        if impl.engine_impl_func:
            det.append("- engine impl resolved to `%s`"
                       % _e(impl.engine_impl_func))
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
        out.append("::: details Implementation & "
                   "reverse-engineering evidence")
        out.append("")
        if det:
            out.extend(det)
            out.append("")
        _ev_list(a.evidence, out)
        out.append("")
        out.append(":::")
        out.append("")
    return "\n".join(out)


def render_service(s):
    out = ["# `%s` `%s`" % (s.name, s.control_path), ""]
    out.append("**visibility** `%s`" % s.visibility)
    out.append("")
    if s.summary:
        out.append(_para(s.summary))
        out.append("")
    if s.todo:
        for t in _todo_lines(s.todo):
            out.append("**TODO:** %s" % t)
        out.append("")
    if s.description:
        _details(out, [_para(s.description)])
    if s.availability and (s.availability.notes
                           or s.availability.enabled_source):
        av = s.availability
        out += ["## Availability", ""]
        for t in _todo_lines(av.todo):
            out.append("- **TODO:** %s" % t)
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
        _details(out, ["**Visibility note:** %s"
                       % _para(s.visibility_note)])
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
    if s.removed_actions:
        out += ["## Removed / stale advertisements", ""]
        for r in s.removed_actions:
            if isinstance(r, dict):
                out.append("- `%s`: %s" % (_e(r.get("name")),
                                            _e(r.get("reason"))))
            else:
                out.append("- `%s`" % _e(r))
        out.append("")
    out += ["## Actions", ""]
    rows = []
    for n, a in s.actions.items():
        errs = ", ".join(sorted({str(e.code) for e in a.errors
                                 if e.code is not None},
                                key=int))
        rows.append(["`%s`" % n, _e(a.visibility), _e(a.reachability),
                     _e(a.dispatch_kind), errs])
    _table(out, ["Action", "Visibility", "Reachability",
                 "Dispatch", "Error codes"], rows)
    for a in s.actions.values():
        out.append(render_action(a))
    if s.state_variables:
        out += ["## State variables", ""]
        rows = []
        for n, sv in s.state_variables.items():
            rows.append(["`%s`" % n, _e(sv.data_type),
                         "yes" if sv.evented else "no",
                         _e(_snip(sv.description, 120))])
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
            _details(out, _generic_lines(ev.extra))
        out.append("")
    if s.errors:
        out += ["## Dispatcher-level errors", ""]
        errbuf = []
        _render_errors(errbuf, s.errors, heading=None)
        _details(out, errbuf)
    if s.impl_return_pattern:
        out += ["## Implementation return pattern", ""]
        _details(out, [_para(s.impl_return_pattern)])
    if s.notes:
        out += ["## Notes", ""]
        nbuf = []
        if isinstance(s.notes, list):
            for n_ in s.notes:
                nbuf.append("- %s" % _para(n_))
        else:
            nbuf.append(_para(s.notes))
        _details(out, nbuf)
    extra_render = {k: v for k, v in s.extra.items() if v}
    if extra_render:
        out += ["## Additional records", ""]
        for k, v in extra_render.items():
            out.append("### `%s`" % k)
            out.append("")
            _details(out, _generic_lines(v))
    if s.impl_files:
        out.append("Implementation sources (recovered): %s"
                   % ", ".join("`%s`" % f for f in s.impl_files))
        out.append("")
    _ev_details(s.evidence, out, "Service evidence")
    return "\n".join(out)


# --------------------------------------------------------------------------
# topic pages
# --------------------------------------------------------------------------

def _sv_slug(name, used):
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "misc"
    base, i = slug, 2
    while slug in used:
        slug = "%s-%d" % (base, i)
        i += 1
    used.add(slug)
    return slug


def render_state_variables(m):
    files = {}
    allsv = m.all_state_variables()
    by_svc = {}
    for k in sorted(allsv):
        svc = allsv[k].service or "internal schemas"
        by_svc.setdefault(svc, []).append(k)

    out = ["# State variables", ""]
    _pt_add(m, out, "state_variables", "intro")
    _details(out, ["Evented variables carry `<NAME val=\"...\"/>` elements "
                   "inside `LastChange` documents; `A_ARG_TYPE_*` variables "
                   "are SCPD argument-type declarations, not device state."])
    used = set()
    slugs = {svc: _sv_slug(svc, used) for svc in sorted(by_svc)}
    rows = []
    for k in sorted(allsv):
        sv = allsv[k]
        svc = sv.service or "internal schemas"
        rows.append(["`%s`" % k,
                     "[%s](state-variables/%s.md)"
                     % (_e(svc), slugs[svc]),
                     _e(sv.data_type),
                     ("yes" if sv.evented else "no")
                     if sv.evented is not None else "?"])
    _table(out, ["Variable", "Service", "Type", "Evented"], rows)
    files["soap/state-variables.md"] = "\n".join(out)

    for svc in sorted(by_svc):
        out = ["# State variables: `%s`" % svc, ""]
        for k in by_svc[svc]:
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
            if sv.description:
                _details(out, [_para(sv.description)])
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
            for t in _todo_lines(getattr(sv, "todo", None)):
                out.append("- **TODO:** %s" % t)
            out.append("")
        files["soap/state-variables/%s.md" % slugs[svc]] = "\n".join(out)
    return files


def render_events(m):
    out = ["# Eventing", ""]
    _pt_add(m, out, "events", "intro")
    svc_blurbs = ((getattr(m, "pages_client", {}) or {}).get("events")
                  or {}).get("services") or {}
    _ALIAS = {"mediaserver": "server", "mediarenderer": "renderer"}
    counts = {}
    for s in m.services:
        if s.events:
            counts[s.name] = counts.get(s.name, 0) + 1
    out += ["## Per-service eventing", ""]
    _pt_add(m, out, "events", "per_service")
    for s in m.services:
        ev = s.events
        if not ev:
            continue
        key = s.name
        heading = s.name
        if counts.get(s.name, 0) > 1:
            parent = s.control_path.strip("/").split("/")[0].lower()
            key = "%s_%s" % (s.name, _ALIAS.get(parent, parent))
            heading = "%s (%s)" % (s.name, parent)
        out.append("## `%s`" % heading)
        out.append("")
        blurb = svc_blurbs.get(key) or svc_blurbs.get(s.name) \
            or svc_blurbs.get(s.slug)
        if blurb:
            out.append(_para(blurb))
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
        tech = []
        if ev.mechanism:
            tech += ["**Mechanism**", "", _para(ev.mechanism), ""]
        if ev.extra:
            tech += ["**Additional data**", ""]
            tech += _generic_lines(ev.extra)
            tech.append("")
        if tech:
            _details(out, tech)
        out.append("")
    sp = m.shared_primitives.get("wss_event_vocabulary")
    if sp:
        out += ["## WSS subscription registry", ""]
        _pt_add(m, out, "events", "wss_registry")
        _details(out, _generic_lines(
            {k: v for k, v in sp.items() if k != "names"}))
        if sp.get("names"):
            out.append("Event names: %s"
                       % ", ".join("`%s`" % x for x in sp["names"]))
        out.append("")
    ge = m.shared_primitives.get("gena_eventing")
    if ge:
        out += ["## GENA internals", ""]
        _pt_add(m, out, "events", "gena_internals")
        _details(out, _generic_lines(ge))
    return "\n".join(out)


def render_errors(m):
    out = ["# Errors", ""]
    _pt_add(m, out, "errors", "intro")
    fw = m.shared_primitives.get("soap_fault_wire_format")
    if fw:
        out += ["## SOAP fault wire format", ""]
        _pt_add(m, out, "errors", "wire_format")
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
        _pt_add(m, out, "errors", "vocabulary")
        _generic(out, vocab)
        out.append("")
    out += ["## Per-action error surface", ""]
    _pt_add(m, out, "errors", "per_action")
    for s in m.services:
        rows = []
        for a in s.actions.values():
            for e in a.errors:
                rows.append(["`%s`" % a.name, "`%s`" % e.code_label,
                             _e(_snip(e.meaning, 140))])
        if s.errors:
            for e in s.errors:
                rows.append(["_(dispatcher)_", "`%s`" % e.code_label,
                             _e(_snip(e.meaning, 140))])
        if not rows:
            continue
        out.append("### `%s`" % s.name)
        out.append("")
        _table(out, ["Action", "Code", "Meaning"], rows)
    return "\n".join(out)


def render_formats(m, kind, title, blurb):
    out = ["# %s" % title, ""]
    _pt_add(m, out, "%s_formats" % kind, "intro")
    _details(out, [blurb])
    src = m.uri_formats if kind == "uri" else m.payload_formats
    for k, f in sorted(src.items()):
        out.append("## `%s`" % k)
        out.append("")
        for t in _todo_lines(getattr(f, "todo", None)):
            out.append("**TODO:** %s" % t)
        if getattr(f, "todo", None):
            out.append("")
        if getattr(f, "client_summary", None):
            out.append(_para(f.client_summary))
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
        tech = []
        if f.description:
            tech += ["**Description**", "", _para(f.description), ""]
        if f.notes:
            tech += ["**Notes**", "", _para(f.notes), ""]
        if f.extra:
            tech += ["**Additional data**", ""]
            tech += _generic_lines(f.extra)
            tech.append("")
        if tech:
            _details(out, tech)
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
    "muse_route_verbs", "enum_tables",
]


_HTTP_GROUPS = [
    ("endpoints", "Endpoints & server behavior",
     ["http_status_endpoints", "http_extra_endpoints",
      "diagnostic_manifest", "diagnostics", "proprietary_headers",
      "http_chunked_strictness", "http_range", "httpcache_manager",
      "csrf_protection", "device_description_variants",
      "albumart_proxy", "alert_engine"]),
    ("discovery", "Discovery & routing",
     ["discovery_layer", "ssdp_discovery", "ssdp_signed_msearch",
      "target_udn_routing", "assoctracker", "gena_internals"]),
    ("auth-security", "Auth & security",
     ["cert_identity", "device_auth", "noncehandler",
      "token_refresh_state_machine", "household_psk_vocabulary",
      "muse_authhelper", "circuitbreaker"]),
    ("cloud-clients", "Outbound clients & cloud",
     ["upnp_cloud_tunnel", "soap_client", "cloud_request",
      "cloud_registration", "service_accounts", "device_registration",
      "device_account_endpoint"]),
    ("media-streaming", "Media & streaming",
     ["hls_radio", "websocket_impl", "icy_metadata",
      "didl_classes_ext", "protocol_info_full"]),
    ("vocabularies", "Internal vocabularies & tables",
     ["xml_schema_clusters", "internal_error_families",
      "system_property_keys", "internal_result_namespace",
      "smapi_capability_vocabulary", "muse_route_verbs", "enum_tables",
      "muse_common", "replication_elements"]),
]


def render_http_api(m):
    files = {}
    sp = m.shared_primitives
    groups = [(slug, title, [k for k in keys if k in sp])
              for slug, title, keys in _HTTP_GROUPS]
    covered = {k for _, _, keys in groups for k in keys}
    leftover = [k for k in _HTTP_KEYS if k in sp and k not in covered]
    if leftover:
        groups.append(("other", "Other", leftover))

    out = ["# HTTP / non-SOAP surface", ""]
    _pt_add(m, out, "http_api", "intro")
    _details(out, ["Endpoints and HTTP-layer behaviors recovered from "
                   "the binary outside the SOAP control path. All are "
                   "static-analysis records."])
    rows = [["[%s](%s.md)" % (_e(title), slug), str(len(keys))]
            for slug, title, keys in groups]
    _table(out, ["Group", "Entries"], rows)
    files["http/index.md"] = "\n".join(out)

    for slug, title, keys in groups:
        out = ["# HTTP: %s" % _e(title), ""]
        for k in keys:
            v = sp[k]
            out.append("## `%s`" % k)
            out.append("")
            if v.get("client_summary"):
                out.append(_para(v["client_summary"]))
                out.append("")
            _details(out, _generic_lines(
                {kk: vv for kk, vv in v.items()
                 if kk != "client_summary"}))
            out.append("")
        files["http/%s.md" % slug] = "\n".join(out)
    return files


def render_firmware(m):
    out = ["# Firmware / model differences", ""]
    _pt_add(m, out, "firmware", "intro")
    meta = m.firmware_diff_meta
    if meta.get("note"):
        _details(out, [_para(meta["note"])])
    for k in ("matrix_method", "crossbuild_matrix_artifact"):
        if meta.get(k):
            out.append("- **%s:** %s" % (k, _e(meta[k])
                                         if isinstance(meta[k], str)
                                         else json.dumps(meta[k])[:400]))
    if meta.get("product_surface"):
        out += ["", "## Product surface", ""]
        _pt_add(m, out, "firmware", "product_surface")
        _details(out, _generic_lines(meta["product_surface"]))
    if meta.get("service_urn_matrix"):
        out += ["", "## Service-URN matrix", ""]
        _pt_add(m, out, "firmware", "service_matrix")
        _details(out, _generic_lines(meta["service_urn_matrix"]))
    out += ["", "## Entries", ""]
    _pt_add(m, out, "firmware", "entries")
    eblurbs = ((getattr(m, "pages_client", {}) or {}).get("firmware")
               or {}).get("entry_text") or {}
    for e in m.firmware_differences:
        out.append("### %s" % _e(e.item))
        out.append("")
        if eblurbs.get(e.item):
            out.append(_para(eblurbs[e.item]))
            out.append("")
        if e.builds:
            _table(out, ["Build", "State"],
                   [["`%s`" % b, _e(v)] for b, v in e.builds.items()])
        tech = []
        if e.detail:
            tech += ["**Description**", "", _para(e.detail), ""]
        if e.extra:
            tech += ["**Additional data**", ""]
            tech += _generic_lines(e.extra)
            tech.append("")
        if tech:
            _details(out, tech)
    return "\n".join(out)


def _todo_lines(todo):
    """Normalize a todo field (string or list) to renderable lines."""
    if not todo:
        return []
    if isinstance(todo, list):
        return [_para(t) for t in todo]
    return [_para(todo)]


def _subsystem_body(out, n, s):
    out += ["## `%s`" % n, ""]
    if s.get("client_summary"):
        out.append(_para(s["client_summary"]))
        out.append("")
    todo = _todo_lines(s.get("todo"))
    if todo:
        out.append("**TODO**")
        out.append("")
        for t in todo:
            out.append("- %s" % t)
        out.append("")
    tech = []
    if s.get("summary"):
        tech += [_para(s["summary"]), ""]
    if s.get("anchors"):
        tech += ["- binary anchors: %s"
                 % ", ".join("`%s`" % _e(a)
                             for a in s["anchors"]), ""]
    _generic(tech, {k: v for k, v in s.items()
                    if k not in ("summary", "anchors",
                                 "evidence", "todo")})
    _ev_details([genmodel.Evidence.from_raw(e)
                 for e in s.get("evidence") or []], tech)
    if any(x.strip() for x in tech):
        _details(out, tech)


def render_subsystems(m):
    files = {}
    subs = sorted(m.subsystems.items())

    out = ["# Non-SOAP subsystems", ""]
    _pt_add(m, out, "subsystems", "intro")
    _details(out, ["Self-contained protocols, engines, and daemons "
                   "living in the same binary beside or below the UPnP "
                   "layer. Any record that still has reverse-engineering "
                   "work ahead carries a TODO naming what is already "
                   "established, what remains unknown, and the next "
                   "concrete step. Evidence addresses are the rodata "
                   "anchor strings."])

    def _gloss(s):
        t = s.get("client_summary") or s.get("summary") or ""
        if not isinstance(t, str):
            t = json.dumps(t, ensure_ascii=False) \
                if isinstance(t, (dict, list)) else str(t)
        cut = t.find(". ")
        if cut > 0:
            t = t[:cut + 1]
        return t

    rows = [["[`%s`](#%s)" % (n, n), _e(_gloss(s))]
            for n, s in subs]
    _table(out, ["Subsystem", "Summary"], rows)
    for n, s in subs:
        _subsystem_body(out, n, s)
    files["subsystems/index.md"] = "\n".join(out)

    open_rows = []
    for n, s in subs:
        raw = s.get("todo")
        if not raw:
            continue
        first = raw[0] if isinstance(raw, list) else raw
        open_rows.append(["[`%s`](index.md#%s)" % (n, n),
                          _e(_snip(first))])

    def _first_todo(t):
        return t[0] if isinstance(t, list) else t

    soap_rows = []
    for s in m.services:
        if s.todo:
            soap_rows.append(
                ["service [`%s`](../soap/%s.md)" % (s.name, s.slug),
                 _e(_snip(_first_todo(s.todo)))])
        for a in s.actions.values():
            if a.todo:
                soap_rows.append(
                    ["action [`%s`](../soap/%s.md#%s)"
                     % (a.name, s.slug, a.name.lower()),
                     _e(_snip(_first_todo(a.todo)))])
            for e in a.errors:
                if getattr(e, "todo", None):
                    soap_rows.append(
                        ["error [`%s` %s](../soap/%s.md#%s)"
                         % (a.name, e.code_label, s.slug,
                            a.name.lower()),
                         _e(_snip(_first_todo(e.todo)))])
        for e in s.errors:
            if getattr(e, "todo", None):
                soap_rows.append(
                    ["error [`%s` dispatcher %s](../soap/%s.md)"
                     % (s.name, e.code_label, s.slug),
                     _e(_snip(_first_todo(e.todo)))])
        av = s.availability
        if av and getattr(av, "todo", None):
            soap_rows.append(
                ["availability [`%s`](../soap/%s.md)" % (s.name, s.slug),
                 _e(_snip(_first_todo(av.todo)))])

    sv_rows = []
    for k, sv in m.all_state_variables().items():
        if getattr(sv, "todo", None):
            sv_rows.append(
                ["[`%s`](../soap/state-variables.md)" % k,
                 _e(_snip(_first_todo(sv.todo)))])

    fmt_rows = []
    for kind, src in (("uri", m.uri_formats),
                      ("payload", m.payload_formats)):
        for k, f in sorted(src.items()):
            if getattr(f, "todo", None):
                fmt_rows.append(
                    ["[`%s`](../soap/%s-formats.md#%s)"
                     % (k, kind, str(k).lower()),
                     _e(_snip(_first_todo(f.todo)))])

    prim_rows = []
    for k, v in sorted(m.shared_primitives.items()):
        if isinstance(v, dict) and v.get("todo"):
            anchor = k if k in _SOAP_PRIM_KEYS \
                else "other-recovered-subsystems"
            prim_rows.append(
                ["[`%s`](../architecture.md#%s)" % (k, anchor),
                 _e(_snip(_first_todo(v["todo"])))])

    fn_rows = []
    for addr, f in sorted(m.internal_functions.items()):
        if isinstance(f, dict) and f.get("todo"):
            fn_rows.append(
                ["[`%s`](../architecture.md#internal-functions)" % addr,
                 _e(_snip(_first_todo(f["todo"])))])

    misc_rows = []
    if m.request_vtable.get("todo"):
        misc_rows.append(
            ["[request vtable](../architecture.md#request-object-vtable)",
             _e(_snip(_first_todo(m.request_vtable["todo"])))])
    for raddr, r in (m.routing.get("routers") or {}).items():
        for rec in r.get("records") or []:
            if rec.get("todo"):
                misc_rows.append(
                    ["routing [`%s`](../architecture.md)" % rec.get("path"),
                     _e(_snip(_first_todo(rec["todo"])))])
    if isinstance(m.muse, dict) and m.muse.get("todo"):
        misc_rows.append(
            ["[muse API](../muse/index.md)",
             _e(_snip(_first_todo(m.muse["todo"])))])
    for k, v in sorted((m.muse or {}).items()):
        if k == "todo":
            continue
        if isinstance(v, dict) and v.get("todo"):
            misc_rows.append(
                ["muse record `%s`" % k,
                 _e(_snip(_first_todo(v["todo"])))])
    cl = getattr(m, "cert_layer", None) or {}
    if isinstance(cl, dict) and cl.get("todo"):
        misc_rows.append(
            ["cert layer (`documentation.json` `cert_layer`)",
             _e(_snip(_first_todo(cl["todo"])))])

    if open_rows or soap_rows or sv_rows or fmt_rows \
            or prim_rows or fn_rows or misc_rows:
        ow = ["# Open work", ""]
        _pt_add(m, ow, "open_work", "intro")
        _details(ow, ["Every record that still has documented "
                      "reverse-engineering work ahead, auto-collected "
                      "from each record's TODO. The first TODO line is "
                      "shown here; the full established / unknown / "
                      "next-step detail lives on the record itself."])
        if open_rows:
            ow += ["## Subsystems", ""]
            _table(ow, ["Subsystem", "TODO"], open_rows)
        if prim_rows:
            ow += ["## Shared primitives", ""]
            _table(ow, ["Primitive", "TODO"], prim_rows)
        if soap_rows:
            ow += ["## SOAP services, actions and errors", ""]
            _table(ow, ["Record", "TODO"], soap_rows)
        if sv_rows:
            ow += ["## State variables", ""]
            _table(ow, ["Variable", "TODO"], sv_rows)
        if fmt_rows:
            ow += ["## Formats", ""]
            _table(ow, ["Format", "TODO"], fmt_rows)
        if fn_rows:
            ow += ["## Internal functions", ""]
            _table(ow, ["Function", "TODO"], fn_rows)
        if misc_rows:
            ow += ["## Other records", ""]
            _table(ow, ["Record", "TODO"], misc_rows)
        files["subsystems/open-work.md"] = "\n".join(ow)
    return files


_MUSE_RESOURCE_GROUPS = [
    ("playback", "Playback & sessions",
     ["playback", "playbackSession", "playbackExtended",
      "playbackMetadata", "sleepTimer", "queue"]),
    ("volume-home-theater", "Volume & home theater",
     ["playerVolume", "groupVolume", "homeTheater", "hdmi",
      "soundSwap", "pinewood"]),
    ("audio-input", "Audio input", ["virtualLineIn"]),
    ("households-zones", "Households, zones & grouping",
     ["groups", "zones", "households", "areas"]),
    ("alarms-timers", "Alarms & timers", ["alarms", "timers"]),
    ("content", "Content, library & music services",
     ["localContentLibrary", "musicServiceAccounts", "playlists",
      "favorites", "catalog", "history", "entitlements", "audioClip"]),
    ("calibration", "Calibration & positioning",
     ["trueplay", "trueroom", "roomDetection", "positioning"]),
    ("settings", "Settings", ["settings", "effectiveSettings"]),
    ("device-hardware", "Device & hardware",
     ["hardwareStatus", "devices", "devicesExtended", "power",
      "ircontrol"]),
    ("voice-control", "Voice & remote control",
     ["voice", "virtualRemoteControl", "smartplay"]),
    ("system", "System, updates & diagnostics",
     ["update", "householdUpdate", "diagnostics", "systemReporting",
      "networkTest", "management", "platformInternal", "svc", "info",
      "systemTime", "time"]),
    ("authorization", "Authorization", ["authorization"]),
    ("upnp-bridge", "UPnP bridge resources", None),
]


def _muse_resource_groups(res):
    """Yield (slug, title, [(name, resource)]) grouped per
    _MUSE_RESOURCE_GROUPS; the upnp-bridge group collects every
    upnp*-prefixed resource and anything unmapped lands in 'other'."""
    mapped = set()
    groups = []
    for slug, title, members in _MUSE_RESOURCE_GROUPS:
        if members is None:
            members = sorted(n for n in res if n.startswith("upnp"))
        groups.append([slug, title,
                       [(n, res[n]) for n in members if n in res]])
        mapped.update(members)
    leftover = sorted(n for n in res if n not in mapped)
    if leftover:
        groups.append(["other", "Other resources",
                       [(n, res[n]) for n in leftover]])
    return [g for g in groups if g[2]]


def _muse_resource_body(out, n, r):
    out += ["## `%s`" % n, ""]
    if r.get("client_summary"):
        out.append(_para(r["client_summary"]))
        out.append("")
    rows = []
    seen = set()
    fields_seen = []
    msgs_seen = []
    paths_seen = []
    for op in r.get("ops") or []:
        key = (op["method"], op["path"], op["verb"])
        if key in seen:
            continue
        seen.add(key)
        impl = op.get("impl") or {}
        if impl.get("execs"):
            execs = " ".join("`%s`" % x for x in impl["execs"])
        elif impl.get("kind") == "outbound_registry":
            execs = "outbound-fwd"
        elif impl.get("kind") == "resource_block":
            execs = "resource-block"
        else:
            execs = "none"
        if op.get("desc_execs"):
            execs += " desc:`%s`" % "` `".join(
                x[2:] for x in op["desc_execs"])
        for f_ in op.get("op_fields") or []:
            if f_ not in fields_seen:
                fields_seen.append(f_)
        for m_ in op.get("op_msgs") or []:
            if m_ not in msgs_seen:
                msgs_seen.append(m_)
        for p_ in op.get("op_paths") or []:
            if p_ not in paths_seen:
                paths_seen.append(p_)
        prm = op.get("op_params") or []
        prm_txt = ", ".join("`%s`" % _e(n) for _, n in prm) if prm \
            else "none"
        specs = []
        for s_ in op.get("spec") or []:
            for a_ in s_.get("accessors") or []:
                mem = [x for x in (a_.get("members") or []) if x]
                pairs = []
                it = 0
                while it + 1 < len(mem):
                    pairs.append("`%s`:`%s`" % (_e(mem[it]),
                                               _e(mem[it + 1])))
                    it += 2
                if it < len(mem):
                    pairs.append("`%s`" % _e(mem[it]))
                specs.append("c%d:%s" % (a_.get("class"),
                                         " ".join(pairs)))
        spec_txt = "<br>".join(specs) if specs else "none"
        rows.append(["`%s`" % _e(op["method"]),
                     "`%s`" % _e(op["path"]),
                     "`%s`" % _e(op["verb"]),
                     "`%s`" % _e(op["subparam"] or "-"),
                     "`%s`" % _e(op["flags"]),
                     execs,
                     prm_txt,
                     spec_txt])
    _table(out, ["Method", "Path", "Op", "Trailing param",
                 "Flags", "Exec (vtable +0x0c)", "Params",
                 "Spec lists (classId: root, field:type pairs)"], rows)
    tech = []
    if r.get("impl_funcs"):
        tech += ["Resource implementation functions (string-block "
                 "registrar family): %s"
                 % ", ".join("`%s`" % f for f in r["impl_funcs"]), ""]
    if r.get("impl_fields"):
        tech += ["Field vocabulary recovered from the resource's "
                 "implementation functions: %s"
                 % ", ".join("`%s`" % _e(x)
                             for x in r["impl_fields"]), ""]
    if r.get("impl_msgs"):
        tech += ["Implementation messages:", ""]
        tech += ["- `%s`" % _e(m_) for m_ in r["impl_msgs"]]
        tech.append("")
    ens = r.get("enums") or {}
    if ens:
        tech += ["Related enum registrations (proven integer "
                 "values, see `enum_tables`):", ""]
        tech += ["- **%s**: %s"
                 % (_e(enm), ", ".join(
                     "`%s`=%s" % (_e(s), v)
                     for s, v in sorted(
                         mem.items(), key=lambda kv: kv[1])))
                 for enm, mem in sorted(ens.items())]
        tech.append("")
    if fields_seen:
        tech += ["Op-level JSON keys recovered from op-object "
                 "methods: %s"
                 % ", ".join("`%s`" % _e(x) for x in fields_seen), ""]
    if msgs_seen:
        tech += ["Validation / log strings recovered from "
                 "op-object methods:", ""]
        tech += ["- `%s`" % _e(m_) for m_ in msgs_seen]
        tech.append("")
    if paths_seen:
        tech += ["Route fragments these ops build or forward to: "
                 "%s" % ", ".join("`%s`" % _e(p)
                                  for p in paths_seen), ""]
    fv = r.get("field_vocab") or []
    if fv:
        tech += ["Field vocabulary (request/response keys seen in "
                 "the resource's client tables, not yet bound to "
                 "individual ops): %s"
                 % ", ".join("`%s`" % _e(x) for x in fv), ""]
    if tech:
        _details(out, tech, "Recovered vocabulary & internals")


def render_muse(m):
    files = {}
    mu = m.muse or {}
    out = ["# muse API (v1)", ""]
    _pt_add(m, out, "muse", "intro")
    _pt_add(m, out, "muse", "description")
    if mu.get("description"):
        _details(out, [_para(mu["description"])])
    for t in _todo_lines(mu.get("todo")):
        out.append("**TODO:** %s" % t)
    out.append("")
    _pt_add(m, out, "muse", "flags_decode")
    _pt_add(m, out, "muse", "dispatch")
    _pt_add(m, out, "muse", "tables")
    rec_lines = []
    if mu.get("flags_decode"):
        rec_lines += ["**flags decode:** %s" % _e(mu["flags_decode"]), ""]
    if mu.get("dispatch"):
        rec_lines += ["**dispatch:** %s" % _e(mu["dispatch"]), ""]
    if mu.get("tables"):
        rec_lines += ["Registration arrays: "
                      + "; ".join("`%s`: %s" % (k, _e(v))
                                  for k, v in mu["tables"].items())]
    if rec_lines:
        _details(out, rec_lines, "Route record internals")
    out += ["## How operations are built", ""]
    _pt_add(m, out, "muse", "op_spine")
    out += ["::: details Technical details", "",
            "Every op is a C++ object sharing one vtable skeleton: "
            "`+0x00`/`+0x04` destructors (per-op), `+0x08` shared run-gate "
            "(`0x109c9854`, same in all 682 vtables), `+0x0c` the per-op "
            "**execute** (unique per op class, shown as Exec in the "
            "tables below), `+0x10` shared default, and `+0x14`..`+0x60` "
            "a fixed hook ladder whose base defaults live at "
            "`0x101c0638..0x101c06ac`. Ops override subsets of the hooks: "
            "the low hooks read body params; each overridden hook is one "
            "**declared parameter**, reading exactly one named JSON member "
            "through `f_108337b0` (e.g. setVolume: `+0x1c`→`muted`, "
            "`+0x20`→`volume`; seek: `+0x1c`→`playOnCompletion`, "
            "`+0x20`→`positionMillis`, `+0x28`→`itemId`, `+0x2c`→`window`) "
            "(the Params column lists them) and higher hooks build "
            "forwarded requests (e.g. `setVolume` overrides `+0x60` to emit "
            "`v1/players/{id}/playerVolume/mute` and "
            "`v1/groups/{id}/groupVolume`). Each verb registers two op "
            "classes: a player-channel variant and a fatter "
            "household-channel variant.", "",
            ":::", ""]
    _pt_add(m, out, "muse", "validation_lib")
    out += ["::: details Technical details", "",
            "**Body validation library** (`0x109c74b0..0x109ca92c`): typed "
            "validators keyed by field name; `f_109ca3b4` emits "
            "'Missing required field: ', `f_109c9cc0` 'Unexpected type "
            "given for key: ', `f_109c8c60` 'Found unexpected array for '/"
            "'Unable to parse array for ', `f_109c90ec` 'Found object "
            "for ', `f_109ca92c` coerces strings "
            "('Unable to coerce string to boolean for key: '/"
            "' to number for key: '), `f_109c7cb4`/`f_109c8004`/"
            "`f_109c8354`/`f_109c86dc` numeric bounds ('below minimum "
            "of '/'above maximum of '), `f_109c7954` 'Parameter '…' "
            "out of range: ', `f_109c74b0` timestamps (' failed "
            "timestamp validation'), `f_109c7740` ' not a valid Muse "
            "error code'.", "",
            ":::", ""]
    pipe = mu.get("pipeline") or {}
    if pipe:
        out += ["## Request pipeline", ""]
        _pt_add(m, out, "muse", "pipeline")
        for k in ("request_envelope", "content_type", "auth",
                  "path_params", "body", "errors", "op_dispatch"):
            if pipe.get(k):
                _pt_add(m, out, "muse", k)
                _details(out, ["**%s.** %s" % (k.replace("_", " "),
                                              _e(pipe[k]))])
    ec = mu.get("event_channels") or {}
    if ec:
        out += ["## Event channels", ""]
        _pt_add(m, out, "muse", "event_channels")
        if ec.get("note"):
            out.append(_para(ec["note"]))
            out.append("")
        ch = ec.get("channels") or []
        if ch:
            out.append(", ".join("`%s`" % _e(c) for c in ch))
            out.append("")
    res = mu.get("resources") or {}
    groups = _muse_resource_groups(res)
    res_page = {}
    for n, r in res.items():
        for slug, _, members in groups:
            if any(mn == n for mn, _ in members):
                res_page[n] = slug
                break
    out += ["## Resources", ""]
    _pt_add(m, out, "muse", "resources")
    rows = [["[`%s`](resources/%s.md#%s)"
             % (n, res_page.get(n, "other"), n.lower()),
             str(r.get("op_count") or 0),
             ", ".join(r.get("methods") or []),
             _e(", ".join(r.get("scopes") or []))]
            for n, r in sorted(res.items())]
    _table(out, ["Resource", "Ops", "Methods", "Scope params"], rows)
    out += ["Resource pages, grouped by function:", ""]
    out += ["- [%s](resources/%s.md)" % (_e(title), slug)
            for slug, title, _ in groups]
    out.append("")
    if mu.get("unresolved"):
        out += ["## Unresolved", ""]
        _pt_add(m, out, "muse", "unresolved")
        _details(out, [_para(mu["unresolved"])])
    if mu.get("evidence"):
        out.append("")
        _ev_details([genmodel.Evidence.from_raw(e)
                     for e in mu["evidence"]], out)
    files["muse/index.md"] = "\n".join(out)

    ob = mu.get("outbound") or {}
    if ob:
        out = ["# Outbound: player as muse client", ""]
        _pt_add(m, out, "muse", "outbound")
        if ob.get("note"):
            _details(out, [_para(ob["note"])])
        rows = []
        for name, spec in sorted((ob.get("ops") or {}).items()):
            bits = []
            if spec.get("prefix"):
                bits.append("prefix `%s`" % _e(spec["prefix"]))
            if spec.get("path"):
                bits.append("suffix `%s`" % _e(spec["path"]))
            if spec.get("query"):
                bits.append("query " + ", ".join("`%s=`" % _e(q)
                                                for q in spec["query"]))
            rows.append(["`%s`" % name, " ".join(bits) or "none"])
        _table(out, ["Outbound op", "Wire shape"], rows)
        out.append("")
        fv = ob.get("field_vocab") or {}
        if fv:
            _pt_add(m, out, "muse", "field_vocab")
            if ob.get("field_vocab_note"):
                _details(out, [_para(ob["field_vocab_note"])])
            rows = [["`%s`" % n,
                     ", ".join("`%s`" % _e(f) for f in fs) or "none"]
                    for n, fs in sorted(fv.items())]
            _table(out, ["Namespace", "Request fields"], rows)
            out.append("")
        files["muse/outbound.md"] = "\n".join(out)

    fam_text = ((getattr(m, "pages_client", {}) or {}).get("muse")
                or {}).get("family_text") or {}
    for slug, title, members in groups:
        out = ["# muse resources: %s" % title, ""]
        if fam_text.get(slug):
            out.append(_para(fam_text[slug]))
            out.append("")
        for n, r in members:
            _muse_resource_body(out, n, r)
        files["muse/resources/%s.md" % slug] = "\n".join(out)
    return files


def render_availability(m):
    out = ["# Availability matrix", ""]
    _pt_add(m, out, "availability", "intro")
    _details(out, ["Every canonical action record. `advertised` services are "
                   "in the served device-description `serviceList` (all "
                   "except AudioIn); every canonical action is declared in "
                   "its service's shipped SCPD. `stub` = dispatched to a "
                   "reject-all fault (removed surface)."])
    decl = (m.meta.get("counts") or {})
    undisp = (decl.get("removed_stale") or {}).get("undispatched_actions")
    if undisp:
        out.append("In addition, %d SCPD-advertised actions have **no "
                   "dispatch record at all** (hard/soft removed): %s"
                   % (len(undisp), ", ".join("`%s`" % x for x in undisp)))
        out.append("")
    for s in m.services:
        out.append("## `%s` `%s` (%s)" % (s.name, s.control_path,
                                            s.visibility))
        out.append("")
        rows = []
        for n, a in s.actions.items():
            flag = "stub" if a.is_stub else (
                "hidden-callable" if a.is_hidden_callable else "callable")
            rows.append(["`%s`" % n, _e(a.visibility), flag,
                         "`%s`" % (a.handler or "-")])
        _table(out, ["Action", "Visibility", "Wire status",
                     "Handler"], rows)
    return "\n".join(out)


# --------------------------------------------------------------------------
# firmware artifacts (docs/artifacts.json + reference/files/)
# --------------------------------------------------------------------------

def _fmt_size(n):
    if n is None:
        return "size unknown"
    if n < 1024:
        return "%d B" % n
    if n < 1024 * 1024:
        return "%.1f KB" % (n / 1024)
    return "%.1f MB" % (n / (1024 * 1024))


def _preview_lines(path, limit=60):
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as fh:
            lines = fh.read(65536).splitlines()
    except OSError:
        return None, 0
    return lines[:limit], len(lines)


def _artifact_cat_slug(cat):
    return re.sub(r"[^a-z0-9]+", "-", cat.lower()).strip("-")


def _artifact_entry(out, rel, e, cat):
    name = os.path.basename(rel)
    status = e.get("status")
    out.append("### `%s`" % name)
    out.append("")
    if e.get("friendly"):
        out.append(_para(e["friendly"]))
        out.append("")

    fs_path = os.path.join(ROOT, "reference", "public",
                           "files", rel)
    # public/files/ is served at the site root; root-absolute
    # links get the VitePress base prepended automatically
    link = "/files/" + rel
    raw_link = link
    if status == "absent":
        out.append("*Not shipped in this build; documented because "
                   "other firmware versions and binary string "
                   "evidence reference it.*")
        out.append("")
    elif status == "missing" or not os.path.isfile(fs_path):
        out.append("*Listed in the manifest but not found during "
                   "the last extraction run.*")
        out.append("")
    else:
        kind = e.get("kind") or "binary"
        if kind == "audio":
            # custom container defined in .vitepress/config.mts;
            # emits the <audio> element at render time so no raw
            # HTML ever sits in the markdown (html rules are off)
            out.append("::: audio %s" % raw_link)
            out.append(":::")
            out.append("")
        elif kind == "image":
            out.append('![%s](%s)' % (_e(name), raw_link))
            out.append("")
        if e.get("sensitive"):
            out.append("*Security-sensitive file: it is published "
                       "firmware data and stays downloadable, but "
                       "its contents are not previewed inline.*")
            out.append("")
        bits = []
        if kind in ("text",) and not e.get("sensitive"):
            bits.append("[View](%s)" % link)
        bits.append("[Download](%s)" % link)
        bits.append(_fmt_size(e.get("size")))
        out.append(" · ".join(bits))
        out.append("")
        if kind == "text" and not e.get("sensitive"):
            preview, nlines = _preview_lines(fs_path)
            if preview:
                fold = ["First %d of %d lines:"
                        % (len(preview), nlines), "",
                        "```"]
                fold += preview
                fold.append("```")
                _details(out, fold, summary="Preview")

    tech = []
    tech.append("- **Path in image:** `/%s`"
                % (rel if not rel.startswith("package/")
                   else rel))
    tech.append("- **Category:** %s" % cat)
    if e.get("size") is not None:
        tech.append("- **Size:** %s (%d bytes)"
                    % (_fmt_size(e["size"]), e["size"]))
    if e.get("sha256"):
        tech.append("- **SHA-256:** `%s`" % e["sha256"])
    tech.append("")
    if e.get("technical"):
        tech += [_para(e["technical"]), ""]
    _details(out, tech)


def render_artifacts(m):
    """Categorized, downloadable firmware artifact pages. The manifest
    (docs/artifacts.json) is authored by hand; tools/extract_artifacts.py
    copies the real files into reference/public/files/ and fills in
    size, sha256 and kind."""
    man_path = os.path.join(ROOT, "docs", "artifacts.json")
    man = json.load(open(man_path))
    cats = man.get("categories") or {}
    entries = man.get("files") or {}
    files = {}

    out = ["# Firmware artifacts", ""]
    _pt_add(m, out, "artifacts", "intro")
    shipped = [p for p, e in entries.items()
               if e.get("status") in ("shipped", "package")]
    total = sum(e.get("size") or 0 for p, e in entries.items()
                if e.get("status") in ("shipped", "package"))
    out.append("Every file below was extracted from the `%s` firmware "
               "image (%d files, %s total). Audio plays in the page, "
               "images render inline, and text files can be viewed or "
               "downloaded. Programs, libraries and modules are download-"
               "only: they are ARM binaries, not something a browser can "
               "open." % (man.get("rootfs", "firmware"), len(shipped),
                          _fmt_size(total)))
    out.append("")
    rows = []
    for cat, cmeta in cats.items():
        members = sorted(p for p, e in entries.items()
                         if e.get("category") == cat)
        if not members:
            continue
        rows.append(["[%s](%s.md)"
                     % (_e(cmeta.get("title") or cat),
                        _artifact_cat_slug(cat)),
                     str(len(members)),
                     _fmt_size(sum(e.get("size") or 0
                                   for e in
                                   (entries[p] for p in members)))])
    _table(out, ["Category", "Files", "Total size"], rows)
    files["artifacts/index.md"] = "\n".join(out)

    for cat, cmeta in cats.items():
        members = sorted(p for p, e in entries.items()
                         if e.get("category") == cat)
        if not members:
            continue
        out = ["# Artifacts: %s" % _e(cmeta.get("title") or cat), ""]
        if cmeta.get("friendly"):
            out.append(_para(cmeta["friendly"]))
            out.append("")
        if cmeta.get("technical"):
            _details(out, [_para(cmeta["technical"])])
        for rel in members:
            _artifact_entry(out, rel, entries[rel], cat)
        out.append("")
        files["artifacts/%s.md" % _artifact_cat_slug(cat)] = \
            "\n".join(out)
    return files


# --------------------------------------------------------------------------
# muse spec-pair streams (docs/muse_spec_streams.json)
# --------------------------------------------------------------------------

def render_muse_spec_streams(m):
    """Reproducible rendering of the decoded spec-pair streams. The JSON
    source (docs/muse_spec_streams.json) holds the extracted stream data;
    this function owns the page layout so the output is regenerated, not
    hand-maintained."""
    path = os.path.join(ROOT, "docs", "muse_spec_streams.json")
    with open(path) as fh:
        data = json.load(fh)
    out = ["# Muse spec-pair streams", ""]
    _pt_add(m, out, "muse_spec_streams", "intro")
    _details(out, [
        "Each row is `{member_name_idx, type_name_idx}` decoded through "
        "the %d-entry name table at %s."
        % (data.get("name_table_size", 0), data.get("name_table_addr")),
        "`ffffffff`/`ffffffff` terminates a stream. `globalError` rows "
        "enumerate the error/variant payload types an op may produce;",
        "`ok`/named members with `upnpEvent` are event-delivered "
        "payloads."])
    for s in data.get("streams") or []:
        out.append("## stream @ %s (n=%d)" % (s["addr"], s["n"]))
        if s.get("verbs"):
            out.append("adjacent verb/param pool: %s"
                       % ", ".join("`%s`" % v for v in s["verbs"]))
        out.append("")
        for r in s.get("rows") or []:
            out.append("- `%s` %s : `%s` %s"
                       % (r["member_idx"], r["member"],
                          r["type_idx"], r["type"]))
        out.append("")
    return "\n".join(out)


# --------------------------------------------------------------------------
# driver
# --------------------------------------------------------------------------

def render_all(m, outdir):
    files = {"index.md": render_index(m),
             "architecture.md": render_architecture(m),
             "firmware-differences.md": render_firmware(m),
             "soap/index.md": render_soap_index(m),
             "soap/events.md": render_events(m),
             "soap/errors.md": render_errors(m),
             "soap/uri-formats.md": render_formats(
                 m, "uri", "URI formats",
                 "URI scheme grammars recovered from literal tables and "
                 "parser call sites."),
             "soap/payload-formats.md": render_formats(
                 m, "payload", "Payload formats",
                 "Opaque payload/field grammars recovered from sscanf/"
                 "printf templates and parser functions."),
             "soap/availability-matrix.md": render_availability(m)}
    files.update(render_state_variables(m))
    files.update(render_http_api(m))
    files.update(render_muse(m))
    files.update(render_subsystems(m))
    for fn in (render_artifacts, render_muse_spec_streams):
        try:
            out = fn(m)
        except FileNotFoundError:
            continue
        if isinstance(out, dict):
            files.update(out)
        elif fn is render_muse_spec_streams:
            files["muse/spec-streams.md"] = out
    for s in m.services:
        files[os.path.join("soap", "%s.md" % s.slug)] = \
            render_service(s)

    os.makedirs(outdir, exist_ok=True)
    # drop generated pages from previous layouts so stale files can
    # never linger in the built site (public/ and dotdirs are kept)
    for dp, dns, fns in os.walk(outdir):
        rel_dp = os.path.relpath(dp, outdir)
        if rel_dp != "." and any(
                p.startswith(".") or p == "public"
                for p in rel_dp.split(os.sep)):
            continue
        for fn in fns:
            rel = os.path.normpath(os.path.join(rel_dp, fn))
            if fn.endswith(".md") and rel not in files:
                os.remove(os.path.join(dp, fn))
    written = []
    for rel, text in files.items():
        p = os.path.join(outdir, rel)
        os.makedirs(os.path.dirname(p), exist_ok=True)
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
