#!/usr/bin/env python3
"""blxref.py -- scan .text for direct `bl` calls to the given target VA(s).

    ANACAPAD=... python3 tools/blxref.py 0x10633400 0x106334a4 ...
"""
import os
import struct
import sys
import bisect

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import extract_soap_api as X

ELF_PATH = os.environ.get("ANACAPAD", "anacapad")


def main():
    elf = X.Elf(ELF_PATH)
    T = elf.sects[".text"]
    d = elf.data
    off, va, size = T["off"], T["va"], T["size"]
    starts, _ = X.build_funcmap(elf)
    ss = sorted(starts)
    targets = set(int(a, 16) for a in sys.argv[1:])
    for i in range(0, size - 3, 4):
        w = struct.unpack_from(">I", d, off + i)[0]
        pc = va + i
        # b / bl : opcode 18
        if (w >> 26) != 18 or not (w & 1):
            continue
        li = w & 0x3fffffc
        if li & 0x2000000:
            li -= 0x4000000
        if w & 2:  # absolute
            tgt = li & 0xFFFFFFFF
        else:
            tgt = (pc + li) & 0xFFFFFFFF
        if tgt in targets:
            fi = bisect.bisect_right(ss, pc) - 1
            fva = ss[fi] if fi >= 0 else 0
            print("bl 0x%08x @0x%08x in func ~0x%08x" % (tgt, pc, fva))
        # also bctrl? not encodable statically


if __name__ == "__main__":
    main()
