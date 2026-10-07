#!/usr/bin/env python3
"""Delegate-call trace analysis for documentation.json records.

Reproduces the member/delegate binding + emulation evidence used to
resolve SOAP action residuals:

  python3 tools/delegate_trace.py --emit-summaries
  python3 tools/delegate_trace.py --emit-objmap
  python3 tools/delegate_trace.py --verdicts

Pipeline:
  1. For every service, bind the implementation object's member
     delegates and the dispatcher-passed engine object (r4 = request
     object - globally opaque, proven by the vptr+0xc8 store census;
     r5 = service engine class).
  2. Emulate every vfunc target named by action implementation.calls
     plus every function named in existing residuals, recursively to
     DEPTH, recording direct calls, vfunc objects, member loads/stores
     on this, rodata strings, and fault-code constants.
  3. --emit-objmap propagates argument-object classes through the call
     graph (caller arg exprs resolved in the caller's class context) to
     a fixpoint.
  4. --verdicts walks each todo-bearing record's call graph from its
     delegate seeds and prints the terminal evidence and the open
     frontier (unbound vfunc objects with per-hop binding verdicts)
     backing that record's residual text.

All analysis runs against reference/public/files/opt/bin/anacapad and
reuses the emulator in extract_soap_api.py.
"""
import argparse, json, os, re, struct, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.dirname(
    os.path.abspath(__file__))))
import extract_soap_api as X

BIN = "reference/public/files/opt/bin/anacapad"

# Per-service delegate vptr bindings proven in the doc pass.
SVC_VPTR = {
    "/AlarmClock/Control": {"m4": ["0x10eaa99c"],
                            "mC": ["0x10eaaa14"], "m10": ["0x10eaaa28"]},
    "/DeviceProperties/Control": {"r5": ["0x10e98278"]},
    "/GroupManagement/Control": {"r5": ["0x10e98278", "0x10ec2bc0"]},
    "/HTControl/Control": {"m4": ["0x10ea6254"]},
    "/MediaRenderer/AVTransport/Control":
        {"r5": ["0x10eaf2ec", "0x10edfbb8"]},
    "/MediaRenderer/ConnectionManager/Control": {"m4": ["0x10eb86c8"]},
    "/MediaRenderer/GroupRenderingControl/Control":
        {"r5": ["0x10e97d30"]},
    "/MediaRenderer/Queue/Control": {"r5": ["0x10ed1bcc"]},
    "/MediaRenderer/RenderingControl/Control":
        {"r5": ["0x10e872f0", "0x10ed279c"]},
    "/MediaServer/ConnectionManager/Control": {"m4": ["0x10eb86c8"]},
    "/MediaServer/ContentDirectory/Control": {"r5": ["0x10ec0b08"]},
    "/MusicServices/Control": {"m4": ["0x10e768a4"]},
    "/SystemProperties/Control": {"m4": ["0x10e98278"]},
    "/ZoneGroupTopology/Control": {"m4": ["0x10e98278"]},
}

HELPER_FNS = re.compile(
    r"__stack_chk|__assert|_Znwm|_ZdlPv|_ZdaPv|__cxa|memset|memcpy|"
    r"memmove|strlen|strnlen|__aeabi|_Unwind|__gxx|abort|exit")

# Engine-class constructor addresses proven during the doc pass.
# Emulating each yields the class's member-vptr map (mv) and the
# member-object constructors called on this+K (mc, resolved via
# ctor_vptr on the constructing callee).
ENGINE_CTORS = {
    "0x10eaa99c": ["0x10276048", "0x102829f0"],
    "0x10e98278": [],
    "0x10ec2bc0": ["0x103938f0"],
    "0x10eaf2ec": ["0x102c05d8", "0x102cc070"],
    "0x10edfbb8": ["0x104000c4", "0x10404f0c", "0x10511f34"],
    "0x10eb86c8": ["0x1032e74c", "0x1032e7ac", "0x1032ead8"],
    "0x10e97d30": [
        "0x1019f774", "0x1019f78c", "0x1019f7cc", "0x1019f7e4",
        "0x102e7df0", "0x102e7e08", "0x102e7e48", "0x102e7e60",
        "0x102e7ea0", "0x102e7eb8", "0x1034fdcc", "0x1034fde4",
        "0x103577a0", "0x103577b8", "0x103577f8", "0x10357810",
        "0x10357850", "0x10357868", "0x103578a8", "0x103578c0",
        "0x10357900", "0x10357918", "0x1036d864", "0x1036d87c",
        "0x103a3f28", "0x103a3f40", "0x103a3f80", "0x103a3f98",
        "0x10472740", "0x10472758", "0x10472798", "0x104727b0",
        "0x104727f0", "0x10472808", "0x10472848", "0x10472860",
        "0x104728a0", "0x104728b8", "0x104728f8", "0x10472910",
        "0x10472950", "0x10472968",
    ],
    "0x10ed1bcc": ["0x10465994", "0x104659dc", "0x10465fac"],
    "0x10e872f0": [],
    "0x10ed279c": [],
    "0x10ec0b08": ["0x1037ca04", "0x1037e030"],
    "0x10e768a4": ["0x100c6950", "0x100cce6c", "0x100ccfe0"],
    "0x10ef4278": ["0x10396e68"],
}


def build_engine_members(elf, text, starts, extents, plt):
    """Emulate every engine-class ctor; collect member-field vptrs
    (rodata values stored into this+K) and member-object ctors
    (callees receiving this+K in arg3)."""
    cvp = _ctor_vptr_cache(elf, text, starts, extents, plt)
    out = {}
    for vptr, ctors in ENGINE_CTORS.items():
        mv, mc = {}, {}
        for ca in ctors:
            em = X.emu(elf, text, starts, extents, int(ca, 16), plt)
            if em is None:
                continue
            for pc, kind, ev in em.events:
                if kind == "store":
                    base, off = ev["addr"]
                    val = ev.get("src")
                    # this+K direct, or this+G via an add-folded base
                    koff = off if base == ("arg", 3) else None
                    if isinstance(base, tuple) and len(base) == 3 \
                            and base[0] == "add" \
                            and base[1] == ("arg", 3) \
                            and isinstance(base[2], int) \
                            and isinstance(off, int):
                        koff = (base[2] + off) & 0xFFFFFFFF
                    if koff and isinstance(val, int):
                        sec = elf.sect_of(val)
                        if sec in (".rodata", ".data.rel.ro",
                                   ".data"):
                            mv[f"{koff:#x}"] = f"{val:#x}"
                elif kind == "call":
                    a3 = (ev.get("args") or {}).get(3)
                    if isinstance(a3, tuple) and a3[0] == "add" \
                            and a3[1] == ("arg", 3) \
                            and isinstance(a3[2], int) and a3[2]:
                        mc[f"{a3[2] & 0xFFFFFFFF:#x}"] = \
                            f"{ev['target']:#x}"
                    elif a3 == ("arg", 3):
                        mc["0x0"] = f"{ev['target']:#x}"
        out[vptr] = {"mv": mv, "mc": mc, "ctors": ctors}
    return out


def summarize(elf, text, starts, extents, plt, lo, hi, t):
    em = X.emu(elf, text, starts, extents, t, plt)
    if em is None:
        return None
    calls, vcalls, mld, mst, strs, faults = [], [], {}, {}, [], []
    for pc, kind, ev in em.events:
        if kind == "call":
            nm = plt.get(ev["target"]) or (
                f"f_{ev['target']:x}" if lo <= ev["target"] < hi
                else None)
            calls.append({"pc": f"{pc:#x}", "f": nm,
                          "a3": X.vstr(ev["args"].get(3)),
                          "a4": X.vstr(ev["args"].get(4))})
            for r, a in ev["args"].items():
                s = X.rodata_str(elf, a) if isinstance(a, int) else None
                if s:
                    strs.append(s)
        elif kind == "vcall":
            a4 = ev["args"].get(4)
            s4 = X.rodata_str(elf, a4) if isinstance(a4, int) else None
            if isinstance(a4, int) and 0x64 <= a4 < 0x1000:
                faults.append({"pc": f"{pc:#x}", "code": a4})
            vcalls.append({"pc": f"{pc:#x}", "obj": X.vstr(ev["obj"]),
                           "slot": ev["slot"], "s4": s4})
        elif kind in ("load", "store"):
            b, k = X.flat_off(ev["addr"][0])
            off = (k + X.sgn32(ev["addr"][1])) & 0xFFFFFFFF \
                if isinstance(k, int) else None
            if isinstance(b, tuple) and b == ("arg", 3) and off:
                d = mld if kind == "load" else mst
                d[f"{off:#x}"] = d.get(f"{off:#x}", 0) + 1
            elif kind == "load" and isinstance(b, int):
                s = X.rodata_str(elf, b)
                if s:
                    strs.append(s)
    return {"calls": calls[:80], "vcalls": vcalls[:80],
            "member_loads": mld, "member_stores": mst,
            "strings": sorted(set(strs))[:40], "fault_codes": faults}


# ------------------------------------------------------------------
# stage 2: argument-object class propagation
# ------------------------------------------------------------------

def _ctor_vptr_cache(elf, text, starts, extents, plt):
    cache = {}
    def cvp(f):
        f = int(f, 16) if isinstance(f, str) else f
        if f not in cache:
            cache[f] = X.ctor_vptr(elf, text, starts, extents, f, plt)
        return cache[f]
    return cvp


def engine_member_maps(elf, engine_members_json):
    """ember_members.json: {vptr: {mv:{off:vptr}, mc:{off:ctor}, ctors}}
    Resolve each mc ctor's installed vptr; return {vptr: {off: vptr}}
    plus {vptr: [ctor_addrs]}."""
    member_map, ctors_of = {}, {}
    for v, d in (engine_members_json or {}).items():
        m = dict(d.get("mv") or {})
        member_map[v] = m
        ctors_of[v] = d.get("ctors") or []
    return member_map, ctors_of


def resolve_member_ctor_vptrs(elf, text, starts, extents, plt,
                              engine_members_json, member_map):
    cvp = _ctor_vptr_cache(elf, text, starts, extents, plt)
    for v, d in (engine_members_json or {}).items():
        m = member_map.setdefault(v, dict(d.get("mv") or {}))
        for off, callee in (d.get("mc") or {}).items():
            pv = cvp(callee)
            if pv:
                m[off] = f"{pv:#x}"


def propagate_objmap(elf, doc, fsum, member_map, lo, hi):
    """obj_map[fn] = {"r3": vptr, "r4": vptr, "r5": vptr}; fixpoint."""
    obj_map = {}
    for p, svc in doc["services"].items():
        vp = SVC_VPTR.get(p) or {}
        for an, act in (svc.get("actions") or {}).items():
            for c in (act.get("implementation") or {}) \
                    .get("calls") or []:
                o = str(c.get("obj"))
                key = {"*(r3-in+0x4)": "m4", "*(r3-in+0xc)": "mC",
                       "*(r3-in+0x10)": "m10", "r5-in": "r5"}.get(o)
                if not key and o.startswith("*(*(sp-"):
                    m = re.search(r"\+0x([0-9a-f]+)\)$", o)
                    key = {0xc: "mC", 0x10: "m10"}.get(
                        int(m.group(1), 16) if m else -1)
                if key and key in vp:
                    for v in vp[key]:
                        t = elf.u32(int(v, 16) + c["slot"])
                        if t and lo <= t < hi:
                            obj_map.setdefault(f"{t:#x}", {})["r3"] = v
            h = act.get("handler")
            if h:
                vps = vp.get("r5") or vp.get("m4") or []
                if vps:
                    obj_map.setdefault(h, {})["r5"] = vps[0]
                if (svc.get("object") or {}).get("vptr"):
                    obj_map.setdefault(h, {})["r3"] = \
                        svc["object"]["vptr"]

    def resolve_expr(expr, ctx):
        if expr is None:
            return None
        if expr in ("r3-in", "r4-in", "r5-in"):
            return ctx.get(expr[:2])
        m = re.fullmatch(r"\*\((r3|r4|r5)-in\+0x([0-9a-f]+)\)", expr)
        if m and ctx.get(m.group(1)):
            return (member_map.get(ctx[m.group(1)]) or {}).get(
                f"{int(m.group(2), 16):#x}")
        m = re.fullmatch(r"(0x[0-9a-f]+)", expr)
        if m:
            gp = elf.u32(int(m.group(1), 16))
            if gp:
                gv = elf.u32(gp)
                if gv and elf.sect_of(gv) in (".rodata",
                                              ".data.rel.ro"):
                    return f"{gv:#x}"
        m = re.fullmatch(r"\*\(0x([0-9a-f]+)\)", expr)
        if m:
            gp = elf.u32(int(m.group(1), 16))
            if gp:
                gv = elf.u32(gp)
                if gv and elf.sect_of(gv) in (".rodata",
                                              ".data.rel.ro"):
                    return f"{gv:#x}"
        return None

    changed, it = True, 0
    while changed and it < 8:
        changed, it = False, it + 1
        for fn, s in fsum.items():
            ctx = obj_map.get(fn)
            if not ctx:
                continue
            for c in s["calls"]:
                f = c.get("f") or ""
                if not f.startswith("f_"):
                    continue
                tgt = obj_map.setdefault(f"{int(f[2:], 16):#x}", {})
                for argn, key in (("a3", "r3"), ("a4", "r4")):
                    v = resolve_expr(c.get(argn), ctx)
                    if v and key not in tgt:
                        tgt[key] = v
                        changed = True
    return obj_map


# ------------------------------------------------------------------
# stage 3: per-record verdicts (frontier + evidence backing residuals)
# ------------------------------------------------------------------

NOTIFY = re.compile(r"notify|signal|gena|publish|post_event|"
                    r"send_event|fire|callback|emit|subscrib", re.I)

REQ_BOUNDARY = ("request object (opaque: built in the UPnP httpd "
                "action layer, dispatcher arg r4; the request vtable "
                "is never stored in .text - all 811 vptr+0xc8 sites "
                "are generic dispatch sites)")


def resolve_vcall(elf, member_map, ctors_of, obj_map, lo, hi, fn, vc):
    """-> (target|None, verdict)"""
    obj = vc["obj"] or "?"
    slot = vc.get("slot")
    ctx = obj_map.get(fn) or {}

    def bound(vptr):
        t = elf.u32(int(vptr, 16) + (slot or 0))
        return t if t and lo <= t < hi else None

    def bound2(vptr, off):
        t = elf.u32(int(vptr, 16) + off)
        return t if t and lo <= t < hi else None

    if obj in ("r3-in", "r4-in", "r5-in"):
        c = ctx.get(obj[:2])
        if c:
            t = bound(c)
            return t, ("%s v+%s -> f_%x" % (obj, hex(slot or 0), t)
                       if t else "%s v+%s (slot outside vtable)"
                       % (obj, hex(slot or 0)))
        if obj == "r4-in":
            return None, "arg4 object (%s)" % REQ_BOUNDARY
        return None, "%s object (caller-dependent)" % obj
    m = re.fullmatch(r"(?:\*\()?r3-in\+0x([0-9a-f]+)\)?", obj)
    if m:
        k = f"{int(m.group(1), 16):#x}"
        embedded = not obj.startswith("*(")
        c = ctx.get("r3")
        if c:
            mv = (member_map.get(c) or {}).get(k)
            if mv and embedded:
                # this+K is the embedded member itself; field K holds
                # its vptr
                t = bound(mv)
                return t, ("embedded member %s v+%s -> f_%x"
                           % (k, hex(slot or 0), t) if t else
                           "embedded member %s v+%s"
                           % (k, hex(slot or 0)))
            if mv:
                # *(this+K) is a pointer field; chase the stored
                # pointer's vptr
                p = elf.u32(int(mv, 16))
                if p and elf.sect_of(p) in (".rodata",
                                            ".data.rel.ro"):
                    t = bound(f"{p:#x}")
                    return t, ("member pointer %s -> vptr 0x%x v+%s "
                               "-> f_%x" % (k, p, hex(slot or 0), t)
                               if t else
                               "member pointer %s -> vptr 0x%x v+%s"
                               % (k, p, hex(slot or 0)))
                return None, ("member pointer field %s of %s holds "
                              "0x%s (a heap/runtime object pointer, "
                              "not a class) - object's ctor not "
                              "reachable (boundary)"
                              % (k, c, mv.lstrip("0x")))
            what = "embedded subobject" if embedded else "member"
            return None, ("%s %s of %s: none of the class's %d "
                          "emulated ctors installs a vptr/pointer at "
                          "the field; populated by runtime code outside"
                          " service construction (boundary)"
                          % (what, k, c, len(ctors_of.get(c) or [])))
        return None, ("member %s of this (caller-dependent class; no "
                      "install site resolved)" % k)
    m = re.fullmatch(r"\*\(0x([0-9a-f]+)(\+0x([0-9a-f]+))?\)", obj)
    if m:
        g = int(m.group(1), 16)
        k = int(m.group(3), 16) if m.group(3) else 0
        gp = elf.u32(g)
        if gp:
            gv = elf.u32(gp)
            if gv and elf.sect_of(gv) in (".rodata",
                                          ".data.rel.ro"):
                if k:
                    mv = (member_map.get(f"{gv:#x}") or {}) \
                        .get(f"{k:#x}")
                    if mv:
                        t = bound(mv)
                        return t, ("global 0x%x+0x%x v+%s -> f_%x"
                                   % (g, k, hex(slot or 0), t)
                                   if t else "global 0x%x+0x%x v+%s"
                                   % (g, k, hex(slot or 0)))
                    return None, ("member 0x%x of global object 0x%x: "
                                  "no ctor-installed vptr at the "
                                  "field (boundary)" % (k, g))
                t = bound(f"{gv:#x}")
                return t, ("global object 0x%x v+%s -> f_%x"
                           % (g, hex(slot or 0), t) if t else
                           "global object 0x%x v+%s"
                           % (g, hex(slot or 0)))
        return None, ("global pointer at 0x%x: runtime-initialized "
                      "(boundary)" % g)
    m = re.fullmatch(r"\*\(r3-in\+0x([0-9a-f]+)\)\+0x([0-9a-f]+)", obj)
    if m:
        k, j = f"{int(m.group(1), 16):#x}", f"{int(m.group(2), 16):#x}"
        c = ctx.get("r3")
        if c:
            mv = (member_map.get(c) or {}).get(k)
            if mv:
                mv2 = (member_map.get(mv) or {}).get(j)
                if mv2:
                    t = bound(mv2)
                    return t, ("member %s.%s v+%s -> f_%x"
                               % (k, j, hex(slot or 0), t) if t else
                               "member %s.%s v+%s"
                               % (k, j, hex(slot or 0)))
                return None, ("member %s of embedded member %s of %s: "
                              "second-level field not ctor-installed "
                              "(boundary)" % (j, k, c))
            return None, ("member %s of %s: no ctor-installed member "
                          "object at the field (boundary)" % (k, c))
        return None, ("member %s.%s of this (caller-dependent class)"
                      % (k, j))
    m = re.fullmatch(r"\*\((r[34])-in\+0x0\)\+0x([0-9a-f]+)", obj)
    if m:
        reg, k = m.group(1), int(m.group(2), 16)
        if reg == "r4":
            return None, ("request-object vfunc v+%s (request object "
                          "boundary: arg4; vtable never stored in "
                          ".text)" % hex(k))
        c = ctx.get("r3")
        if c:
            t = bound2(c, k)
            return t, ("this v+%s -> f_%x (resolved via class vptr %s)"
                       % (hex(k), t, c) if t else
                       "this v+%s on %s (slot outside vtable)"
                       % (hex(k), c))
        return None, ("this v+%s (caller-dependent class; no install "
                      "site resolved)" % hex(k))
    if re.fullmatch(r"0x[0-9a-f]+", obj):
        return None, ("immediate %s used as an object pointer "
                      "(dispatch through a constant - untaken path or "
                      "untracked conditional store in the linear "
                      "slice)" % obj)
    if re.fullmatch(r"r[0-9]+-in", obj):
        return None, ("%s object (caller-dependent argument)" % obj)
    if obj.startswith("vret") or obj.startswith("ret"):
        return None, ("call-returned object %s: callee return-class "
                      "unbound" % obj)
    if "sp-" in obj or "sp+" in obj:
        return None, ("stack-reloaded object %s: producer lies outside"
                      " the emulated linear slice" % obj)
    if obj == "?":
        return None, "opaque register object (dataflow lost)"
    return None, "object %s (unbound)" % obj


def walk_graph(elf, extents, fsum, member_map, ctors_of, obj_map,
               lo, hi, seed_fns, sec):
    ev, frontier, seen = [], [], set()
    stack = list(seed_fns)
    while stack:
        f = stack.pop()
        if f in seen or f not in extents:
            continue
        seen.add(f)
        s = fsum.get(f"{f:#x}")
        if s is None:
            frontier.append("f_%x (not emulated)" % f)
            continue
        name = "f_%x" % f
        ml, ms = s.get("member_loads", {}), s.get("member_stores", {})
        fc = s.get("fault_codes", [])
        if ml and sec in ("state_dependencies", "return_behavior",
                          "requirements", None):
            ev.append("%s reads member %s" % (name, ",".join(
                sorted(ml, key=lambda x: int(x, 16))[:8])))
        if ms and sec in ("state_transitions", "side_effects",
                          "return_behavior", None):
            ev.append("%s writes member %s" % (name, ",".join(
                sorted(ms, key=lambda x: int(x, 16))[:8])))
        if fc:
            ev.append("%s materializes fault %s" % (name, ",".join(
                "%s@%s" % (x["code"], x["pc"]) for x in fc[:6])))
        for c in s["calls"]:
            fn_ = c.get("f")
            if not fn_ or HELPER_FNS.search(fn_):
                continue
            if NOTIFY.search(fn_):
                ev.append("%s calls %s (event path)" % (name, fn_))
            elif fn_.startswith("f_"):
                stack.append(int(fn_[2:], 16))
            else:
                ev.append("%s -> plt:%s (library boundary)"
                          % (name, fn_))
        for vc in s["vcalls"]:
            t, verdict = resolve_vcall(elf, member_map, ctors_of,
                                       obj_map, lo, hi, f"{f:#x}", vc)
            if t:
                stack.append(t)
            else:
                frontier.append("%s: %s" % (name, verdict))
        if not s["calls"] and not s["vcalls"] and not ev:
            ev.append("%s is a leaf" % name)
    return ev, sorted(set(frontier))


SECS = {"requirements", "state_dependencies", "state_transitions",
        "events_triggered", "return_behavior", "side_effects",
        "validation", "errors", "internal_functions",
        "implementation"}


def seed_targets(elf, extents, lo, hi, svc_path, act, t):
    out = set()
    for c in (act or {}).get("implementation", {}).get("calls") or []:
        o = str(c.get("obj"))
        key = {"*(r3-in+0x4)": "m4", "*(r3-in+0xc)": "mC",
               "*(r3-in+0x10)": "m10", "r5-in": "r5"}.get(o)
        if not key and o.startswith("*(*(sp-"):
            m = re.search(r"\+0x([0-9a-f]+)\)$", o)
            key = {0xc: "mC", 0x10: "m10"}.get(
                int(m.group(1), 16) if m else -1)
        for v in (SVC_VPTR.get(svc_path) or {}).get(key or "", []):
            tt = elf.u32(int(v, 16) + c["slot"])
            if tt and lo <= tt < hi:
                out.add(tt)
    for m in re.findall(r"f_([0-9a-f]{6,8})", t):
        a = int(m, 16)
        if a in extents:
            out.add(a)
    return out


def _load(path, default):
    try:
        return json.load(open(path))
    except OSError:
        return default


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--emit-summaries", action="store_true")
    ap.add_argument("--emit-objmap", action="store_true")
    ap.add_argument("--verdicts", action="store_true")
    ap.add_argument("--out", default="/tmp/fn_summary.json")
    ap.add_argument("--objmap-out", default="/tmp/obj_map.json")
    ap.add_argument("--engine-members",
                    default="/tmp/engine_members.json",
                    help="ctor-derived member-vptr map JSON")
    ap.add_argument("--doc", default="docs/documentation.json")
    ap.add_argument("--depth", type=int, default=5)
    args = ap.parse_args()

    elf = X.Elf(BIN)
    text = X.Text(elf)
    starts, extents = X.build_funcmap(elf)
    plt = elf.plt_names
    lo, hi = text.base, text.hi
    doc = json.load(open(args.doc))

    if args.emit_objmap or args.verdicts:
        fsum = _load(args.out, None)
        if not fsum:
            sys.exit("run --emit-summaries first (missing %s)"
                     % args.out)
        em_ = _load(args.engine_members, None)
        if em_ is None:
            print("deriving engine member maps from ENGINE_CTORS...",
                  file=sys.stderr)
            em_ = build_engine_members(elf, text, starts, extents,
                                       plt)
        member_map, ctors_of = engine_member_maps(elf, em_)
        resolve_member_ctor_vptrs(elf, text, starts, extents, plt,
                                  em_, member_map)
        obj_map = propagate_objmap(elf, doc, fsum, member_map, lo, hi)
        print("obj_map: %d fns (r3:%d r4:%d r5:%d)"
              % (len(obj_map),
                 sum(1 for v in obj_map.values() if "r3" in v),
                 sum(1 for v in obj_map.values() if "r4" in v),
                 sum(1 for v in obj_map.values() if "r5" in v)))
        if args.emit_objmap:
            with open(args.objmap_out, "w") as fp:
                json.dump(obj_map, fp, indent=1)
            print("wrote %s" % args.objmap_out)
        if args.verdicts:
            for p, svc in sorted(doc["services"].items()):
                for an, act in sorted(
                        (svc.get("actions") or {}).items()):
                    for t in (act.get("todo") or []):
                        if not isinstance(t, str):
                            continue
                        seeds = seed_targets(elf, extents, lo, hi,
                                             p, act, t)
                        if not seeds:
                            continue
                        ev, frontier = walk_graph(
                            elf, extents, fsum, member_map, ctors_of,
                            obj_map, lo, hi, seeds, None)
                        print("%s %s" % (p, an))
                        for e in ev[:8]:
                            print("  + %s" % e)
                        for fr in frontier[:6]:
                            print("  ? %s" % fr)
        return

    # seed: every action delegate target + every fn named in todos
    seed = set()
    for p, svc in doc["services"].items():
        vp = SVC_VPTR.get(p) or {}
        for an, act in (svc.get("actions") or {}).items():
            h = act.get("handler")
            if h and int(h, 16) in extents:
                seed.add(int(h, 16))
            for c in (act.get("implementation") or {}) \
                    .get("calls") or []:
                o = str(c.get("obj"))
                key = {"*(r3-in+0x4)": "m4", "*(r3-in+0xc)": "mC",
                       "*(r3-in+0x10)": "m10", "r5-in": "r5"}.get(o)
                if not key and o.startswith("*(*(sp-"):
                    m = re.search(r"\+0x([0-9a-f]+)\)$", o)
                    key = {0xc: "mC", 0x10: "m10"}.get(
                        int(m.group(1), 16) if m else -1)
                if key and key in vp:
                    for v in vp[key]:
                        t = elf.u32(int(v, 16) + c["slot"])
                        if t and lo <= t < hi:
                            seed.add(t)
            for x in (act.get("todo") or []):
                if isinstance(x, str):
                    for m2 in re.findall(r"f_([0-9a-f]{6,8})", x):
                        a = int(m2, 16)
                        if a in extents:
                            seed.add(a)

    fsum = {}
    frontier = sorted(seed)
    seen = set()
    for depth in range(args.depth + 1):
        nxt = []
        for t in frontier:
            if t in seen or t not in extents:
                continue
            seen.add(t)
            s = summarize(elf, text, starts, extents, plt, lo, hi, t)
            if s is None:
                continue
            fsum[f"{t:#x}"] = s
            for c in s["calls"]:
                f = c.get("f") or ""
                if f.startswith("f_") and not HELPER_FNS.search(f):
                    nxt.append(int(f[2:], 16))
        frontier = sorted(set(nxt) - seen)
        print("depth %d: summarized %d, frontier %d"
              % (depth, len(fsum), len(frontier)),
              file=sys.stderr)

    with open(args.out, "w") as fp:
        json.dump(fsum, fp, indent=1)
        fp.flush()
        os.fsync(fp.fileno())
    print("wrote %d summaries -> %s" % (len(fsum), args.out))


if __name__ == "__main__":
    main()
