#!/usr/bin/env python3
"""Error-domain census: immediate return literals in worker fns.

For every function address referenced anywhere in
docs/documentation.json, scan the linear body for li/addi/ori
materializations that look like status/error codes (small positive
ints 100..1300 via ori, signed simm via li with rA==0). Used to bound
the SOAP fault-code vocabulary documented under
shared_primitives/soap_fault_code_vocabulary.

Run:  python3 tools/errdomain_scan.py
"""
import json
import re
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.dirname(
    os.path.abspath(__file__))))
import disas as D


def main():
    try:
        D.init()
    except (OSError, FileNotFoundError) as e:
        sys.exit("anacapad binary not found: %s "
                 "(set ANACAPAD=/path/to/anacapad)" % e)
    elf = D._elf
    starts = set(D._starts)
    TEXT_LO, TEXT_HI = 0x10000000, 0x11000000

    def fn_body(start):
        pc, insns = start, []
        for _ in range(3000):
            w = elf.u32(pc)
            if w is None:
                break
            insns.append((pc, w))
            if w in (0x4E800020, 0x4E800420):
                break
            pc += 4
            if pc in starts and pc != start:
                break
        return insns

    def errcodes(start):
        codes = set()
        for pc, w in fn_body(start):
            op = w >> 26
            if op == 14:           # addi / li
                ra = (w >> 16) & 0x1F
                simm = w & 0xFFFF
                if simm & 0x8000:
                    simm -= 0x10000
                if ra == 0 and (simm >= 100 or simm <= -20):
                    codes.add(simm)
            elif op == 24:         # ori
                imm = w & 0xFFFF
                if 100 <= imm <= 1300:
                    codes.add(imm)
            elif op == 25:         # oris
                imm = w & 0xFFFF
                if 100 <= imm <= 1300:
                    codes.add(imm)
        return sorted(codes)

    doc = json.load(open("docs/documentation.json"))
    fns = set()

    def grab(o):
        if isinstance(o, dict):
            for v in o.values():
                grab(v)
        elif isinstance(o, list):
            for v in o:
                grab(v)
        elif isinstance(o, str):
            for m in re.finditer(
                    r"\bf_([0-9a-f]{8})\b|\b(0x10[0-9a-f]{6})\b", o):
                a = m.group(1) or m.group(2)
                a = a if a.startswith("0x") else "0x" + a
                fns.add(int(a, 16))

    grab(doc)
    fns = [a for a in sorted(fns) if TEXT_LO < a < TEXT_HI]
    print(len(fns), "fns")
    for a in fns:
        c = errcodes(a)
        if c:
            print("0x%x: %s" % (a, c))


if __name__ == "__main__":
    main()
