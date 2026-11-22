#!/usr/bin/env python3
# quick capstone-based whole-range disassembler with annotations
import os, sys, struct, bisect
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import extract_soap_api as X
from capstone import Cs, CS_ARCH_PPC, CS_MODE_BIG_ENDIAN, CS_MODE_32

elf = X.Elf(os.environ.get("ANACAPAD", "reference/public/files/opt/bin/anacapad"))
T = elf.sects[".text"]
starts, _ = X.build_funcmap(elf)
sl = sorted(starts)
md = Cs(CS_ARCH_PPC, CS_MODE_BIG_ENDIAN | CS_MODE_32)
plt = elf.plt_names

def nm(va):
    if va in plt:
        return plt[va]
    if va in starts:
        return "f_%x" % va
    return None

def disasm_range(a, b):
    code = elf.data[T["off"] + a - T["va"]: T["off"] + b - T["va"]]
    for i in md.disasm(code, a):
        note = ""
        if i.mnemonic in ("bl", "b", "beq", "bne", "blt", "bgt", "ble", "bge",
                          "bdnz", "bdz", "beql", "bnel") and i.op_str:
            tgt = i.op_str.split()[-1].rstrip("<>")
            try:
                tv = int(tgt, 16)
                n = nm(tv)
                if n:
                    note = " ; <%s>" % n
            except ValueError:
                pass
        if i.mnemonic.startswith("b") and i.mnemonic not in ("blr",):
            pass
        print("%08x  %-12s %s%s" % (i.address, i.mnemonic, i.op_str, note))

if __name__ == "__main__":
    a = int(sys.argv[1], 16)
    if len(sys.argv) > 2 and sys.argv[2].startswith("+"):
        b = a + int(sys.argv[2][1:]) * 4
    elif len(sys.argv) > 2:
        b = int(sys.argv[2], 16)
    else:
        i = bisect.bisect_right(sl, a) - 1
        j = bisect.bisect_right(sl, a)
        b = sl[j] if j < len(sl) else a + 0x400
    disasm_range(a, b)
