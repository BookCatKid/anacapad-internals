#!/usr/bin/env python3
"""
_callers.py -- census of direct branches (bl/b) to a target VA.

    ANACAPAD=path python3 tools/_callers.py 0x1056ffb0 [0x...]

Prints callsite pc, opcode, and containing function estimate.
"""
import os
import struct
import sys
import bisect

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import extract_soap_api as X


def main():
    elf = X.Elf(os.environ.get("ANACAPAD", "anacapad"))
    T = elf.sects[".text"]
    d = elf.data
    off, va, size = T["off"], T["va"], T["size"]
    starts, _ = X.build_funcmap(elf)
    ss = sorted(starts)
    targets = {int(a, 16) for a in sys.argv[1:]}
    n = (size - 3) // 4
    for i in range(n):
        w = struct.unpack_from(">I", d, off + 4 * i)[0]
        pc = va + 4 * i
        op = w >> 26
        if op == 18:  # b / bl
            li = (w >> 2) & 0xffffff
            li <<= 2
            if li & 0x2000000:
                li -= 0x4000000
            tgt = (pc + li) & 0xFFFFFFFF
            kind = "bl" if (w & 1) else "b"
        elif op == 16:  # bc (conditional branch)
            bd = w & 0xfffc
            if bd & 0x8000:
                bd -= 0x10000
            tgt = pc + bd
            kind = "bc(lk)" if (w & 1) else "bc"
            if not (w & 1):
                continue  # only conditional calls matter for callers
        else:
            continue
        if tgt in targets:
            fi = bisect.bisect_right(ss, pc) - 1
            print("0x%08x  %s -> 0x%08x  in func ~0x%08x"
                  % (pc, kind, tgt, ss[fi] if fi >= 0 else 0))


if __name__ == "__main__":
    main()
