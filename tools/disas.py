#!/usr/bin/env python3
"""
disas.py -- linear PPC disassembler for anacapad with annotations.

    python3 tools/disas.py 0x102f935c            # one function (to blr)
    python3 tools/disas.py 0x102f935c 0x102f9500 # explicit range
    python3 tools/disas.py 0x102f935c +64        # 64 instructions

Annotates: PLT/dynsym call targets, rodata strings reached via lis+low
pairs, data words pointing into .text (vtables), and function starts.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import extract_soap_api as X

ELF_PATH = None  # filled in main / init
_elf = _text = _plt = _starts = None


def init(path=None):
    global _elf, _text, _plt, _starts, ELF_PATH
    ELF_PATH = path or os.environ.get(
        "ANACAPAD", "anacapad")
    _elf = X.Elf(ELF_PATH)
    _text = X.Text(_elf)
    _plt = _elf.plt_names
    _starts, _ = X.build_funcmap(_elf)
    return _elf


def name_of(va):
    if va in _plt:
        return _plt[va]
    if va in _starts:
        return "f_%x" % va
    return None


def _annotate(va):
    """Return a comment for an address constant."""
    nm = name_of(va)
    out = []
    if nm:
        out.append(nm)
    s = _elf.cstr(va, 128)
    if s and s != nm:
        out.append(repr(s))
    if not out:
        sect = _elf.sect_of(va)
        if sect in (".data", ".rodata", ".data.rel.ro", ".got2", ".sdata",
                    ".sdata2", ".bss"):
            w = _elf.u32(va)
            if w:
                tgt = name_of(w)
                sec2 = _elf.sect_of(w)
                if tgt:
                    out.append("-> %s (%s)" % (tgt, sec2))
                elif sec2 == ".text":
                    out.append("-> f_%x" % w)
    return "; ".join(out)


def decode_for_listing(word, pc):
    """Preserve RE-relevant guards and masks without changing the extractor."""
    op = word >> 26
    rd, ra, rb = (word >> 21) & 31, (word >> 16) & 31, (word >> 11) & 31
    if op in (10, 11):
        immediate = word & 0xffff
        if op == 11 and immediate & 0x8000:
            immediate -= 0x10000
        return ("cmplwi" if op == 10 else "cmpwi",
                (word >> 23) & 7, ra, immediate)
    if op == 21:
        return ("rlwinm." if word & 1 else "rlwinm", ra, rd, rb,
                (word >> 6) & 31, (word >> 1) & 31)
    if op == 19 and ((word >> 1) & 1023) == 16:
        bo, bi = rd, ra
        if bo not in (20, 21):
            return ("bclrl" if word & 1 else "bclr", bo, bi)
    if op == 4 and (word & 0x7ff) in (0x300, 0x320):
        return ("evlddx" if (word & 0x7ff) == 0x300 else "evstddx",
                rd, ra, rb)
    if op == 31:
        xo = (word >> 1) & 1023
        if xo in (23, 55):
            mnemonic = "lwzx" if xo == 23 else "lwzux"
            return (mnemonic, rd, ra, rb)
        if xo == 444 and rd == rb and word & 1:
            return ("mr.", ra, rd)
    return X.decode(word, pc)


def fmt_ins(pc, ins):
    op = ins[0]
    a = ins[1:]
    def r(x):
        return "r%d" % x
    if op in ("cmpwi", "cmplwi"):
        immediate = "0x%x" % a[2] if op == "cmplwi" else str(a[2])
        return "%s cr%d, %s, %s" % (op, a[0], r(a[1]), immediate)
    if op in ("bclr", "bclrl"):
        return "%s bo=%d,bi=%d" % (op, a[0], a[1])
    if op in ("b", "bl"):
        nm = name_of(a[0])
        return "%s 0x%x%s" % (op, a[0], "  <%s>" % nm if nm else "")
    if op == "bc":
        bo, bi, tgt = a
        cr = "cr%d" % (bi >> 2) if bi >= 2 else ""
        cond = {4: "lt", 5: "gt", 6: "eq", 7: "so",
                12: "ge", 13: "le", 14: "ne", 15: "ns",
                20: "un", 28: "nu", 29: "ng", 30: "nn"}.get(
                    bi & 31, "b%d" % bo)
        m = "b%s%s" % ("" if bo & 16 else "dnz_" if bo & 8 else "",
                       cond if (bi >> 2) == 0 or bi < 2 else cond)
        # crude: bc bo=4*lt+16 style; just print raw plus target
        return "bc  bo=%d,bi=%d -> 0x%x" % (bo, bi, tgt)
    if op in ("blr", "blrl", "bctr", "bctrl"):
        return op
    if op == "bc19":
        return "bc19 xo=%d" % a[0]
    if op in ("mr", "mr."):
        return "%s %s, %s" % (op, r(a[0]), r(a[1]))
    if op in ("extsb", "extsh", "cntlzw"):
        return "%s %s, %s" % (op, r(a[0]), r(a[1]))
    if op in ("cmp", "cmpl"):
        return "%s cr%d, %s, %s" % (op, a[0], r(a[1]), r(a[2]))
    if op in ("mtlr", "mtctr", "mflr", "mfctr"):
        return "%s %s" % (op, r(a[0]))
    if op in ("rlwinm", "rlwinm.", "rlwnm"):
        return "%s %s, %s, %d, %d, %d" % (op, r(a[0]), r(a[1]), a[2],
                                         a[3], a[4])
    if op == "rlwimi":
        return "rlwimi %s, %s, %d, %d, %d" % (r(a[0]), r(a[1]), a[2],
                                             a[3], a[4])
    if op in ("slwi", "srwi", "clrrwi"):
        return "%s %s, %s, %d" % (op, r(a[0]), r(a[1]), a[2])
    if op in ("andi.", "andis.", "ori", "oris", "xori", "xoris"):
        return "%s %s, %s, 0x%x" % (op, r(a[1]), r(a[0]), a[2])
    if len(a) == 3:
        m = op
        if m.endswith("i") or m in ("li", "lis", "addi", "addis", "subi",
                                   "lwz", "stw", "lbz", "stb", "lhz",
                                   "sth", "lha", "lfs", "lfd", "stfs",
                                   "stfd", "cmpwi", "cmplwi", "mulli",
                                   "subfic", "lwzu", "stwu", "lbzu",
                                   "stbu", "lhzu", "sthu"):
            if m in ("li", "lis"):
                return "%s %s, 0x%x" % (m, r(a[0]), a[1] & 0xFFFF)
            return "%s %s, 0x%x(%s)" % (m, r(a[0]), a[2], r(a[1]))
        return "%s %s, %s, %s" % (m, r(a[0]), r(a[1]), r(a[2]))
    if len(a) == 2:
        return "%s %s, %s" % (op, r(a[0]), r(a[1]))
    return "%s %s" % (op, a)


def disas(start, end=None, count=None):
    pc = start
    hi = {}            # reg -> hi16 value seen at addis/lis
    addr_of = {}       # reg -> last computed full address
    n = 0
    while True:
        if end is not None and pc >= end:
            break
        if count is not None and n >= count:
            break
        w = _elf.u32(pc)
        if w is None:
            break
        ins = decode_for_listing(w, pc)
        txt = fmt_ins(pc, ins)
        notes = []
        # track hi/lo address formation
        op = ins[0]
        if op in ("addis", "lis") and len(ins) == 4:
            d, ra, imm = ins[1], ins[2], ins[3]
            hi[d] = ((addr_of.get(ra, 0) if ra else 0) + (imm << 16)) \
                & 0xFFFFFFFF
            addr_of[d] = hi[d]
        elif op in ("addi", "ori", "xori", "lwz", "stw", "lbz", "stb",
                    "lhz", "sth", "lha", "addic", "addic.", "subi") \
                and len(ins) == 4:
            d, ra, imm = ins[1], ins[2], ins[3]
            if ra in addr_of:
                va = (addr_of[ra] + imm) & 0xFFFFFFFF
                addr_of[d] = va
                ann = _annotate(va)
                if ann:
                    notes.append("0x%x %s" % (va, ann))
            elif op in ("addi", "ori"):
                addr_of.pop(d, None)
        elif op in ("mr", "mr.") and len(ins) == 3:
            if ins[2] in addr_of:
                addr_of[ins[1]] = addr_of[ins[2]]
            else:
                addr_of.pop(ins[1], None)
        # annotate branches/calls
        if op in ("b", "bl", "bc"):
            tgt = ins[-1]
            nm = name_of(tgt)
            if nm:
                notes.append("<%s>" % nm)
        line = "%08x  %-34s" % (pc, txt)
        if notes:
            line += " ; " + " ; ".join(notes)
        print(line)
        n += 1
        pc += 4
        if end is None and count is None and op in ("blr", "bctr"):
            break


def main():
    a = sys.argv[1:]
    if not a:
        print(__doc__)
        return
    if os.path.exists(a[0]):
        init(a[0])
        a = a[1:]
    else:
        init()
    start = int(a[0], 16)
    if len(a) > 1:
        if a[1].startswith("+"):
            disas(start, count=int(a[1][1:]))
        else:
            disas(start, end=int(a[1], 16))
    else:
        disas(start)


if __name__ == "__main__":
    main()
