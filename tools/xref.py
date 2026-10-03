#!/usr/bin/env python3
"""
xref.py -- raw text scan for address formation of given VAs.

    python3 tools/xref.py 0x10eb8550 0x10eb8560 ...

Finds lis/addis + low-part pairs regardless of function-map coverage.
Prints (use-pc, target, forming-insn-pc, enclosing-func-estimate).
"""
import os
import struct
import sys
import bisect

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import extract_soap_api as X

ELF_PATH = os.environ.get(
    "ANACAPAD", "anacapad")


def main():
    elf = X.Elf(ELF_PATH)
    T = elf.sects[".text"]
    d = elf.data
    off, va, size = T["off"], T["va"], T["size"]
    starts, _ = X.build_funcmap(elf)
    ss = sorted(starts)
    targets = {}
    for a in sys.argv[1:]:
        v = int(a, 16)
        targets[v] = elf.cstr(v, 64) or ""

    words = [struct.unpack_from(">I", d, off + i)[0]
             for i in range(0, size - 3, 4)]
    n = len(words)
    lo_forms = ("addi", "ori", "xori", "lwz", "stw", "lbz", "stb", "lhz",
                "sth", "lha", "lwzu", "stwu")
    hits = []
    for i, w in enumerate(words):
        pc = va + 4 * i
        ins = X.decode(w, pc)
        if ins[0] not in ("addis", "lis") or len(ins) != 4:
            continue
        hi_base = 0 if ins[2] == 0 else None   # only ra==0 tracked (rarely otherwise)
        if hi_base is None:
            continue
        base = (ins[3] << 16) & 0xFFFFFFFF
        reg = ins[1]
        for j in range(i + 1, min(i + 16, n)):
            pc2 = va + 4 * j
            ins2 = X.decode(words[j], pc2)
            if ins2[0] in ("addis", "lis"):
                break
            if len(ins2) == 4 and ins2[2] == reg and ins2[0] in lo_forms:
                imm = ins2[3]
                if ins2[0] in ("ori", "xori"):
                    tgt = base | (imm & 0xFFFF)
                else:
                    tgt = (base + imm) & 0xFFFFFFFF
                if tgt in targets:
                    fi = bisect.bisect_right(ss, pc2) - 1
                    hits.append((pc2, tgt, ins2[0], pc,
                                 ss[fi] if fi >= 0 else 0))
                if ins2[0] in ("addi", "ori", "xori"):
                    break  # reg consumed/redefined
    for pc2, tgt, opc, hipc, fva in hits:
        print("0x%08x  %s -> 0x%08x %r  (hi@0x%08x) in func ~0x%08x"
              % (pc2, opc, tgt, targets[tgt], hipc, fva))


if __name__ == "__main__":
    main()
