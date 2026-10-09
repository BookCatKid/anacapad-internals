#!/usr/bin/env python3
"""extract_soap_api.py -- binary-only SOAP/UPnP surface extractor for the
stripped 32-bit big-endian PowerPC `anacapad` binary.

No SCPD XML or external API description is used: service identity, routing,
actions, handler resolution, argument semantics and fault codes are all
recovered from the binary itself.

Pipeline:
  1. ELF + dynamic symbols + PLT-stub map (8-byte stubs keyed to .rela.plt)
  2. Function map: .eh_frame FDE extents + stwu prologues + bl targets
  3. Per-function linear register/stack emulator tracking string and
     immediate materialisation, stack stores, vptr-slot loads and indirect
     calls
  4. Routers: functions materialising >=2 '/Svc/Control' path strings are
     emulation-traced to recover {obj, path, name, flags, enabled} records
     and the fallback chain between routers
  5. Service objects -> vptr via constructor-call-site analysis
     (r3 = base+off -> bl ctor -> `stw vptr, 0(r3)`)
  6. Dispatchers: service vptr slot +8; plus an exhaustive sweep for
     dispatcher-shaped functions not reachable from registration records
  7. Handlers: bounded by the function map; arg reads/writes classified by
     the request-vfunc slot invoked (+0x1c/+0x20 in, +0x24/+0x28 out,
     +0x14 fault, +0x0c/+0x10 commit); trailing helper calls are decoded once each to
     recover typed-buffer tags / format strings
  8. Capability plumbing: readers/writers of the enabled bytes and the
     capability-mask word

Every emitted fact carries an evidence address; decoded-vs-raw outcomes
are recorded in the structured `kind` fields.

Usage:  extract_soap_api.py ANACAPAD [--json OUT] [-v]
"""
import argparse
import bisect
import json
import re
import struct
import sys

# =================================================================== ELF ===

class Elf:
    def __init__(self, path):
        self.path = path
        self.data = open(path, "rb").read()
        d = self.data
        assert d[:4] == b"\x7fELF" and d[4] == 1 and d[5] == 2, \
            "expected 32-bit big-endian ELF"
        (self.entry,) = struct.unpack_from(">I", d, 0x18)
        phoff, shoff = struct.unpack_from(">II", d, 0x1C)
        phentsize, phnum = struct.unpack_from(">HH", d, 0x2A)
        shentsize, shnum, shstrndx = struct.unpack_from(">HHH", d, 0x2E)
        self.phdrs = []
        for i in range(phnum):
            t, off, va, pa, fsz, msz, fl, al = struct.unpack_from(
                ">IIIIIIII", d, phoff + i * phentsize)
            self.phdrs.append(dict(type=t, off=off, va=va, fsz=fsz))
        shstr = struct.unpack_from(">I", d, shoff + shstrndx * shentsize + 16)[0]
        self.sects = {}
        for i in range(shnum):
            (noff, ty, flags, addr, off, size, link, info, align,
             entsz) = struct.unpack_from(">IIIIIIIIII", d,
                                         shoff + i * shentsize)
            e = d.index(b"\0", shstr + noff)
            self.sects[d[shstr + noff:e].decode()] = dict(
                va=addr, off=off, size=size, type=ty, flags=flags)
        self.dynsyms = []
        if ".dynsym" in self.sects:
            ds = self.sects[".dynsym"]
            dst = self.sects[".dynstr"]
            for i in range(ds["size"] // 16):
                n, val, sz, info, oth, sh = struct.unpack_from(
                    ">IIIBBH", d, ds["off"] + i * 16)
                e = d.index(b"\0", dst["off"] + n)
                self.dynsyms.append(d[dst["off"] + n:e].decode(
                    "utf-8", "replace"))
        # PLT stubs: 8 bytes each, addresses match .rela.plt r_offset order
        # (BSS-plt; stubs are linker-synthesised, not file-backed).
        self.plt_names = {}
        if ".rela.plt" in self.sects:
            rp = self.sects[".rela.plt"]
            for i in range(rp["size"] // 12):
                off, info, add = struct.unpack_from(
                    ">III", d, rp["off"] + i * 12)
                sym = info >> 8
                if sym < len(self.dynsyms):
                    self.plt_names[off] = self.dynsyms[sym]

    def v2f(self, va):
        for p in self.phdrs:
            if p["type"] == 1 and p["va"] <= va < p["va"] + p["fsz"]:
                return p["off"] + (va - p["va"])
        return None

    def u32(self, va):
        fo = self.v2f(va)
        return struct.unpack(">I", self.data[fo:fo + 4])[0] \
            if fo is not None else None

    def cstr(self, va, maxlen=4096):
        fo = self.v2f(va)
        if fo is None:
            return None
        e = self.data.find(b"\0", fo, fo + maxlen)
        if e < 0:
            return None
        try:
            s = self.data[fo:e].decode("utf-8")
        except UnicodeDecodeError:
            return None
        return s or None

    def sect_of(self, va):
        for nm, s in self.sects.items():
            if s["va"] <= va < s["va"] + s["size"]:
                return nm
        return None


# ============================================================ PPC decode ===

_D = {7: "mulli", 8: "subfic", 10: "cmplwi", 11: "cmpwi", 12: "addic",
      13: "addic.", 14: "addi", 15: "addis", 24: "ori", 25: "oris",
      26: "xori", 27: "xoris", 28: "andi.", 29: "andis.",
      32: "lwz", 33: "lwzu", 34: "lbz", 35: "lbzu", 36: "stw", 37: "stwu",
      38: "stb", 39: "stbu", 40: "lhz", 41: "lhzu", 42: "lha", 44: "sth",
      45: "sthu", 46: "lmw", 47: "stmw"}

_XO = {0: "cmp", 19: "mfcr", 24: "slw", 26: "cntlzw", 28: "and", 32: "cmpl",
       40: "subf", 60: "andc", 87: "lbzx", 124: "nor", 150: "stwcx.",
       266: "add", 279: "lhzx", 316: "xor", 339: "mfspr", 343: "lhax",
       371: "mftb", 407: "stwx", 412: "orc", 444: "or", 467: "mtspr",
       476: "nand", 536: "srw", 55: "lwzx", 792: "sraw", 922: "extsh",
       954: "extsb", 311: "sthx", 247: "stbx", 23: "lwzux", 183: "stwux"}


def decode(w, pc):
    op = w >> 26
    if op in _D:
        rd, ra = (w >> 21) & 31, (w >> 16) & 31
        imm = w & 0xFFFF
        m = _D[op]
        if m in ("andi.", "andis.", "ori", "oris", "xori", "xoris"):
            return (m, rd, ra, imm)
        if imm & 0x8000:
            imm -= 0x10000
        return (m, rd, ra, imm)
    if op == 18:
        li = w & 0x03FFFFFC
        if li & 0x02000000:
            li -= 0x04000000
        tgt = li if (w & 2) else (pc + li) & 0xFFFFFFFF
        return ("bl" if w & 1 else "b", tgt)
    if op == 16:
        bo, bi = (w >> 21) & 31, (w >> 16) & 31
        bd = w & 0xFFFC
        if bd & 0x8000:
            bd -= 0x10000
        tgt = bd if (w & 2) else (pc + bd) & 0xFFFFFFFF
        if bo == 20 and not (w & 1):
            return ("b", tgt)
        return ("bc", bo, bi, tgt)
    if op == 19:
        xo = (w >> 1) & 0x3FF
        if xo == 16:
            return ("blrl",) if (w & 1) else ("blr",)
        if xo == 528:
            return ("bctrl",) if (w & 1) else ("bctr",)
        return ("bc19", xo)
    if op in (20, 21, 23):                    # rlwimi / rlwinm / rlwnm
        rs, ra, sh = (w >> 21) & 31, (w >> 16) & 31, (w >> 11) & 31
        mb, me = (w >> 6) & 31, (w >> 1) & 31
        m = {20: "rlwimi", 21: "rlwinm", 23: "rlwnm"}[op]
        if op == 21 and mb == 0 and me == 31 - sh:
            return ("slwi", ra, rs, sh)
        if op == 21 and sh == 0 and me == 31:
            return ("srwi" if mb else "clrrwi", ra, rs, 32 - mb if mb else 0)
        return (m, ra, rs, sh, mb, me)
    if op == 31:
        xo = (w >> 1) & 0x3FF
        m = _XO.get(xo)
        if m is None:
            return ("op31", xo)
        v21, v16, v11 = (w >> 21) & 31, (w >> 16) & 31, (w >> 11) & 31
        # PPC XO logical ops:  op rA(dest), rS(v21), rB(v11)
        # PPC XO arith ops:    op rD(dest=v21), rA(v16), rB(v11)
        if m in ("or", "and", "xor", "nand", "nor", "andc", "orc",
                 "slw", "srw", "sraw"):
            if m == "or" and v21 == v11:
                return ("mr", v16, v21)          # mr rA, rS
            return (m, v16, v21, v11)            # dest, srcS, srcB
        if m in ("extsb", "extsh", "cntlzw"):
            return (m, v16, v21)                 # dest, src
        if m == "cmp" or m == "cmpl":
            return (m, v21, v16, v11)            # crf, rA, rB
        if m == "mtspr":
            spr = v16 | (v11 << 5)
            return ({8: "mtlr", 9: "mtctr"}.get(spr, "mtspr"), v21)
        if m == "mfspr":
            spr = v16 | (v11 << 5)
            return ({8: "mflr", 9: "mfctr"}.get(spr, "mfspr"), v21)
        if m in ("lwarx",):
            return (m, v21, v16, v11)
        # indexed loads/stores and arith: dest=v21, base/index=v16,v11
        return (m, v21, v16, v11)
    return ("x", op)


# ====================================================== function map ======

def parse_eh_frame(elf):
    s = elf.sects.get(".eh_frame")
    if not s:
        return {}
    d, base, off, size = elf.data, s["va"], s["off"], s["size"]
    out = {}
    i = 0
    while i + 8 <= size:
        length, cie_off = struct.unpack_from(">II", d, off + i)
        if length in (0, 0xFFFFFFFF):
            i += 4
            continue
        if cie_off != 0:
            loc_pos = base + i + 8
            (rel,) = struct.unpack_from(">i", d, off + i + 8)
            start = (loc_pos + rel) & 0xFFFFFFFF
            (rng,) = struct.unpack_from(">I", d, off + i + 12)
            if start:
                out[start] = rng
        i += 8 + length
    return out


def build_funcmap(elf):
    fdes = parse_eh_frame(elf)
    starts = set(fdes)
    T = elf.sects[".text"]
    base, size, off = T["va"], T["size"], T["off"]
    words = elf.data[off:off + size]
    for i in range(0, size & ~3, 4):
        (w,) = struct.unpack_from(">I", words, i)
        ins = decode(w, base + i)
        if ins[0] == "bl":
            starts.add(ins[1])
        elif ins[0] == "stwu" and ins[1] == 1 and ins[2] == 1:
            starts.add(base + i)
    # functions reachable only via vtables: any rodata word pointing into
    # .text is a candidate entry
    for sname in (".rodata", ".data.rel.ro", ".data"):
        s = elf.sects.get(sname)
        if not s:
            continue
        w = elf.data[s["off"]:s["off"] + s["size"]]
        for i in range(0, s["size"] & ~3, 4):
            (p,) = struct.unpack_from(">I", w, i)
            if base <= p < base + size:
                starts.add(p)
    # gap starts: code right after an FDE end that has no known start
    # (e.g. switch-driven blobs with no prologue/FDE)
    for s, r in fdes.items():
        e = s + r
        if e < base + size and e not in starts and \
                struct.unpack_from(">I", words, e - base)[0] != 0:
            starts.add(e)
    starts = sorted(x for x in starts if base <= x < base + size)

    def is_boundary(x):
        """x looks like a real function boundary iff the preceding word is
        a terminator/padding (incl. calls to noreturn funcs such as
        __stack_chk_fail, after which a new function legitimately starts),
        or x is an FDE start."""
        if x in fdes:
            return True
        if x - 4 < base:
            return True
        ins = decode(struct.unpack_from(">I", words, x - 4 - base)[0], x - 4)
        if ins is None:
            return True
        if ins[0] in ("blr", "bctr", "bcctr", "bc19", "x"):
            return True
        if ins[0] in ("b", "bc"):
            # unconditional tail jumps end the function; conditional bc
            # to a noreturn stub also terminates the reachable flow here
            tgt = ins[1] if ins[0] == "b" else ins[3]
            return ins[0] == "b" or elf.plt_names.get(tgt) in NORETURN
        if ins[0] == "bl":
            return elf.plt_names.get(ins[1]) in NORETURN
        return False

    extents = {}
    for j, s in enumerate(starts):
        if s in fdes:
            # FDE range is authoritative even if heuristic starts fall inside
            extents[s] = s + fdes[s]
            continue
        # non-FDE start: extend to the first later start that is a real
        # boundary (dual-entry ctors and mid-blob arm labels are NOT
        # boundaries -- their preceding insn is not a terminator)
        e = min(s + 0x40000, base + size)
        for k in range(j + 1, len(starts)):
            x = starts[k]
            if x >= e:
                break
            if is_boundary(x):
                e = x
                break
        extents[s] = max(e, s + 4)
    return starts, extents


def func_of(starts, va):
    i = bisect.bisect_right(starts, va) - 1
    return starts[i] if i >= 0 else None


class Text:
    def __init__(self, elf):
        s = elf.sects[".text"]
        self.base, self.size = s["va"], s["size"]
        self.words = elf.data[s["off"]:s["off"] + s["size"]]
        self.hi = self.base + self.size

    def ins(self, va):
        if not (self.base <= va < self.hi):
            return None
        (w,) = struct.unpack_from(">I", self.words, va - self.base)
        return decode(w, va)


# ============================================================ emulator ====
# Values:  int                        known constant / address
#          ("arg", n)                 incoming r<n> argument
#          ("add", v, k)              v + k  (k may be int or reg tuple)
#          ("load", v, k)             *(v + k)
#          ("call", fva)              return value of direct call
#          ("vret", base_v, slot)     return value of vfunc call
#          ("sdata", name)            r1-sp / r2 / r13 bases
#          ("xform", op, v)           one-input transform (and/xor/shift...)

VOL = {0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12}

NORETURN = {"__stack_chk_fail", "abort", "exit", "_exit",
            "__assert_fail", "std::terminate", "pthread_exit"}


def vadd(v, k):
    if v is None:
        return None
    if k == 0:
        return v
    if isinstance(v, int):
        return (v + k) & 0xFFFFFFFF
    if v[0] == "add" and isinstance(v[2], int) and isinstance(k, int):
        return ("add", v[1], v[2] + k)
    return ("add", v, k)


def vstr(v):
    if v is None:
        return "?"
    if isinstance(v, int):
        return f"{v:#x}"
    k = v[0]
    if k == "arg":
        return f"r{v[1]}-in"
    if k == "add":
        return f"{vstr(v[1])}{v[2]:+#x}" if isinstance(v[2], int) else \
               f"{vstr(v[1])}+{vstr(v[2])}"
    if k == "load":
        return f"*({vstr(v[1])}+{v[2]:#x})"
    if k == "call":
        return f"ret({v[1]:#x})"
    if k == "vret":
        return f"vret({vstr(v[1])},+{v[2]:#x})" \
            if isinstance(v[2], int) else f"vret({vstr(v[1])},{v[2]})"
    if k == "sdata":
        return v[1]
    if k == "xform":
        return f"{v[1]}({vstr(v[2])})"
    return f"{k}({vstr(v[1]) if len(v)>1 else ''})"


def flat_off(v):
    """("add", base, K) chains -> (base_residual, total_const)."""
    tot = 0
    while isinstance(v, tuple) and v[0] == "add" and isinstance(v[2], int):
        tot += v[2]
        v = v[1]
    return v, tot


class FuncEmu:
    def __init__(self, elf, text, start, end, plt):
        self.elf, self.t, self.plt = elf, text, plt
        self.start, self.end = start, end
        self.reg = [None] * 32
        self.reg[1] = ("sdata", "sp")
        self.reg[2] = ("sdata", "r2")
        self.reg[13] = ("sdata", "r13")
        for n in range(3, 11):
            self.reg[n] = ("arg", n)
        self.mem = {}
        self.ctr = None
        self.labels = set()
        self.events = []
        va = start
        while va < end:
            ins = text.ins(va)
            if ins and ins[0] in ("b", "bc"):
                t = ins[1] if ins[0] == "b" else ins[3]
                if start < t < end:
                    self.labels.add(t)
            va += 4

    def run(self):
        # Note: we deliberately do NOT clear registers at branch targets.
        # The compiler schedules value materialisation and use within a few
        # instructions; clearing at merge points loses more than stale
        # values would cost.
        va = self.start
        while va < self.end:
            ins = self.t.ins(va)
            if ins is not None:
                self.step(va, ins)
            va += 4
        return self

    def step(self, va, ins):
        op = ins[0]
        R = self.reg
        if op == "addis":
            _, rd, ra, imm = ins
            if ra == 0:                             # lis
                self.reg[rd] = (imm << 16) & 0xFFFFFFFF
            else:
                self.reg[rd] = vadd(R[ra], imm << 16)
        elif op in ("addi", "addic", "addic."):
            _, rd, ra, imm = ins
            self.reg[rd] = imm & 0xFFFFFFFF if ra == 0 else vadd(R[ra], imm)
        elif op == "subfic":
            self.reg[ins[1]] = ("sub", ins[3] & 0xFFFF, R[ins[2]])
        elif op == "ori":
            _, rd, ra, imm = ins
            v = R[ra]
            self.reg[rd] = (v | imm) & 0xFFFFFFFF if isinstance(v, int) \
                else ("or", v, imm)
        elif op == "oris":
            _, rd, ra, imm = ins
            v = R[ra]
            self.reg[rd] = (v | (imm << 16)) & 0xFFFFFFFF \
                if isinstance(v, int) else ("or", v, imm << 16)
        elif op == "xori":
            _, rd, ra, imm = ins
            self.reg[rd] = ("xor", R[ra], imm)
        elif op == "andi.":
            _, rd, ra, imm = ins
            self.reg[rd] = ("and", R[ra], imm)
        elif op == "andis.":
            _, rd, ra, imm = ins
            self.reg[rd] = ("and", R[ra], imm << 16)
        elif op == "mr":
            self.reg[ins[1]] = R[ins[2]]
        elif op == "add":
            _, rd, ra, rb = ins
            a, b = R[ra], R[rb]
            if isinstance(a, int) and isinstance(b, int):
                self.reg[rd] = (a + b) & 0xFFFFFFFF
            elif isinstance(a, int):
                self.reg[rd] = vadd(b, a)
            elif isinstance(b, int):
                self.reg[rd] = vadd(a, b)
            else:
                self.reg[rd] = ("add", a, b)
        elif op == "subf":
            _, rd, ra, rb = ins
            self.reg[rd] = ("sub", R[rb], R[ra])
        elif op in ("slwi", "srwi", "clrrwi"):
            self.reg[ins[1]] = ("xform", op, R[ins[2]])
        elif op in ("slw", "srw", "rlwinm", "rlwnm", "rlwimi", "and", "andc",
                    "or", "xor", "orc", "nand", "nor", "extsh", "extsb",
                    "cntlzw", "sraw", "mulli"):
            self.reg[ins[1]] = ("xform", op, R[ins[2]])
        elif op in ("lwz", "lbz", "lhz", "lha", "lwzu", "lbzu", "lhzu"):
            _, rd, ra, imm = ins
            base = R[ra] if ra else 0
            key = ("m", base, imm & 0xFFFFFFFF)
            v = self.mem.get(key)
            if v is None:
                v = ("load", base if base is not None else 0,
                     imm & 0xFFFFFFFF)
            self.reg[rd] = v
            if op.endswith("u") and ra:
                self.reg[ra] = vadd(R[ra], imm)
            self.events.append((va, "load", {"reg": rd, "addr":
                                             (base, imm & 0xFFFFFFFF),
                                             "val": v, "size": op}))
        elif op in ("stw", "stb", "sth", "stbu", "sthu", "stmw", "lmw",
                    "stwu"):
            _, rs, ra, imm = ins
            if op == "stwu" and rs == 1 and ra == 1:
                self.reg[1] = vadd(self.reg[1], imm)
                return
            if op in ("stmw", "lmw"):
                base0 = R[ra] if ra else 0
                for rn in range(rs, 32):
                    k2 = ("m", base0,
                          (imm + 4 * (rn - rs)) & 0xFFFFFFFF)
                    if op == "stmw":
                        self.mem[k2] = R[rn]
                    else:
                        R[rn] = self.mem.get(k2) or \
                            ("load", base0 if base0 is not None else 0,
                             (imm + 4 * (rn - rs)) & 0xFFFFFFFF)
                return
            base = R[ra] if ra else 0
            key = ("m", base, imm & 0xFFFFFFFF)
            self.mem[key] = R[rs]
            if op.endswith("u") and ra:
                self.reg[ra] = vadd(R[ra], imm)
            self.events.append((va, "store", {"src": R[rs],
                                              "addr": (base,
                                                       imm & 0xFFFFFFFF),
                                              "size": op}))
        elif op in ("lwzx", "lbzx", "lhzx", "lhax"):
            _, rd, ra, rb = ins
            self.reg[rd] = ("loadx", R[ra] if ra else 0, R[rb])
        elif op in ("stwx", "stbx", "sthx", "stwux", "lwzux"):
            _, rs, ra, rb = ins
            self.events.append((va, "storex",
                                {"src": R[rs], "base": R[ra],
                                 "idx": R[rb], "size": op}))
        elif op == "mtctr":
            self.ctr = R[ins[1]]
        elif op in ("bctrl", "bctr"):
            tgt = self.ctr
            obj, slot = None, None
            if isinstance(tgt, tuple) and tgt[0] == "load" \
                    and isinstance(tgt[1], tuple) \
                    and tgt[1][0] == "load" and tgt[1][2] == 0:
                obj, slot = tgt[1][1], tgt[2]
            elif isinstance(tgt, tuple) and tgt[0] == "load":
                obj, slot = tgt[1], tgt[2]
            self.events.append((va, "vcall",
                                {"ctr": tgt, "obj": obj, "slot": slot,
                                 "link": op == "bctrl",
                                 "args": {n: R[n] for n in range(3, 11)}}))
            if op == "bctrl":
                for r in VOL - {1, 2, 13}:
                    self.reg[r] = None
                self.reg[3] = ("vret", obj, slot)
            self.ctr = None
        elif op == "bl":
            tgt = ins[1]
            nm = self.plt.get(tgt)
            self.events.append((va, "call",
                                {"target": tgt, "name": nm,
                                 "sp": self.reg[1],
                                 "args": {n: R[n] for n in range(3, 11)}}))
            for r in VOL - {1, 2, 13}:
                self.reg[r] = None
            if nm not in NORETURN:
                self.reg[3] = ("call", tgt)
            # noreturn: fallthrough belongs to another path -- don't let a
            # fake ret() pollute vcall attribution
        elif op == "b":
            if not (self.start <= ins[1] < self.end):
                self.events.append((va, "tail",
                                    {"target": ins[1],
                                     "name": self.plt.get(ins[1]),
                                     "args": {n: R[n]
                                              for n in range(3, 11)}}))
        elif op == "blrl":
            for r in VOL - {1, 2, 13}:
                self.reg[r] = None


# ============================================ shared analysis helpers =====

_EMU = {}


def emu(elf, text, starts, extents, fva, plt):
    if fva not in extents:
        return None
    if fva not in _EMU:
        _EMU[fva] = FuncEmu(elf, text, fva, extents[fva], plt).run()
    return _EMU[fva]


def sp_slot(base, off):
    """Reduce addr (base,off) to a stack offset if base derives from sp."""
    b, k = flat_off(base)
    if isinstance(b, tuple) and b[0] == "sdata" and b[1] == "sp":
        return off + k
    return None


def rodata_str(elf, v):
    if isinstance(v, int) and elf.sect_of(v) in (".rodata", ".data.rel.ro"):
        return elf.cstr(v, 128)
    return None


# ======================================================= action tables ====

IDENT = re.compile(r"^[A-Za-z_][A-Za-z0-9_.]{0,63}$")


def str_at(elf, va):
    s = elf.cstr(va, 128)
    if s and 1 < len(s) <= 64 and IDENT.match(s):
        return s
    return None


def find_action_tables(elf, text_lo, text_hi):
    R = elf.sects[".rodata"]
    words = elf.data[R["off"]:R["off"] + R["size"]]
    va0, n = R["va"], R["size"] // 4
    tables = []
    j = 0
    while j <= n - 3:
        w0, w1, w2 = struct.unpack_from(">III", words, j * 4)
        if str_at(elf, w0) and (((w1 & 1) and w1 < 0x400)
                                or text_lo <= w1 < text_hi) and w2 < 0x100:
            ent = []
            while j <= n - 3:
                w0, w1, w2 = struct.unpack_from(">III", words, j * 4)
                nm = str_at(elf, w0)
                if nm and (((w1 & 1) and w1 < 0x400)
                           or text_lo <= w1 < text_hi) and w2 < 0x100:
                    ent.append({"name": nm, "fn": w1, "adj": w2,
                                "addr": va0 + j * 4})
                    j += 3
                else:
                    break
            names = [e["name"] for e in ent]
            if (len(ent) >= 3 and names == sorted(names)
                    and all(x[0].isupper() or x[0] == "_" for x in names)
                    and any(any(c.islower() for c in x) for x in names)):
                tables.append({"base": ent[0]["addr"], "entries": ent})
        else:
            j += 1
    return tables


# ============================================================ routers =====

CONTROL_PATH = re.compile(r"^/[A-Za-z]+(/[A-Za-z]+)*/Control$")


def xref_strings(elf, text, starts, extents):
    """One fast pass: function -> {pc: target_va} for lis+addi/ori pairs
    landing on valid C strings."""
    out = {}
    for f in starts:
        e = extents.get(f)
        if not e:
            continue
        hi = {}
        va = f
        while va < e:
            ins = text.ins(va)
            va += 4
            if ins is None:
                continue
            if ins[0] == "addis" and ins[2] == 0:   # lis
                hi[ins[1]] = ins[3] << 16
            elif ins[0] in ("addi", "addis"):
                _, rd, ra, imm = ins
                if ra in hi:
                    t = (hi[ra] + imm) & 0xFFFFFFFF
                    s = elf.cstr(t, 96)
                    if s is not None and len(s) >= 3:
                        out.setdefault(f, {})[va - 4] = t
                    if ra == rd:
                        hi[rd] = t
            elif ins[0] == "ori":
                _, rd, ra, imm = ins
                if ra in hi:
                    t = hi[ra] | imm
                    s = elf.cstr(t, 96)
                    if s is not None and len(s) >= 3:
                        out.setdefault(f, {})[va - 4] = t
    return out


def find_routers(elf, text, starts, extents, xrefs, plt):
    routers = {}
    for f, xr in xrefs.items():
        n = len([t for t in xr.values()
                 if CONTROL_PATH.match(elf.cstr(t) or "")])
        if n >= 2:
            routers[f] = analyze_router(elf, text, starts, extents, f, plt)
    return routers


def describe_enabled(en):
    """Turn the stored enabled-byte value into a structured description."""
    if not en:
        return {"kind": "always"}
    src, pc, sz = en["val"], f"{en['pc']:#x}", en["size"]
    d = {"store_pc": pc, "size": sz, "raw_expr": vstr(src)}
    if isinstance(src, int):
        d.update(kind="const", value=src)
    elif isinstance(src, tuple) and src[0] == "load":
        off = src[2] - 0x100000000 if isinstance(src[2], int) \
            and src[2] & 0x80000000 else src[2]
        d.update(kind="field", base=vstr(src[1]), off=off)
    elif isinstance(src, tuple) and src[0] == "xor" and src[2] == 1 \
            and isinstance(src[1], tuple) and src[1][0] == "load":
        off = src[1][2] - 0x100000000 if isinstance(src[1][2], int) \
            and src[1][2] & 0x80000000 else src[1][2]
        d.update(kind="field_inverted", base=vstr(src[1][1]),
                 off=off)
    else:
        d.update(kind="expr")
    return d


def analyze_router(elf, text, starts, extents, fva, plt):
    em = emu(elf, text, starts, extents, fva, plt)
    if em is None:
        return None
    # stack stores keyed by sp-relative offset
    stw = {}
    for pc, kind, ev in em.events:
        if kind != "store":
            continue
        base, off = ev["addr"]
        so = sp_slot(base, off)
        if so is None:
            continue
        stw.setdefault(so, []).append((pc, ev["src"], ev["size"]))
    def last(off):
        xs = stw.get(off)
        return xs[-1][1] if xs else None
    def lastsz(off):
        xs = stw.get(off)
        return xs[-1][2] if xs else None
    def lastpc(off):
        xs = stw.get(off)
        return xs[-1][0] if xs else None

    path_offs = sorted(
        o for o in stw
        if CONTROL_PATH.match(rodata_str(elf, last(o)) or "\x00"))
    if not path_offs:
        return {"func": fva, "records": [], "emu": em}
    diffs = [b - a for a, b in zip(path_offs, path_offs[1:]) if b - a >= 8]
    stride = min(diffs) if diffs else 16
    records = []
    for o in path_offs:
        # record layout observed: obj@-4, path@0, name@+4, flags@+8,
        # enabled@+0x10 (byte store)
        rec = {"path": rodata_str(elf, last(o)),
               "path_str_va": last(o),
               "evidence": {"path_store": lastpc(o)},
               "stack_off": o}
        nm = last(o + 4)
        rec["name"] = rodata_str(elf, nm)
        rec["name_str_va"] = nm if isinstance(nm, int) else None
        fl = last(o + 8)
        rec["cap_flags"] = fl if isinstance(fl, int) else None
        rec["flags_expr"] = None if isinstance(fl, int) else vstr(fl)
        obj = last(o - 4)
        rec["obj_expr"] = vstr(obj)
        rec["obj_val"] = obj
        # enabled byte lives at record_base+0x10 == path_off + 0x0C and is
        # a *byte* store; a word store at o+0x10 is the NEXT record's obj.
        en = None
        for cand_off in (o + 0x0C, o + 0x10, o - 4 + 0x10):
            xs = stw.get(cand_off)
            if xs and xs[-1][2] in ("stb", "stbu"):
                en = xs
                break
        if en:
            pc_, src, sz = en[-1]
            rec["enabled"] = {"val": src, "pc": pc_, "size": sz}
        else:
            rec["enabled"] = None
        records.append(rec)

    for rec in records:
        rec["enabled_desc"] = describe_enabled(rec.get("enabled"))
    calls = []
    for pc, kind, ev in em.events:
        if kind in ("call", "tail"):
            calls.append({"pc": pc, "target": ev["target"],
                          "tail": kind == "tail",
                          "name": ev.get("name")})
        elif kind == "vcall" and ev["slot"] is not None:
            calls.append({"pc": pc, "vcall_slot": ev["slot"],
                          "obj": vstr(ev["obj"])})
    return {"func": fva, "stride": stride, "records": records,
            "calls": calls, "emu": em}


# ==================================================== ctor resolution ====

def collect_ctor_sites(elf, text, starts, extents, plt):
    """offset -> set of candidate ctor addrs, from `r3 = base+K ; bl F`."""
    cand = {}
    for f in starts:
        e = extents.get(f)
        if not e:
            continue
        em = emu(elf, text, starts, extents, f, plt)
        if em is None:
            continue
        for pc, kind, ev in em.events:
            if kind != "call":
                continue
            a3 = ev["args"].get(3)
            b, k = flat_off(a3)
            if k >= 0x80 and b is not None and not isinstance(b, int):
                cand.setdefault(k & 0xFFFFFFFF, []).append(
                    (ev["target"], pc, f))
    return cand


def ctor_vptr(elf, text, starts, extents, fva, plt, depth=0):
    """Emulate ctor; return the last rodata word stored to 0(this)."""
    if depth > 2:
        return None
    em = emu(elf, text, starts, extents, fva, plt)
    if em is None:
        return None
    vptr = None
    for pc, kind, ev in em.events:
        if kind == "store" and ev["size"] == "stw":
            base, off = ev["addr"]
            if off == 0:
                b, k = flat_off(base)
                if isinstance(b, tuple) and b == ("arg", 3) and k == 0:
                    v = ev["src"]
                    if isinstance(v, int) and \
                            elf.sect_of(v) in (".rodata", ".data.rel.ro"):
                        vptr = v
        elif kind == "call":
            # chained ctor: base class may store vptr first; our own store
            # wins (linear order) but if we never store, check callee
            pass
    return vptr


def resolve_member_vptr(elf, text, starts, extents, off, ctor_sites, plt):
    """member at ctx+off -> candidate ctor -> vptr."""
    out = []
    for tgt, pc, fn in ctor_sites.get(off, []):
        vp = ctor_vptr(elf, text, starts, extents, tgt, plt)
        out.append({"ctor": tgt, "site": f"{pc:#x}", "in_func": f"{fn:#x}",
                    "vptr": vp})
    return out


# ============================================== dispatcher classification ==

def find_vptrs_for_disp(elf, disp, text_lo, text_hi):
    """Every rodata array slot containing disp gives candidate vptr=addr-8."""
    R = elf.sects[".rodata"]
    words = elf.data[R["off"]:R["off"] + R["size"]]
    needle = struct.pack(">I", disp)
    out = []
    i = words.find(needle)
    while i >= 0:
        va = R["va"] + i
        vp = va - 8
        if vp >= R["va"]:
            s0, s1 = struct.unpack_from(">II", words, vp - R["va"])
            if text_lo <= s0 < text_hi and text_lo <= s1 < text_hi:
                out.append(vp)
        i = words.find(needle, i + 1)
    return out


def classify_dispatcher(elf, text, starts, extents, fva, tables, plt):
    """Return kind + detail for a candidate dispatcher function."""
    em = emu(elf, text, starts, extents, fva, plt)
    if em is None:
        return {"kind": "out-of-text"}
    tabset = {t["base"] for t in tables}
    used_tables = set()
    strcmps = []     # literal strings compared
    fault401 = False
    faults = []
    vcalls = []
    hi = {}
    va = fva
    while va < extents[fva]:
        ins = text.ins(va)
        va += 4
        if ins is None:
            continue
        if ins[0] == "addis" and ins[2] == 0:       # lis
            hi[ins[1]] = ins[3] << 16
        elif ins[0] in ("addi", "addis"):
            _, rd, ra, imm = ins
            if ra in hi:
                t = (hi[ra] + imm) & 0xFFFFFFFF
                if t in tabset:
                    used_tables.add(t)
                if ra == rd:
                    hi[rd] = t
    for pc, kind, ev in em.events:
        if kind == "call":
            nm = ev.get("name") or ""
            if nm in ("strcmp", "strncmp", "strcasecmp"):
                for rr in (4, 5, 3):
                    v = ev["args"].get(rr)
                    s = rodata_str(elf, v) if isinstance(v, int) else None
                    if s:
                        strcmps.append({"pc": pc, "str": s,
                                        "str_va": v})
            if nm == "strcmp":
                pass
        elif kind == "vcall":
            vcalls.append({"pc": pc, "slot": ev["slot"],
                           "obj": vstr(ev["obj"]),
                           "arg4": ev["args"].get(4)})
            if ev["slot"] == 0x14:
                a4 = ev["args"].get(4)
                if a4 == 0x191:
                    fault401 = True
                faults.append({"pc": pc,
                               "code": a4 if isinstance(a4, int) else None})
    kind = "unknown"
    if used_tables:
        kind = "table"
    elif fault401 and strcmps:
        kind = "strcmp"
    elif fault401 and not strcmps:
        kind = "reject-all"
    elif strcmps:
        kind = "strcmp-nofault"
    return {"kind": kind, "tables": sorted(used_tables),
            "strcmps": strcmps, "faults": faults, "vcalls": vcalls,
            "events": em.events}


# ============================================ handler analysis ============

REQ_IN_SLOTS = (0x1c, 0x20)
REQ_OUT_SLOTS = (0x24, 0x28)
REQ_FAULT_SLOT = 0x14
REQ_COMMIT_SLOTS = (0x0c, 0x10)
REQ_PARSE_SLOT = 0x08
REQ_STATUS_SLOT = 0x38


def classify_helper(elf, text, starts, extents, fva, plt, cache):
    """Peek into a small helper called right after an arg-record fetch.
    In-arg parsers store {rec+4=type tag, rec+8=buf, rec+0x10=cap};
    out-arg formatters embed a literal format string."""
    if fva in cache:
        return cache[fva]
    T = elf.sects[".text"]
    res = None
    if isinstance(fva, int) and T["va"] <= fva < T["va"] + T["size"]:
        e = extents.get(fva)
        if e and e - fva <= 0x1400:
            em = emu(elf, text, starts, extents, fva, plt)
            if em is not None:
                res = {}
                for pc, k, ev in em.events:
                    if k == "store" and ev["size"] == "stw":
                        b, kk = flat_off(ev["addr"][0])
                        off = ev["addr"][1]
                        if isinstance(off, int) and off & 0x80000000:
                            off -= 0x100000000
                        if isinstance(b, tuple) and b == ("arg", 3) \
                                and kk == 0 and isinstance(ev["src"], int):
                            if off == 4:
                                res["tag"] = ev["src"]
                            elif off == 0x10:
                                res["cap"] = ev["src"]
                    elif k == "call":
                        pass
                # format-string candidate: shortest materialized literal
                xr = xref_strings(elf, text, [fva], extents)
                fmts = []
                for t in (xr.get(fva) or {}).values():
                    s = elf.cstr(t, 64)
                    if s is None:
                        continue
                    if s in ("0", "1", "true", "false") or \
                            ("%" in s and len(s) <= 24):
                        fmts.append((len(s), t, s))
                if fmts:
                    fmts.sort()
                    res["fmt"] = fmts[0][2]
                    res["fmt_va"] = fmts[0][1]
    cache[fva] = res
    return res


def analyze_handler(elf, text, starts, extents, hva, plt, helper_cache,
                    faults_from):
    em = emu(elf, text, starts, extents, hva, plt)
    if em is None:
        return None
    res = {"handler": hva,
           "in_args": [], "out_args": [], "faults": [],
           "vcalls": [], "impl_calls": [], "literal_compares": [],
           "helpers": [], "req_arg": None}
    events = em.events
    # find which incoming arg is the request object: the one with a vcall
    # at a known request slot
    req_srcs = {}
    for pc, kind, ev in events:
        if kind == "vcall" and ev["slot"] in REQ_IN_SLOTS + \
                REQ_OUT_SLOTS + (REQ_FAULT_SLOT, REQ_PARSE_SLOT,
                                 REQ_STATUS_SLOT) + REQ_COMMIT_SLOTS:
            req_srcs[vstr(ev["obj"])] = req_srcs.get(
                vstr(ev["obj"]), 0) + 1
    if req_srcs:
        res["req_arg"] = max(req_srcs, key=req_srcs.get)
    req_obj = res["req_arg"]

    def spilled(o, pc):
        """obj=("load",base,off): chase the earlier same-function store
        that wrote that cell (request object commonly re-spilled via a
        different register alias than the one that stored it)."""
        if not (isinstance(o, tuple) and o[0] == "load"):
            return o
        b, k = flat_off(o[1])
        want = (k + sgn32(o[2])) & 0xFFFFFFFF
        best = None
        for pc2, k2, ev2 in events:
            if k2 != "store" or pc2 >= pc:
                continue
            b2, kk2 = flat_off(ev2["addr"][0])
            i2 = ev2["addr"][1]
            if not isinstance(i2, int):
                continue
            if b2 == b and (kk2 + sgn32(i2)) & 0xFFFFFFFF == want:
                best = ev2["src"]
        return best if best is not None else o

    evs = list(events)
    for idx, (pc, kind, ev) in enumerate(evs):
        if kind == "vcall":
            obj = vstr(spilled(ev["obj"], pc))
            slot = ev["slot"]
            a4 = ev["args"].get(4)
            s4 = rodata_str(elf, a4) if isinstance(a4, int) else None
            on_req = (obj == req_obj)
            # request obj re-loaded from a spill slot the emu could not
            # backtrack: accept an unresolved load-typed obj iff the call
            # carries a plausible arg-name string at a known arg slot
            if not on_req and s4 and IDENT.match(s4) and \
                    isinstance(ev["obj"], tuple) and \
                    ev["obj"][0] == "load":
                on_req = True
            if on_req and slot in REQ_IN_SLOTS and s4:
                # following helper call consumes the returned rec
                tag = cap = fmt = helper = None
                cap_arg = None
                for pc2, k2, e2 in evs[idx + 1:idx + 6]:
                    if k2 == "call":
                        helper = e2["target"]
                        # string descriptors take the caller's buffer
                        # capacity as the 5th argument (r5) at the call
                        # site - not a constant inside the helper
                        c5 = e2.get("args", {}).get(5)
                        if isinstance(c5, int) and 0 < c5 < 0x10000:
                            cap_arg = c5
                        hi_ = classify_helper(elf, text, starts, extents,
                                              helper, plt, helper_cache)
                        if hi_:
                            tag, cap, fmt = hi_.get("tag"), \
                                hi_.get("cap"), hi_.get("fmt")
                        break
                    if k2 == "vcall":
                        break
                if cap is None:
                    cap = cap_arg
                res["in_args"].append({
                    "name": s4, "name_va": a4, "site": pc,
                    "slot": slot, "helper": helper,
                    "type_tag": tag, "buf_cap": cap, "fmt": fmt})
            elif on_req and slot in REQ_OUT_SLOTS and s4:
                helper = None
                fmt = None
                for pc2, k2, e2 in evs[idx + 1:idx + 6]:
                    if k2 == "call":
                        helper = e2["target"]
                        hi_ = classify_helper(elf, text, starts, extents,
                                              helper, plt, helper_cache)
                        if hi_:
                            fmt = hi_.get("fmt")
                        break
                    if k2 == "vcall":
                        break
                res["out_args"].append({
                    "name": s4, "name_va": a4, "site": pc,
                    "slot": slot, "helper": helper, "fmt": fmt})
            elif on_req and slot == REQ_FAULT_SLOT:
                src = "const" if isinstance(a4, int) else vstr(a4)
                res["faults"].append({
                    "site": pc, "code": a4 if isinstance(a4, int) else None,
                    "code_expr": None if isinstance(a4, int) else vstr(a4),
                    "source": src})
            elif on_req:
                res["vcalls"].append({"site": pc, "slot": slot,
                                      "purpose": "commit" if slot in
                                      REQ_COMMIT_SLOTS else
                                      "parse" if slot == REQ_PARSE_SLOT else
                                      "status" if slot == REQ_STATUS_SLOT
                                      else "other"})
            elif not on_req:
                # service impl / arg-record / other object vfuncs
                res["impl_calls"].append({"site": pc, "slot": slot,
                                          "obj": obj,
                                          "arg4": s4 or
                                          (a4 if isinstance(a4, int)
                                           else vstr(a4))})
        elif kind == "call":
            nm = ev.get("name") or ""
            if nm in ("strcmp", "strncmp", "strcasecmp", "strncasecmp"):
                lits = []
                for rr in (4, 5, 3):
                    v = ev["args"].get(rr)
                    s = rodata_str(elf, v) if isinstance(v, int) else None
                    if s:
                        lits.append(s)
                res["literal_compares"].append(
                    {"pc": pc, "fn": nm, "literals": lits})
            elif nm:
                res["helpers"].append({"pc": pc, "name": nm})
            else:
                res["helpers"].append({"pc": pc, "target": ev["target"]})
    return res


# =========================================================== capability ===

def sgn32(x):
    return x - 0x100000000 if x & 0x80000000 else x


def decode_getter(text, gva):
    """Simple getter bodies: this-adjusting thunks (addi r3,r3,-N; b real),
    embedded-member `addi r3,r3,K; blr`, pointer-member `lwz r3,K(r3); blr`.
    Returns ("member", off) / ("ptr", off) / (None, None)."""
    adj = 0
    cur = gva
    for _ in range(4):
        if cur is None:
            break
        va, ret_load = cur, None
        while va < cur + 0x80:
            ins = text.ins(va)
            va += 4
            if ins is None:
                break
            if ins[0] == "addis" and ins[1] == 3 and ins[2] == 3:
                adj += ins[3] << 16
            elif ins[0] == "addi" and ins[1] == 3 and ins[2] == 3:
                adj += ins[3]
            elif ins[0] == "lwz" and ins[1] == 3 and ins[2] == 3:
                ret_load = adj + sgn32(ins[3])
            elif ins[0] == "b":
                cur = ins[1]
                break
            elif ins[0] in ("blr", "bctr", "blrl"):
                cur = None
                break
        else:
            cur = None
        if ret_load is not None:
            return ("ptr", ret_load & 0xFFFFFFFF)
        if cur is None:
            return ("member", adj & 0xFFFFFFFF)
    return (None, None)


def scan_ctx_access(elf, text, starts, extents, offsets, plt):
    """Report all load/store sites to *(obj + off) for off in offsets.
    Emulation-based: folds addis/addi splits so ctx+0xaa6c reached via
    `addis rB,ctx,1 ; stw rX,-0x5594(rB)` still resolves to off 0xaa6c.
    Two passes: pass 1 learns self-pointer cells *(X+k1) == X+k2 (common
    when a sub-area base pointer is cached inside the context); pass 2
    resolves load-based destinations through that map."""
    hits = {o: {"loads": [], "stores": []} for o in offsets}
    offs = set(offsets)
    per_func = []
    for f in starts:
        em = emu(elf, text, starts, extents, f, plt)
        if em is None:
            continue
        evs = [(pc, kind, ev) for pc, kind, ev in em.events
               if kind in ("load", "store")]
        if evs:
            per_func.append((f, evs))

    def sgn(v):
        return v - 0x100000000 if v & 0x80000000 else v

    selfptr = {}          # (base_key, cell_off) -> pointed_off
    for f, evs in per_func:
        for pc, kind, ev in evs:
            if kind != "store":
                continue
            base, imm = ev["addr"]
            if not isinstance(imm, int):
                continue
            sb, sk = flat_off(ev.get("src"))
            db, dk = flat_off(base)
            if isinstance(sb, int) or sb != db:
                continue
            tot = (dk + sgn(imm)) & 0xFFFFFFFF
            if sk is not None:
                selfptr[(repr(db), tot)] = sk & 0xFFFFFFFF

    def resolve_addr(addr):
        """dst addr -> (base_expr, eff_off) with self-pointer chase."""
        base, imm = addr
        if not isinstance(imm, int):
            return None
        b, k = flat_off(base)
        if isinstance(b, int):
            return None
        tot = (k + sgn(imm)) & 0xFFFFFFFF
        if isinstance(b, tuple) and b[0] == "load":
            ib, ik = flat_off(b[1])
            if not isinstance(ib, int) and \
                    (repr(ib), (ik + b[2]) & 0xFFFFFFFF) in selfptr:
                poff = selfptr[(repr(ib), (ik + b[2]) & 0xFFFFFFFF)]
                return ib, (poff + sgn(imm)) & 0xFFFFFFFF
        return b, tot

    for f, evs in per_func:
        for pc, kind, ev in evs:
            r = resolve_addr(ev["addr"])
            if r is None:
                continue
            b, tot = r
            if tot in offs:
                ent = {"pc": pc, "func": f, "base": vstr(b)}
                if kind == "store":
                    ent["size"] = ev["size"]
                    hits[tot]["stores"].append(ent)
                else:
                    hits[tot]["loads"].append(ent)
    return hits


# ================================================================ main ====

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("binary")
    ap.add_argument("--json")
    ap.add_argument("-v", "--verbose", action="store_true")
    a = ap.parse_args()

    elf = Elf(a.binary)
    T = elf.sects[".text"]
    text_lo, text_hi = T["va"], T["va"] + T["size"]
    text = Text(elf)
    plt = elf.plt_names
    log = (lambda *m: print("[*]", *m, file=sys.stderr)) if a.verbose \
        else (lambda *m: None)

    log("building function map")
    starts, extents = build_funcmap(elf)
    log(f"{len(starts)} function starts")

    log("scanning rodata action tables")
    tables = find_action_tables(elf, text_lo, text_hi)
    log(f"{len(tables)} candidate action tables")

    log("computing string xrefs")
    xrefs = xref_strings(elf, text, starts, extents)

    log("finding routers")
    routers = find_routers(elf, text, starts, extents, xrefs, plt)
    log("routers: %s" % [hex(x) for x in routers])

    log("collecting ctor call sites")
    ctor_sites = collect_ctor_sites(elf, text, starts, extents, plt)
    log(f"{len(ctor_sites)} member offsets with candidate ctors")

    # -------- assemble services from router records ---------------------
    helper_cache = {}
    services = []
    all_dispatchers = {}          # disp_addr -> {"vptrs": [...], "class": ..}
    svc_by_ctxoff = {}

    def fmtv(v):
        return f"{v:#x}" if isinstance(v, int) else v

    fde_set = set(parse_eh_frame(elf))

    def rec_score(rec):
        """Higher = better-resolved record (prefer concrete obj exprs)."""
        e = str(rec.get("obj_expr") or "?")
        s = 0
        if "?" not in e:
            s += 2
        if "0x0" not in e:
            s += 2
        if rec.get("name"):
            s += 1
        if rec.get("enabled_desc"):
            s += 1
        return s

    by_path = {}
    for rf, rinfo in sorted(routers.items(),
                            key=lambda kv: (kv[0] not in fde_set, kv[0])):
        if not rinfo:
            continue
        for rec in rinfo.get("records") or []:
            p = rec.get("path")
            if p is None:
                continue
            old = by_path.get(p)
            if old is not None and rec_score(old[1]) >= rec_score(rec):
                continue
            by_path[p] = (rf, rec)
    for p, (rf, rec) in sorted(by_path.items()):
        svc = {
        "name": rec.get("name"),
        "control_path": rec.get("path"),
        "router": f"{rf:#x}",
        "cap_flags": fmtv(rec.get("cap_flags")),
        "enabled": rec.get("enabled_desc"),
        "evidence": {
            "record_stack_off": rec.get("stack_off"),
            "path_str_va": fmtv(rec.get("path_str_va")),
            "name_str_va": fmtv(rec.get("name_str_va")),
            "path_store_pc": fmtv(rec["evidence"].get(
                "path_store")),
        },
        "object": {"expr": rec.get("obj_expr")},
        "_rec": rec,
        }
        services.append(svc)

    # --- resolve obj -> vptr -------------------------------------------
    def sgn32(x):
        return x - 0x100000000 if x & 0x80000000 else x

    def classify_obj(obj):
        """registration obj value -> descriptor"""
        if obj is None:
            return {"kind": "none"}
        if isinstance(obj, tuple) and obj[0] == "vret":
            return {"kind": "vfunc_getter", "slot": obj[2],
                    "manager_expr": vstr(obj[1])}
        if isinstance(obj, tuple) and obj[0] == "load":
            b, k = flat_off(obj[1])
            return {"kind": "indirect_ptr",
                    "cell_off": (k + sgn32(obj[2])) & 0xFFFFFFFF,
                    "base": vstr(b)}
        b, k = flat_off(obj)
        if b is not None and k:
            return {"kind": "member", "ctx_off": k & 0xFFFFFFFF}
        return {"kind": "expr", "expr": vstr(obj)}

    member_vptr = {}
    member_detail = {}

    def member_ctor_vptr(off):
        if off in member_vptr:
            return member_vptr[off]
        cands = resolve_member_vptr(elf, text, starts, extents,
                                    off, ctor_sites, plt)
        member_detail[off] = cands
        good = [c["vptr"] for c in cands if c["vptr"]]
        member_vptr[off] = good[-1] if good else None
        return member_vptr[off]

    for svc in services:
        rec = svc["_rec"]
        d = classify_obj(rec.get("obj_val"))
        svc["object"].update({k: (f"{v:#x}" if isinstance(v, int) else v)
                              for k, v in d.items() if k != "kind"})
        svc["object"]["source"] = d["kind"]
        if d["kind"] == "member":
            off = d["ctx_off"]
            cands = member_detail.get(off) or resolve_member_vptr(
                elf, text, starts, extents, off, ctor_sites, plt)
            member_detail[off] = cands
            svc["object"]["ctor_candidates"] = [
                {"ctor": f"{c['ctor']:#x}", "site_pc": c["site"],
                 "in_func": c["in_func"], "vptr": fmtv(c["vptr"])}
                for c in cands]
            vp = member_ctor_vptr(off)
            svc["object"]["vptr"] = fmtv(vp) if vp else None

    # --- router-2 style: obj via manager vfunc getter -------------------
    # The router's `this` is itself a member object (arg3 = ctx+K).  Its
    # member offset is recoverable by finding callers that pass base+K to
    # the router -- ctor_sites maps K -> call targets.
    router_member_off = {}
    for offv, lst in ctor_sites.items():
        for tgt, pc, fn in lst:
            if tgt in routers:
                router_member_off.setdefault(tgt, set()).add(offv)

    # --- batch ctx-access scan (enabled bytes + ptr cells + mgr cells) --
    need_offs = {0xcdc, 0x934}
    for svc in services:
        en = svc.get("enabled") or {}
        if isinstance(en.get("off"), int):
            need_offs.add(en["off"] & 0xFFFFFFFF)
        if svc["object"]["source"] == "indirect_ptr":
            need_offs.add(
                classify_obj(svc["_rec"]["obj_val"])["cell_off"])
        elif svc["object"]["source"] == "vfunc_getter":
            for k in router_member_off.get(int(svc["router"], 16)) or ():
                need_offs.add(k)
    cap = scan_ctx_access(elf, text, starts, extents, sorted(need_offs),
                          plt)

    def cell_stores(cell):
        """values stored to *(obj+cell): (writer_func, pc, src_val)"""
        out = []
        for w in (cap.get(cell) or {}).get("stores", []):
            em = emu(elf, text, starts, extents, w["func"], plt)
            if not em:
                continue
            for pc, kind, ev in em.events:
                if kind != "store":
                    continue
                b, k2 = flat_off(ev["addr"][0])
                i2 = ev["addr"][1]
                if not isinstance(i2, int):
                    continue
                tot = (k2 + sgn32(i2)) & 0xFFFFFFFF
                if tot == cell:
                    out.append((w["func"], pc, ev["src"]))
        return out

    def valid_vptr(vp, slot=None):
        """A vptr points at a word array whose entries are text."""
        if not isinstance(vp, int) or \
                elf.sect_of(vp) not in (".rodata", ".data.rel.ro"):
            return False
        if slot is not None:
            w = elf.u32(vp + slot)
            return bool(w) and text_lo <= w < text_hi
        return any(text_lo <= (elf.u32(vp + i) or 0) < text_hi
                   for i in (0, 4, 8, 12))

    _callers = {}

    def callers_of(tgt):
        if not _callers:
            for i in range(0, text.size & ~3, 4):
                ins = text.ins(text.base + i)
                if ins and ins[0] == "bl":
                    _callers.setdefault(ins[1], []).append(text.base + i)
        return _callers.get(tgt, [])

    def chase_load(f, p, src, depth=0):
        """src=("load",base,off): find the earlier store that wrote that
        cell -- same function first, then callers' stack-arg stores when
        the cell is an incoming stack slot (positive offset off sp)."""
        if depth > 5:
            return src
        em = emu(elf, text, starts, extents, f, plt)
        if not em:
            return src
        sb, so = flat_off(src[1])
        if not (isinstance(sb, tuple) and sb == ("sdata", "sp")):
            return src
        want = (so + sgn32(src[2])) & 0xFFFFFFFF
        for pc2, k2, ev2 in em.events:
            if k2 == "store" and pc2 < p:
                b2, kk2 = flat_off(ev2["addr"][0])
                i2 = ev2["addr"][1]
                if not isinstance(i2, int):
                    continue
                b3, kk3 = flat_off(b2)
                if isinstance(b3, tuple) and b3 == ("sdata", "sp") and \
                        (kk3 + sgn32(i2)) & 0xFFFFFFFF == want:
                    return chase_val(f, pc2, ev2["src"], depth + 1)
        if not (0 < want < 0x4000):
            return src
        # incoming stack argument: callers wrote (their r1 @ call)+want
        for site in callers_of(f)[:24]:
            cf = func_of(starts, site)
            cem = emu(elf, text, starts, extents, cf, plt)
            if not cem:
                continue
            spv = None
            for pc2, k2, ev2 in cem.events:
                if pc2 == site and k2 == "call" and ev2["target"] == f:
                    spv = ev2.get("sp")
                    break
            if spv is None:
                continue
            wb, wk = flat_off(spv)
            tgt_off = (wk + want) & 0xFFFFFFFF
            for pc2, k2, ev2 in cem.events:
                if k2 == "store" and pc2 < site:
                    b2, kk2 = flat_off(ev2["addr"][0])
                    i2 = ev2["addr"][1]
                    if not isinstance(i2, int):
                        continue
                    if b2 == wb and \
                            (kk2 + sgn32(i2)) & 0xFFFFFFFF == tgt_off:
                        return chase_val(cf, pc2, ev2["src"], depth + 1)
        return src

    def chase_val(f, p, v, depth=0):
        """Resolve a stored/candidate value through loads and vcall
        getters: load->writer chase, vret->getter-body member decode."""
        if depth > 6 or not isinstance(v, tuple):
            return v
        if v[0] == "load":
            # if the load base is itself an expression (ptr cell), chase
            # the inner pointer's writer first:  *(X + off) where X is
            # stored/derived.  yields ("cellload", base, eff_off).
            ib0, ik0 = flat_off(v[1])
            if not isinstance(ib0, int) and not (
                    isinstance(ib0, tuple) and ib0 == ("sdata", "sp")):
                inner = v[1]
                if isinstance(inner, tuple) and inner[0] == "load":
                    inner = chase_load(f, p, inner, depth + 1)
                ib, ik = flat_off(inner)
                if not isinstance(ib, int) and not (
                        isinstance(ib, tuple) and ib[0] == "load"):
                    return ("cellload", ib,
                            (ik + sgn32(v[2])) & 0xFFFFFFFF)
            return chase_load(f, p, v, depth)
        if v[0] == "vret":
            obj, slot = v[1], v[2]
            obj = chase_val(f, p, obj, depth + 1)
            vp = None
            if isinstance(obj, int):
                w0 = elf.u32(obj)
                if w0 and text_lo <= w0 < text_hi:
                    vp = obj
                elif w0 and elf.sect_of(w0) in (".rodata",
                                              ".data.rel.ro"):
                    vp = w0
            elif isinstance(obj, tuple):
                ob, ok = flat_off(obj)
                if ok and not isinstance(ob, int):
                    vp = member_ctor_vptr(ok)
            if not (isinstance(vp, int) and isinstance(slot, int)):
                return ("vret", obj, slot)
            g = elf.u32(vp + slot)
            if not (g and text_lo <= g < text_hi):
                return ("vret", obj, slot)
            gkind, goff = decode_getter(text, g)
            ob, ok = flat_off(obj)
            if isinstance(ob, int) or not isinstance(ok, int):
                return ("vret", obj, slot)
            if gkind == "member":
                return ("add", ob, (ok + sgn32(goff)) & 0xFFFFFFFF)
            if gkind == "ptr":
                return ("load", ob, (ok + sgn32(goff)) & 0xFFFFFFFF)
            return ("vret", obj, slot)
        return v

    def resolve_cell(cell, slot=None, depth=0):
        """Candidates stored to *(obj+cell); first that yields a vptr
        passing valid_vptr(vp, slot) wins."""
        sites = cell_stores(cell)
        det = {"store_sites": [{"pc": f"{p:#x}", "func": f"{f:#x}"}
                               for f, p, _ in sites[:8]]}
        det["candidates"] = []
        for f, p, src0 in sites:
            src = chase_val(f, p, src0)
            det["candidates"].append(vstr(src))
            vps = []
            if isinstance(src, tuple) and src[0] == "cellload" \
                    and depth < 4:
                # *(ptr_cell): recurse into that cell's stores
                vp2, det2 = resolve_cell(src[2], slot, depth + 1)
                if vp2:
                    det["nested_cell"] = det2
                    vps.append(vp2)
            elif isinstance(src, int) and elf.sect_of(src) in \
                    (".data", ".bss", ".data.rel.ro", ".rodata"):
                w0 = elf.u32(src)
                if w0 and text_lo <= w0 < text_hi:
                    vps.append(src)          # src is itself a vptr
                if w0 and elf.sect_of(w0) in (".rodata", ".data.rel.ro"):
                    vps.append(w0)           # src is an object pointer
            elif isinstance(src, tuple) and src[0] == "call":
                vp = ctor_vptr(elf, text, starts, extents, src[1], plt)
                if vp:
                    det["alloc_call"] = f"{src[1]:#x}"
                    vps.append(vp)
                em = emu(elf, text, starts, extents, f, plt)
                if em:
                    for pc2, k2, ev2 in em.events:
                        if k2 == "store" and ev2["size"] == "stw" \
                                and ev2["addr"][1] == 0 \
                                and ev2["addr"][0] == src \
                                and isinstance(ev2["src"], int) and \
                                elf.sect_of(ev2["src"]) in \
                                (".rodata", ".data.rel.ro"):
                            det["vptr_store_pc"] = f"{pc2:#x}"
                            vps.append(ev2["src"])
                        elif k2 == "call" and ev2["args"].get(3) == src:
                            vp = ctor_vptr(elf, text, starts, extents,
                                           ev2["target"], plt)
                            if vp:
                                det["ctor_call"] = f"{ev2['target']:#x}"
                                vps.append(vp)
            elif isinstance(src, tuple):
                b, k = flat_off(src)
                if b is not None and k:
                    vp = member_ctor_vptr(k)
                    if vp:
                        det["member_off"] = f"{k:#x}"
                        vps.append(vp)
            for vp in vps:
                if valid_vptr(vp, slot):
                    det["chosen_vptr"] = f"{vp:#x}"
                    det["stored_value"] = vstr(src0)
                    return vp, det
        return None, det

    for svc in services:
        if svc["object"]["source"] != "indirect_ptr":
            continue
        K = classify_obj(svc["_rec"]["obj_val"])["cell_off"]
        vp, det = resolve_cell(K, 8)
        svc["object"].update(det)
        if vp:
            svc["object"]["vptr"] = f"{vp:#x}"

    for svc in services:
        if svc["object"]["source"] != "vfunc_getter":
            continue
        rf = int(svc["router"], 16)
        slot = svc["_rec"]["obj_val"][2]
        svc["object"]["getter_slot"] = slot
        mgr_offs = router_member_off.get(rf) or set()
        svc["object"]["manager_ctx_off_candidates"] = \
            [f"{o:#x}" for o in sorted(mgr_offs)]
        mg_vptr = None
        for k in sorted(mgr_offs):
            mg_vptr = member_ctor_vptr(k)
            if not (mg_vptr and valid_vptr(mg_vptr, slot)):
                mg_vptr = None
                vp2, det2 = resolve_cell(k, slot)
                if vp2:
                    mg_vptr = vp2
                    svc["object"]["manager_cell"] = det2
            if mg_vptr:
                svc["object"]["manager_ctx_off"] = f"{k:#x}"
                break
        svc["object"]["manager_vptr"] = fmtv(mg_vptr)
        if not mg_vptr:
            continue
        getter = elf.u32(mg_vptr + slot)
        svc["object"]["getter"] = fmtv(getter)
        if not (getter and text_lo <= getter < text_hi):
            continue
        # getters may be this-adjusting thunks (addi r3,r3,-N; b real)
        # and the real getter either returns this+K (embedded member) or
        # *(this+K) (pointer member).
        gkind, goff = decode_getter(text, getter)
        svc["object"]["getter_kind"] = gkind
        svc["object"]["getter_off"] = f"{goff:#x}" if goff is not None \
            else None
        for k in sorted(mgr_offs):
            if gkind == "member":
                total = (k + sgn32(goff)) & 0xFFFFFFFF
                svc["object"]["member_ctx_off"] = f"{total:#x}"
                vp = member_ctor_vptr(total)
                if not (vp and valid_vptr(vp, 8)):
                    vp, _det = resolve_cell(total, 8)
                if vp:
                    svc["object"]["vptr"] = f"{vp:#x}"
                    break
            elif gkind == "ptr":
                cell = (k + sgn32(goff)) & 0xFFFFFFFF
                svc["object"]["ptr_member_ctx_off"] = f"{cell:#x}"
                vp, det2 = resolve_cell(cell, 8)
                if vp:
                    svc["object"]["vptr"] = f"{vp:#x}"
                    svc["object"]["cell"] = det2
                    break

    # --- dispatchers, tables, actions ------------------------------------
    table_by_base = {t["base"]: t for t in tables}
    disp_info = {}

    def analyze_disp(dva):
        if dva in disp_info:
            return disp_info[dva]
        info = classify_dispatcher(elf, text, starts, extents, dva,
                                   tables, plt)
        disp_info[dva] = info
        return info

    log("resolving dispatchers and actions")
    for svc in services:
        vp = svc["object"].get("vptr")
        if isinstance(vp, str):
            vp = int(vp, 16)
        svc["dispatcher"] = None
        svc["actions"] = []
        if not vp:
            continue
        disp = elf.u32(vp + 8)
        svc["dispatcher"] = {"addr": fmtv(disp)}
        if not (disp and text_lo <= disp < text_hi):
            continue
        info = analyze_disp(disp)
        svc["dispatcher"]["kind"] = info["kind"]
        svc["dispatcher"]["fault_sites"] = [
            {"pc": f"{f['pc']:#x}", "code": f["code"]}
            for f in info["faults"]]
        for sm in info["strcmps"]:
            svc["dispatcher"].setdefault("compares", []).append(
                {"pc": f"{sm['pc']:#x}", "str": sm["str"],
                 "str_va": f"{sm['str_va']:#x}"})
        for tb in info["tables"]:
            t = table_by_base.get(tb)
            if not t:
                continue
            svc["dispatcher"]["action_table"] = f"{tb:#x}"
            for e in t["entries"]:
                act = {"name": e["name"], "entry_addr": f"{e['addr']:#x}"}
                if e["fn"] & 1:
                    voff = e["fn"] & ~1
                    hv = elf.u32(vp + voff)
                    act["kind"] = "virtual"
                    act["voff"] = voff
                    act["handler"] = fmtv(hv) \
                        if hv and text_lo <= hv < text_hi else None
                else:
                    act["kind"] = "direct"
                    act["handler"] = fmtv(e["fn"])
                svc["actions"].append(act)

    # services without a resolved vptr: try dispatcher-less matching via
    # strcmp dispatch info (QPlay) -- also add non-table "actions" from
    # dispatcher compares
    for svc in services:
        if svc["actions"] or not svc["dispatcher"]:
            continue
        d = svc["dispatcher"]
        if d.get("kind") == "strcmp":
            # each compared name = an action; the match branch invokes a
            # vfunc on the service object (arg3), not on the request
            vcalls = disp_info[int(d["addr"], 16)]["vcalls"]
            slots = [v["slot"] for v in vcalls
                     if v["slot"] is not None and v["obj"] == "r3-in"]
            for sm in d.get("compares", []):
                act = {"name": sm["str"], "kind": "strcmp-dispatched",
                       "compare_pc": sm["pc"]}
                vp = svc["object"].get("vptr")
                if vp and slots:
                    hv = elf.u32(int(vp, 16) + slots[0])
                    if hv and text_lo <= hv < text_hi:
                        act["handler"] = f"{hv:#x}"
                        act["via_slot"] = slots[0]
                svc["actions"].append(act)

    # --- handler deep analysis -------------------------------------------
    log("analyzing handlers")
    n_an = 0
    for svc in services:
        for act in svc["actions"]:
            hv = act.get("handler")
            if not hv:
                continue
            hva = int(hv, 16)
            res = analyze_handler(elf, text, starts, extents, hva, plt,
                                  helper_cache, None)
            if not res:
                continue
            n_an += 1
            act["handler_func"] = f"{hva:#x}"
            act["req_arg"] = res["req_arg"]
            act["args_in"] = [
                {"name": x["name"], "name_va": f"{x['name_va']:#x}",
                 "site": f"{x['site']:#x}",
                 "via_slot": x["slot"],
                 "parse_helper": fmtv(x["helper"]),
                 "type_tag": x["type_tag"], "buf_cap": x["buf_cap"],
                 "fmt": x["fmt"]} for x in res["in_args"]]
            act["args_out"] = [
                {"name": x["name"], "name_va": f"{x['name_va']:#x}",
                 "site": f"{x['site']:#x}",
                 "fmt_helper": fmtv(x["helper"]), "fmt": x["fmt"]}
                for x in res["out_args"]]
            act["faults"] = [
                {"site": f"{x['site']:#x}", "code": x["code"],
                 "code_expr": x["code_expr"], "source": x["source"]}
                for x in res["faults"]]
            act["req_vcalls"] = [{"site": f"{x['site']:#x}",
                                  "slot": x["slot"],
                                  "purpose": x["purpose"]}
                                 for x in res["vcalls"]]
            act["impl_calls"] = [{"site": f"{x['site']:#x}",
                                  "obj": x["obj"], "slot": x["slot"],
                                  "arg4": x["arg4"]}
                                 for x in res["impl_calls"]]
            if res["literal_compares"]:
                act["literal_compares"] = [
                    {"pc": f"{c['pc']:#x}", "fn": c["fn"],
                     "literals": c["literals"]}
                    for c in res["literal_compares"]]
    log(f"{n_an} handlers analyzed")

    # --- exhaustive dispatcher sweep -------------------------------------
    # every function containing `req->vfunc[0x14](..., 0x191)` is a
    # dispatcher-like rejector; collect all, subtract those accounted for.
    log("sweeping for non-table dispatchers")
    accounted = {int(s["dispatcher"]["addr"], 16)
                 for s in services
                 if s.get("dispatcher") and s["dispatcher"].get("addr")}
    sweep = []
    for f in starts:
        e = extents.get(f)
        if not e or f in accounted:
            continue
        va = f
        hit = None
        while va < e:
            ins = text.ins(va)
            va += 4
            if ins is None:
                continue
            if ins[0] == "addi" and ins[2] == 0 and ins[1] == 4 \
                    and ins[3] == 0x191:
                hit = va - 4
        if hit:
            sweep.append({"func": f"{f:#x}", "li_401_at": f"{hit:#x}"})
    # classify sweep hits
    unattached = []
    for s in sweep:
        fv = int(s["func"], 16)
        info = classify_dispatcher(elf, text, starts, extents, fv,
                                   tables, plt)
        s["kind"] = info["kind"]
        if info["strcmps"]:
            s["compares"] = [{"pc": f"{x['pc']:#x}", "str": x["str"]}
                             for x in info["strcmps"]]
        vptrs = find_vptrs_for_disp(elf, fv, text_lo, text_hi)
        s["vptr_candidates"] = [f"{v:#x}" for v in vptrs]
        unattached.append(s)

    # --- capability plumbing (reuse the batched ctx-access scan) ---------
    cap_out = {}
    for offv, h in cap.items():
        stores = []
        for x in h["stores"][:24]:
            ent = {"pc": f"{x['pc']:#x}", "func": f"{x['func']:#x}",
                   "size": x.get("size")}
            em = emu(elf, text, starts, extents, x["func"], plt)
            if em:
                for pc2, k2, ev2 in em.events:
                    if pc2 == x["pc"] and k2 == "store":
                        ent["src"] = vstr(ev2["src"])
                        break
            stores.append(ent)
        cap_out[f"{offv:#x}"] = {
            "loads": [{"pc": f"{x['pc']:#x}", "func": f"{x['func']:#x}"}
                      for x in h["loads"][:24]],
            "stores": stores,
        }

    # --- router chain ------------------------------------------------------
    router_chain = []
    for rf, rinfo in routers.items():
        if not rinfo:
            continue
        for c in rinfo.get("calls") or []:
            tgt = c.get("target")
            if isinstance(tgt, int) and tgt in routers:
                router_chain.append({"from": f"{rf:#x}",
                                     "to": f"{tgt:#x}",
                                     "at": f"{c['pc']:#x}"})

    # ---------------------------------------------------------------- emit
    for svc in services:
        svc.pop("_rec", None)
    out = {
        "binary": a.binary,
        "arch": "ppc32-be",
        "functions_mapped": len(starts),
        "plt_symbols": len(plt),
        "action_tables_found": len(tables),
        "routers": out_routers(routers),
        "router_chain": router_chain,
        "capability_fields": cap_out,
        "services": services,
        "unattached_dispatcher_candidates": unattached,
        "action_tables": [{"base": f"{t['base']:#x}",
                           "n": len(t["entries"]),
                           "names": [e["name"] for e in t["entries"]]}
                          for t in tables],
        "request_vtable": {
            "0x08": "validate/materialize queued input-argument records",
            "0x0c": "serialize/commit SOAP success response",
            "0x10": "alias success-response commit path",
            "0x14": "emit non-success UPnP/SOAP result (r4 = code)",
            "0x18": "fixed-code 1000 wrapper around fault/result emitter",
            "0x1c": "advance/allocate next input-argument record",
            "0x20": "same input-argument allocator as +0x1c",
            "0x24": "advance/allocate next output-argument record",
            "0x28": "alternate output-record allocator",
            "0x34": "embedded request/zone context accessor",
            "0x38": "current request result/status accessor",
            "0x3c": "no-op hook",
        },
    }
    blob = json.dumps(out, indent=1, default=str)
    if a.json:
        open(a.json, "w").write(blob + "\n")
        log(f"wrote {a.json}")
    else:
        print(blob)


def out_routers(routers):
    o = {}
    for rf, rinfo in routers.items():
        if not rinfo:
            continue
        o[f"{rf:#x}"] = {
            "kind": ("soap_path_router" if rinfo.get("records")
                     else "path_referencing_nonrouter"),
            "record_stride": rinfo.get("stride"),
            "n_records": len(rinfo.get("records") or []),
            "records": [{"path": r["path"], "name": r["name"],
                         "cap_flags": (f"{r['cap_flags']:#x}"
                                       if isinstance(r.get("cap_flags"),
                                                     int) else None),
                         "enabled": r.get("enabled_desc"),
                         "obj": r.get("obj_expr")}
                        for r in rinfo.get("records") or []],
        }
    return o


if __name__ == "__main__":
    main()
