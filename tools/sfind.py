#!/usr/bin/env python3
"""
sfind.py -- map literal strings in anacapad to their load addresses.

    python3 tools/sfind.py "scrobbling submission %s"
    python3 tools/sfind.py -f terms.txt          # one term per line

Each term is searched as a byte substring in the ELF file; the first
hit is converted to a virtual address via the program headers. Prints
`VA  sect  string` per line so results can be pasted into evidence
records.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import extract_soap_api as X

ELF_PATH = os.environ.get(
    "ANACAPAD", "anacapad")


def main():
    e = X.Elf(ELF_PATH)
    if sys.argv[1] == "-f":
        terms = [l.rstrip("\n") for l in open(sys.argv[2]) if l.strip()]
    else:
        terms = sys.argv[1:]
    # file-offset -> VA via phdrs
    def f2v(fo):
        for p in e.phdrs:
            if p["type"] == 1 and p["off"] <= fo < p["off"] + p["fsz"]:
                return p["va"] + (fo - p["off"])
        return None
    for t in terms:
        fo = e.data.find(t.encode())
        while fo >= 0:
            va = f2v(fo)
            sect = e.sect_of(va) if va else None
            print("0x%08x  %-8s  %s" % (va, sect, t))
            break
        else:
            print("not-found           %s" % t)


if __name__ == "__main__":
    main()
