#!/usr/bin/env python3
"""_dsym.py -- print dynsym names with values/sizes for an ELF.
   usage: python3 tools/_dsym.py <path> [substr]"""
import struct
import sys


def main():
    d = open(sys.argv[1], "rb").read()
    phoff, shoff = struct.unpack_from(">II", d, 0x1C)
    shentsize, shnum, shstrndx = struct.unpack_from(">HHH", d, 0x2E)
    shstr = struct.unpack_from(">I", d, shoff + shstrndx * shentsize + 16)[0]
    sects = {}
    for i in range(shnum):
        (noff, ty, flags, addr, off, size, link, info, align,
         entsz) = struct.unpack_from(">IIIIIIIIII", d, shoff + i * shentsize)
        e = d.index(b"\0", shstr + noff)
        sects[d[shstr + noff:e].decode()] = dict(
            va=addr, off=off, size=size)
    ds = sects[".dynsym"]
    dst = sects[".dynstr"]
    filt = sys.argv[2] if len(sys.argv) > 2 else None
    for i in range(ds["size"] // 16):
        n, val, sz, info, oth, sh = struct.unpack_from(
            ">IIIBBH", d, ds["off"] + i * 16)
        e = d.index(b"\0", dst["off"] + n)
        nm = d[dst["off"] + n:e].decode("utf-8", "replace")
        if filt and filt not in nm:
            continue
        if not val:
            continue
        print("0x%08x  %5d  sh=%d  %s" % (val, sz, sh, nm))


if __name__ == "__main__":
    main()
