#!/usr/bin/env python3
"""Re-fold residual todo strings using the delegate_trace machinery
plus the image-wide store-xref census.

Per todo string naming f_ targets: seed-target extraction -> walk_graph
-> findings/residuals per section (same policy as the original
graph_fold.py).  Census binding: before folding, use store sites from
.scratch/store_xref.json to populate member_map fields that the
ctor-scan could not install a value for -- a store of a vptr pointer or
an expression resolving to a vptr at member offset K by any fn whose
r3 class is known binds member_map[class][K].
"""
import json, re, sys, os, collections
sys.path.insert(0, "tools")
sys.path.insert(0, ".")
import extract_soap_api as X
import delegate_trace as D

BIN = D.BIN
elf = X.Elf(BIN)
text = X.Text(elf)
starts, extents = X.build_funcmap(elf)
plt = elf.plt_names
lo, hi = text.base, text.hi
fsum = json.load(open(".scratch/fsum.json"))
doc = json.load(open("docs/documentation.json"))

# --- build maps (mirrors delegate_trace.main --emit-objmap) ---
em_ = D._load(".scratch/engine_members.json", None)
if em_ is None:
    print("deriving engine member maps...", file=sys.stderr)
    em_ = D.build_engine_members(elf, text, starts, extents, plt)
member_map, ctors_of = D.engine_member_maps(elf, em_)
D.resolve_member_ctor_vptrs(elf, text, starts, extents, plt, em_,
                            member_map)
cvp = D._ctor_vptr_cache(elf, text, starts, extents, plt)
obj_map = D.propagate_objmap(elf, doc, fsum, member_map, lo, hi)
for _ in range(3):
    D.augment_member_map(fsum, obj_map, member_map, cvp)
    obj_map = D.propagate_objmap(elf, doc, fsum, member_map, lo, hi)
print("obj_map: %d fns" % len(obj_map), file=sys.stderr)
def _tuple(v):
    """restore tuples from the callsite census JSON lists"""
    if isinstance(v, list):
        return tuple(_tuple(x) for x in v)
    return v

# vtable-derived r3 classes: a fn in exactly one rodata table's code
# slots has its 'this' class = that table's address point
fn_tables = json.load(open(".scratch/fn_tables.json"))
def bind_vtable_r3():
    n = 0
    for fh, tables in fn_tables.items():
        if len(tables) == 1:
            e = obj_map.setdefault(fh, {})
            if "r3" not in e:
                e["r3"] = tables[0]
                n += 1
    return n
print("vtable-bound r3: %d" % bind_vtable_r3(), file=sys.stderr)

def bind_callers(callsite_map, regs=("3", "5")):
    """obj_map[callee][r<reg>] = unanimous caller arg class."""
    bound_n = 0
    for callee, sites in callsite_map.items():
        ce = obj_map.setdefault(callee, {})
        for reg in regs:
            key = "r" + reg
            if key in ce:
                continue
            classes = set()
            n_known = 0
            for s in sites:
                a = (s.get("args") or {}).get(reg)
                if a is None:
                    continue
                cctx = obj_map.get(s["caller"]) or {}
                cls = D._class_of(elf, member_map, cctx, _tuple(a))
                if cls:
                    classes.add(cls)
                    n_known += 1
                else:
                    classes.add("<unbound>")
            if len(classes) == 1 and "<unbound>" not in classes:
                ce[key] = next(iter(classes))
                bound_n += 1
    return bound_n


# --- census: bind member_map fields image-wide ---
# A store "mem[b+k]=src" where b is the r3-in object of a fn whose r3
# class C is known: any such store at member offset k installs a value
# into field k of C.  When src resolves to a vptr pointer (rodata or
# ctor-derived vptr), record member_map[C][k] = vptr.
xref = json.load(open(".scratch/store_xref.json"))
xbind = 0
for off, sites in xref.items():
    for site in sites:
        base, src = site["base"], site["src"]
        # r3-in stores: class from the storing fn's bound r3
        classes = []
        if base == "r3-in":
            C = (obj_map.get(site["fn"]) or {}).get("r3")
            if C:
                classes = [C]
        else:
            # 0xG bases: absolute object address; its class is the
            # vptr at *G when that's a rodata vptr. *(0xG) bases:
            # pointer chase -- object is *G, vptr at *(*G).
            mg = re.fullmatch(r"0x([0-9a-f]+)", base)
            mg2 = re.fullmatch(r"\*\(0x([0-9a-f]+)\)", base)
            g = mg.group(1) if mg else \
                (mg2.group(1) if mg2 else None)
            if g:
                g = int(g, 16)
                ov = elf.u32(g)
                if mg2 and ov:
                    ov = elf.u32(ov)
                if ov and elf.sect_of(ov) in (".rodata",
                                              ".data.rel.ro"):
                    classes = [f"{ov:#x}"]
        if not classes:
            continue
        cand = None
        if re.fullmatch(r"0x[0-9a-f]+", src):
            v = int(src, 16)
            # stored value is an address: if it points at rodata/
            # .data.rel.ro it's a vptr or constant table pointer
            if elf.sect_of(v) in (".rodata", ".data.rel.ro"):
                cand = src
        elif src.startswith("ret(0x"):
            # stored = return value of a call; if callee is a known
            # ctor-ish fn returning 'this', use its vptr
            mr = re.match(r"ret\(0x([0-9a-f]+)\)", src)
            pv = mr and cvp(int(mr.group(1), 16))
            if pv:
                cand = f"{pv:#x}"
        if cand:
            for C in classes:
                mm = member_map.setdefault(C, {})
                if off not in mm:
                    mm[off] = cand
                    xbind += 1
print("census-bound member fields: %d" % xbind, file=sys.stderr)

# absolute-address cells: *(0xADDR) -> producer srcs, for singleton
# globals and GOT-slotted objects whose class is installed at init
global_xref = collections.defaultdict(list)
for off, sites in xref.items():
    for s in sites:
        m = re.fullmatch(r"\*\((0x[0-9a-f]+)\+0x[0-9a-f]+\)", s["base"])
        if m:
            global_xref[m.group(1)].append(
                {"fn": s["fn"], "pc": s["pc"], "src": s["src"]})

def class_of_expr(e, ctx=None, depth=0):
    """expr -> vptr class, using member_map + census global cells."""
    if depth > 4 or e is None:
        return None
    if isinstance(e, str):
        if e.startswith("0x"):
            return e
        return _ret_src_class(e) or None
    if not isinstance(e, tuple):
        return None
    if e[0] == "load":
        b, k = X.flat_off(e[1])
        if isinstance(b, int) and isinstance(e[2], int):
            cell = (b + e[2]) & 0xFFFFFFFF
            p = elf.u32(cell)
            if p and elf.sect_of(p) in (".rodata", ".data.rel.ro"):
                return f"{p:#x}"          # cell holds a vptr directly
            srcs = {_ret_src_class(s["src"]) or s["src"]
                    for s in global_xref.get(f"{cell:#x}", [])}
            srcs.discard("0x0")
            if len(srcs) == 1:
                return next(iter(srcs))
            if srcs:
                return "union{" + ",".join(sorted(srcs)) + "}"
        return class_of_expr(e[1], ctx, depth + 1)
    if e[0] == "arg" and ctx:
        return ctx.get("r%d" % e[1])
    if e[0] == "call":
        # return-through-call: class of the inner callee's r3
        pv = cvp(e[1])
        if pv:
            return f"{pv:#x}"
        for re2 in D.ret_exprs(elf, text, starts, extents, plt,
                               e[1]):
            c2 = class_of_expr(re2, obj_map.get(f"{e[1]:#x}") or {},
                               depth + 1)
            if c2:
                return c2
        return None
    if e[0] == "vret" and ctx:
        return None
    return None

# (fn, slot-base-string) -> producer srcs for stack-reload binding.
# Bind ret(0xT) producers: ctor vptr if T is a ctor, else the callee's
# own return-expression class.
def _ret_src_class(src):
    m = re.match(r"ret\(0x([0-9a-f]+)\)(\+0x[0-9a-f]+)?$", src)
    if not m:
        return None
    T = int(m.group(1), 16)
    pv = cvp(T)
    if pv:
        return f"{pv:#x}"
    for re_ in D.ret_exprs(elf, text, starts, extents, plt, T):
        cls = D._class_of(elf, member_map, obj_map.get(f"{T:#x}") or {},
                          re_)
        if cls is None:
            cls = class_of_expr(re_, obj_map.get(f"{T:#x}") or {})
        if cls:
            return cls
    return None

slot_xref = {}
for off, sites in xref.items():
    if off != "0x0":
        # only stores INTO the cell are producers; stores to
        # *(slot+K) write a field of the pointed-to object
        continue
    for s in sites:
        if s["base"].startswith("*(") and "sp" in s["base"]:
            src = _ret_src_class(s["src"]) or s["src"]
            slot_xref.setdefault((s["fn"], s["base"]),
                                 []).append({"pc": s["pc"],
                                             "src": src})

# --- callsite census: caller-directed r3/r5 binding ---
import glob
callsite_map = {}
for p in glob.glob(".scratch/callsite_k*.json"):
    for callee, sites in json.load(open(p)).items():
        callsite_map.setdefault(callee, []).extend(sites)
print("callsite callees: %d" % len(callsite_map), file=sys.stderr)
# iterate: new r3 classes expose new caller-side resolutions;
# merge propagated entries without discarding bound ones
def merge_propagate():
    p = D.propagate_objmap(elf, doc, fsum, member_map, lo, hi)
    for k, v in p.items():
        e = obj_map.setdefault(k, {})
        for kk, vv in v.items():
            e.setdefault(kk, vv)
for _round in range(4):
    n = bind_callers(callsite_map)
    n += bind_vtable_r3()
    print("bound this round: %d" % n, file=sys.stderr)
    merge_propagate()
    if not n:
        break

SECS = {"requirements", "state_dependencies", "state_transitions",
        "events_triggered", "return_behavior", "side_effects",
        "validation", "errors", "internal_functions",
        "implementation"}
REQ_B = D.REQ_BOUNDARY
stats = {"fold": 0, "res": 0, "same": 0}

def proc(o, svc_path, act, sec):
    if "todo" not in o:
        return
    new = []
    for t in (o["todo"] if isinstance(o["todo"], list) else [o["todo"]]):
        if not isinstance(t, str):
            new.append(t)
            continue
        seeds = D.seed_targets(elf, extents, lo, hi, svc_path, act, t)
        if not seeds:
            new.append(t)
            stats["same"] += 1
            continue
        ev, frontier = D.walk_graph(
            elf, text, starts, extents, plt, fsum, member_map,
            ctors_of, obj_map, lo, hi, seeds, sec, slot_xref)
        has_req = "r4-in" in t or "req->v[" in t or "request" in t
        for e in ev[:8]:
            o.setdefault("resolved_findings", []).append(
                "Finding: " + e)
        if not frontier:
            if has_req:
                new.append(
                    "Residual: delegate-side behavior fully traced "
                    "(findings folded); the remaining input side "
                    "depends on the " + REQ_B + ".")
                stats["res"] += 1
            else:
                stats["fold"] += 1
            continue
        tail = ("; input side also depends on the " + REQ_B
                if has_req else "")
        new.append("Residual: " + "; ".join(frontier[:4]) + tail + ".")
        stats["res"] += 1
    if new:
        o["todo"] = new
    else:
        del o["todo"]

def walk(o, svc_path, act, sec):
    if isinstance(o, dict):
        proc(o, svc_path, act, sec)
        for k, v in o.items():
            walk(v, svc_path, act, k if k in SECS else sec)
    elif isinstance(o, list):
        for v in o:
            walk(v, svc_path, act, sec)

# warmup: resolved vcall targets record their r3 class into obj_map;
# walk every residual's seeds to a fixpoint so later proc() calls see
# classes discovered in earlier ones
def all_seeds():
    for p, svc in sorted(doc["services"].items()):
        for an, act in sorted((svc.get("actions") or {}).items()):
            for t in (act.get("todo") or []):
                if isinstance(t, str):
                    sd = D.seed_targets(elf, extents, lo, hi, p, act, t)
                    if sd:
                        yield sd
for _ in range(3):
    before = repr(sorted(obj_map.items()))
    for sd in all_seeds():
        D.walk_graph(elf, text, starts, extents, plt, fsum,
                     member_map, ctors_of, obj_map, lo, hi, sd, None,
                     slot_xref)
    if repr(sorted(obj_map.items())) == before:
        break
print("after warmup: %d fns" % len(obj_map), file=sys.stderr)

for p, svc in doc["services"].items():
    for an, act in (svc.get("actions") or {}).items():
        walk(act, p, act, None)
    for k, v in svc.items():
        if k != "actions":
            walk(v, p, None, k if k in SECS else None)
for k in ("subsystems", "shared_primitives", "internal_functions",
          "request_vtable", "routing", "muse", "cert_layer"):
    walk(doc.get(k), None, None, None)

print(stats)
out = json.dumps(doc, indent=1)
with open(".scratch/doc_folded.json", "w") as f:
    f.write(out)
    f.flush()
    os.fsync(f.fileno())
json.dump(obj_map, open(".scratch/obj_map_fold.json", "w"))
print("wrote .scratch/doc_folded.json")
